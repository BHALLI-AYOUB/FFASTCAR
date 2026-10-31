// Checks the actual agency-provided reviews. No synthetic review API responses.
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const puppeteer = require(process.env.PUPPETEER_MODULE || path.join(os.homedir(), 'lhtool/node_modules/puppeteer-core'))
const base = process.argv.find(a => a.startsWith('--base='))?.slice(7) || 'http://localhost:3000'
assert.match(base, /^http:\/\/(?:localhost|127\.0\.0\.1):\d+$/, 'Only local QA targets are allowed')
const output = 'reports/google-reviews-supplied'
fs.mkdirSync(output, { recursive: true })
const report = { base, source: 'Actual four reviews supplied by the agency', results: [], errors: [], avatarResponses: [] }
const check = (name, pass, detail) => {
  report.results.push({ name, pass: Boolean(pass), detail })
  console.log(`${pass ? 'PASS' : 'FAIL'} ${name}${detail === undefined ? '' : ': ' + JSON.stringify(detail)}`)
  assert(pass, name)
}
const expected = [
  ['Ayoub Bhalli', 'Excellente expérience avec AB FAST CAR à Marrakech ! Service professionnel, équipe accueillante et réactive. Réservation simple, communication claire et très bon accompagnement. Je recommande vivement AB FAST CAR pour la location de voitures à Marrakech ! 🚗✨'],
  ['Driss Rachdi', 'أحسن اجونس'], ['Meryama Belomari', 'Meilleure agence'], ['Hamza Boughazi', 'Great service'],
]
const labels = locale => JSON.parse(fs.readFileSync(`messages/${locale}.json`, 'utf8')).reviews
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] })

try {
  const profiles = ['fr', 'en', 'nl', 'ar'].flatMap(locale => [390, 1440].map(width => ({ locale, width })))
  profiles.push({ locale: 'fr', width: 320 }, { locale: 'fr', width: 820 }, { locale: 'fr', width: 1440, theme: 'light' }, { locale: 'fr', width: 390, failAvatars: true })
  const selected = process.argv.find(a => a.startsWith('--profiles='))?.slice(11).split(',')
  for (const { locale, width, theme = 'dark', failAvatars = false } of profiles.filter(p => !selected || selected.includes(`${p.locale}-${p.width}`))) {
    const prefix = `${locale}-${width}-${theme}${failAvatars ? '-failed-avatars' : ''}`
    const context = await browser.createBrowserContext()
    const page = await context.newPage()
    const errors = [], apiRequests = []
    page.on('pageerror', error => errors.push(String(error)))
    page.on('response', response => { if (response.url().startsWith('https://lh3.googleusercontent.com/')) report.avatarResponses.push({ url: response.url(), status: response.status() }) })
    await page.setViewport({ width, height: 1000, isMobile: width < 640, hasTouch: width < 640, deviceScaleFactor: 1 })
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    await page.evaluateOnNewDocument(theme => {
      if (theme === 'light') localStorage.setItem('abfc-theme', 'light')
      else localStorage.removeItem('abfc-theme')
    }, theme)
    await page.setRequestInterception(true)
    page.on('request', request => {
      if (/\/api\/google-reviews|places\.googleapis\.com/.test(request.url())) { apiRequests.push(request.url()); return request.abort() }
      if (request.url().startsWith('https://lh3.googleusercontent.com/')) return failAvatars ? request.abort() : request.continue()
      if (!request.url().startsWith(base) && !request.url().startsWith('data:')) return request.abort()
      return request.continue()
    })
    const route = locale === 'fr' ? '/' : '/' + locale
    const response = await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 90000 })
    const html = await response.text()
    check(`${prefix}: four names already in initial HTML`, expected.every(([name]) => html.includes(name)))
    await page.$eval('#reviews', el => el.scrollIntoView({ block: 'start', behavior: 'instant' }))
    await page.waitForFunction(() => document.querySelector('#reviews button[aria-label]'))
    await page.evaluate(async () => { await document.fonts.ready })
    const state = await page.evaluate(() => {
      const section = document.querySelector('#reviews')
      const rail = section.querySelector('[aria-roledescription]')
      const bounds = rail.getBoundingClientRect()
      const cards = [...section.querySelectorAll('article')]
      return {
        reviews: cards.map(card => [card.querySelector('h3').textContent, card.querySelector('blockquote p').textContent]),
        fullText: cards.every(card => { const text = card.querySelector('blockquote p'); return text.scrollHeight <= text.clientHeight + 1 }),
        textSizes: cards.map(card => { const p = card.querySelector('blockquote p'); return { client: p.clientHeight, scroll: p.scrollHeight, overflow: getComputedStyle(p).overflow } }),
        visible: cards.filter(card => { const r = card.getBoundingClientRect(); return r.left >= bounds.left - 3 && r.right <= bounds.right + 3 }).length,
        heights: cards.map(card => card.getBoundingClientRect().height),
        overflow: document.documentElement.scrollWidth > innerWidth,
        dir: document.documentElement.dir,
        arabic: { lang: cards[1].querySelector('blockquote p').lang, dir: getComputedStyle(cards[1].querySelector('blockquote p')).direction },
        headingTop: document.querySelector('#reviews-title').getBoundingClientRect().top,
        navBottom: document.querySelector('body header').getBoundingClientRect().bottom,
        inventedMetadata: section.querySelectorAll('time, [role="img"]').length,
        emptyPlaceholder: Boolean(section.querySelector('[aria-busy], [role="status"]')),
        canonical: document.querySelector('link[rel="canonical"]')?.href,
        alternates: document.querySelectorAll('link[rel="alternate"][hreflang]').length,
        reviewsSchema: [...document.querySelectorAll('script[type="application/ld+json"]')].some(el => /"(?:aggregateRating|review)"\s*:/.test(el.textContent)),
        palette: {
          background: getComputedStyle(section).backgroundColor,
          card: getComputedStyle(cards[0]).backgroundColor,
          text: getComputedStyle(cards[0].querySelector('blockquote')).color,
          logo: [...section.querySelectorAll('header img[alt="Google Maps"]')].find(img => getComputedStyle(img).display !== 'none')?.getAttribute('src'),
        },
      }
    })
    check(`${prefix}: all original names and complete review messages`, JSON.stringify(state.reviews) === JSON.stringify(expected) && state.fullText, state.textSizes)
    check(`${prefix}: 1/2/3 cards and equal compact heights`, state.visible === (width >= 1024 ? 3 : width >= 640 ? 2 : 1) && Math.max(...state.heights) - Math.min(...state.heights) < 2 && Math.max(...state.heights) < 550, state.heights)
    check(`${prefix}: no page overflow and correct RTL`, !state.overflow && state.dir === (locale === 'ar' ? 'rtl' : 'ltr') && state.arabic.lang === 'ar' && state.arabic.dir === 'rtl')
    check(`${prefix}: heading clears the fixed navbar`, state.headingTop >= state.navBottom)
    check(`${prefix}: no placeholders, invented stars, dates or aggregate schema`, !state.inventedMetadata && !state.emptyPlaceholder && !state.reviewsSchema)
    check(`${prefix}: section, cards, text and official logo follow the site theme`,
      theme === 'light'
        ? state.palette.background === 'rgb(246, 246, 245)' && state.palette.card === 'rgb(255, 255, 255)' && state.palette.text === 'rgb(82, 82, 91)' && state.palette.logo === '/images/google-maps-attribution.svg'
        : state.palette.background === 'rgb(9, 9, 11)' && state.palette.card === 'rgb(20, 20, 22)' && state.palette.text === 'rgb(196, 196, 204)' && state.palette.logo === '/images/google-maps-attribution-white.svg', state.palette)
    const expectedCanonical = 'https://abfastcar.com' + (locale === 'fr' ? '/' : route)
    check(`${prefix}: canonical and existing language links preserved`, state.canonical === expectedCanonical && state.alternates === 5)
    const t = labels(locale)
    check(`${prefix}: translated section and optional business link`, await page.$eval('#reviews', (el, t) => el.innerText.includes(t.subtitle) && el.innerText.includes(t.allReviews) && el.querySelector('a').href.includes('0xbc8c4e5d09225de6'), t))
    const next = '#reviews button[aria-label="' + t.next + '"]'
    const previous = '#reviews button[aria-label="' + t.previous + '"]'
    await page.$eval('#reviews [aria-roledescription]', el => el.focus())
    await page.keyboard.press(locale === 'ar' ? 'ArrowLeft' : 'ArrowRight')
    await page.waitForFunction(selector => !document.querySelector(selector).disabled, {}, previous)
    check(`${prefix}: keyboard navigation`, await page.$eval(previous, el => !el.disabled))
    await page.click(previous)
    await page.waitForFunction(selector => document.querySelector(selector).disabled, {}, previous)
    if (width < 640) {
      await page.$eval('#reviews [aria-roledescription]', el => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
      const bounds = await (await page.$('#reviews [aria-roledescription]')).boundingBox()
      const cdp = await page.createCDPSession()
      const start = locale === 'ar' ? bounds.x + 45 : bounds.x + bounds.width - 45
      const end = locale === 'ar' ? bounds.x + bounds.width - 45 : bounds.x + 45
      const y = Math.min(750, bounds.y + 130)
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: start, y }] })
      for (let i = 1; i <= 6; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start + (end - start) * i / 6, y }] }); await sleep(25) }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      await page.waitForFunction(selector => !document.querySelector(selector).disabled, {}, previous)
      check(`${prefix}: native touch swipe`, await page.$eval(previous, el => !el.disabled))
      await sleep(500)
    }
    // Reach the fourth review using the actual navigation controls.
    while (await page.$eval(next, el => !el.disabled)) { await page.click(next); await sleep(100) }
    await page.click('#reviews details summary')
    check(`${prefix}: supplied owner response expands`, await page.$eval('#reviews details', el => el.open && el.querySelector('p').textContent === 'Thank you'))
    await page.click('#reviews details summary')
    if (failAvatars) {
      await page.waitForFunction(() => document.querySelectorAll('#reviews article img').length === 0)
      check(`${prefix}: all four failed avatars show correct initials`, await page.$$eval('#reviews article header > span', spans => spans.map(el => el.textContent).join(',') === 'AB,DR,MB,HB'))
    }
    check(`${prefix}: zero review API requests`, apiRequests.length === 0, apiRequests)
    await page.$eval('#home', el => el.scrollIntoView({ block: 'start', behavior: 'instant' }))
    if (width < 640) {
      await page.focus('header button[aria-controls="mobile-menu"]'); await page.keyboard.press('Enter')
      await page.waitForSelector('#mobile-menu a.bg-brand-red', { visible: true })
      await page.focus('#mobile-menu a.bg-brand-red'); await page.keyboard.press('Enter')
    } else { await page.focus('header a.bg-brand-red'); await page.keyboard.press('Enter') }
    await page.waitForSelector('[role="dialog"] form', { visible: true, timeout: 15000 })
    check(`${prefix}: existing booking still opens`, Boolean(await page.$('[role="dialog"] form')))
    check(`${prefix}: no runtime errors`, errors.length === 0, errors)
    if (locale === 'fr' || locale === 'ar') {
      await page.keyboard.press('Escape')
      // Capture only: stable geometry for Chrome's full-section screenshot.
      await page.addStyleTag({ content: '#main > section, #main > div > section, body footer { content-visibility: visible !important; contain-intrinsic-size: none !important; }' })
      await page.$eval('#reviews [aria-roledescription]', el => { el.scrollLeft = 0 })
      await page.$eval('#reviews', el => el.scrollIntoView({ block: 'start', behavior: 'instant' }))
      await page.$eval('body header', el => { el.style.visibility = 'hidden' })
      await sleep(150)
      await (await page.$('#reviews')).screenshot({ path: `${output}/${prefix}.png` })
    }
    await context.close()
  }
  const context = await browser.createBrowserContext()
  const page = await context.newPage()
  await page.setJavaScriptEnabled(false)
  await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 })
  check('without JavaScript: all four supplied reviews are rendered', await page.$$eval('#reviews article', cards => cards.map(card => card.querySelector('h3').textContent).join('|') === 'Ayoub Bhalli|Driss Rachdi|Meryama Belomari|Hamza Boughazi'))
  await context.close()
  // Exercise the existing real switch and its persistence, not just CSS attributes.
  const themeContext = await browser.createBrowserContext()
  const themePage = await themeContext.newPage()
  await themePage.setViewport({ width: 1440, height: 1000 })
  await themePage.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 })
  const navigation = JSON.parse(fs.readFileSync('messages/fr.json', 'utf8')).navigation
  const lightSwitch = 'body header button[aria-label="' + navigation.themeLight + '"]'
  const darkSwitch = 'body header button[aria-label="' + navigation.themeDark + '"]'
  const sectionColor = () => themePage.$eval('#reviews', el => getComputedStyle(el).backgroundColor)
  await themePage.waitForSelector(lightSwitch)
  check('theme switch: a new browser defaults to dark', await sectionColor() === 'rgb(9, 9, 11)' && await themePage.evaluate(() => localStorage.getItem('abfc-theme')) === null)
  await themePage.click(lightSwitch)
  check('theme switch: enabling light mode updates the reviews', await sectionColor() === 'rgb(246, 246, 245)')
  // External avatar/analytics requests need not settle to verify saved theme.
  await themePage.reload({ waitUntil: 'domcontentloaded' })
  await themePage.waitForSelector(darkSwitch)
  check('theme switch: light preference survives reload', await sectionColor() === 'rgb(246, 246, 245)')
  await themePage.waitForSelector(darkSwitch)
  await themePage.click(darkSwitch)
  check('theme switch: disabling light mode restores dark reviews', await sectionColor() === 'rgb(9, 9, 11)')
  await themePage.reload({ waitUntil: 'domcontentloaded' })
  await themePage.waitForSelector(lightSwitch)
  check('theme switch: dark preference survives reload', await sectionColor() === 'rgb(9, 9, 11)')
  await themeContext.close()
} catch (error) {
  report.errors.push(String(error)); process.exitCode = 1
} finally {
  await browser.close()
  fs.writeFileSync(`${output}/browser-results.json`, JSON.stringify(report, null, 2))
  console.log(`${report.results.filter(r => r.pass).length}/${report.results.length} browser checks passed`)
  if (report.errors.length) console.error(report.errors.join('\n'))
}
