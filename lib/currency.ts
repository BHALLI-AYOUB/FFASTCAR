import type { Market } from "@/i18n/config"

/** Convert a MAD amount into the market's currency. */
export function convertFromMad(amountMad: number, market: Market): number {
  return amountMad * market.rate
}

/**
 * Format a MAD amount as a price in the market's currency, e.g.
 *   Maroc          15 000 MAD
 *   Belgique       1.380 €
 *   United Kingdom £1,185
 *
 * Prices are whole units: rental rates are round numbers and trailing
 * decimals only add noise on a card.
 */
export function formatPrice(amountMad: number, market: Market): string {
  const value = convertFromMad(amountMad, market)
  try {
    return new Intl.NumberFormat(market.intlLocale, {
      style: "currency",
      currency: market.currency,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(Math.round(value))
  } catch {
    // Very old engines may not know the currency; fall back to a plain number.
    return `${Math.round(value).toLocaleString(market.intlLocale)} ${market.currency}`
  }
}

/** The bare converted number, formatted without the currency symbol. */
export function formatAmount(amountMad: number, market: Market): string {
  return new Intl.NumberFormat(market.intlLocale, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(convertFromMad(amountMad, market)))
}

/** Just the symbol (or code) for the market's currency. */
export function currencySymbol(market: Market): string {
  try {
    const parts = new Intl.NumberFormat(market.intlLocale, {
      style: "currency",
      currency: market.currency,
      maximumFractionDigits: 0,
    }).formatToParts(0)
    return parts.find((p) => p.type === "currency")?.value ?? market.currency
  } catch {
    return market.currency
  }
}

/**
 * Amount and symbol split apart, for layouts that style the number and the
 * symbol differently — plus where the symbol belongs. Locales disagree:
 * en-GB writes £1,185 but fr-BE writes 1 380 €.
 */
export function priceParts(amountMad: number, market: Market): {
  amount: string
  symbol: string
  symbolFirst: boolean
} {
  const amount = formatAmount(amountMad, market)
  const symbol = currencySymbol(market)
  let symbolFirst = false
  try {
    const parts = new Intl.NumberFormat(market.intlLocale, {
      style: "currency",
      currency: market.currency,
      maximumFractionDigits: 0,
    }).formatToParts(1)
    symbolFirst = parts.findIndex((p) => p.type === "currency") <
      parts.findIndex((p) => p.type === "integer")
  } catch {
    // keep the default (symbol after the number)
  }
  return { amount, symbol, symbolFirst }
}
