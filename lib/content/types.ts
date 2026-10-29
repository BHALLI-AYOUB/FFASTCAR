import type { Locale } from "@/i18n/config"

/**
 * Shape of the editable site content (the admin edits it, the public pages
 * read it). Stored as one JSON document; see lib/content/store.ts.
 *
 * OWNER: agent 1 (coordinator). Agents 2 and 3 code against these types;
 * changes go through the coordinator.
 */

export type ImageVariant = { url: string; width: number }

/** A photo with everything needed for a responsive, CLS-free <img>. */
export type ImageAsset = {
  /** Fallback URL for <img src> (a mid-size WebP or the original). */
  src: string
  /** Intrinsic size of the original, for width/height attributes. */
  width: number
  height: number
  /** Responsive variants, ascending width. Absent = only `src` is available. */
  avif?: ImageVariant[]
  webp?: ImageVariant[]
  /** Tiny blurred preview for decorative backdrops. */
  blur?: string
}

export type LocalizedText = Record<Locale, string>
export type LocalizedList = Record<Locale, string[]>

/** The French client document is retained in docs/client as the source reference. */
export type RentalConditions = {
  title: string
  intro: string
  articles: {
    title: string
    sections: { heading?: string; paragraphs: string[] }[]
  }[]
}

export type VehicleRecord = {
  /**
   * Stable identifier: used in the URL (/fleet/<slug>) and in booking drafts.
   * Never changes after creation, even when the name changes.
   */
  slug: string
  name: string
  brand: string
  year: number
  /** Reference daily rate in MAD (integer). */
  priceMad: number
  /** Hidden vehicles are not shown, not in the sitemap, and their page is a 404. */
  hidden: boolean
  /**
   * Former home carousel flag. The hero now shows the videos, so nothing
   * reads it; kept so stored documents and the admin round-trip stay valid.
   */
  featured: boolean
  image: ImageAsset
  gallery: ImageAsset[]
  category: LocalizedText
  features: LocalizedList
}

/**
 * A video of the "AB FAST CAR universe" section. Files are prepared offline
 * (H.264/AAC MP4 + WebP cover, see docs/client/medias-prepares.md); the admin
 * edits the texts, order, visibility and URLs, it does not upload or transcode
 * videos.
 */
export type VideoRecord = {
  /** Stable identifier (React key, element ids). */
  id: string
  title: LocalizedText
  caption: LocalizedText
  /** MP4 under /videos/ (or an https URL). */
  src: string
  /** Lighter MP4 of the same video, chosen on small screens when playback starts. */
  srcSmall?: string
  /** Cover image (WebP) shown before playback. */
  poster: string
  /** Intrinsic size of the video: the card and the player keep this ratio. */
  width: number
  height: number
  /**
   * Aspect ratio of the picture itself when black bars are baked into the
   * frame (the client's film: 2.53 inside 16:9). The hero background crops
   * the bars with it. Absent = width / height.
   */
  pictureAspect?: number
  hidden: boolean
}

export type ContactInfo = {
  phoneDisplay: string
  /** E.164, e.g. +212601666665 — used for tel: links. */
  phoneE164: string
  /** Digits only with country code, e.g. 212601666665 — used for wa.me links. */
  whatsappNumber: string
  email: string
  instagramUrl: string
  instagramHandle: string
  facebookUrl: string
  /** Empty until confirmed. Never invented. */
  street: string
  postalCode: string
  city: LocalizedText
  country: LocalizedText
  countryCode: string
  latitude: number
  longitude: number
}

/** Editable texts for one language. Keys mirror messages/<locale>.json. */
export type LocaleTexts = {
  meta: { home: { title: string; description: string } }
  hero: { slogan: string; title1: string; title2: string; subtitle: string }
  about: {
    tagline: string
    description: string
    mission: string
    missionText: string
    values: { title: string; description: string }[]
  }
  /** Services section ("features" namespace in the messages). */
  features: { title: string; subtitle: string; features: { title: string; description: string }[] }
  faq: { title: string; intro: string; items: { q: string; a: string }[] }
}

export type SiteContent = {
  schemaVersion: 1
  /** ISO date of the last successful save (or of the defaults). */
  updatedAt: string
  /** Display order = array order. */
  vehicles: VehicleRecord[]
  /** Display order = array order. */
  videos: VideoRecord[]
  conditions: Record<Locale, RentalConditions>
  contact: ContactInfo
  texts: Record<Locale, LocaleTexts>
}

/** What the public client components need (no texts: those go through next-intl). */
export type PublicContent = Pick<SiteContent, "vehicles" | "contact">

/* ---------- Admin API contract (routes under /api/admin, JSON) ----------
 * POST /api/admin/login    {email, password}     → 200 {ok:true} + session cookie | 401 {error:"invalid_credentials"} | 429 {error:"too_many_attempts"}
 * POST /api/admin/logout                          → 200 {ok:true}
 * GET  /api/admin/session                         → 200 {authenticated:boolean, email?:string}
 * GET  /api/admin/content                         → 200 {content:SiteContent, etag:string, storage:"blob"|"filesystem"|"defaults", saveTo:"blob"|"filesystem"|"none"}
 * PUT  /api/admin/content  {content, etag}       → 200 {content, etag, savedAt} | 400 {error:"invalid", issues:{path:string,message:string}[]}
 *                                                    | 409 {error:"conflict"} | 503 {error:"storage_unavailable"}
 * POST /api/admin/upload   multipart: file        → 200 {image:ImageAsset} | 400 {error:"invalid_file"} | 413 {error:"too_large"} | 415 {error:"unsupported_type"} | 503
 * Any admin route without a valid session         → 401 {error:"unauthorized"}
 */
export type AdminError =
  | "invalid_credentials"
  | "too_many_attempts"
  | "unauthorized"
  | "invalid"
  | "conflict"
  | "storage_unavailable"
  | "invalid_file"
  | "too_large"
  | "unsupported_type"
