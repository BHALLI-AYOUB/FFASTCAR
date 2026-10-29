import { defineRouting } from "next-intl/routing"

import { DEFAULT_LOCALE, locales } from "@/i18n/config"

export const routing = defineRouting({
  locales,
  defaultLocale: DEFAULT_LOCALE,
  // French keeps the existing unprefixed URLs (/), the others live under
  // /en, /nl and /ar.
  localePrefix: "as-needed",
  // Every URL always serves its own language: no redirect based on the
  // browser language or a cookie, so crawlers and shared links get exactly
  // the page they asked for.
  localeDetection: false,
  // hreflang is emitted in the page <head> by lib/seo.ts instead.
  alternateLinks: false,
})
