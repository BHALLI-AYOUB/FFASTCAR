import { revalidateTag, unstable_cache } from "next/cache"

import type { Locale } from "@/i18n/config"
import { readStoredContent, writeStoredContent } from "@/lib/content/store"
import type { LocaleTexts, PublicContent, SiteContent, VehicleRecord } from "@/lib/content/types"

/**
 * Server-side access to the editable site content. Pages read through a
 * cache tagged "site-content"; a save in the admin expires that tag, so the
 * next visit renders the new content without a redeploy.
 */
export const CONTENT_TAG = "site-content"

// The data cache outlives builds and deployments: bump the version part of
// the key whenever the shape of the content changes (v3: video pictureAspect),
// otherwise pages keep rendering a cached copy in the old shape.
const readCached = unstable_cache(async () => (await readStoredContent()).content, ["site-content", "v3-video-picture-aspect"], {
  tags: [CONTENT_TAG],
})

/** The whole document, hidden vehicles included. Server-side only. */
export async function getSiteContent(): Promise<SiteContent> {
  return readCached()
}

/** Published vehicles in display order. */
export async function getVisibleVehicles(): Promise<VehicleRecord[]> {
  return (await getSiteContent()).vehicles.filter((v) => !v.hidden)
}

/**
 * One vehicle by slug. Hidden vehicles count as missing (their page is a
 * 404) unless `includeHidden` is set, e.g. for the admin preview.
 */
export async function getVehicle(
  slug: string,
  { includeHidden = false }: { includeHidden?: boolean } = {},
): Promise<VehicleRecord | undefined> {
  const vehicle = (await getSiteContent()).vehicles.find((v) => v.slug === slug)
  if (!vehicle || (vehicle.hidden && !includeHidden)) return undefined
  return vehicle
}

/** What client components receive: visible vehicles and contact, nothing else. */
export async function getPublicContent(): Promise<PublicContent> {
  const content = await getSiteContent()
  return { vehicles: content.vehicles.filter((v) => !v.hidden), contact: content.contact }
}

/** Editable texts of one language, merged over messages/ by i18n/request.ts. */
export async function getLocaleTexts(locale: Locale): Promise<LocaleTexts> {
  return (await getSiteContent()).texts[locale]
}

/**
 * Save a validated document (see lib/content/validate.ts) and expire every
 * page that read the content. Throws ConflictError / StorageUnavailableError
 * from lib/content/store.ts.
 */
export async function saveSiteContent(
  content: SiteContent,
  expectedEtag: string,
): Promise<{ content: SiteContent; etag: string; savedAt: string }> {
  const savedAt = new Date().toISOString()
  const toSave: SiteContent = { ...content, schemaVersion: 1, updatedAt: savedAt }
  const etag = await writeStoredContent(toSave, expectedEtag)
  // Expire immediately: the next request re-reads the store. (updateTag is
  // not allowed in route handlers; this is its equivalent there.)
  revalidateTag(CONTENT_TAG, { expire: 0 })
  return { content: toSave, etag, savedAt }
}

export type { LocaleTexts, PublicContent, SiteContent, VehicleRecord } from "@/lib/content/types"
