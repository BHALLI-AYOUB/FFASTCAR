"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { CalendarCheck, Menu, X } from "lucide-react"

import { Link, usePathname } from "@/i18n/navigation"
import { MarketSwitcher } from "@/components/market-switcher"
import { BookButton } from "@/components/book-button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navigation() {
  const t = useTranslations("navigation")
  const tc = useTranslations("common")
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close the menu after navigating.
  useEffect(() => setMobileMenuOpen(false), [pathname])

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/fleet", label: t("fleet") },
    { href: "/#services", label: t("services") },
    { href: "/#about", label: t("about") },
    { href: "/faq", label: t("faq") },
    { href: "/contact", label: t("contact") },
  ]
  const isActive = (href: string) => (href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href))

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || mobileMenuOpen ? "border-white/15 bg-black/95" : "border-white/10 bg-black/90"
      }`}
    >
      <nav aria-label={t("mainNav")} className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-3 lg:h-20">
          <Link href="/" aria-label={t("logoHome")} className="flex shrink-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <img
              src="/images/logo-ab-fastcar-white.webp"
              alt="AB FAST CAR"
              width={240}
              height={107}
              className="h-10 w-auto object-contain lg:h-12"
            />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white xl:px-4 ${
                      active ? "text-white after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:rounded-full after:bg-white" : "text-zinc-300 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* On phones the header is full: the switch is in the menu. */}
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
            <MarketSwitcher />
            <BookButton className="hidden min-h-11 px-5 text-sm sm:inline-flex">
              <CalendarCheck aria-hidden="true" className="h-4 w-4" />
              {tc("book")}
            </BookButton>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? t("closeMenu") : t("openMenu")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:hidden"
            >
              {mobileMenuOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-menu" className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 py-4 lg:hidden">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-12 items-center rounded-xl border-s-4 px-4 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                        active ? "border-white bg-white/10 text-white" : "border-transparent text-zinc-200 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <ThemeToggle variant="row" />
            <BookButton className="mt-4 min-h-12 w-full text-base" onOpen={() => setMobileMenuOpen(false)}>
              <CalendarCheck aria-hidden="true" className="h-5 w-5" />
              {tc("book")}
            </BookButton>
          </div>
        )}
      </nav>
    </header>
  )
}
