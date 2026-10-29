import type { ImageAsset, ImageVariant } from "@/lib/content/types"

/**
 * Every vehicle photo on the site goes through this component, so image
 * optimisation lives in one place: AVIF then WebP through <picture>, several
 * widths in srcset, a fallback <img>, and explicit width/height so the
 * browser reserves the space before the file arrives (no layout shift).
 *
 * One code path for both kinds of photos:
 * - the original fleet photos, pre-optimised by scripts/optimize-images.mjs
 *   into /abfastcar/opt/ (see components/car-image-manifest.json);
 * - photos uploaded from the admin, which get the same AVIF/WebP
 *   320/480/640/960 variants and blur preview at upload time.
 */
export type CarImageProps = {
  image: ImageAsset
  alt: string
  /** The `sizes` attribute describing the rendered width. */
  sizes: string
  /** Above-the-fold image (LCP): eager, fetchpriority=high. Never lazy. */
  priority?: boolean
  className?: string
}

function srcSet(variants: ImageVariant[] | undefined): string | undefined {
  if (!variants?.length) return undefined
  return variants.map((v) => `${v.url} ${v.width}w`).join(", ")
}

/** URL of the tiny blurred preview, for decorative backdrops. */
export function carBlurSrc(image: ImageAsset): string | undefined {
  return image.blur
}

/**
 * Attributes for <link rel="preload" as="image"> matching what <CarImage>
 * will pick, so the preload is reused instead of downloading twice.
 */
export function carPreload(
  image: ImageAsset,
  sizes: string,
): { href: string; imageSrcSet?: string; imageSizes?: string; type?: string } {
  const avif = srcSet(image.avif)
  if (avif) return { href: image.src, imageSrcSet: avif, imageSizes: sizes, type: "image/avif" }
  const webp = srcSet(image.webp)
  if (webp) return { href: image.src, imageSrcSet: webp, imageSizes: sizes, type: "image/webp" }
  return { href: image.src }
}

export function CarImage({ image, alt, sizes, priority = false, className }: CarImageProps) {
  const common = {
    alt,
    sizes,
    className,
    width: image.width,
    height: image.height,
    loading: priority ? ("eager" as const) : ("lazy" as const),
    fetchPriority: priority ? ("high" as const) : ("auto" as const),
    decoding: priority ? ("sync" as const) : ("async" as const),
  }
  const avif = srcSet(image.avif)
  const webp = srcSet(image.webp)

  if (!avif && !webp) return <img src={image.src} {...common} />

  // <picture> must not create a box of its own: `contents` lets the <img>
  // keep absolute/object-cover layouts written for a bare <img>.
  return (
    <picture className="contents">
      {avif && <source type="image/avif" srcSet={avif} sizes={sizes} />}
      {webp && <source type="image/webp" srcSet={webp} sizes={sizes} />}
      <img src={image.src} {...common} />
    </picture>
  )
}
