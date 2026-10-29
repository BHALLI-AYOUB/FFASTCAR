"use client"

import { useState } from "react"

import { LOCALE_META, locales, type Locale } from "@/i18n/config"
import type { RentalConditions } from "@/lib/content/types"
import source from "@/lib/content/conditions/fr.json"
import { TextField, useHasIssueUnder } from "@/components/admin/fields"

export function ConditionsEditor({ conditions, onChange }: { conditions: Record<Locale, RentalConditions>; onChange: (conditions: Record<Locale, RentalConditions>) => void }) {
  const [locale, setLocale] = useState<Locale>("fr")
  const doc = conditions[locale]
  const dir = LOCALE_META[locale].dir
  const base = `conditions.${locale}`
  const update = (patch: Partial<RentalConditions>) => onChange({ ...conditions, [locale]: { ...doc, ...patch } })
  const articleUpdate = (index: number, patch: Partial<RentalConditions["articles"][number]>) => update({ articles: doc.articles.map((a, i) => i === index ? { ...a, ...patch } : a) })
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Conditions de location</h1>
      <p className="text-sm leading-relaxed text-zinc-400">Chaque langue est indépendante. Conservez les 16 articles, les paragraphes, les exceptions et les montants. Le texte français initial reste la référence ci-dessous ; il n’est pas remplacé par vos modifications. L’article 10 désigne Rabat : toute modification de cette clause doit venir d’une instruction précise du client.</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Langue des conditions">
        {locales.map((language) => <LanguageButton key={language} locale={language} selected={locale === language} onSelect={() => setLocale(language)} />)}
      </div>
      <TextField label="Titre de la page" value={doc.title} onChange={(title) => update({ title })} path={`${base}.title`} dir={dir} />
      <TextField label="Introduction" multiline value={doc.intro} onChange={(intro) => update({ intro })} path={`${base}.intro`} dir={dir} />
      <details className="rounded-xl border border-white/15 p-4">
        <summary className="cursor-pointer font-semibold">Texte français initial du client (référence)</summary>
        <p className="mt-4 break-all text-xs text-zinc-500">SHA-256 du fichier source : cfec541e936d9c7dc2a69f817ce9cad2a262d2420e7125405c8add8472669ef5</p>
        <div className="mt-4 max-h-96 space-y-6 overflow-y-auto text-sm leading-relaxed text-zinc-300" lang="fr" dir="ltr">
          {source.articles.map((article, a) => <div key={a}><h3 className="font-bold">Article {a + 1} — {article.title}</h3>{article.sections.map((section, s) => <div key={s} className="mt-3 space-y-2">{"heading" in section && <h4 className="font-semibold">{section.heading}</h4>}{section.paragraphs.map((paragraph, p) => <p key={p}>{paragraph}</p>)}</div>)}</div>)}
        </div>
      </details>
      {doc.articles.map((article, a) => (
        <ArticleFields key={`${locale}-${a}`} index={a} article={article} base={`${base}.articles.${a}`} dir={dir} onChange={(patch) => articleUpdate(a, patch)} />
      ))}
    </div>
  )
}

function LanguageButton({ locale, selected, onSelect }: { locale: Locale; selected: boolean; onSelect: () => void }) {
  const hasError = useHasIssueUnder(`conditions.${locale}`)
  return <button type="button" aria-pressed={selected} onClick={onSelect} className={`min-h-11 rounded-full px-4 text-sm ${selected ? "bg-white text-black" : "border border-white/20 text-zinc-300 hover:bg-white/10"}`}>{LOCALE_META[locale].label}{hasError ? " · Erreur" : ""}</button>
}

function ArticleFields({ index, article, base, dir, onChange }: {
  index: number
  article: RentalConditions["articles"][number]
  base: string
  dir: "ltr" | "rtl"
  onChange: (patch: Partial<RentalConditions["articles"][number]>) => void
}) {
  const hasError = useHasIssueUnder(base)
  const setSection = (index: number, patch: Partial<RentalConditions["articles"][number]["sections"][number]>) => onChange({ sections: article.sections.map((section, s) => index === s ? { ...section, ...patch } : section) })
  return (
    <details open={hasError || undefined} className="rounded-xl border border-white/15 bg-zinc-900/40">
      <summary className="cursor-pointer p-4 font-semibold">Article {index + 1} — {article.title}{hasError ? " · Erreur" : ""}</summary>
      <div className="space-y-5 border-t border-white/10 p-4 sm:p-6">
        <TextField label="Titre de l’article" value={article.title} onChange={(title) => onChange({ title })} path={`${base}.title`} dir={dir} />
        {article.sections.map((section, s) => <div key={s} className="space-y-4">
          {section.heading && <TextField label="Sous-titre" value={section.heading} onChange={(heading) => setSection(s, { heading })} path={`${base}.sections.${s}.heading`} dir={dir} />}
          {section.paragraphs.map((paragraph, p) => <TextField key={p} label={`Paragraphe ${p + 1}`} multiline rows={4} value={paragraph} onChange={(text) => setSection(s, { paragraphs: section.paragraphs.map((current, i) => i === p ? text : current) })} path={`${base}.sections.${s}.paragraphs.${p}`} dir={dir} />)}
        </div>)}
      </div>
    </details>
  )
}
