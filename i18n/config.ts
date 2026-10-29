/**
 * Language, currency and country are three separate settings:
 *
 * - The language decides the URL (/, /en, /nl, /ar) and every piece of text.
 *   It is the only one search engines see: each language is its own page.
 * - The currency only changes how prices are displayed. It never changes the
 *   URL, so there are no indexable per-currency variants.
 * - A country is a shortcut that sets both at once (France → français + EUR).
 *
 * Prices are stored once per vehicle in MAD (lib/fleet.ts), which is the
 * reference price the agency charges. Other currencies are converted with the
 * fixed rates below and flagged as indicative in the UI.
 */

export const locales = ["fr", "en", "nl", "ar"] as const
export type Locale = (typeof locales)[number]

export const DEFAULT_LOCALE: Locale = "fr"

export function isLocale(value: string | null | undefined): value is Locale {
  return locales.includes(value as Locale)
}

export type LocaleMeta = {
  /** Name of the language written in that language, shown in the picker. */
  label: string
  /** Value for <html lang> and hreflang. */
  htmlLang: string
  dir: "ltr" | "rtl"
  /** BCP-47 tag used for Intl number and date formatting. */
  intlLocale: string
  /** Currency shown on a first visit to this language, before any choice. */
  defaultCurrency: Currency
  /** Open Graph locale, e.g. fr_MA. */
  ogLocale: string
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  fr: { label: "Français", htmlLang: "fr", dir: "ltr", intlLocale: "fr-FR", defaultCurrency: "MAD", ogLocale: "fr_FR" },
  en: { label: "English", htmlLang: "en", dir: "ltr", intlLocale: "en-GB", defaultCurrency: "GBP", ogLocale: "en_GB" },
  nl: { label: "Nederlands", htmlLang: "nl", dir: "ltr", intlLocale: "nl-NL", defaultCurrency: "EUR", ogLocale: "nl_NL" },
  ar: { label: "العربية (المغرب)", htmlLang: "ar-MA", dir: "rtl", intlLocale: "ar-MA", defaultCurrency: "MAD", ogLocale: "ar_MA" },
}

export const currencies = ["MAD", "EUR", "GBP"] as const
export type Currency = (typeof currencies)[number]

export function isCurrency(value: string | null | undefined): value is Currency {
  return currencies.includes(value as Currency)
}

/**
 * How many units of each currency one MAD buys.
 *
 * Fixed constants, not live rates: they drift as the market moves, which is
 * why converted prices are labelled "indicative" and the booking is always
 * confirmed in MAD. Review them periodically.
 * Source: mid-market rates, last set 2026-09-09 (1 EUR ≈ 10.87 MAD,
 * 1 GBP ≈ 12.66 MAD).
 */
export const MAD_RATES: Record<Currency, number> = {
  MAD: 1,
  EUR: 0.092,
  GBP: 0.079,
}
export const RATES_DATE = "2026-09-09"

/** A country shortcut in the picker: it sets the language and the currency. */
export type Market = {
  code: string
  flag: string
  /** Country name in its own language. */
  label: string
  locale: Locale
  currency: Currency
}

export const MARKETS: Market[] = [
  { code: "ma", flag: "🇲🇦", label: "المغرب", locale: "ar", currency: "MAD" },
  { code: "fr", flag: "🇫🇷", label: "France", locale: "fr", currency: "EUR" },
  { code: "be", flag: "🇧🇪", label: "Belgique", locale: "fr", currency: "EUR" },
  { code: "gb", flag: "🇬🇧", label: "United Kingdom", locale: "en", currency: "GBP" },
  { code: "nl", flag: "🇳🇱", label: "Nederland", locale: "nl", currency: "EUR" },
]
