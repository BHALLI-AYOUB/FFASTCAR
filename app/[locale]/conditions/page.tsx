import { getTranslations, setRequestLocale } from "next-intl/server"

import { LOCALE_META, type Locale } from "@/i18n/config"
import { Link } from "@/i18n/navigation"
import { getSiteContent } from "@/lib/content"
import { buildMetadata } from "@/lib/seo"
import { SiteShell } from "@/components/site-shell"
import styles from "./conditions.module.css"

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return buildMetadata({ locale, page: "conditions", path: "/conditions" })
}

export default async function ConditionsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const [content, t] = await Promise.all([getSiteContent(), getTranslations("conditions")])
  const document = content.conditions[locale]
  const contents = document.articles.map((article, i) => (
    <li key={i}>
      <a href={`#article-${i + 1}`} className="flex min-h-11 gap-3 rounded py-2 text-sm leading-snug text-zinc-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <span className="tabular-nums text-zinc-400">{i + 1}.</span>
        <span>{article.title}</span>
      </a>
    </li>
  ))

  return (
    <SiteShell>
      <section dir={LOCALE_META[locale].dir} className={`${styles.document} mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 lg:px-8 lg:pt-32`}>
        <header className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold tracking-widest text-zinc-400">AB FAST CAR</p>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">{document.title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-300">{document.intro}</p>
          <p className="mt-4 text-sm text-zinc-400">
            {locale === "fr" ? t("source") : <>{t("translation")} <Link href="/conditions" locale="fr" className="underline underline-offset-4 hover:text-white">{t("frenchSource")}</Link></>}
          </p>
        </header>

        <div className="mt-12 grid min-w-0 gap-12 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <nav aria-label={t("contents")} className={`${styles.contents} self-start rounded-2xl border border-white/15 bg-zinc-900/40 p-5 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto`}>
            <details className="lg:hidden">
              <summary className="min-h-11 cursor-pointer py-2 font-bold text-white">{t("contents")} · 16</summary>
              <ol className="mt-3 space-y-1">{contents}</ol>
            </details>
            <div className="hidden lg:block">
              <h2 className="font-bold text-white">{t("contents")}</h2>
              <ol className="mt-3 space-y-1">{contents}</ol>
            </div>
          </nav>

          <div className="min-w-0 max-w-3xl space-y-12">
            {document.articles.map((article, i) => (
              <article id={`article-${i + 1}`} key={i} className="scroll-mt-28 border-t border-white/15 pt-7">
                <h2 className="text-xl font-bold leading-snug text-white sm:text-2xl">{t("article", { number: i + 1 })} — {article.title}</h2>
                {article.sections.map((section, s) => (
                  <div key={s} className="mt-5 space-y-4">
                    {section.heading && <h3 className="pt-2 text-lg font-bold text-white">{section.heading}</h3>}
                    {section.paragraphs.map((paragraph, p) => <p key={p} className="break-words leading-relaxed text-zinc-300">{paragraph}</p>)}
                  </div>
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
