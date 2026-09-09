"use client"

import { useEffect, useRef, useState } from "react"
import { Check, ChevronDown } from "lucide-react"

import { MARKETS } from "@/i18n/config"
import { useMarket } from "@/components/locale-provider"

export function MarketSwitcher({ className = "" }: { className?: string }) {
  const { market, setMarket } = useMarket()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("touchstart", onPointerDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("touchstart", onPointerDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={market.label}
        className="relative flex items-center gap-1.5 sm:gap-2 bg-gradient-to-br from-zinc-900 to-black text-yellow-400 hover:text-yellow-300 font-bold rounded-xl px-3 sm:px-4 py-2 border-2 border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 hover:scale-105 min-h-[40px]"
      >
        <span className="text-base leading-none" aria-hidden="true">
          {market.flag}
        </span>
        <span className="text-xs sm:text-sm tracking-wide uppercase">{market.locale}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-2 z-50 w-56 overflow-hidden rounded-2xl border border-yellow-400/25 bg-zinc-950/95 backdrop-blur-xl shadow-2xl shadow-black/60 py-1.5"
        >
          {MARKETS.map((m) => {
            const active = m.code === market.code
            return (
              <li key={m.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setMarket(m)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-200 ${
                    active
                      ? "bg-yellow-400/15 text-yellow-400"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="text-xl leading-none" aria-hidden="true">
                    {m.flag}
                  </span>
                  <span className="flex-1 font-semibold text-sm">{m.label}</span>
                  {active && <Check className="h-4 w-4 shrink-0" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
