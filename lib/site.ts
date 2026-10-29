import { DEFAULT_LOCALE, type Locale } from "@/i18n/config"
import type { ContactInfo } from "@/lib/content/types"

/** Canonical production origin. Never the temporary *.vercel.app domain. */
export const SITE_URL = "https://abfastcar.com"

/**
 * True only for the production deployment. Vercel previews and local builds
 * are kept out of search indexes (see lib/seo.ts and app/robots.ts).
 * Set NEXT_PUBLIC_INDEXABLE=true to force it when hosting outside Vercel.
 */
export const IS_INDEXABLE =
  process.env.VERCEL_ENV === "production" || process.env.NEXT_PUBLIC_INDEXABLE === "true"

/**
 * Contact details before any edit in the admin (the admin saves its own copy
 * in the content store, see lib/content). Only confirmed facts: the street
 * and postal code stay empty until Ayoub confirms them — never guess.
 */
export const DEFAULT_CONTACT: ContactInfo = {
  phoneDisplay: "+212 601 66 66 65",
  phoneE164: "+212601666665",
  whatsappNumber: "212601666665",
  email: "Abfastcar@gmail.com",
  instagramUrl: "https://www.instagram.com/abfastcar/",
  instagramHandle: "@abfastcar",
  facebookUrl: "https://facebook.com/abfastcar",
  street: "",
  postalCode: "",
  city: { fr: "Marrakech", en: "Marrakech", nl: "Marrakech", ar: "مراكش" },
  country: { fr: "Maroc", en: "Morocco", nl: "Marokko", ar: "المغرب" },
  countryCode: "MA",
  // Agency pin shared by Ayoub: https://maps.app.goo.gl/cWY14iA6cm7SsNxA8
  latitude: 31.6737595,
  longitude: -8.0252161,
}

/** Every link derived from the contact details, so an edit updates them all. */
export function contactLinks(c: ContactInfo) {
  const geo = `${c.latitude},${c.longitude}`
  return {
    tel: `tel:${c.phoneE164}`,
    mailto: `mailto:${c.email}`,
    whatsappUrl: `https://wa.me/${c.whatsappNumber}`,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${geo}`,
    mapsEmbedUrl: `https://maps.google.com/maps?q=${geo}&z=16&output=embed`,
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${geo}`,
  }
}

/**
 * The address as shown to visitors, e.g. "Marrakech, Maroc" or
 * "مراكش، المغرب". A confirmed street and postal code are added automatically.
 */
export function formatAddress(c: ContactInfo, locale: Locale): string {
  const city = [c.postalCode, c.city[locale]].filter(Boolean).join(" ")
  const separator = locale === "ar" ? "، " : ", "
  return [c.street, city, c.country[locale]].filter(Boolean).join(separator)
}

/** "/fleet" in English → "/en/fleet"; French stays unprefixed. */
export function localePath(locale: Locale, path: string = "/"): string {
  const clean = path === "/" ? "" : path
  if (locale === DEFAULT_LOCALE) return clean || "/"
  return `/${locale}${clean}`
}

export function absoluteUrl(locale: Locale, path: string = "/"): string {
  return `${SITE_URL}${localePath(locale, path)}`
}
