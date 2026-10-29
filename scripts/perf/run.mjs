import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { summarize } from "./summary.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const at = arg.indexOf("=")
  return at < 0 ? [arg.replace(/^--/, ""), true] : [arg.slice(2, at), arg.slice(at + 1)]
}))
if (args.help) {
  console.log("node scripts/perf/run.mjs --base=http://localhost:3100 --dist=.next --out=reports/perf/codex-final [--methods=simulate,devtools] [--scenarios=home-mobile,home-desktop,ar-home-mobile,en-fleet-mobile] [--lighthouse=/path/to/lighthouse/cli/index.js] [--chrome=/path/to/chrome]")
  process.exit(0)
}

const base = args.base || "http://localhost:3100"
const output = path.resolve(root, args.out || "reports/perf/codex-final")
const dist = path.resolve(root, args.dist || ".next")
const methods = String(args.methods || "simulate,devtools").split(",")
const scenarios = [
  { name: "home-mobile", route: "/", formFactor: "mobile" },
  { name: "home-desktop", route: "/", formFactor: "desktop" },
  { name: "ar-home-mobile", route: "/ar", formFactor: "mobile" },
  { name: "en-fleet-mobile", route: "/en/fleet", formFactor: "mobile" },
].filter((scenario) => !args.scenarios || String(args.scenarios).split(",").includes(scenario.name))
const lighthouse = args.lighthouse || process.env.LIGHTHOUSE_CLI || path.join(process.env.USERPROFILE || "", "lhtool/node_modules/lighthouse/cli/index.js")
const chrome = args.chrome || process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe"
const sha = (value) => crypto.createHash("sha256").update(value).digest("hex")
const buildIdPath = path.join(dist, "BUILD_ID")
if (!fs.existsSync(buildIdPath)) throw new Error(`Production BUILD_ID missing: ${buildIdPath}`)
if (!fs.existsSync(lighthouse) || !fs.existsSync(chrome)) throw new Error("Set --lighthouse and --chrome to the existing tools; this runner installs nothing.")
if (!scenarios.length || methods.some((m) => !["simulate", "devtools"].includes(m))) throw new Error("Invalid scenario or throttling method")
if (fs.existsSync(output)) throw new Error(`Refusing to mix reports in an existing campaign: ${output}`)

const git = (...gitArgs) => spawnSync("git", gitArgs, { cwd: root, encoding: "utf8" }).stdout?.trim()
const fingerprint = () => {
  const hash = crypto.createHash("sha256")
  for (const name of ["BUILD_ID", "build-manifest.json", "app-build-manifest.json", "required-server-files.json"]) {
    const file = path.join(dist, name)
    if (fs.existsSync(file)) hash.update(name).update(fs.readFileSync(file))
  }
  return hash.digest("hex")
}
const initialFingerprint = fingerprint()
const sourceFingerprint = () => {
  const hash = crypto.createHash("sha256")
  const visit = (relative) => {
    const file = path.join(root, relative)
    if (!fs.existsSync(file)) return
    if (fs.statSync(file).isDirectory()) {
      for (const name of fs.readdirSync(file).sort()) visit(path.join(relative, name))
    } else hash.update(relative).update(fs.readFileSync(file))
  }
  for (const name of ["app", "components", "i18n", "lib", "messages", "proxy.ts", "next.config.mjs", "package.json", "pnpm-lock.yaml", ".data/site-content.json"]) visit(name)
  return hash.digest("hex")
}
const initialSourceFingerprint = sourceFingerprint()
const initialDiff = sha(git("diff", "HEAD") || "")
const response = await fetch(base)
const html = await response.text()
if (!response.ok || html.includes("/_next/webpack-hmr") || html.includes("nextjs-portal")) throw new Error("Expected a healthy production server, without development overlays")
fs.mkdirSync(output, { recursive: true })
const manifest = {
  startedAt: new Date().toISOString(), base, dist, buildId: fs.readFileSync(buildIdPath, "utf8").trim(),
  buildFingerprint: initialFingerprint, sourceFingerprint: initialSourceFingerprint,
  head: git("rev-parse", "HEAD"), trackedDiffSha256: initialDiff,
  node: process.version, lighthouseCli: lighthouse, chromePath: chrome, methods, scenarios, runsPerScenario: 3,
  browserFlags: ["--headless=new", "--no-sandbox"], cache: "Lighthouse default storage reset; fresh Chrome process for every run",
  notes: "No compilation, source edits, functional browser tests, or other Lighthouse campaigns may run concurrently. Simulated and observed metrics are reported separately. Local server; not deployed CDN/Blob validation.",
}
fs.writeFileSync(path.join(output, "campaign.json"), JSON.stringify(manifest, null, 2) + "\n")
try {
  for (const method of methods) {
    const directory = path.join(output, method)
    fs.mkdirSync(directory)
    for (const scenario of scenarios) {
      for (let run = 1; run <= 3; run++) {
        if (fingerprint() !== initialFingerprint) throw new Error("Production build changed during campaign")
        if (sourceFingerprint() !== initialSourceFingerprint) throw new Error("Application source or local content changed during campaign")
        console.log(`${method}: ${scenario.name} ${run}/3`)
        const cliArgs = [lighthouse, new URL(scenario.route, base).href,
          `--throttling-method=${method}`, "--only-categories=performance,accessibility,best-practices,seo",
          "--chrome-flags=--headless=new --no-sandbox", "--quiet", "--output=json", "--output=html",
          `--output-path=${path.join(directory, `${scenario.name}-${run}`)}`,
        ]
        if (scenario.formFactor === "desktop") cliArgs.push("--preset=desktop")
        const result = spawnSync(process.execPath, cliArgs, { cwd: root, env: { ...process.env, CHROME_PATH: chrome }, encoding: "utf8", timeout: 180000, windowsHide: true })
        if (result.error || result.status !== 0) throw new Error(`Lighthouse failed: ${result.error?.message || result.stderr || result.status}`)
      }
    }
  }
  if (fingerprint() !== initialFingerprint) throw new Error("Production build changed during campaign")
  if (sourceFingerprint() !== initialSourceFingerprint) throw new Error("Application source or local content changed during campaign")
  manifest.completedAt = new Date().toISOString()
  manifest.trackedDiffUnchanged = initialDiff === sha(git("diff", "HEAD") || "")
  manifest.status = "complete"
} catch (error) {
  manifest.status = "incomplete"
  manifest.error = error.message
  process.exitCode = 1
} finally {
  fs.writeFileSync(path.join(output, "campaign.json"), JSON.stringify(manifest, null, 2) + "\n")
  summarize(output)
}
