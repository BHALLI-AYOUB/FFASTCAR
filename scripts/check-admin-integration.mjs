import fs from 'node:fs'
import path from 'node:path'
import { createHmac, randomBytes } from 'node:crypto'
import { createRequire } from 'node:module'
import assert from 'node:assert/strict'

const require = createRequire(import.meta.url)
const nextRequire = createRequire(require.resolve('next/package.json'))
nextRequire('@next/env').loadEnvConfig(process.cwd(), true, { info() {}, error() {} })
const base = process.argv.find((a) => a.startsWith('--base='))?.slice(7) || 'http://localhost:3210'
assert.match(base, /^http:\/\/(?:localhost|127\.0\.0\.1):\d+$/)
assert(!process.env.BLOB_READ_WRITE_TOKEN, 'This test only permits local filesystem storage')
assert(!process.env.VERCEL, 'This test must never run against hosted storage')
const file = '.data/site-content.json'
const existed = fs.existsSync(file)
const originalRaw = existed ? fs.readFileSync(file) : null
const report = { at: new Date().toISOString(), base, authentication: 'Signed local test session using existing environment; password login not exercised', results: [], errors: [] }
const check = (name, pass, detail) => {
  report.results.push({ name, pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'} ${name}${detail === undefined ? '' : ': ' + JSON.stringify(detail)}`)
  assert(pass, name)
}
// No credential or session value is ever logged or written to the report.
const body = Buffer.from(JSON.stringify({ e: process.env.ADMIN_EMAIL.trim().toLowerCase(), x: Date.now() + 3600000, n: randomBytes(9).toString('base64url') })).toString('base64url')
const key = createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(process.env.ADMIN_PASSWORD_HASH.trim()).digest()
const cookie = 'abfc_admin=' + body + '.' + createHmac('sha256', key).update(body).digest('base64url')
async function request(route, options = {}, authenticated = true) {
  return fetch(base + route, { ...options, headers: { ...(authenticated ? { Cookie: cookie } : {}), Origin: base, 'Content-Type': 'application/json', ...options.headers } })
}
let original, etag, wrote = false
async function save(content) {
  const response = await request('/api/admin/content', { method: 'PUT', body: JSON.stringify({ content, etag }) })
  const result = await response.json()
  assert.equal(response.status, 200, 'Save failed: ' + JSON.stringify(result.issues || result.error))
  etag = result.etag
  wrote = true
  return result
}
try {
  for (const method of ['GET', 'PUT']) {
    const r = await request('/api/admin/content', { method, ...(method === 'PUT' ? { body: '{}' } : {}) }, false)
    check(`unauthenticated ${method} refused`, r.status === 401, r.status)
  }
  const initial = await (await request('/api/admin/content')).json()
  check('local storage selected', initial.saveTo === 'filesystem', initial.saveTo)
  original = structuredClone(initial.content)
  etag = initial.etag
  const invalid = structuredClone(original)
  invalid.videos[0].src = '/videos/IMG_0051.MOV'
  const reject = await request('/api/admin/content', { method: 'PUT', body: JSON.stringify({ content: invalid, etag }) })
  check('original MOV source rejected', reject.status === 400, reject.status)
  const cross = await request('/api/admin/content', { method: 'PUT', headers: { Origin: 'https://invalid.example' }, body: JSON.stringify({ content: original, etag }) })
  check('cross-origin write refused', cross.status === 403, cross.status)
  const changed = structuredClone(original)
  const marker = 'QA-' + Date.now()
  for (const locale of ['fr', 'en', 'nl', 'ar']) {
    changed.videos[0].title[locale] += ' ' + marker
    changed.conditions[locale].intro += ' ' + marker
  }
  const slug = 'integration-' + Date.now()
  changed.vehicles.push({ ...structuredClone(changed.vehicles[0]), slug, name: 'QA Integration', featured: false, hidden: false })
  const staleEtag = etag
  await save(changed)
  const other = await (await request('/api/admin/content')).json()
  check('saved video and conditions persist server-side', other.content.videos[0].title.fr.includes(marker) && other.content.conditions.ar.intro.includes(marker))
  const conflict = await request('/api/admin/content', { method: 'PUT', body: JSON.stringify({ content: changed, etag: staleEtag }) })
  check('stale write refused without overwrite', conflict.status === 409, conflict.status)
  for (const locale of ['fr', 'en', 'nl', 'ar']) {
    const prefix = locale === 'fr' ? '' : '/' + locale
    const home = await fetch(base + (prefix || '/')).then((r) => r.text())
    const conditions = await fetch(base + prefix + '/conditions').then((r) => r.text())
    check(`${locale}: public session sees saved video and conditions`, home.includes(marker) && conditions.includes(marker))
  }
  check('added vehicle works without redeploy', (await fetch(base + '/fleet/' + slug)).status === 200)
  changed.vehicles.find((v) => v.slug === slug).hidden = true
  changed.videos[0].hidden = true
  await save(changed)
  check('hidden vehicle returns 404', (await fetch(base + '/fleet/' + slug)).status === 404)
  const html = await fetch(base).then((r) => r.text())
  check('hidden video removed from public HTML', !html.includes(marker))
  const sitemap = await fetch(base + '/sitemap.xml').then((r) => r.text())
  check('hidden vehicle removed from sitemap', !sitemap.includes(slug))
  await save(original)
  check('deleted test vehicle returns 404', (await fetch(base + '/fleet/' + slug)).status === 404)
  const legacy = structuredClone(original)
  delete legacy.videos
  delete legacy.conditions
  legacy.vehicles[0].name = 'QA Legacy vehicle'
  legacy.vehicles[0].priceMad += 17
  const legacyConditions = {
    fr: "Ces conditions ne sont pas encore publiées sur le site. Contactez-nous par téléphone ou sur WhatsApp avant de réserver : notre équipe vous indique les conditions qui s'appliquent au véhicule choisi.",
    en: 'These conditions are not published on the site yet. Contact us by phone or WhatsApp before booking: our team will tell you the conditions that apply to the car you choose.',
    nl: 'Deze voorwaarden staan nog niet op de site. Neem vóór het reserveren contact met ons op via telefoon of WhatsApp: ons team vertelt u welke voorwaarden gelden voor de gekozen auto.',
    ar: 'هذه الشروط غير منشورة بعد على الموقع. تواصل معنا عبر الهاتف أو واتساب قبل الحجز، وسيُطلعك فريقنا على الشروط المطبقة على السيارة التي اخترتها.',
  }
  for (const locale of ['fr', 'en', 'nl', 'ar']) {
    legacy.texts[locale].faq.items[0].a = legacyConditions[locale] + ' QA custom answer to preserve'
    legacy.texts[locale].faq.items[7].a = legacyConditions[locale]
  }
  legacy.texts.en.faq.items[3].a = 'No, our rentals come with unlimited mileage.'
  await save(legacy)
  const migrated = (await (await request('/api/admin/content')).json()).content
  check('legacy document gains videos and all conditions', migrated.videos.length === 2 && ['fr', 'en', 'nl', 'ar'].every((locale) => migrated.conditions[locale].articles.length === 16))
  check('legacy migration preserves saved vehicles prices contact and custom text', migrated.vehicles[0].name === legacy.vehicles[0].name && migrated.vehicles[0].priceMad === legacy.vehicles[0].priceMad &&
    JSON.stringify(migrated.contact) === JSON.stringify(legacy.contact) && migrated.texts.en.faq.items[0].a === legacy.texts.en.faq.items[0].a)
  check('legacy stock unlimited mileage promise migrated', !migrated.texts.en.faq.items[3].a.includes('unlimited mileage'))
  check('legacy stock conditions answers migrated in four languages', ['fr', 'en', 'nl', 'ar'].every((locale) => migrated.texts[locale].faq.items[7].a !== legacyConditions[locale]))
  check('custom extended answers preserved verbatim in four languages', ['fr', 'en', 'nl', 'ar'].every((locale) => migrated.texts[locale].faq.items[0].a === legacy.texts[locale].faq.items[0].a))
} catch (error) {
  report.errors.push(String(error.stack || error))
  console.error(error.message)
} finally {
  if (wrote && original) {
    try {
      const current = await (await request('/api/admin/content')).json()
      etag = current.etag
      await save(original)
      const after = await (await request('/api/admin/content')).json()
      const { updatedAt: a, ...actual } = after.content
      const { updatedAt: b, ...expected } = original
      assert.deepEqual(actual, expected)
      if (existed) fs.writeFileSync(file, originalRaw)
      else fs.unlinkSync(file) // Only the test-created file; existing data is restored byte-for-byte.
      check('original local data restored exactly', existed ? fs.readFileSync(file).equals(originalRaw) : !fs.existsSync(file))
    } catch (error) { report.errors.push('RESTORE FAILED: ' + error.message); console.error('RESTORE FAILED: ' + error.message) }
  }
  fs.mkdirSync('reports/integration', { recursive: true })
  fs.writeFileSync('reports/integration/admin-results.json', JSON.stringify(report, null, 2))
}
if (report.errors.length || report.results.some((r) => !r.pass)) process.exitCode = 1
