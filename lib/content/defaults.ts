import { locales, type Locale } from "@/i18n/config"
import { VEHICLES } from "@/lib/fleet"
import { DEFAULT_CONTACT } from "@/lib/site"
import { SITE_LAST_UPDATED } from "@/lib/seo-dates"
import { defaultConditions } from "@/lib/content/conditions/defaults"
import manifest from "@/components/car-image-manifest.json"
import type { ImageAsset, LocaleTexts, SiteContent, VideoRecord } from "@/lib/content/types"

import fr from "@/messages/fr.json"
import en from "@/messages/en.json"
import nl from "@/messages/nl.json"
import ar from "@/messages/ar.json"
import seoFr from "@/messages/seo/fr.json"
import seoEn from "@/messages/seo/en.json"
import seoNl from "@/messages/seo/nl.json"
import seoAr from "@/messages/seo/ar.json"

/**
 * The content the site shows until the admin saves its first edit: the fleet
 * from lib/fleet.ts, the contact details from lib/site.ts and the editable
 * texts from messages/. Once a save exists in the store, it replaces these
 * defaults entirely (see lib/content/store.ts).
 */

/** Widths produced by scripts/optimize-images.mjs (and by admin uploads). */
export const VARIANT_WIDTHS = [320, 480, 640, 960] as const

/** The carousel of the original site, in display order. */
const FEATURED_SLUGS = new Set([
  "lamborghini-urus",
  "mercedes-g63",
  "range-rover-sport",
  "mercedes-classe-e-w214",
  "porsche-cayenne",
  "porsche-macan-t",
  "volkswagen-touareg",
  "mercedes-cla-amg-line-plus",
  "range-rover-evoque",
  "audi-a3-s-line",
  "mercedes-classe-a-pack-amg",
  "cupra-formentor",
])

type ManifestEntry = { base: string; width: number; height: number }

/** ImageAsset for an original fleet photo, using its pre-optimised variants. */
export function bundledImage(originalPath: string): ImageAsset {
  const entry = (manifest as Record<string, ManifestEntry>)[originalPath]
  if (!entry) return { src: originalPath, width: 1000, height: 1250 }
  const dir = "/abfastcar/opt"
  const variants = (ext: "avif" | "webp") =>
    VARIANT_WIDTHS.filter((w) => w <= entry.width).map((width) => ({ url: `${dir}/${entry.base}-${width}.${ext}`, width }))
  return {
    src: `${dir}/${entry.base}-640.webp`,
    width: entry.width,
    height: entry.height,
    avif: variants("avif"),
    webp: variants("webp"),
    blur: `${dir}/${entry.base}-blur.webp`,
  }
}

/**
 * The two client videos (originals public/IMG_0051.MOV and IMG_0053.MOV, never
 * served). Captions stay factual: the filmed showroom is not claimed to be
 * the Marrakech agency.
 */
export function defaultVideos(): VideoRecord[] {
  return [
    {
      id: "experience",
      title: {
        fr: "L’expérience AB FAST CAR",
        en: "The AB FAST CAR experience",
        nl: "De AB FAST CAR-ervaring",
        ar: "تجربة AB FAST CAR",
      },
      caption: {
        fr: "Un aperçu en images de véhicules de la flotte.",
        en: "A look at some of the vehicles in the fleet.",
        nl: "Een blik op enkele voertuigen uit de vloot.",
        ar: "لمحة مصورة عن بعض سيارات أسطولنا.",
      },
      src: "/videos/abfastcar-film.mp4",
      srcSmall: "/videos/abfastcar-film-mobile.mp4",
      poster: "/videos/abfastcar-film-poster.webp",
      width: 1920,
      height: 1080,
      // Cinema bars baked in: 110 px top / 104 px bottom of 720 on the cover.
      pictureAspect: 2.53,
      hidden: false,
    },
    {
      id: "coulisses",
      title: {
        fr: "Dans les coulisses",
        en: "Behind the scenes",
        nl: "Achter de schermen",
        ar: "خلف الكواليس",
      },
      caption: {
        fr: "Visite d’un espace de présentation automobile.",
        en: "A tour of a car showroom.",
        nl: "Een rondleiding door een autoshowroom.",
        ar: "جولة في صالة عرض للسيارات.",
      },
      src: "/videos/abfastcar-showroom.mp4",
      poster: "/videos/abfastcar-showroom-poster.webp",
      width: 720,
      height: 1280,
      hidden: false,
    },
  ]
}

const UI = { fr, en, nl, ar } as Record<Locale, typeof fr>
const SEO = { fr: seoFr, en: seoEn, nl: seoNl, ar: seoAr } as Record<Locale, typeof seoFr>

function textsFor(locale: Locale): LocaleTexts {
  const ui = UI[locale]
  const seo = SEO[locale]
  return {
    meta: { home: { title: seo.meta.home.title, description: seo.meta.home.description } },
    hero: {
      slogan: ui.hero.slogan,
      title1: ui.hero.title1,
      title2: ui.hero.title2,
      subtitle: ui.hero.subtitle,
    },
    about: {
      tagline: ui.about.tagline,
      description: ui.about.description,
      mission: ui.about.mission,
      missionText: ui.about.missionText,
      values: ui.about.values.map((v) => ({ title: v.title, description: v.description })),
    },
    features: {
      title: ui.features.title,
      subtitle: ui.features.subtitle,
      features: ui.features.features.map((f) => ({ title: f.title, description: f.description })),
    },
    faq: {
      title: seo.faq.title,
      intro: seo.faq.intro,
      items: seo.faq.items.map((i) => ({ q: i.q, a: i.a })),
    },
  }
}

export function defaultContent(): SiteContent {
  return {
    schemaVersion: 1,
    updatedAt: `${SITE_LAST_UPDATED}T00:00:00.000Z`,
    vehicles: VEHICLES.map((v) => ({
      slug: v.slug,
      name: v.name,
      brand: v.brand,
      year: v.year,
      priceMad: v.priceMad,
      hidden: false,
      featured: FEATURED_SLUGS.has(v.slug),
      image: bundledImage(v.image),
      gallery: [],
      category: { ...v.category },
      features: Object.fromEntries(locales.map((l) => [l, [...v.features[l]]])) as Record<Locale, string[]>,
    })),
    videos: defaultVideos(),
    conditions: defaultConditions(),
    contact: structuredClone(DEFAULT_CONTACT),
    texts: Object.fromEntries(locales.map((l) => [l, textsFor(l)])) as Record<Locale, LocaleTexts>,
  }
}
