"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useLocale } from "next-intl"

import { LOCALE_META, isCurrency, type Currency, type Locale } from "@/i18n/config"
import type { PriceFormat } from "@/lib/currency"

/**
 * Holds the display currency. The language is not stored here: it comes from
 * the URL, so every page can be opened directly in its language.
 *
 * The currency choice is remembered in localStorage and survives navigation
 * and reloads. Until one is made, each language uses its default currency.
 */
const CURRENCY_KEY = "abfastcar.currency"

type CurrencyContextValue = {
  currency: Currency
  setCurrency: (currency: Currency) => void
  /** Ready-made argument for formatPrice / priceParts. */
  priceFormat: PriceFormat
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error("useCurrency must be used inside <CurrencyProvider>")
  return ctx
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale() as Locale
  const meta = LOCALE_META[locale]
  // Render the language's default first so server and client markup agree;
  // the stored choice is applied after mount.
  const [stored, setStored] = useState<Currency | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_KEY)
      if (isCurrency(saved)) setStored(saved)
    } catch {
      // private mode / blocked storage: keep the default
    }
  }, [])

  const setCurrency = useCallback((next: Currency) => {
    setStored(next)
    try {
      localStorage.setItem(CURRENCY_KEY, next)
    } catch {
      // non-fatal: the choice just won't persist
    }
  }, [])

  const currency = stored ?? meta.defaultCurrency
  const value = useMemo(
    () => ({ currency, setCurrency, priceFormat: { currency, intlLocale: meta.intlLocale } }),
    [currency, setCurrency, meta.intlLocale],
  )

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}
