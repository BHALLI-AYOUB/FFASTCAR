import fs from 'node:fs'
import assert from 'node:assert/strict'

const base = process.argv[2] || 'http://localhost:3211'
const report = { base, at: new Date().toISOString(), results: [], errors: [] }
const check = (name, pass, detail) => {
  report.results.push({ name, pass: !!pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'} ${name}${detail === undefined ? '' : ': ' + JSON.stringify(detail)}`)
}
try {
  const sitemap = await fetch(base + '/sitemap.xml').then((r) => r.text())
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
  assert(urls.length > 0)
  for (const url of urls) {
    const expected = new URL(url)
    const response = await fetch(base + expected.pathname)
    const html = await response.text()
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1]
    check(expected.pathname, response.status === 200 && canonical && new URL(canonical).href === expected.href &&
      (html.match(/rel="alternate" hrefLang=/gi) || []).length === 5 && /<h1[\s>]/.test(html), { status: response.status, canonical })
  }
  check('all sitemap routes checked without hard-coded limit', report.results.length === urls.length, urls.length)
  for (const route of ['/does-not-exist', '/en/fleet/does-not-exist', '/ar/does-not-exist']) {
    check(`${route}: real 404`, (await fetch(base + route)).status === 404)
  }
  for (const [from, to] of [['/fr', '/'], ['/fr/conditions', '/conditions']]) {
    const response = await fetch(base + from, { redirect: 'manual' })
    check(`${from}: canonical language redirect`, [307, 308].includes(response.status) && new URL(response.headers.get('location'), base).pathname === to)
  }
  const local = await fetch(base + '/conditions').then((r) => r.text())
  check('local verification build noindex', /<meta name="robots" content="noindex, nofollow"/.test(local))
  for (const file of ['abfastcar-film.mp4', 'abfastcar-film-mobile.mp4', 'abfastcar-showroom.mp4']) {
    const response = await fetch(`${base}/videos/${file}`, { headers: { Range: 'bytes=0-1023' } })
    check(`${file}: MP4 range support`, response.status === 206 && response.headers.get('content-type').includes('video/mp4') && response.headers.get('content-range').startsWith('bytes 0-1023/'), { status: response.status, type: response.headers.get('content-type'), range: response.headers.get('content-range') })
    await response.body.cancel()
  }
} catch (error) {
  report.errors.push(String(error.stack || error))
  console.error(error)
}
fs.mkdirSync('reports/integration', { recursive: true })
fs.writeFileSync('reports/integration/public-routes-final.json', JSON.stringify(report, null, 2))
if (report.errors.length || report.results.some((r) => !r.pass)) process.exitCode = 1
