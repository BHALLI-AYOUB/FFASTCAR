import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const puppeteer = require(process.env.PUPPETEER_MODULE || path.join(os.homedir(), 'lhtool/node_modules/puppeteer-core'))
const base = process.argv.find(a => a.startsWith('--base='))?.slice(7) || 'http://localhost:3210'
const output = process.argv.find(a => a.startsWith('--out='))?.slice(6) || 'reports/integration'
fs.mkdirSync(output, { recursive: true })
const results = []
const check = (name, pass, detail) => {
  results.push({ name, pass: Boolean(pass), detail })
  console.log(`${pass ? 'PASS' : 'FAIL'} ${name}${detail === undefined ? '' : ': ' + JSON.stringify(detail)}`)
}
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] })
try {
  const sitemap = await (await fetch(base + '/sitemap.xml')).text()
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])
  const originalVehicles = [...fs.readFileSync('lib/fleet.ts', 'utf8').matchAll(/^\s+slug: "/gm)].length
  const stored = fs.existsSync('.data/site-content.json') ? JSON.parse(fs.readFileSync('.data/site-content.json', 'utf8')) : null
  const vehicleCount = stored ? stored.vehicles.filter(vehicle => !vehicle.hidden).length : originalVehicles
  check('sitemap: real expected route count', locations.length === (vehicleCount + 5) * 4, { actual: locations.length, expected: (vehicleCount + 5) * 4 })
  const llms = await (await fetch(base + '/llms.txt')).text()
  const conditionURLs = ['', '/en', '/nl', '/ar'].map(prefix => 'https://abfastcar.com' + prefix + '/conditions')
  check('sitemap and llms: conditions in all four languages', conditionURLs.every(url => locations.includes(url) && llms.includes(url)))
  for (const width of [390, 1440]) {
    for (const locale of ['fr', 'en', 'nl', 'ar']) {
      const page = await browser.newPage()
      await page.setViewport({ width, height: width === 390 ? 844 : 1000, deviceScaleFactor: 1 })
      const errors = []
      page.on('pageerror', error => errors.push(String(error)))
      // No real messaging is involved in these navigation tests.
      await page.setRequestInterception(true)
      page.on('request', request => /wa\.me|whatsapp\.com/.test(request.url()) ? request.abort() : request.continue())
      const route = (locale === 'fr' ? '' : '/' + locale) + '/conditions'
      await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 120000 })
      const label = `${locale}-${width === 390 ? 'mobile' : 'desktop'}`
      const initial = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        dir: document.documentElement.dir,
        articles: document.querySelectorAll('article[id^="article-"]').length,
        paragraphs: document.querySelectorAll('article[id^="article-"] p').length,
        canonical: document.querySelector('link[rel="canonical"]')?.href,
        alternates: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map(el => [el.hreflang, el.href]),
        footerLink: [...document.querySelectorAll('footer a')].some(el => el.href.endsWith(location.pathname)),
      }))
      check(`${label}: complete readable content and direction`, !initial.overflow && initial.articles === 16 && initial.paragraphs === 63 && initial.dir === (locale === 'ar' ? 'rtl' : 'ltr'), initial)
      check(`${label}: canonical, reciprocal languages and footer`, initial.canonical === 'https://abfastcar.com' + route && initial.alternates.length === 5 && initial.footerLink)
      if (locale === 'fr' || locale === 'ar') await page.screenshot({ path: path.join(output, `${label}-conditions.png`) })
      if (width === 390) {
        const summary = await page.$('main nav details summary')
        check(`${label}: compact mobile contents`, await page.$eval('main nav details', el => !el.open))
        await summary.click()
      }
      await page.click(`main nav ${width === 390 ? 'details' : 'div'} a[href="#article-16"]`)
      await page.waitForFunction(() => location.hash === '#article-16' && document.querySelector('#article-16').getBoundingClientRect().top < innerHeight, { timeout: 10000 })
      check(`${label}: article anchor reaches content`, await page.$eval('#article-16', el => el.getBoundingClientRect().top >= 0))
      if (locale === 'fr' && width === 1440) {
        await page.emulateMediaType('print')
        const printable = await page.evaluate(() => ({
          footer: getComputedStyle(document.querySelector('footer')).display,
          nav: getComputedStyle(document.querySelector('main nav')).display,
          articles: [...document.querySelectorAll('article')].every(el => getComputedStyle(el).display !== 'none'),
          text: getComputedStyle(document.querySelector('article p')).color,
        }))
        check('print: articles in black, navigation and footer hidden', printable.footer === 'none' && printable.nav === 'none' && printable.articles && printable.text === 'rgb(0, 0, 0)', printable)
        await page.pdf({ path: path.join(output, 'conditions-fr-print.pdf'), format: 'A4', margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' }, printBackground: false })
        await page.emulateMediaType('screen')
      }
      await page.click(width === 390 ? '[role="region"] a.bg-brand-red' : 'header a.bg-brand-red')
      await page.waitForSelector('[role="dialog"] form a[href$="/conditions"]', { visible: true, timeout: 15000 })
      const bookingLink = await page.$('[role="dialog"] form a[href$="/conditions"]')
      const booking = await page.$eval('[role="dialog"] form', form => {
        const link = form.querySelector('a[href$="/conditions"]')
        const submit = form.querySelector('button[type="submit"]')
        return { url: new URL(link.href).pathname, beforeSubmit: Boolean(link.compareDocumentPosition(submit) & Node.DOCUMENT_POSITION_FOLLOWING), gap: submit.getBoundingClientRect().top - link.getBoundingClientRect().bottom }
      })
      check(`${label}: real conditions link next to booking submission`, booking.url === route && booking.beforeSubmit && booking.gap >= 0 && booking.gap < 80, booking)
      const popupPromise = new Promise(resolve => page.once('popup', resolve))
      await bookingLink.click()
      const popup = await Promise.race([popupPromise, new Promise((_, reject) => setTimeout(() => reject(new Error('Conditions link did not open a page')), 15000))])
      await popup.waitForSelector('#article-16', { timeout: 15000 })
      check(`${label}: booking conditions link opens correct complete page`, new URL(popup.url()).pathname === route && (await popup.$$('article')).length === 16)
      await popup.close()
      check(`${label}: no browser exceptions`, errors.length === 0, errors)
      await page.close()
    }
  }
} catch (error) {
  check('browser verification completed', false, String(error.stack || error))
} finally {
  await browser.close()
  fs.writeFileSync(path.join(output, 'conditions-results.json'), JSON.stringify({ base, at: new Date().toISOString(), results }, null, 2))
}
if (results.some(r => !r.pass)) process.exitCode = 1
