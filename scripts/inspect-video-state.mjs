import fs from 'node:fs'
import path from 'node:path'

for (const dir of ['.next', '.next-perf']) {
  const build = path.join(dir, 'BUILD_ID')
  const html = path.join(dir, 'server/app/fr.html')
  console.log(JSON.stringify({ dir, builtAt: fs.existsSync(build) ? fs.statSync(build).mtime.toISOString() : null,
    videosInHTML: fs.existsSync(html) ? fs.readFileSync(html, 'utf8').includes('id="videos"') : null }))
}
console.log(JSON.stringify({ videoSourceModifiedAt: fs.statSync('components/video-section.tsx').mtime.toISOString(),
  savedLocalContentExists: fs.existsSync('.data/site-content.json') }))
const base = process.argv[2] || 'http://localhost:3210'
for (const route of ['/', '/fr', '/en', '/nl', '/ar']) {
  const response = await fetch(base + route)
  const html = await response.text()
  console.log(JSON.stringify({ route, url: response.url, status: response.status, videos: html.includes('id="videos"'),
    initialVideoElements: (html.match(/<video[\s>]/g) || []).length, rtl: html.includes('dir="rtl"') }))
}
