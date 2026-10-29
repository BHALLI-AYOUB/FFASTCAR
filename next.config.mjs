import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

/**
 * Photos and the logo are not content-hashed (their names are stable), so
 * they get a week of browser cache plus a day of stale-while-revalidate
 * instead of an "immutable" year: a replaced photo shows up within a week at
 * worst. Hashed build assets under /_next/static are already immutable.
 * HTML keeps Vercel's default (revalidated on every visit) so prices and
 * pages are never frozen in a cache.
 */
const STATIC_IMAGE_CACHE = "public, max-age=604800, stale-while-revalidate=86400"

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets performance builds use their own folder (NEXT_DIST_DIR=.next-perf)
  // without colliding with `next dev` or the regular build.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  experimental: {
    // External CSS avoids duplicating the stylesheet in HTML and the RSC
    // payload (~30 KB less transferred in the recorded comparison), and
    // lets repeat navigations reuse the hashed stylesheet from cache.
    // Retain an explicit opt-in for a reproducible inline-CSS comparison.
    inlineCss: process.env.NEXT_INLINE_CSS === "1",
  },
  images: {
    // Photos are pre-optimised to AVIF/WebP by scripts/optimize-images.mjs
    // and served by <CarImage>; no runtime optimisation needed.
    unoptimized: true,
  },
  async headers() {
    return [
      { source: "/abfastcar/:path*", headers: [{ key: "Cache-Control", value: STATIC_IMAGE_CACHE }] },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: STATIC_IMAGE_CACHE }] },
    ]
  },
}

export default withNextIntl(nextConfig)
