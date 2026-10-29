"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, ChevronDown, Plus, TriangleAlert, X } from "lucide-react"

import { LOCALE_META, locales, type Locale } from "@/i18n/config"
import type { LocaleTexts } from "@/lib/content/types"
import { TextField, buttonClass, moveItem, useHasIssueUnder } from "@/components/admin/fields"

/** Lengths Google shows in results; longer is allowed but gets cut off. */
const TITLE_LENGTH = 60
const DESCRIPTION_LENGTH = 155

export function TextsEditor({ texts, onChange }: { texts: Record<Locale, LocaleTexts>; onChange: (texts: Record<Locale, LocaleTexts>) => void }) {
  const [locale, setLocale] = useState<Locale>("fr")
  const t = texts[locale]
  const dir = LOCALE_META[locale].dir
  const base = `texts.${locale}`
  const set = <K extends keyof LocaleTexts>(key: K, value: LocaleTexts[K]) => onChange({ ...texts, [locale]: { ...t, [key]: value } })

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div role="tablist" aria-label="Langue" className="flex flex-wrap gap-2">
        {locales.map((l) => (
          <LocaleTab key={l} locale={l} selected={l === locale} onSelect={() => setLocale(l)} />
        ))}
      </div>
      <p className="text-sm text-zinc-400">
        Chaque langue a ses propres textes et ses propres listes : une question ajoutée en français n&apos;apparaît pas en anglais tant que vous ne
        l&apos;ajoutez pas aussi dans l&apos;onglet English.
      </p>

      <Section title="Référencement Google" path={`${base}.meta`} defaultOpen>
        <TextField
          label="Titre de la page d'accueil"
          value={t.meta.home.title}
          onChange={(title) => set("meta", { home: { ...t.meta.home, title } })}
          path={`${base}.meta.home.title`}
          dir={dir}
          recommended={TITLE_LENGTH}
          hint="Le titre bleu dans les résultats Google."
        />
        <TextField
          label="Description"
          multiline
          value={t.meta.home.description}
          onChange={(description) => set("meta", { home: { ...t.meta.home, description } })}
          path={`${base}.meta.home.description`}
          dir={dir}
          recommended={DESCRIPTION_LENGTH}
          hint="Le texte gris sous le titre dans Google."
        />
      </Section>

      <Section title="Accueil : grand titre" path={`${base}.hero`}>
        <TextField label="Accroche (petit texte au-dessus du titre)" value={t.hero.slogan} onChange={(slogan) => set("hero", { ...t.hero, slogan })} path={`${base}.hero.slogan`} dir={dir} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Titre, ligne 1" value={t.hero.title1} onChange={(title1) => set("hero", { ...t.hero, title1 })} path={`${base}.hero.title1`} dir={dir} />
          <TextField label="Titre, ligne 2" value={t.hero.title2} onChange={(title2) => set("hero", { ...t.hero, title2 })} path={`${base}.hero.title2`} dir={dir} />
        </div>
        <TextField label="Sous-titre" multiline value={t.hero.subtitle} onChange={(subtitle) => set("hero", { ...t.hero, subtitle })} path={`${base}.hero.subtitle`} dir={dir} />
      </Section>

      <Section title="À propos" path={`${base}.about`}>
        <TextField label="Phrase d'introduction" multiline rows={2} value={t.about.tagline} onChange={(tagline) => set("about", { ...t.about, tagline })} path={`${base}.about.tagline`} dir={dir} />
        <TextField label="Présentation" multiline rows={5} value={t.about.description} onChange={(description) => set("about", { ...t.about, description })} path={`${base}.about.description`} dir={dir} />
        <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
          <TextField label="Titre de la mission" value={t.about.mission} onChange={(mission) => set("about", { ...t.about, mission })} path={`${base}.about.mission`} dir={dir} />
          <TextField label="Texte de la mission" multiline value={t.about.missionText} onChange={(missionText) => set("about", { ...t.about, missionText })} path={`${base}.about.missionText`} dir={dir} />
        </div>
        <ListEditor
          label="Valeurs"
          itemLabel="Valeur"
          max={6}
          items={t.about.values}
          onChange={(values) => set("about", { ...t.about, values })}
          create={() => ({ title: "", description: "" })}
          render={(item, i, update) => (
            <>
              <TextField label="Titre" value={item.title} onChange={(title) => update({ ...item, title })} path={`${base}.about.values.${i}.title`} dir={dir} />
              <TextField label="Description" multiline rows={2} value={item.description} onChange={(description) => update({ ...item, description })} path={`${base}.about.values.${i}.description`} dir={dir} />
            </>
          )}
        />
      </Section>

      <Section title="Services" path={`${base}.features`}>
        <TextField label="Titre de la section" value={t.features.title} onChange={(title) => set("features", { ...t.features, title })} path={`${base}.features.title`} dir={dir} />
        <TextField label="Sous-titre" multiline rows={2} value={t.features.subtitle} onChange={(subtitle) => set("features", { ...t.features, subtitle })} path={`${base}.features.subtitle`} dir={dir} />
        <ListEditor
          label="Services"
          itemLabel="Service"
          max={8}
          items={t.features.features}
          onChange={(features) => set("features", { ...t.features, features })}
          create={() => ({ title: "", description: "" })}
          render={(item, i, update) => (
            <>
              <TextField label="Titre" value={item.title} onChange={(title) => update({ ...item, title })} path={`${base}.features.features.${i}.title`} dir={dir} />
              <TextField label="Description" multiline rows={2} value={item.description} onChange={(description) => update({ ...item, description })} path={`${base}.features.features.${i}.description`} dir={dir} />
            </>
          )}
        />
      </Section>

      <Section title="Questions fréquentes (FAQ)" path={`${base}.faq`}>
        <TextField label="Titre de la page" value={t.faq.title} onChange={(title) => set("faq", { ...t.faq, title })} path={`${base}.faq.title`} dir={dir} />
        <TextField label="Introduction" multiline rows={2} value={t.faq.intro} onChange={(intro) => set("faq", { ...t.faq, intro })} path={`${base}.faq.intro`} dir={dir} />
        <ListEditor
          label="Questions"
          itemLabel="Question"
          max={30}
          items={t.faq.items}
          onChange={(items) => set("faq", { ...t.faq, items })}
          create={() => ({ q: "", a: "" })}
          render={(item, i, update) => (
            <>
              <TextField label="Question" value={item.q} onChange={(q) => update({ ...item, q })} path={`${base}.faq.items.${i}.q`} dir={dir} />
              <TextField label="Réponse" multiline rows={3} value={item.a} onChange={(a) => update({ ...item, a })} path={`${base}.faq.items.${i}.a`} dir={dir} />
            </>
          )}
        />
      </Section>
    </div>
  )
}

function LocaleTab({ locale, selected, onSelect }: { locale: Locale; selected: boolean; onSelect: () => void }) {
  const hasError = useHasIssueUnder(`texts.${locale}`)
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onSelect}
      className={`inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium ${
        selected ? "bg-white text-black" : "border border-white/15 text-zinc-300 hover:bg-white/10"
      }`}
    >
      {hasError && <TriangleAlert className="size-3.5 text-red-500" aria-label="Erreur" />}
      {LOCALE_META[locale].label}
    </button>
  )
}

function Section({ title, path, defaultOpen = false, children }: { title: string; path: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const hasError = useHasIssueUnder(path)
  return (
    <details open={defaultOpen || hasError || undefined} className="group rounded-2xl border border-white/10 bg-zinc-900/40">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 sm:px-6 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2 text-base font-semibold text-white">
          {hasError && <TriangleAlert className="size-4 text-red-400" aria-label="Erreur" />}
          {title}
        </span>
        <ChevronDown className="size-4 text-zinc-400 transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="space-y-4 border-t border-white/10 p-4 sm:p-6">{children}</div>
    </details>
  )
}

function ListEditor<T>({
  label,
  itemLabel,
  max,
  items,
  onChange,
  create,
  render,
}: {
  label: string
  itemLabel: string
  max: number
  items: T[]
  onChange: (items: T[]) => void
  create: () => T
  render: (item: T, index: number, update: (item: T) => void) => React.ReactNode
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-zinc-200">
        {label} ({items.length}/{max})
      </legend>
      <ol className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="rounded-xl border border-white/10 bg-zinc-950/60 p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">
                {itemLabel} {i + 1}
              </span>
              <div className="flex gap-1">
                <button type="button" className={buttonClass.icon} disabled={i === 0} onClick={() => onChange(moveItem(items, i, -1))} aria-label={`Monter : ${itemLabel} ${i + 1}`}>
                  <ArrowUp className="size-4" aria-hidden />
                </button>
                <button type="button" className={buttonClass.icon} disabled={i === items.length - 1} onClick={() => onChange(moveItem(items, i, 1))} aria-label={`Descendre : ${itemLabel} ${i + 1}`}>
                  <ArrowDown className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  className={buttonClass.icon}
                  onClick={() => window.confirm(`Supprimer : ${itemLabel} ${i + 1} ?`) && onChange(items.filter((_, j) => j !== i))}
                  aria-label={`Supprimer : ${itemLabel} ${i + 1}`}
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
            </div>
            <div className="space-y-3">{render(item, i, (next) => onChange(items.map((it, j) => (j === i ? next : it))))}</div>
          </li>
        ))}
      </ol>
      <button type="button" className={buttonClass.secondary} disabled={items.length >= max} onClick={() => onChange([...items, create()])}>
        <Plus className="size-4" aria-hidden /> Ajouter : {itemLabel.toLowerCase()}
      </button>
    </fieldset>
  )
}
