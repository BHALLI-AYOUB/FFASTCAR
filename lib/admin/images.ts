import { randomBytes } from "node:crypto"
import sharp from "sharp"

import { VARIANT_WIDTHS } from "@/lib/content/defaults"
import { storeImageFile } from "@/lib/content/store"
import type { ImageAsset, ImageVariant } from "@/lib/content/types"

/**
 * Turn an uploaded photo into the same set of files the bundled fleet photos
 * have (scripts/optimize-images.mjs): AVIF and WebP at 320/480/640/960 px and
 * a tiny blurred preview. The original file is not kept: it is often several
 * megabytes and may carry GPS data in its EXIF, which sharp drops.
 */

/** Vercel functions accept request bodies up to 4.5 MB. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024
const MIN_DIMENSION = 320
const ACCEPTED_FORMATS = new Set(["jpeg", "png", "webp", "avif", "heif"])

export class InvalidImageError extends Error {}
export class UnsupportedImageError extends Error {}

function slugify(name: string): string {
  const base = name
    .replace(/\.[^.]+$/, "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
  return base || "photo"
}

export async function processUpload(file: File): Promise<ImageAsset> {
  const input = Buffer.from(await file.arrayBuffer())

  // Trust the bytes, not the file name or the declared type.
  let meta: sharp.Metadata
  try {
    meta = await sharp(input, { failOn: "error" }).metadata()
  } catch {
    throw new InvalidImageError()
  }
  if (!meta.format || !ACCEPTED_FORMATS.has(meta.format)) throw new UnsupportedImageError()
  if ((meta.pages ?? 1) > 1) throw new UnsupportedImageError()

  // Apply the EXIF orientation once; every variant starts from this.
  const { data: oriented, info } = await sharp(input, { failOn: "error" })
    .rotate()
    .toBuffer({ resolveWithObject: true })
  if (info.width < MIN_DIMENSION || info.height < MIN_DIMENSION) throw new InvalidImageError()

  const dir = `${new Date().toISOString().slice(0, 10)}-${randomBytes(6).toString("hex")}`
  const base = `${dir}/${slugify(file.name)}`
  const widths: number[] = VARIANT_WIDTHS.filter((w) => w <= info.width)
  if (widths.length === 0) widths.push(info.width)

  const avif: ImageVariant[] = []
  const webp: ImageVariant[] = []
  for (const width of widths) {
    const resized = sharp(oriented).resize({ width, withoutEnlargement: true })
    const [avifBuf, webpBuf] = await Promise.all([
      resized.clone().avif({ quality: 50, effort: 4 }).toBuffer(),
      resized.clone().webp({ quality: 72 }).toBuffer(),
    ])
    avif.push({ url: await storeImageFile(`${base}-${width}.avif`, avifBuf, "image/avif"), width })
    webp.push({ url: await storeImageFile(`${base}-${width}.webp`, webpBuf, "image/webp"), width })
  }

  const blurBuf = await sharp(oriented).resize({ width: 24 }).blur(2).webp({ quality: 40 }).toBuffer()
  const blur = await storeImageFile(`${base}-blur.webp`, blurBuf, "image/webp")

  // Fallback <img src>: the 640 px WebP, or the largest one available.
  const fallback = webp.find((v) => v.width === 640) ?? webp[webp.length - 1]

  return { src: fallback.url, width: info.width, height: info.height, avif, webp, blur }
}
