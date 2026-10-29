import { hasLocale } from "next-intl"
import { getRequestConfig } from "next-intl/server"

import { routing } from "@/i18n/routing"
import { getLocaleTexts } from "@/lib/content"

/**
 * Messages come from three sources per language, later ones winning:
 * - messages/<locale>.json      interface text (navigation, fleet, booking…)
 * - messages/seo/<locale>.json  page titles, descriptions and FAQ content
 * - the content store           texts edited in the admin (lib/content/types.ts
 *                               LocaleTexts), merged key by key so the keys the
 *                               admin does not edit keep their catalogue value.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  const [ui, seo, edited] = await Promise.all([
    import(`../messages/${locale}.json`).then((m) => m.default),
    import(`../messages/seo/${locale}.json`).then((m) => m.default),
    getLocaleTexts(locale),
  ])

  const messages = { ...ui, ...seo }
  messages.meta = { ...messages.meta, home: { ...messages.meta?.home, ...edited.meta.home } }
  messages.hero = { ...messages.hero, ...edited.hero }
  messages.about = { ...messages.about, ...edited.about }
  messages.features = { ...messages.features, ...edited.features }
  messages.faq = { ...messages.faq, ...edited.faq }

  return {
    locale,
    messages,
    timeZone: "Africa/Casablanca",
  }
})
