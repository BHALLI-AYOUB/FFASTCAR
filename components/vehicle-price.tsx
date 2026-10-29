"use client"

import { useLocale, useTranslations } from "next-intl"

import { LOCALE_META, type Locale } from "@/i18n/config"
import { formatPrice, isIndicative, priceParts } from "@/lib/currency"
import { useCurrency } from "@/components/locale-provider"

/**
 * Daily price in the visitor's currency. Converted amounts are marked "≈"
 * and, in the detailed variant, followed by the MAD price actually charged.
 */
export function VehiclePrice({ priceMad, size = "md" }: { priceMad: number; size?: "md" | "lg" }) {
  const t = useTranslations("common")
  const locale = useLocale() as Locale
  const { priceFormat } = useCurrency()
  const { amount, symbol, symbolFirst } = priceParts(priceMad, priceFormat)
  const indicative = isIndicative(priceFormat.currency)
  const mad = formatPrice(priceMad, { currency: "MAD", intlLocale: LOCALE_META[locale].intlLocale })

  const amountClass = size === "lg" ? "text-4xl sm:text-5xl" : "text-xl sm:text-3xl"
  const symbolClass = size === "lg" ? "text-lg" : "text-xs sm:text-base"

  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-1" dir="ltr">
        {indicative && (
          <span className="text-zinc-400" title={t("indicativeShort")}>
            ≈
          </span>
        )}
        {symbolFirst && <span className={`${symbolClass} font-bold text-zinc-300`}>{symbol}</span>}
        <span className={`${amountClass} font-black text-white`}>{amount}</span>
        {!symbolFirst && <span className={`${symbolClass} font-bold text-zinc-300`}>{symbol}</span>}
        <span className="text-xs font-medium text-zinc-400 sm:text-sm">{t("perDay")}</span>
      </p>
      {indicative && size === "lg" && <p className="mt-2 text-sm text-zinc-400">{t("indicative", { mad })}</p>}
      {indicative && size === "md" && <p className="sr-only">{t("indicative", { mad })}</p>}
    </div>
  )
}
