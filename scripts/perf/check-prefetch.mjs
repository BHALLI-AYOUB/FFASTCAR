// Diagnostic only, after Lighthouse has stopped. Does not change application code.
import fs from "node:fs"
import path from "node:path"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const puppeteer = require(process.env.PUPPETEER_MODULE || path.join(process.env.USERPROFILE || "", "lhtool/node_modules/puppeteer-core"))
const base = process.argv[2] || "http://localhost:3211"
const output = process.argv[3] || "reports/perf/prefetch-diagnostic"
fs.mkdirSync(output, { recursive: true })
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new", args: ["--no-sandbox"] })
const results = []
try {
  for (const blockRsc of [false, true]) {
    const context = await browser.createBrowserContext()
    const page = await context.newPage()
    await page.setViewport({ width: 412, height: 823, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true })
    const client = await page.createCDPSession()
    await client.send("Network.enable")
    await client.send("Network.setCacheDisabled", { cacheDisabled: true })
    const requests = new Map()
    let navigationTimestamp
    client.on("Network.requestWillBeSent", (event) => {
      if (navigationTimestamp === undefined && event.type === "Document") navigationTimestamp = event.timestamp
      requests.set(event.requestId, {
        url: event.request.url, type: event.type, startMs: (event.timestamp - (navigationTimestamp ?? event.timestamp)) * 1000,
        initiatorType: event.initiator.type, initiatorUrl: event.initiator.url,
        initiatorStack: event.initiator.stack?.callFrames.slice(0, 3).map(({ functionName, url, lineNumber }) => ({ functionName, url, lineNumber })),
      })
    })
    client.on("Network.loadingFinished", ({ requestId, encodedDataLength }) => {
      const request = requests.get(requestId)
      if (request) request.bytes = encodedDataLength
    })
    client.on("Network.loadingFailed", ({ requestId, errorText }) => {
      const request = requests.get(requestId)
      if (request) request.error = errorText
    })
    await page.setRequestInterception(true)
    const blocked = []
    page.on("request", (request) => {
      if (blockRsc && new URL(request.url()).searchParams.has("_rsc")) {
        blocked.push(request.url())
        request.abort("blockedbyclient").catch(() => {})
      } else request.continue().catch(() => {})
    })
    await page.goto(new URL("/en/fleet", base).href, { waitUntil: "load" })
    const remaining = await page.evaluate(() => Math.max(0, 5000 - performance.now()))
    if (remaining) await new Promise((resolve) => setTimeout(resolve, remaining))
    const timing = await page.evaluate(() => ({
      loadMs: performance.getEntriesByType("navigation")[0].loadEventEnd,
      paints: performance.getEntriesByType("paint").map(({ name, startTime }) => ({ name, startTime })),
      images: [...document.querySelectorAll("#fleet img")].map((image) => ({ src: image.currentSrc, loading: image.loading, priority: image.fetchPriority, top: Math.round(image.getBoundingClientRect().top) })),
    }))
    const all = [...requests.values()]
    const images = all.filter((request) => request.type === "Image")
    const beforeLoad = images.filter((request) => request.startMs <= timing.loadMs)
    const result = {
      mode: blockRsc ? "block-rsc" : "normal", url: page.url(), protocol: "Observed Chrome navigation; no CPU or network throttling; isolated context and cache disabled; exactly 5 seconds without scroll or navigation clicks. This is diagnostic, not a Lighthouse score.",
      blocked, timing, imageRequests: images.length, imageRequestsBeforeLoad: beforeLoad.length,
      imageTransferredBytes: images.reduce((total, request) => total + (request.bytes || 0), 0),
      imageVariants: images.map((request) => new URL(request.url).pathname.split("/").pop()),
      distinctVehicles: [...new Set(images.filter((request) => request.url.includes("/abfastcar/opt/")).map((request) => new URL(request.url).pathname.split("/").pop().replace(/-(?:320|480|640|960|blur)\.(?:avif|webp)$/, "")))],
      requests: all,
    }
    results.push(result)
    fs.writeFileSync(path.join(output, `${result.mode}.json`), JSON.stringify(result, null, 2) + "\n")
    console.log(JSON.stringify({ ...result, requests: undefined, timing: { ...timing, images: undefined } }, null, 2))
    await context.close()
  }
} finally {
  await browser.close()
  fs.writeFileSync(path.join(output, "summary.json"), JSON.stringify(results.map(({ requests, timing, ...result }) => ({ ...result, timing: { ...timing, images: undefined } })), null, 2) + "\n")
}
