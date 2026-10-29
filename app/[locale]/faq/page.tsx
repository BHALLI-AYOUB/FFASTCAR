import { getTranslations, setRequestLocale } from "next-intl/server"

import { LOCALE_META, type Locale } from "@/i18n/config"
import { Link } from "@/i18n/navigation"
import { getVisibleVehicles } from "@/lib/content"
import { formatPrice } from "@/lib/currency"
import { buildMetadata } from "@/lib/seo"
import { SiteShell } from "@/components/site-shell"
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/structured-data"

type Props = { params: Promise<{ locale: Locale }> }
type FaqItem = { q: string; a: string }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return buildMetadata({ locale, page: "faq", path: "/faq" })
}

/** Fill {min} / {max} from the fleet so the answer always matches the prices shown. */
function withPrices(text: string, locale: Locale, prices: number[]): string {
  if (prices.length === 0) return text
  const fmt = { currency: "MAD" as const, intlLocale: LOCALE_META[locale].intlLocale }
  return text
    .replace("{min}", formatPrice(Math.min(...prices), fmt))
    .replace("{max}", formatPrice(Math.max(...prices), fmt))
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("faq")
  const nav = await getTranslations("navigation")
  const prices = (await getVisibleVehicles()).map((v) => v.priceMad)
  const items = (t.raw("items") as FaqItem[]).map((item) => ({ q: item.q, a: withPrices(item.a, locale, prices) }))

  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-4 pt-28 pb-20 sm:px-6 lg:pt-32">
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">{t("title")}</h1>
        <p className="mt-5 text-lg leading-relaxed text-zinc-300">{t("intro")}</p>

        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {items.map((item) => (
            <details key={item.q} className="group py-2">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-lg py-3 text-start text-lg font-bold text-white outline-none focus-visible:ring-2 focus-visible:ring-white [&::-webkit-details-marker]:hidden">
                <h2 className="text-lg font-bold">{item.q}</h2>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-2xl leading-none text-zinc-400 transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                >
                  +
                </span>
              </summary>
              <p className="pb-4 leading-relaxed text-zinc-300">{item.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link href="/conditions" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 font-bold text-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            {(await getTranslations("footer"))("conditions")}
          </Link>
          <Link
            href="/fleet"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-red px-8 font-bold text-white transition-colors hover:bg-brand-red-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-ring"
          >
            {t("book")}
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-8 font-bold text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {t("contact")}
          </Link>
        </div>
      </section>

      <JsonLd data={faqSchema(locale, items)} />
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: nav("home"), path: "/" },
          { name: t("title"), path: "/faq" },
        ])}
      />
    </SiteShell>
  )
}
