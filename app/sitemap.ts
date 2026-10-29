import type { MetadataRoute } from "next"

import { locales } from "@/i18n/config"
import { getSiteContent } from "@/lib/content"
import { SITE_LAST_UPDATED, languageAlternates, publicPaths } from "@/lib/seo"
import { absoluteUrl } from "@/lib/site"

/**
 * /sitemap.xml — every published page in every language, with its hreflang
 * alternates. Only canonical, indexable URLs that answer 200: no anchors, no
 * redirects, no preview domain, no hidden vehicle.
 *
 * <lastmod> is the later of the last deploy that changed content
 * (SITE_LAST_UPDATED) and the last save in the admin.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getSiteContent()
  const visible = content.vehicles.filter((v) => !v.hidden)
  const savedOn = content.updatedAt.slice(0, 10)
  const lastModified = savedOn > SITE_LAST_UPDATED ? savedOn : SITE_LAST_UPDATED

  return publicPaths(visible).flatMap((path) =>
    locales.map((locale) => ({
      url: absoluteUrl(locale, path),
      lastModified,
      alternates: { languages: languageAlternates(path) },
    })),
  )
}
