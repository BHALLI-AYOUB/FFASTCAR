import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const puppeteer = require(process.env.PUPPETEER_MODULE || path.join(os.homedir(), 'lhtool/node_modules/puppeteer-core'))
const base = process.argv.find((a) => a.startsWith('--base='))?.slice(7) || 'http://localhost:3210'
const output = process.argv.find((a) => a.startsWith('--out='))?.slice(6) || 'reports/integration'
const selectedLocales = process.argv.find((a) => a.startsWith('--locales='))?.slice(10).split(',') || ['fr', 'en', 'nl', 'ar']
const selectedProfiles = process.argv.find((a) => a.startsWith('--profiles='))?.slice(11).split(',') || ['desktop', 'mobile']
fs.mkdirSync(output, { recursive: true })
const report = { base, at: new Date().toISOString(), browser: '', autoplayOverride: false, results: [], errors: [] }
const check = (name, pass, detail) => {
  report.results.push({ name, pass: !!pass, detail })
  console.log(`${pass ? 'PASS' : 'FAIL'} ${name}${detail === undefined ? '' : ': ' + JSON.stringify(detail)}`)
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true, args: ['--no-sandbox'],
  // Puppeteer normally disables the user activation requirement for media.
  // Explicitly retain Chrome's normal autoplay policy for this verification.
  ignoreDefaultArgs: ['--autoplay-policy=no-user-gesture-required'],
})
report.browser = await browser.version()
report.launchArgs = browser.process().spawnargs.filter((a) => !a.includes('user-data-dir'))
assert(!report.launchArgs.some((a) => a.includes('autoplay-policy=no-user-gesture-required')))
try {
  for (const mobile of [false, true].filter((value) => selectedProfiles.includes(value ? 'mobile' : 'desktop'))) {
    for (const locale of selectedLocales) {
      const label = `${locale}-${mobile ? 'mobile' : 'desktop'}`
      const context = await browser.createBrowserContext()
      const page = await context.newPage()
      const videos = []
      const errors = []
      page.on('request', (r) => { if (/\.(mp4|mov)(?:\?|$)/i.test(r.url())) videos.push(r.url()) })
      page.on('pageerror', (e) => errors.push(String(e)))
      await page.setRequestInterception(true)
      page.on('request', (r) => /(?:wa\.me|api\.whatsapp\.com)/.test(r.url()) ? r.abort() : r.continue())
      await page.setViewport(mobile ? { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 } : { width: 1440, height: 1000, deviceScaleFactor: 1 })
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
      const route = locale === 'fr' ? '/' : `/${locale}`
      const response = await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 120000 })
      const initialHTML = await response.text()
      check(`${label}: section in initial HTML`, initialHTML.includes('id="videos"'))
      await page.waitForSelector('#videos button[aria-haspopup="dialog"]', { timeout: 15000 })
      await page.$eval('#videos', (el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }))
      await sleep(700)
      check(`${label}: no media before click even after scrolling`, videos.length === 0 && await page.$('video') === null, videos)
      const layout = await page.evaluate(() => {
        const cards = [...document.querySelectorAll('#videos figure > div')].map((el) => {
          const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }
        })
        return { overflow: document.documentElement.scrollWidth > innerWidth, dir: document.documentElement.dir, cards }
      })
      check(`${label}: layout ratios and direction`, !layout.overflow && layout.cards.length === 2 &&
        layout.cards[0].w > layout.cards[0].h && layout.cards[1].w < layout.cards[1].h &&
        (mobile ? layout.cards[1].y > layout.cards[0].y : Math.abs(layout.cards[1].y - layout.cards[0].y) < 2) &&
        (locale !== 'ar' || layout.dir === 'rtl'), layout)
      if (locale === 'fr' || locale === 'ar') {
        await page.screenshot({ path: path.join(output, `${label}-videos.png`) })
      }
      const trigger = await page.$('#videos button[aria-haspopup="dialog"]')
      await trigger.click()
      await page.waitForSelector('dialog[open] video', { timeout: 15000 })
      await page.waitForFunction(() => document.querySelector('dialog video')?.readyState >= 2, { timeout: 30000 })
      // Metadata/canplay precede actual decoded playback. Wait for progress
      // rather than sampling at a fixed delay on a busy verification host.
      await page.waitForFunction(() => {
        const v = document.querySelector('dialog video')
        return v && !v.paused && v.currentTime > 0 && (v.webkitAudioDecodedByteCount === undefined || v.webkitAudioDecodedByteCount > 0)
      }, { timeout: 15000 })
      const playing = await page.$eval('dialog video', (v) => ({ src: v.currentSrc, paused: v.paused, time: v.currentTime,
        muted: v.muted, controls: v.controls, inline: v.playsInline, duration: v.duration,
        audioBytes: v.webkitAudioDecodedByteCount ?? null, volume: v.volume }))
      const expected = mobile ? 'abfastcar-film-mobile.mp4' : 'abfastcar-film.mp4'
      check(`${label}: one correct source`, [...new Set(videos)].length === 1 && playing.src.endsWith(expected), [...new Set(videos)])
      check(`${label}: playback with normal autoplay rules and audio`, !playing.paused && playing.time > 0 && !playing.muted && playing.controls && playing.inline && playing.audioBytes > 0, playing)
      await page.$eval('dialog video', (v) => { v.pause(); v.currentTime = 8; v.volume = 0.4 })
      await page.waitForFunction(() => Math.abs(document.querySelector('dialog video').currentTime - 8) < 1, { timeout: 5000 })
      check(`${label}: seeking and volume`, await page.$eval('dialog video', (v) => Math.abs(v.currentTime - 8) < 1 && v.volume === 0.4))
      await page.$eval('dialog video', (v) => { window.__closedPlayer = v })
      check(`${label}: background scroll locked`, await page.evaluate(() => document.documentElement.style.overflow === 'hidden'))
      await page.click('dialog button')
      await page.waitForFunction(() => !document.querySelector('dialog[open]'))
      await sleep(50)
      const closed = await page.evaluate(() => ({ paused: window.__closedPlayer.paused, src: window.__closedPlayer.getAttribute('src'),
        focus: document.activeElement?.matches('#videos button[aria-haspopup="dialog"]'), overflow: document.documentElement.style.overflow }))
      check(`${label}: close stops and unloads, restores focus and scroll`, closed.paused && closed.src === null && closed.focus && closed.overflow !== 'hidden', closed)
      const second = (await page.$$('#videos button[aria-haspopup="dialog"]'))[1]
      await second.click()
      await page.waitForSelector('dialog[open] video')
      await page.waitForFunction(() => document.querySelector('dialog video')?.readyState >= 2, { timeout: 30000 })
      check(`${label}: portrait plays alone`, await page.$eval('dialog video', (v) => v.currentSrc.endsWith('abfastcar-showroom.mp4')) && (await page.$$('video')).length === 1)
      for (let i = 0; i < 5; i++) await page.keyboard.press('Tab')
      check(`${label}: modal focus contained`, await page.evaluate(() => !!document.activeElement?.closest('dialog')))
      await page.keyboard.press('Escape')
      await page.waitForFunction(() => !document.querySelector('dialog[open]'))
      check(`${label}: Escape closes`, await page.$('video') === null)
      check(`${label}: no browser exceptions`, errors.length === 0, errors)
      await context.close()
    }
  }
  // Exercise a real media failure and retry without changing saved content.
  {
    const page = await browser.newPage()
    await page.setRequestInterception(true)
    let failMedia = true
    page.on('request', (r) => failMedia && r.url().endsWith('.mp4') ? r.respond({ status: 404, body: 'QA media error' }) : r.continue())
    await page.goto(base, { waitUntil: 'networkidle0' })
    await page.$eval('#videos', (el) => el.scrollIntoView({ behavior: 'instant' }))
    await page.click('#videos button[aria-haspopup="dialog"]')
    await page.waitForSelector('dialog[open] video')
    await page.waitForFunction(() => document.querySelectorAll('dialog button').length === 2)
    check('media error offers retry', await page.$eval('dialog', (el) => el.textContent.includes('Réessayer')))
    failMedia = false
    await (await page.$$('dialog button'))[1].click()
    await page.waitForFunction(() => document.querySelector('dialog video')?.readyState >= 2, { timeout: 30000 })
    check('media retry recovers', await page.$eval('dialog video', (v) => !v.error && v.readyState >= 2))
    await page.keyboard.press('Escape')
    await page.close()
  }
} catch (error) {
  report.errors.push(String(error.stack || error))
  console.error(error)
} finally {
  await browser.close()
  fs.writeFileSync(path.join(output, 'video-results.json'), JSON.stringify(report, null, 2))
}
if (report.errors.length || report.results.some((r) => !r.pass)) process.exitCode = 1
