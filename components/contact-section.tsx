import { useLocale, useTranslations } from "next-intl"
import { Clock, Instagram, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react"

import type { Locale } from "@/i18n/config"
import type { ContactInfo } from "@/lib/content/types"
import { contactLinks, formatAddress } from "@/lib/site"
import { SectionHeading } from "@/components/section-heading"
import { MapEmbed } from "@/components/map-embed"

export function ContactSection({ contact, headingLevel = "h2" }: { contact: ContactInfo; headingLevel?: "h1" | "h2" }) {
  const t = useTranslations("contact")
  const tc = useTranslations("common")
  const address = formatAddress(contact, useLocale() as Locale)
  const links = contactLinks(contact)

  const cards = [
    { icon: Phone, label: t("phone"), value: contact.phoneDisplay, href: links.tel, ltr: true },
    { icon: Mail, label: t("email"), value: contact.email, href: links.mailto, ltr: true },
    { icon: MapPin, label: t("address"), value: address, href: links.directionsUrl, external: true },
    { icon: Instagram, label: t("instagram"), value: contact.instagramHandle, href: contact.instagramUrl, external: true, ltr: true },
  ]

  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20 bg-black py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="contact-title" as={headingLevel} eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

        <ul className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <li key={card.label}>
              <a
                href={card.href}
                {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex h-full items-center gap-4 rounded-2xl border border-white/10 bg-zinc-950 p-5 transition-colors hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white">
                  <card.icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-zinc-400">{card.label}</span>
                  <span className="block font-bold break-words text-white" dir={card.ltr ? "ltr" : undefined}>
                    {card.value}
                  </span>
                  {card.external && <span className="sr-only">{tc("opensInNewTab")}</span>}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:p-8">
            <div>
              <h3 className="text-2xl font-black text-white">{t("findUs")}</h3>
              <p className="mt-2 text-zinc-300">{address}</p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white">
                <Clock aria-hidden="true" className="h-4 w-4" />
                {t("openNow")}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href={links.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-whatsapp px-6 font-bold text-black transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <MessageCircle aria-hidden="true" className="h-5 w-5" />
                {t("whatsapp")}
                <span className="sr-only">{tc("opensInNewTab")}</span>
              </a>
              <a
                href={links.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-6 font-bold text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Navigation aria-hidden="true" className="h-5 w-5" />
                {t("getDirections")}
                <span className="sr-only">{tc("opensInNewTab")}</span>
              </a>
            </div>
          </div>
          <MapEmbed
            src={links.mapsEmbedUrl}
            title={t("mapTitle", { address })}
            directionsUrl={links.directionsUrl}
            directionsLabel={t("getDirections")}
          />
        </div>
      </div>
    </section>
  )
}
