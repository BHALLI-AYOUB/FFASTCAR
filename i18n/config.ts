export const locales = ["fr", "en", "nl"] as const
export type Locale = (typeof locales)[number]

export const DEFAULT_LOCALE: Locale = "fr"

/**
 * The picker is organised by market, not by language: Morocco and Belgium are
 * both served in French, so they share the `fr` catalogue.
 */
export type Market = {
  code: string
  flag: string
  label: string
  locale: Locale
}

export const MARKETS: Market[] = [
  { code: "ma", flag: "🇲🇦", label: "Maroc", locale: "fr" },
  { code: "be", flag: "🇧🇪", label: "Belgique", locale: "fr" },
  { code: "gb", flag: "🇬🇧", label: "United Kingdom", locale: "en" },
  { code: "nl", flag: "🇳🇱", label: "Nederland", locale: "nl" },
]

export const DEFAULT_MARKET = MARKETS[0]

export function marketByCode(code: string | null | undefined): Market {
  return MARKETS.find((m) => m.code === code) ?? DEFAULT_MARKET
}
