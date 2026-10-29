import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const puppeteer = require(process.env.PUPPETEER_MODULE || path.join(os.homedir(), 'lhtool/node_modules/puppeteer-core'))
const base = process.argv[2] || 'http://localhost:3211'
const output = 'reports/integration/final-captures'
fs.mkdirSync(output, { recursive: true })
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--no-sandbox'] })
try {
  for (const locale of ['fr', 'ar']) for (const mobile of [false, true]) {
    const page = await browser.newPage()
    await page.setViewport({ width: mobile ? 390 : 1440, height: mobile ? 844 : 1100, deviceScaleFactor: 1 })
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    await page.goto(base + (locale === 'fr' ? '/' : '/ar'), { waitUntil: 'networkidle0' })
    await page.evaluate(() => document.fonts.ready)
    await page.$eval('#videos', (el) => el.scrollIntoView({ behavior: 'instant' }))
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
    await page.$eval('#videos', (el) => scrollBy(0, el.getBoundingClientRect().top - 80))
    await new Promise((resolve) => setTimeout(resolve, 400))
    // Actual viewport screenshots preserve content-visibility layout and do
    // not capture skipped offscreen sections using stale document offsets.
    await page.screenshot({ path: path.join(output, `${locale}-${mobile ? 'mobile' : 'desktop'}-videos.png`) })
    if (mobile) {
      await page.$$eval('#videos figure', (els) => els[1].scrollIntoView({ block: 'center', behavior: 'instant' }))
      await new Promise((resolve) => setTimeout(resolve, 200))
      await page.screenshot({ path: path.join(output, `${locale}-mobile-portrait.png`) })
    }
    await page.close()
  }
} finally { await browser.close() }
