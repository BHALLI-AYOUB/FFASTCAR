import { MAD_RATES, type Currency } from "@/i18n/config"

/**
 * Display settings for a price: which currency, formatted for which locale.
 * The locale comes from the page language, the currency from the visitor's
 * choice — they are independent.
 */
export type PriceFormat = {
  currency: Currency
  intlLocale: string
}

/** Convert a MAD amount into another currency, rounded to whole units. */
export function convertFromMad(amountMad: number, currency: Currency): number {
  return Math.round(amountMad * MAD_RATES[currency])
}

/** True when the amount shown is a conversion rather than the MAD price charged. */
export function isIndicative(currency: Currency): boolean {
  return currency !== "MAD"
}

function currencyFormatter(fmt: PriceFormat) {
  return new Intl.NumberFormat(fmt.intlLocale, {
    style: "currency",
    currency: fmt.currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    // Keep Latin digits in every language, including Arabic, so prices read
    // the same as on the phone and on the invoice.
    numberingSystem: "latn",
  } as Intl.NumberFormatOptions)
}

/**
 * Format a MAD amount in the chosen currency, e.g.
 *   fr + MAD   1 500 MAD
 *   fr + EUR   138 €
 *   en + GBP   £119
 *   ar + MAD   ‏1,500 د.م.‏
 */
export function formatPrice(amountMad: number, fmt: PriceFormat): string {
  const value = convertFromMad(amountMad, fmt.currency)
  try {
    return currencyFormatter(fmt).format(value)
  } catch {
    // Very old engines may not know the currency; fall back to a plain number.
    return `${value.toLocaleString(fmt.intlLocale)} ${fmt.currency}`
  }
}

/**
 * Amount and symbol split apart, for layouts that style the number and the
 * symbol differently — plus where the symbol belongs. Locales disagree:
 * en-GB writes £1,185 but fr-FR writes 1 380 €.
 */
export function priceParts(amountMad: number, fmt: PriceFormat): {
  amount: string
  symbol: string
  symbolFirst: boolean
} {
  const value = convertFromMad(amountMad, fmt.currency)
  try {
    const parts = currencyFormatter(fmt).formatToParts(value)
    const symbolIndex = parts.findIndex((p) => p.type === "currency")
    const firstNumber = parts.findIndex((p) => p.type === "integer")
    const amount = parts
      .filter((p) => p.type === "integer" || p.type === "group")
      .map((p) => p.value)
      .join("")
    return {
      amount,
      symbol: parts[symbolIndex]?.value ?? fmt.currency,
      symbolFirst: symbolIndex > -1 && symbolIndex < firstNumber,
    }
  } catch {
    return { amount: String(value), symbol: fmt.currency, symbolFirst: false }
  }
}
