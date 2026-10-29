"use client"

import { useTranslations } from "next-intl"
import { CalendarCheck, MessageCircle } from "lucide-react"

import { contactLinks } from "@/lib/site"
import { useContact } from "@/components/content-provider"
import { BookButton } from "@/components/book-button"

/**
 * Small-screen booking bar: a persistent red "Réserver" plus WhatsApp, in one
 * slim strip at the bottom. It replaces the floating WhatsApp bubble on
 * mobile so the two never overlap, and the page reserves its height (see
 * SiteShell) so it never hides content.
 */
export function MobileBookBar() {
  const t = useTranslations("common")
  const tb = useTranslations("mobileBar")
  const { whatsappUrl } = contactLinks(useContact())

  return (
    <div
      role="region"
      aria-label={tb("label")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/95 px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <div className="mx-auto flex max-w-md items-center gap-2">
        <BookButton className="min-h-12 flex-1 text-base">
          <CalendarCheck aria-hidden="true" className="h-5 w-5" />
          {t("book")}
        </BookButton>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t("whatsapp")} ${t("opensInNewTab")}`}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-whatsapp text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <MessageCircle aria-hidden="true" className="h-6 w-6" />
        </a>
      </div>
    </div>
  )
}
