"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Moon, Sun } from "lucide-react"

import { THEME_STORAGE_KEY } from "@/lib/theme"

type Theme = "dark" | "light"

/**
 * Dark (default) / light switch. The theme is the `data-theme` attribute of
 * <html>, styled by app/theme.css; the choice is remembered in this browser
 * only (a visitor preference, nothing to save on the server).
 */
export function ThemeToggle({ variant = "icon", onToggle }: { variant?: "icon" | "row"; onToggle?: () => void }) {
  const t = useTranslations("navigation")
  const [theme, setTheme] = useState<Theme>("dark")

  // The inline script may already have applied a saved choice before hydration.
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark")
  }, [])

  const next: Theme = theme === "light" ? "dark" : "light"
  const label = next === "light" ? t("themeLight") : t("themeDark")
  const Icon = theme === "light" ? Moon : Sun

  function toggle() {
    if (next === "light") document.documentElement.dataset.theme = "light"
    else delete document.documentElement.dataset.theme
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Private mode / blocked storage: the switch still works for this page.
    }
    setTheme(next)
    onToggle?.()
  }

  if (variant === "row") {
    return (
      <button
        type="button"
        onClick={toggle}
        className="mt-2 flex min-h-12 w-full items-center gap-3 rounded-xl px-4 font-semibold text-zinc-200 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <Icon aria-hidden="true" className="h-5 w-5" />
        {label}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      <Icon aria-hidden="true" className="h-5 w-5" />
    </button>
  )
}
