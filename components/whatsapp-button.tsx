"use client"

import { useTranslations } from "next-intl"
import { MessageCircle } from "lucide-react"

import { contactLinks } from "@/lib/site"
import { useContact } from "@/components/content-provider"

/** Floating WhatsApp shortcut on large screens (the mobile bar has its own). */
export function WhatsAppButton() {
  const t = useTranslations("common")
  const { whatsappUrl } = contactLinks(useContact())

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${t("whatsapp")} ${t("opensInNewTab")}`}
      className="fixed end-8 bottom-8 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-black shadow-2xl transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none lg:flex"
    >
      <MessageCircle aria-hidden="true" className="h-7 w-7" />
    </a>
  )
}
