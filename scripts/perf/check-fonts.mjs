// Run only after the Lighthouse campaign: this opens its own Chrome process.
import fs from "node:fs"
import path from "node:path"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const puppeteer = require(process.env.PUPPETEER_MODULE || path.join(process.env.USERPROFILE || "", "lhtool/node_modules/puppeteer-core"))
const base = process.argv[2] || "http://localhost:3211"
const output = process.argv[3] || "reports/perf/font-diagnostic"
fs.mkdirSync(output, { recursive: true })
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: "new", args: ["--no-sandbox"],
})
const results = []
try {
  for (const route of ["/", "/ar"]) {
    const page = await browser.newPage()
    await page.setViewport({ width: 1350, height: 940, deviceScaleFactor: 1 })
    const requests = []
    page.on("response", (response) => {
      if (/\.woff2?(?:\?|$)/.test(response.url())) requests.push({ url: response.url(), status: response.status() })
    })
    const client = await page.createCDPSession()
    await client.send("DOM.enable")
    await client.send("CSS.enable")
    await client.send("Performance.enable")
    await page.goto(new URL(route, base).href, { waitUntil: "networkidle0" })
    await page.evaluate(() => document.fonts.ready)
    const values = await page.evaluate(() => {
      const vars = ["--font-inter", "--font-montserrat", "--font-playfair", "--font-cairo", "--font-sans", "--font-display", "--font-serif"]
      const selectors = ["html", "body", "#home h1 span", "#home .font-serif", "header a"]
      return {
        lang: document.documentElement.lang, dir: document.documentElement.dir,
        nodes: selectors.map((selector) => {
          const element = document.querySelector(selector)
          if (!element) return { selector, missing: true }
          const style = getComputedStyle(element)
          return { selector, fontFamily: style.fontFamily, fontWeight: style.fontWeight, text: element.textContent.trim().slice(0, 80), variables: Object.fromEntries(vars.map((v) => [v, style.getPropertyValue(v).trim()])) }
        }),
        faces: [...document.fonts].map((font) => ({ family: font.family, status: font.status, weight: font.weight, style: font.style })),
        checks: Object.fromEntries(["--font-inter", "--font-montserrat", "--font-playfair", "--font-cairo"].map((name) => {
          const family = getComputedStyle(document.body).getPropertyValue(name).trim().split(",")[0]
          return [name, { family, available: family ? document.fonts.check(`16px ${family}`, name === "--font-cairo" ? "مرحبا" : "AB FAST CAR") : false }]
        })),
        paints: performance.getEntriesByType("paint").map((p) => ({ name: p.name, startTime: p.startTime })),
        navigation: performance.getEntriesByType("navigation").map((n) => ({ domContentLoadedEventEnd: n.domContentLoadedEventEnd, loadEventEnd: n.loadEventEnd, responseEnd: n.responseEnd })),
      }
    })
    const { root } = await client.send("DOM.getDocument")
    const platformFonts = []
    for (const selector of ["#home h1 span", "#home .font-serif", "header a"]) {
      try {
        const { nodeId } = await client.send("DOM.querySelector", { nodeId: root.nodeId, selector })
        platformFonts.push({ selector, ...(nodeId ? await client.send("CSS.getPlatformFontsForNode", { nodeId }) : { missing: true }) })
      } catch (error) { platformFonts.push({ selector, error: error.message }) }
    }
    const performanceMetrics = await client.send("Performance.getMetrics")
    const row = { route, ...values, requestedFonts: requests, platformFonts, performanceMetrics }
    results.push(row)
    console.log(JSON.stringify(row, null, 2))
    await page.screenshot({ path: path.join(output, route === "/" ? "fr-desktop.png" : "ar-desktop.png") })
    await page.close()
  }
} finally {
  await browser.close()
  fs.writeFileSync(path.join(output, "fonts.json"), JSON.stringify(results, null, 2) + "\n")
}
