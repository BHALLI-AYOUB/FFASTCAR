import { z } from "zod"

import { locales } from "@/i18n/config"
import { defaultVideos } from "@/lib/content/defaults"
import { defaultConditions } from "@/lib/content/conditions/defaults"
import conditionsSource from "@/lib/content/conditions/fr.json"
import { migrateLegacyContent } from "@/lib/content/migrate"
import type { SiteContent } from "@/lib/content/types"

/**
 * Server-side validation of a content document sent by the admin. Everything
 * the public pages render goes through here first, so a bad save can never
 * break a page: unknown keys are dropped, strings are trimmed and bounded.
 */

const text = (max: number) => z.string().trim().max(max)
const required = (max: number) => text(max).min(1, "Obligatoire")

const localized = (max: number, optional = false) =>
  z.object(Object.fromEntries(locales.map((l) => [l, optional ? text(max) : required(max)])) as Record<
    (typeof locales)[number],
    z.ZodString
  >)

const localizedList = z.object(
  Object.fromEntries(locales.map((l) => [l, z.array(required(60)).max(8)])) as Record<
    (typeof locales)[number],
    z.ZodArray<z.ZodString>
  >,
)

/** Same-site paths (bundled or uploaded in dev) or HTTPS URLs (Vercel Blob). */
const imageUrl = z
  .string()
  .max(500)
  .refine((u) => /^\/(?!\/)[\w\-./]+$/.test(u) || /^https:\/\/[\w.-]+\/[\w\-./%]+$/.test(u), "URL d'image invalide")

const variant = z.object({ url: imageUrl, width: z.number().int().min(16).max(4000) })

const image = z.object({
  src: imageUrl,
  width: z.number().int().min(16).max(10000),
  height: z.number().int().min(16).max(10000),
  avif: z.array(variant).max(8).optional(),
  webp: z.array(variant).max(8).optional(),
  blur: imageUrl.optional(),
})

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const vehicle = z.object({
  slug: z.string().max(80).regex(SLUG_PATTERN, "Lettres minuscules, chiffres et tirets uniquement"),
  name: required(80),
  brand: required(40),
  year: z.number().int().min(1990).max(2100),
  priceMad: z.number().int("Nombre entier en MAD").min(1).max(1_000_000),
  hidden: z.boolean(),
  featured: z.boolean(),
  image,
  gallery: z.array(image).max(12),
  category: localized(60),
  features: localizedList,
})

/** Prepared media only: same-site /videos/ files or HTTPS URLs, no upload. */
const MEDIA_PATH = /^(\/videos\/[\w\-./]+|https:\/\/[\w.-]+\/[\w\-./%]+)$/
const mediaUrl = (extension: RegExp, message: string) =>
  z
    .string()
    .trim()
    .max(500)
    .refine((u) => MEDIA_PATH.test(u) && extension.test(u) && !u.includes(".."), message)

const MP4 = /\.mp4$/i
const COVER = /\.(webp|jpe?g|png|avif)$/i
const MP4_MESSAGE = "Fichier MP4 sous /videos/ ou lien https vers un .mp4"

const video = z.object({
  id: z.string().max(40).regex(SLUG_PATTERN, "Lettres minuscules, chiffres et tirets uniquement"),
  title: localized(80),
  caption: localized(200, true),
  src: mediaUrl(MP4, MP4_MESSAGE),
  srcSmall: mediaUrl(MP4, MP4_MESSAGE).optional(),
  poster: mediaUrl(COVER, "Image sous /videos/ ou lien https (webp, jpg, png, avif)"),
  width: z.number().int().min(16).max(8000),
  height: z.number().int().min(16).max(8000),
  pictureAspect: z.number().min(0.2).max(5).optional(),
  hidden: z.boolean(),
})

const phoneE164 = z.string().regex(/^\+[1-9]\d{6,14}$/, "Format international, ex. +212601666665")

const contact = z.object({
  phoneDisplay: required(30),
  phoneE164,
  whatsappNumber: z.string().regex(/^[1-9]\d{6,14}$/, "Chiffres uniquement avec l'indicatif, ex. 212601666665"),
  email: z.string().trim().email("Email invalide").max(120),
  instagramUrl: z.string().url().startsWith("https://", "Lien https requis").max(200),
  instagramHandle: text(60),
  facebookUrl: z.string().url().startsWith("https://", "Lien https requis").max(200),
  street: text(120),
  postalCode: text(12),
  city: localized(60),
  country: localized(60),
  countryCode: z.string().regex(/^[A-Z]{2}$/, "Code pays ISO à 2 lettres"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})

const titled = z.object({ title: required(80), description: required(400) })

const localeTexts = z.object({
  // Search engines show about 60 and 155 characters; the limits leave room
  // for longer languages without truncating a save.
  meta: z.object({ home: z.object({ title: required(90), description: required(220) }) }),
  hero: z.object({ slogan: text(40), title1: required(60), title2: text(60), subtitle: required(200) }),
  about: z.object({
    tagline: required(160),
    description: required(1500),
    mission: required(60),
    missionText: required(1000),
    values: z.array(titled).max(6),
  }),
  features: z.object({ title: required(80), subtitle: text(200), features: z.array(titled).max(8) }),
  faq: z.object({
    title: required(80),
    intro: text(500),
    items: z.array(z.object({ q: required(200), a: required(1500) })).max(30),
  }),
})

const conditionSection = z.object({
  heading: required(200).optional(),
  paragraphs: z.array(required(5000)).min(1).max(20),
})
const rentalConditions = z.object({
  title: required(200),
  intro: required(1500),
  articles: z.array(z.object({ title: required(200), sections: z.array(conditionSection).min(1).max(6) })).length(16, "Les 16 articles sont requis"),
}).superRefine((doc, ctx) => {
  // Keep every source paragraph represented; editors change the text, never
  // silently drop an article, a reservation or an article 4 subheading.
  const reference = conditionsSource
  doc.articles.forEach((article, a) => {
    const original = reference.articles[a]
    if (article.sections.length !== original.sections.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["articles", a, "sections"], message: "Conserver toutes les sections de l’article source" })
    }
    article.sections.forEach((section, s) => {
      if (section.paragraphs.length !== original.sections[s]?.paragraphs.length || Boolean(section.heading) !== Boolean(original.sections[s]?.heading)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["articles", a, "sections", s], message: "Conserver les paragraphes et sous-titres du texte source" })
      }
    })
  })
})

export const siteContentSchema = z
  .object({
    schemaVersion: z.literal(1),
    updatedAt: z.string().max(40),
    vehicles: z.array(vehicle).min(1, "Au moins un véhicule").max(100),
    // Documents saved before the videos existed get the prepared ones.
    videos: z.array(video).max(6).default(defaultVideos),
    conditions: z.object(
      Object.fromEntries(locales.map((l) => [l, rentalConditions])) as Record<(typeof locales)[number], typeof rentalConditions>,
    ).default(defaultConditions),
    contact,
    texts: z.object(
      Object.fromEntries(locales.map((l) => [l, localeTexts])) as Record<(typeof locales)[number], typeof localeTexts>,
    ),
  })
  .superRefine((content, ctx) => {
    const seen = new Set<string>()
    content.vehicles.forEach((v, i) => {
      if (seen.has(v.slug)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["vehicles", i, "slug"], message: "Identifiant déjà utilisé" })
      }
      seen.add(v.slug)
    })
    const ids = new Set<string>()
    content.videos.forEach((v, i) => {
      if (ids.has(v.id)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["videos", i, "id"], message: "Identifiant déjà utilisé" })
      ids.add(v.id)
    })
    if (!content.vehicles.some((v) => !v.hidden)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["vehicles"], message: "Au moins un véhicule doit rester visible" })
    }
  })

export type ValidationIssue = { path: string; message: string }

export function validateContent(
  input: unknown,
): { ok: true; content: SiteContent } | { ok: false; issues: ValidationIssue[] } {
  const result = siteContentSchema.safeParse(migrateLegacyContent(input))
  if (result.success) return { ok: true, content: result.data as SiteContent }
  return {
    ok: false,
    issues: result.error.issues.slice(0, 50).map((issue) => ({ path: issue.path.join("."), message: issue.message })),
  }
}
