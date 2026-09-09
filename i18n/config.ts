export const locales = ["fr", "en", "nl"] as const
export type Locale = (typeof locales)[number]

export const DEFAULT_LOCALE: Locale = "fr"

/**
 * The picker is organised by market, not by language: Morocco and Belgium are
 * both served in French, so they share the `fr` catalogue.
 *
 * Prices are stored once per vehicle in MAD (see fleet-section.tsx) and
 * converted for display. `rate` is how many units of `currency` one MAD buys.
 *
 * NOTE: these are fixed constants, not live exchange rates. They will drift as
 * the market moves, so review them periodically — or replace them with rates
 * fetched from a provider if the displayed prices need to track the market.
 * Last set: 2026-09-09.
 */
export type Market = {
  code: string
  flag: string
  label: string
  locale: Locale
  /** BCP-47 tag used for number formatting (thousands separators etc.) */
  intlLocale: string
  currency: string
  rate: number
}

export const MARKETS: Market[] = [
  { code: "ma", flag: "🇲🇦", label: "Maroc", locale: "fr", intlLocale: "fr-MA", currency: "MAD", rate: 1 },
  { code: "be", flag: "🇧🇪", label: "Belgique", locale: "fr", intlLocale: "fr-BE", currency: "EUR", rate: 0.092 },
  { code: "gb", flag: "🇬🇧", label: "United Kingdom", locale: "en", intlLocale: "en-GB", currency: "GBP", rate: 0.079 },
  { code: "nl", flag: "🇳🇱", label: "Nederland", locale: "nl", intlLocale: "nl-NL", currency: "EUR", rate: 0.092 },
]

export const DEFAULT_MARKET = MARKETS[0]

export function marketByCode(code: string | null | undefined): Market {
  return MARKETS.find((m) => m.code === code) ?? DEFAULT_MARKET
}
