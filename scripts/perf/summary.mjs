import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const median = (values) => {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b)
  if (!sorted.length) return null
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}
function reportFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory()
    ? reportFiles(path.join(directory, entry.name))
    : entry.name.endsWith(".report.json") ? [path.join(directory, entry.name)] : [])
}

export function summarize(directory) {
  const groups = new Map()
  for (const file of reportFiles(directory).sort()) {
    const report = JSON.parse(fs.readFileSync(file, "utf8"))
    const a = report.audits
    const metrics = a?.metrics?.details?.items?.[0]
    const label = path.basename(file).replace(/-\d+\.report\.json$/, "")
    // Keep protocol, viewport, browser version and exact throttle settings in
    // the grouping key, so incompatible measurements never share a median.
    const protocol = report.configSettings.throttlingMethod
    const key = JSON.stringify([path.dirname(file), label, protocol, report.configSettings.formFactor, report.environment.hostUserAgent, report.configSettings.throttling])
    if (!groups.has(key)) groups.set(key, { label, protocol, settings: report.configSettings, runs: [] })
    const resources = a?.["resource-summary"]?.details?.items || []
    const resource = (type, field) => resources.find((r) => r.resourceType === type)?.[field] ?? 0
    const requests = a?.["network-requests"]?.details?.items || []
    const initialRequests = requests.filter((r) => Number.isFinite(r.networkRequestTime) && r.networkRequestTime <= metrics?.observedLoad)
    const lateRequests = requests.filter((r) => Number.isFinite(r.networkRequestTime) && r.networkRequestTime > metrics?.observedLoad)
    const sumTransfer = (rows, type) => rows.filter((r) => !type || r.resourceType === type).reduce((total, r) => total + (r.transferSize || 0), 0)
    groups.get(key).runs.push({
      file: path.relative(directory, file), valid: !report.runtimeError && Boolean(metrics), runtimeError: report.runtimeError,
      url: report.finalDisplayedUrl || report.finalUrl, lighthouseVersion: report.lighthouseVersion,
      benchmarkIndex: report.environment.benchmarkIndex,
      performance: report.categories?.performance?.score == null ? null : Math.round(report.categories.performance.score * 100),
      FCP: a?.["first-contentful-paint"]?.numericValue, LCP: a?.["largest-contentful-paint"]?.numericValue,
      SI: a?.["speed-index"]?.numericValue, TBT: a?.["total-blocking-time"]?.numericValue, CLS: a?.["cumulative-layout-shift"]?.numericValue,
      observedFCP: metrics?.observedFirstContentfulPaint, observedLCP: metrics?.observedLargestContentfulPaint,
      observedSI: metrics?.observedSpeedIndex,
      htmlBytes: resource("document", "transferSize"), cssBytes: resource("stylesheet", "transferSize"), jsBytes: resource("script", "transferSize"),
      initialLoadCutoffMs: metrics?.observedLoad,
      initialHtmlBytes: sumTransfer(initialRequests, "Document"), initialCssBytes: sumTransfer(initialRequests, "Stylesheet"), initialJsBytes: sumTransfer(initialRequests, "Script"), initialTotalBytes: sumTransfer(initialRequests),
      lateHtmlBytes: sumTransfer(lateRequests, "Document"), lateCssBytes: sumTransfer(lateRequests, "Stylesheet"), lateJsBytes: sumTransfer(lateRequests, "Script"), lateTotalBytes: sumTransfer(lateRequests),
      lateRequests: lateRequests.map(({ url, resourceType, networkRequestTime, transferSize }) => ({ url, resourceType, networkRequestTime, transferSize })),
    })
  }
  const results = [...groups.values()].map((group) => ({ ...group,
    complete: group.runs.length === 3 && group.runs.every((r) => r.valid),
    medians: Object.fromEntries(["performance", "FCP", "LCP", "SI", "TBT", "CLS", "observedFCP", "observedLCP", "observedSI", "htmlBytes", "cssBytes", "jsBytes", "benchmarkIndex", "initialLoadCutoffMs", "initialHtmlBytes", "initialCssBytes", "initialJsBytes", "initialTotalBytes", "lateHtmlBytes", "lateCssBytes", "lateJsBytes", "lateTotalBytes"].map((key) => [key, median(group.runs.filter((r) => r.valid).map((r) => r[key]))])),
  }))
  const lines = ["# Performance campaign", "", "Primary metrics follow the stated Lighthouse throttling protocol. Observed trace timings are a separate diagnostic table, never substituted for simulated scores. The main table includes all transferred resources collected during the unscrolled audit. The strict initial-load table sums only requests with networkRequestTime <= observedLoad from the same trace; later requests are separated. This cutoff is observed for both protocols, not a simulated timestamp. Values are medians of each metric, not one selected run.", ""]
  const seconds = (n) => n == null ? "—" : (n / 1000).toFixed(2)
  const fixed = (n, places = 0) => n == null ? "—" : n.toFixed(places)
  for (const protocol of [...new Set(results.map((r) => r.protocol))]) {
    lines.push(`## ${protocol}`, "", "| Scenario | Runs valid/total | Perf | FCP s | LCP s | SI s | TBT ms | CLS | HTML KiB | CSS KiB | JS KiB | Benchmark |", "|---|---|---|---|---|---|---|---|---|---|---|---|")
    for (const r of results.filter((r) => r.protocol === protocol)) {
      const m = r.medians
      lines.push(`| ${r.label}${r.complete ? "" : " (INCOMPLETE)"} | ${r.runs.filter((x) => x.valid).length}/${r.runs.length} | ${fixed(m.performance)} | ${seconds(m.FCP)} | ${seconds(m.LCP)} | ${seconds(m.SI)} | ${fixed(m.TBT)} | ${fixed(m.CLS, 3)} | ${fixed(m.htmlBytes / 1024, 1)} | ${fixed(m.cssBytes / 1024, 1)} | ${fixed(m.jsBytes / 1024, 1)} | ${fixed(m.benchmarkIndex)} |`)
    }
    lines.push("", "Observed trace timings (same reports, diagnostic only):", "", "| Scenario | Observed FCP s | Observed LCP s | Observed SI s |", "|---|---|---|---|")
    for (const r of results.filter((r) => r.protocol === protocol)) lines.push(`| ${r.label} | ${seconds(r.medians.observedFCP)} | ${seconds(r.medians.observedLCP)} | ${seconds(r.medians.observedSI)} |`)
    lines.push("")
    lines.push("Strict initial navigation transfers, excluding requests started after the observed load event:", "", "| Scenario | Load cutoff s | Initial HTML KiB | Initial CSS KiB | Initial JS KiB | Initial all KiB | Later HTML KiB | Later CSS KiB | Later JS KiB | Later all KiB |", "|---|---|---|---|---|---|---|---|---|---|")
    for (const r of results.filter((r) => r.protocol === protocol)) {
      const m = r.medians
      lines.push(`| ${r.label} | ${seconds(m.initialLoadCutoffMs)} | ${["initialHtmlBytes", "initialCssBytes", "initialJsBytes", "initialTotalBytes", "lateHtmlBytes", "lateCssBytes", "lateJsBytes", "lateTotalBytes"].map((key) => fixed(m[key] / 1024, 1)).join(" | ")} |`)
    }
    lines.push("")
    lines.push("CPU benchmark ranges (environment variability, not a site metric):", "")
    for (const r of results.filter((r) => r.protocol === protocol)) {
      const benchmarks = r.runs.map((run) => run.benchmarkIndex).filter(Number.isFinite)
      const low = Math.min(...benchmarks)
      const high = Math.max(...benchmarks)
      lines.push(`- ${r.label}: ${fixed(low)}–${fixed(high)}${high / low > 1.5 ? "; high variability — avoid attributing a small score change to code alone" : ""}.`)
    }
    lines.push("")
  }
  fs.writeFileSync(path.join(directory, "summary.json"), JSON.stringify(results, null, 2) + "\n")
  fs.writeFileSync(path.join(directory, "SUMMARY.md"), lines.join("\n") + "\n")
  console.log(lines.join("\n"))
  return results
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!process.argv[2]) throw new Error("Usage: node scripts/perf/summary.mjs <report-directory>")
  summarize(path.resolve(process.argv[2]))
}
