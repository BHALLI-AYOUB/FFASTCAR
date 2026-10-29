// Generates responsive AVIF/WebP variants of the fleet photos and the logo.
//
//   node scripts/optimize-images.mjs
//
// Originals stay untouched in public/abfastcar/*.jpg (they are the fallback
// and the source of truth). Variants go to public/abfastcar/opt/ and a
// manifest with each photo's intrinsic size is written for <CarImage>.
// Re-run it after adding or replacing a photo.
import { mkdir, readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const ROOT = path.resolve(import.meta.dirname, "..")
const SRC = path.join(ROOT, "public/abfastcar")
const OUT = path.join(SRC, "opt")
const MANIFEST = path.join(ROOT, "components/car-image-manifest.json")

/** Widths served through srcset. Keep in sync with WIDTHS in components/car-image.tsx. */
const WIDTHS = [320, 480, 640, 960]
/** Tiny blurred preview used as the hero backdrop. */
const BLUR_WIDTH = 24

await mkdir(OUT, { recursive: true })

const manifest = {}
for (const file of (await readdir(SRC)).filter((f) => f.endsWith(".jpg")).sort()) {
  const base = file.replace(/\.jpg$/, "")
  const input = sharp(path.join(SRC, file))
  const { width, height } = await input.metadata()
  manifest[`/abfastcar/${file}`] = { base, width, height }

  for (const w of WIDTHS) {
    const resized = input.clone().resize({ width: Math.min(w, width) })
    await resized.clone().avif({ quality: 55, effort: 6 }).toFile(path.join(OUT, `${base}-${w}.avif`))
    await resized.clone().webp({ quality: 74, effort: 6 }).toFile(path.join(OUT, `${base}-${w}.webp`))
  }
  await input.clone().resize({ width: BLUR_WIDTH }).webp({ quality: 50 }).toFile(path.join(OUT, `${base}-blur.webp`))
  console.log("✓", file)
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n")

await whiteLogo()

/**
 * The logo is black on transparent (5311×2372 PNG, 200 KB) and was turned
 * white with a CSS filter. Pre-whiten it at the size actually shown (40–48 px
 * tall, ~110 px wide → 240 px wide covers 2× screens).
 */
async function whiteLogo() {
  const LOGO = path.join(ROOT, "public/images/logo-20ab-20300pp-20.png")
  const WIDTH = 240
  const resized = await sharp(LOGO).resize({ width: WIDTH }).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = resized.info
  const px = resized.data
  for (let i = 0; i < px.length; i += channels) px[i] = px[i + 1] = px[i + 2] = 255
  const white = sharp(px, { raw: { width, height, channels } })
  await white.clone().webp({ quality: 90, alphaQuality: 100 }).toFile(path.join(ROOT, "public/images/logo-ab-fastcar-white.webp"))
  await white.clone().png({ compressionLevel: 9 }).toFile(path.join(ROOT, "public/images/logo-ab-fastcar-white.png"))
  console.log(`✓ logo ${width}×${height}`)
}
