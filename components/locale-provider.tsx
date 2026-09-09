"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { NextIntlClientProvider } from "next-intl"

import { DEFAULT_MARKET, marketByCode, type Market } from "@/i18n/config"
import fr from "@/messages/fr.json"
import en from "@/messages/en.json"
import nl from "@/messages/nl.json"

const MESSAGES = { fr, en, nl } as const

const STORAGE_KEY = "abfastcar.market"

type LocaleContextValue = {
  market: Market
  setMarket: (market: Market) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function useMarket() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error("useMarket must be used inside <LocaleProvider>")
  return ctx
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // Always render the default market first so the server and client markup
  // agree; the stored choice is applied after mount.
  const [market, setMarketState] = useState<Market>(DEFAULT_MARKET)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setMarketState(marketByCode(saved))
    } catch {
      // private mode / blocked storage: keep the default
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = market.locale
  }, [market.locale])

  const setMarket = (next: Market) => {
    setMarketState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next.code)
    } catch {
      // non-fatal: the choice just won't persist
    }
  }

  return (
    <LocaleContext.Provider value={{ market, setMarket }}>
      <NextIntlClientProvider
        locale={market.locale}
        messages={MESSAGES[market.locale]}
        timeZone="Africa/Casablanca"
      >
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  )
}
