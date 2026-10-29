import { locales } from "@/i18n/config"
import fr from "@/messages/seo/fr.json"
import en from "@/messages/seo/en.json"
import nl from "@/messages/seo/nl.json"
import ar from "@/messages/seo/ar.json"

const messages = { fr, en, nl, ar }
const legacyMileage = {
  fr: "Non, nos locations sont proposées en kilométrage illimité.",
  en: "No, our rentals come with unlimited mileage.",
  nl: "Nee, onze verhuur is met onbeperkt aantal kilometers.",
  ar: "لا، يتم الكراء لدينا بمسافة غير محدودة.",
}
const legacyConditions = {
  fr: "Ces conditions ne sont pas encore publiées sur le site. Contactez-nous par téléphone ou sur WhatsApp avant de réserver : notre équipe vous indique les conditions qui s'appliquent au véhicule choisi.",
  en: "These conditions are not published on the site yet. Contact us by phone or WhatsApp before booking: our team will tell you the conditions that apply to the car you choose.",
  nl: "Deze voorwaarden staan nog niet op de site. Neem vóór het reserveren contact met ons op via telefoon of WhatsApp: ons team vertelt u welke voorwaarden gelden voor de gekozen auto.",
  ar: "هذه الشروط غير منشورة بعد على الموقع. تواصل معنا عبر الهاتف أو واتساب قبل الحجز، وسيُطلعك فريقنا على الشروط المطبقة على السيارة التي اخترتها.",
}

const record = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value)

/** Only obsolete stock FAQ answers change; all custom content is preserved. */
export function migrateLegacyContent(input: unknown): unknown {
  if (!record(input) || input.conditions !== undefined || !record(input.texts)) return input
  const migrated = structuredClone(input)
  const texts = migrated.texts as Record<string, unknown>
  for (const locale of locales) {
    const text = texts[locale]
    if (!record(text) || !record(text.faq) || !Array.isArray(text.faq.items)) continue
    text.faq.items = text.faq.items.map((item: unknown) => {
      if (!record(item) || typeof item.a !== "string") return item
      if (item.a === legacyMileage[locale]) return { ...item, a: messages[locale].faq.items[3].a }
      if (item.a === legacyConditions[locale]) {
        return { ...item, a: messages[locale].faq.items[7].a }
      }
      return item
    })
  }
  return migrated
}
