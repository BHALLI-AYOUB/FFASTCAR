import { useLocale, useTranslations } from "next-intl"
import { Clock, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react"

import { Link } from "@/i18n/navigation"
import type { Locale } from "@/i18n/config"
import type { ContactInfo } from "@/lib/content/types"
import { contactLinks, formatAddress } from "@/lib/site"

export function Footer({ contact }: { contact: ContactInfo }) {
  const t = useTranslations("footer")
  const tn = useTranslations("navigation")
  const tc = useTranslations("common")
  const locale = useLocale() as Locale
  const contactHrefs = contactLinks(contact)

  const links = [
    { href: "/", label: tn("home") },
    { href: "/fleet", label: tn("fleet") },
    { href: "/#services", label: tn("services") },
    { href: "/faq", label: tn("faq") },
    { href: "/contact", label: tn("contact") },
    { href: "/conditions", label: t("conditions") },
  ]
  const socials = [
    { href: contact.instagramUrl, label: "Instagram", icon: Instagram },
    { href: contact.facebookUrl, label: "Facebook", icon: Facebook },
    { href: contactHrefs.whatsappUrl, label: "WhatsApp", icon: MessageCircle },
  ]
  const linkClass = "inline-flex min-h-11 items-center text-zinc-300 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"

  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <img
            src="/images/logo-ab-fastcar-white.webp"
            alt="AB FAST CAR"
            width={240}
            height={107}
            loading="lazy"
            className="h-12 w-auto"
          />
          <p className="mt-4 font-bold text-white">{t("tagline")}</p>
          <p className="mt-2 max-w-md text-zinc-400">{t("description")}</p>
        </div>

        <nav aria-label={t("explore")}>
          <h2 className="mb-3 text-sm font-bold tracking-[0.18em] text-zinc-400 uppercase">{t("explore")}</h2>
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 text-sm font-bold tracking-[0.18em] text-zinc-400 uppercase">{t("contactTitle")}</h2>
          <ul className="space-y-1">
            <li>
              <a href={contactHrefs.tel} className={`${linkClass} gap-2`}>
                <Phone aria-hidden="true" className="h-4 w-4" />
                <span dir="ltr">{contact.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a href={contactHrefs.mailto} className={`${linkClass} gap-2`}>
                <Mail aria-hidden="true" className="h-4 w-4" />
                <span dir="ltr">{contact.email}</span>
              </a>
            </li>
            <li className="flex min-h-11 items-center gap-2 text-zinc-300">
              <MapPin aria-hidden="true" className="h-4 w-4" />
              {formatAddress(contact, locale)}
            </li>
            <li className="flex min-h-11 items-center gap-2 text-zinc-300">
              <Clock aria-hidden="true" className="h-4 w-4" />
              {t("hours")}
            </li>
          </ul>
          <h2 className="mt-6 mb-3 text-sm font-bold tracking-[0.18em] text-zinc-400 uppercase">{t("follow")}</h2>
          <ul className="flex gap-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.label} ${tc("opensInNewTab")}`}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <s.icon aria-hidden="true" className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-6 text-sm text-zinc-400 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} AB FAST CAR. {t("rights")}
        </p>
      </div>
    </footer>
  )
}
