"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { Check, ChevronDown } from "lucide-react"

import { LOCALE_META, MARKETS, RATES_DATE, currencies, locales, type Locale, type Market } from "@/i18n/config"
import { usePathname } from "@/i18n/navigation"
import { localePath } from "@/lib/site"
import { useCurrency } from "@/components/locale-provider"
import { Flag, type FlagCode } from "@/components/flag"

const COUNTRY_KEY = "abfastcar.country"

/** Flag shown for each language (Arabic: Morocco, the agency's country). */
const LOCALE_FLAG: Record<Locale, FlagCode> = { fr: "fr", en: "gb", nl: "nl", ar: "ma" }
const CURRENCY_SYMBOL: Record<string, string> = { MAD: "DH", EUR: "€", GBP: "£" }

/**
 * Language, country and currency picker.
 * - Languages are real links to the same page in another language.
 * - Currencies only change how prices are displayed; the language stays.
 * - Countries are shortcuts that set both (Maroc → العربية + MAD, …).
 */
export function MarketSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("switcher")
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const { currency, setCurrency } = useCurrency()
  const [open, setOpen] = useState(false)
  const [country, setCountry] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

  useEffect(() => {
    try {
      setCountry(localStorage.getItem(COUNTRY_KEY))
    } catch {
      // storage blocked: no country highlighted
    }
  }, [])

  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLElement>("button, a")?.focus()
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const chooseCountry = (m: Market) => {
    setCurrency(m.currency)
    setCountry(m.code)
    try {
      localStorage.setItem(COUNTRY_KEY, m.code)
    } catch {
      // non-fatal
    }
    setOpen(false)
    // A full load to the canonical URL of that language (French has no /fr prefix).
    if (m.locale !== locale) window.location.assign(localePath(m.locale, pathname))
  }

  // A remembered country stays highlighted only while it still matches.
  const activeCountry = MARKETS.find((m) => m.code === country && m.locale === locale && m.currency === currency)

  const groupTitle = "px-4 pt-4 pb-2 text-[11px] font-bold tracking-[0.18em] text-zinc-500 uppercase"
  const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${t("button")}: ${LOCALE_META[locale].label}, ${currency}`}
        className={`flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-black/40 ps-2.5 pe-3 text-sm font-bold text-white transition-colors hover:border-white/60 sm:pe-4 ${focusRing}`}
      >
        <Flag code={LOCALE_FLAG[locale]} className="h-[15px] w-[22px]" />
        <span className="uppercase">{locale}</span>
        <span aria-hidden="true" className="text-zinc-500">·</span>
        <span>{currency}</span>
        <ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          className="absolute end-0 top-full z-50 mt-2 max-h-[min(80dvh,38rem)] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-white/15 bg-zinc-950 pb-2 shadow-2xl shadow-black/60"
        >
          {/* Countries: shortcuts that set language + currency. */}
          <p className={groupTitle} id={`${panelId}-country`}>
            {t("country")}
          </p>
          <ul aria-labelledby={`${panelId}-country`} className="space-y-0.5 px-2">
            {MARKETS.map((m) => {
              const active = activeCountry?.code === m.code
              return (
                <li key={m.code}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => chooseCountry(m)}
                    className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2 text-start transition-colors ${focusRing} ${
                      active ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    <Flag code={m.code as FlagCode} className="h-[18px] w-[27px]" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-white" lang={LOCALE_META[m.locale].htmlLang}>
                        {m.label}
                      </span>
                      <span className="block truncate text-xs text-zinc-400">
                        {LOCALE_META[m.locale].label} · {m.currency}
                      </span>
                    </span>
                    {active && <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-white" />}
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Languages: real links to the same page in another language. */}
          <p className={`${groupTitle} mt-2 border-t border-white/10`} id={`${panelId}-lang`}>
            {t("language")}
          </p>
          <ul aria-labelledby={`${panelId}-lang`} className="grid grid-cols-2 gap-2 px-3">
            {locales.map((l) => {
              const active = l === locale
              return (
                <li key={l}>
                  <a
                    href={localePath(l, pathname)}
                    hrefLang={LOCALE_META[l].htmlLang}
                    lang={LOCALE_META[l].htmlLang}
                    aria-current={active ? "true" : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex min-h-11 items-center gap-2 rounded-xl border px-3 text-sm transition-colors ${focusRing} ${
                      active ? "border-white/60 bg-white/10 font-bold text-white" : "border-white/10 text-zinc-200 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    <Flag code={LOCALE_FLAG[l]} className="h-[14px] w-[21px]" />
                    <span className="truncate">{LOCALE_META[l].label}</span>
                  </a>
                </li>
              )
            })}
          </ul>

          {/* Currencies: only change how prices are displayed. */}
          <p className={`${groupTitle} mt-3 border-t border-white/10`} id={`${panelId}-cur`}>
            {t("currency")}
          </p>
          <ul aria-labelledby={`${panelId}-cur`} className="mx-3 grid grid-cols-3 gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
            {currencies.map((c) => {
              const active = c === currency
              return (
                <li key={c}>
                  <button
                    type="button"
                    aria-pressed={active}
                    title={t(`currencies.${c}`)}
                    onClick={() => {
                      setCurrency(c)
                      setOpen(false)
                    }}
                    className={`flex min-h-11 w-full flex-col items-center justify-center rounded-lg text-xs transition-colors ${focusRing} ${
                      active ? "bg-white font-bold text-black" : "text-zinc-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span aria-hidden="true" className="text-sm font-black leading-none">
                      {CURRENCY_SYMBOL[c] ?? c}
                    </span>
                    <span className="mt-0.5 leading-none">{c}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="px-4 pt-3 text-xs leading-relaxed text-zinc-500">
            {t("note", { date: new Intl.DateTimeFormat(LOCALE_META[locale].intlLocale, { dateStyle: "medium" }).format(new Date(RATES_DATE)) })}
          </p>
        </div>
      )}
    </div>
  )
}
