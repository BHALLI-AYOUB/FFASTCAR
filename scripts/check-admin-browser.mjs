import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { createHmac, randomBytes } from 'node:crypto'
import { createRequire } from 'node:module'
import assert from 'node:assert/strict'

const require = createRequire(import.meta.url)
const nextRequire = createRequire(require.resolve('next/package.json'))
nextRequire('@next/env').loadEnvConfig(process.cwd(), true, { info() {}, error() {} })
const puppeteer = require(process.env.PUPPETEER_MODULE || path.join(os.homedir(), 'lhtool/node_modules/puppeteer-core'))
const base = process.argv.find(a => a.startsWith('--base='))?.slice(7) || 'http://localhost:3211'
const output = process.argv.find(a => a.startsWith('--out='))?.slice(6) || 'reports/integration/final-admin-ui'
assert.match(base, /^http:\/\/(?:localhost|127\.0\.0\.1):\d+$/)
assert(!process.env.BLOB_READ_WRITE_TOKEN && !process.env.VERCEL, 'Local filesystem only')
assert(!fs.existsSync('.data/site-content.json'), 'Wait for the API test to restore local storage before this UI smoke')
fs.mkdirSync(output, { recursive: true })
const report = { base, at: new Date().toISOString(), authentication: 'Signed local session in memory. Password login not tested.', persistence: 'No save attempted; all browser PUT/POST/DELETE requests blocked.', results: [], errors: [] }
const check = (name, pass, detail) => {
  report.results.push({ name, pass: Boolean(pass), detail })
  console.log(`${pass ? 'PASS' : 'FAIL'} ${name}${detail === undefined ? '' : ': ' + JSON.stringify(detail)}`)
  assert(pass, name)
}
// Never print or persist the environment values or the signed cookie.
const body = Buffer.from(JSON.stringify({ e: process.env.ADMIN_EMAIL.trim().toLowerCase(), x: Date.now() + 3600000, n: randomBytes(9).toString('base64url') })).toString('base64url')
const key = createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(process.env.ADMIN_PASSWORD_HASH.trim()).digest()
const session = body + '.' + createHmac('sha256', key).update(body).digest('base64url')
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] })
try {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 })
  await page.setCookie({ name: 'abfc_admin', value: session, url: base, httpOnly: true, sameSite: 'Strict' })
  const exceptions = []
  const writes = []
  page.on('pageerror', error => exceptions.push(String(error)))
  await page.setRequestInterception(true)
  page.on('request', request => {
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method())) { writes.push(request.method() + ' ' + new URL(request.url()).pathname); return request.abort() }
    if (/wa\.me|whatsapp\.com/.test(request.url())) return request.abort()
    return request.continue()
  })
  const clickButton = async label => {
    for (const button of await page.$$('button')) {
      if ((await button.evaluate(el => el.textContent.trim())) === label) { await button.click(); return }
    }
    throw new Error('Missing button: ' + label)
  }
  const field = async label => {
    const id = await page.evaluate(text => [...document.querySelectorAll('main label')].find(el => el.textContent.trim() === text)?.htmlFor, label)
    assert(id, 'Missing field: ' + label)
    return page.$('#' + await page.evaluate(id => CSS.escape(id), id))
  }
  await page.goto(base + '/admin', { waitUntil: 'networkidle0', timeout: 120000 })
  await page.waitForSelector('main input', { timeout: 15000 })
  check('admin is authenticated through local signed session', await page.$('nav[aria-label="Sections"]') !== null)
  await clickButton('Vidéos')
  await page.waitForSelector('main section fieldset input')
  const videos = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('main section')]
    const card = cards[0]
    return {
      count: cards.length,
      languages: [...card.querySelectorAll('fieldset')].map(set => ({ legend: set.querySelector('legend')?.textContent, inputs: [...set.querySelectorAll('input')].map(input => ({ label: input.getAttribute('aria-label'), dir: input.dir })) })),
      labels: [...card.querySelectorAll('label')].map(el => el.textContent),
      visibility: card.querySelector('input[type="checkbox"]') !== null,
      order: [...card.querySelectorAll('button[aria-label]')].map(el => el.getAttribute('aria-label')),
    }
  })
  check('video admin has two cards, four-language title and caption with RTL', videos.count === 2 && videos.languages.length === 2 && videos.languages.every(group => group.inputs.length === 4 && group.inputs.filter(input => input.dir === 'rtl').length === 1), videos)
  check('video sources, poster, visibility and order controls are present', videos.visibility && videos.labels.some(label => label.includes('Vidéo principale')) && videos.labels.some(label => label.includes('Variante petit écran')) && videos.labels.some(label => label.includes('Couverture')) && videos.order.some(label => label.startsWith('Monter')) && videos.order.some(label => label.startsWith('Descendre')))
  await page.screenshot({ path: path.join(output, 'admin-videos-desktop.png') })
  const title = await page.$('main section fieldset input[aria-label="Français"]')
  const originalTitle = await title.evaluate(el => el.value)
  await title.click(); await page.keyboard.press('End'); await page.keyboard.type(' UI unsaved test')
  check('editing video title exposes Enregistrer and Annuler', await page.evaluate(() => ['Enregistrer', 'Annuler'].every(label => [...document.querySelectorAll('button')].some(button => button.textContent.trim() === label))))
  page.once('dialog', dialog => dialog.accept())
  await clickButton('Annuler')
  check('video cancellation restores saved title', await page.$eval('main section fieldset input[aria-label="Français"]', el => el.value) === originalTitle)
  await clickButton('Conditions')
  for (const [locale, label] of [['fr', 'Français'], ['en', 'English'], ['nl', 'Nederlands'], ['ar', 'العربية (المغرب)']]) {
    await clickButton(label)
    const titleField = await field('Titre de la page')
    check(`${locale}: condition title and intro are editable in correct direction`, await titleField.evaluate((el, dir) => !el.readOnly && el.dir === dir && Boolean(el.value), locale === 'ar' ? 'rtl' : 'ltr'))
  }
  await clickButton('Français')
  const originalCondition = await (await field('Titre de la page')).evaluate(el => el.value)
  const conditionTitle = await field('Titre de la page')
  await conditionTitle.click(); await page.keyboard.press('End'); await page.keyboard.type(' UI unsaved test')
  check('editing condition title exposes Enregistrer and Annuler', await page.evaluate(() => ['Enregistrer', 'Annuler'].every(label => [...document.querySelectorAll('button')].some(button => button.textContent.trim() === label))))
  page.once('dialog', dialog => dialog.accept())
  await clickButton('Annuler')
  check('conditions cancellation restores saved title', await (await field('Titre de la page')).evaluate(el => el.value) === originalCondition)
  await page.screenshot({ path: path.join(output, 'admin-conditions-desktop.png') })
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
  await page.screenshot({ path: path.join(output, 'admin-conditions-mobile.png') })
  check('admin conditions fit mobile width', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  check('no browser exceptions', exceptions.length === 0, exceptions)
  check('no writes or messaging attempted, local storage remains absent', writes.length === 0 && !fs.existsSync('.data/site-content.json'), writes)
} catch (error) {
  report.errors.push(String(error.message))
  console.error(error.message)
} finally {
  await browser.close()
  fs.writeFileSync(path.join(output, 'admin-ui-results.json'), JSON.stringify(report, null, 2))
}
if (report.errors.length || report.results.some(result => !result.pass)) process.exitCode = 1
