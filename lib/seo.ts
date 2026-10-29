import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { LOCALE_META, DEFAULT_LOCALE, locales, type Locale } from "@/i18n/config"
import type { ImageAsset, VehicleRecord } from "@/lib/content/types"
import { formatPrice } from "@/lib/currency"
import { IS_INDEXABLE, SITE_URL, absoluteUrl } from "@/lib/site"

/**
 * Per-page metadata: title, description, canonical, hreflang, Open Graph and
 * robots. Page files call buildMetadata(); the texts live in
 * messages/seo/<locale>.json under "meta".
 *
 * Rules:
 * - Each language is its own canonical URL on https://abfastcar.com (never the
 *   temporary *.vercel.app domain), with reciprocal hreflang + x-default (French).
 * - Currency is display-only and never appears in a URL, so there are no
 *   per-currency variants to canonicalise.
 * - Anything that is not the production deployment is noindex (lib/site.ts).
 */
export type PageKey = "home" | "fleet" | "vehicle" | "faq" | "contact" | "conditions" | "notFound"

export { SITE_LAST_UPDATED } from "@/lib/seo-dates"

/**
 * Every public, indexable path (unprefixed). Single list for the sitemap and
 * /llms.txt; it must match the routes under app/[locale].
 */
export function publicPaths(vehicles: { slug: string }[]): string[] {
  return ["/", "/fleet", ...vehicles.map((v) => `/fleet/${v.slug}`), "/faq", "/contact", "/conditions"]
}

/** Default share image: an existing fleet photo. */
const DEFAULT_OG_IMAGE = "/abfastcar/lamborghini-urus.jpg"

/** hreflang → absolute URL for every published language, plus x-default. */
export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const l of locales) languages[LOCALE_META[l].htmlLang] = absoluteUrl(l, path)
  languages["x-default"] = absoluteUrl(DEFAULT_LOCALE, path)
  return languages
}

/**
 * Share image for a vehicle: the largest WebP variant (social networks do
 * not all read AVIF), with its size so previews render without a refetch.
 */
function ogImage(asset: ImageAsset): { url: string; width?: number; height?: number } {
  const largest = asset.webp?.[asset.webp.length - 1]
  if (!largest) return { url: asset.src, width: asset.width, height: asset.height }
  return { url: largest.url, width: largest.width, height: Math.round((asset.height * largest.width) / asset.width) }
}

export const ROBOTS_INDEX: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
}
export const ROBOTS_NOINDEX: Metadata["robots"] = { index: false, follow: false }

export async function buildMetadata(opts: {
  locale: Locale
  page: PageKey
  /** Unprefixed path of the page, e.g. "/fleet/porsche-macan". */
  path: string
  vehicle?: VehicleRecord
}): Promise<Metadata> {
  const { locale, page, path, vehicle } = opts
  const t = await getTranslations({ locale, namespace: "meta" })
  const meta = LOCALE_META[locale]
  const siteName = t("siteName")

  let title: string
  let description: string
  let image: { url: string; width?: number; height?: number } = { url: DEFAULT_OG_IMAGE }
  let imageAlt = siteName

  if (page === "vehicle" && vehicle) {
    const values = {
      name: vehicle.name,
      category: vehicle.category[locale],
      features: vehicle.features[locale].join(", "),
      price: formatPrice(vehicle.priceMad, { currency: "MAD", intlLocale: meta.intlLocale }),
    }
    title = t("vehicle.title", values)
    description = t("vehicle.description", values)
    image = ogImage(vehicle.image)
    imageAlt = vehicle.name
  } else {
    const key = page === "vehicle" ? "fleet" : page
    title = t(`${key}.title`)
    description = t(`${key}.description`)
  }

  const canonical = absoluteUrl(locale, path)
  const indexable = IS_INDEXABLE && page !== "notFound"

  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: title },
    description,
    applicationName: siteName,
    alternates: page === "notFound" ? undefined : { canonical, languages: languageAlternates(path) },
    robots: indexable ? ROBOTS_INDEX : ROBOTS_NOINDEX,
    openGraph: {
      type: "website",
      siteName,
      title,
      description,
      url: canonical,
      locale: meta.ogLocale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => LOCALE_META[l].ogLocale),
      images: [{ ...image, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  }
}
