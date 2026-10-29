"use client"

import { createContext, useContext, useEffect, useId, useState } from "react"

import { LOCALE_META, locales, type Locale } from "@/i18n/config"
import type { LocalizedText } from "@/lib/content/types"

/**
 * Form controls shared by the admin editors. Every field takes the `path` of
 * the value it edits in SiteContent (e.g. "contact.email"), so the errors the
 * server returns for that path show up under the right field.
 */

const IssuesContext = createContext<Map<string, string>>(new Map())

export const IssuesProvider = IssuesContext.Provider

export function useIssue(path?: string): string | undefined {
  const issues = useContext(IssuesContext)
  return path ? issues.get(path) : undefined
}

/** True when the server reported an error at `prefix` or anywhere below it. */
export function useHasIssueUnder(prefix: string): boolean {
  const issues = useContext(IssuesContext)
  for (const path of issues.keys()) if (path === prefix || path.startsWith(`${prefix}.`)) return true
  return false
}

export const inputClass =
  "w-full rounded-lg border border-white/15 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 aria-[invalid=true]:border-red-500"

type FieldShellProps = {
  label: string
  hint?: string
  error?: string
  counter?: { length: number; recommended: number }
  children: (id: string, describedBy: string | undefined) => React.ReactNode
}

function FieldShell({ label, hint, error, counter, children }: FieldShellProps) {
  const id = useId()
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-zinc-200">
          {label}
        </label>
        {counter && (
          <span className={`text-xs tabular-nums ${counter.length > counter.recommended ? "text-amber-400" : "text-zinc-500"}`}>
            {counter.length} / {counter.recommended}
          </span>
        )}
      </div>
      {children(id, describedBy)}
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-zinc-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

type TextFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  path?: string
  hint?: string
  multiline?: boolean
  rows?: number
  dir?: "ltr" | "rtl"
  type?: "text" | "email" | "url" | "tel"
  placeholder?: string
  readOnly?: boolean
  /** Length search engines display; shown as a counter, not enforced. */
  recommended?: number
}

export function TextField({ label, value, onChange, path, hint, multiline, rows = 3, dir, type = "text", placeholder, readOnly, recommended }: TextFieldProps) {
  const error = useIssue(path)
  return (
    <FieldShell label={label} hint={hint} error={error} counter={recommended ? { length: value.length, recommended } : undefined}>
      {(id, describedBy) =>
        multiline ? (
          <textarea
            id={id}
            value={value}
            rows={rows}
            dir={dir}
            placeholder={placeholder}
            readOnly={readOnly}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} resize-y`}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            dir={dir}
            placeholder={placeholder}
            readOnly={readOnly}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} ${readOnly ? "cursor-not-allowed text-zinc-400" : ""}`}
          />
        )
      }
    </FieldShell>
  )
}

type NumberFieldProps = {
  label: string
  value: number
  onChange: (value: number) => void
  path?: string
  hint?: string
  integer?: boolean
  suffix?: string
}

/**
 * Keeps what is typed as text so "31," or "-" can be typed on the way to a
 * number; the content only receives valid numbers. Commas are accepted.
 */
export function NumberField({ label, value, onChange, path, hint, integer, suffix }: NumberFieldProps) {
  const serverError = useIssue(path)
  const [text, setText] = useState(Number.isFinite(value) ? String(value) : "")
  const parsed = Number(text.replace(",", ".").trim())
  const valid = text.trim() !== "" && Number.isFinite(parsed) && (!integer || Number.isInteger(parsed))

  // Follow outside changes (cancel, reload) without fighting the typing.
  useEffect(() => {
    if (!valid || parsed !== value) setText(Number.isFinite(value) ? String(value) : "")
  }, [value]) // only on outside changes, not on each keystroke

  const error = !valid ? (integer ? "Nombre entier attendu" : "Nombre attendu") : serverError
  return (
    <FieldShell label={label} hint={hint} error={error}>
      {(id, describedBy) => (
        <div className="relative">
          <input
            id={id}
            inputMode={integer ? "numeric" : "decimal"}
            value={text}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            onChange={(e) => {
              setText(e.target.value)
              const n = Number(e.target.value.replace(",", ".").trim())
              if (e.target.value.trim() !== "" && Number.isFinite(n) && (!integer || Number.isInteger(n))) onChange(n)
            }}
            className={`${inputClass} ${suffix ? "pe-14" : ""}`}
          />
          {suffix && <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-xs text-zinc-500">{suffix}</span>}
        </div>
      )}
    </FieldShell>
  )
}

export function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-zinc-900/60 p-3 hover:border-white/25">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 size-4 accent-white" />
      <span>
        <span className="block text-sm font-medium text-white">{label}</span>
        {hint && <span className="block text-xs text-zinc-500">{hint}</span>}
      </span>
    </label>
  )
}

export function LocaleTag({ locale }: { locale: Locale }) {
  return <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-zinc-300 uppercase">{locale}</span>
}

/** One input per language, French first. */
export function LocalizedField({
  label,
  value,
  onChange,
  path,
  hint,
}: {
  label: string
  value: LocalizedText
  onChange: (value: LocalizedText) => void
  path: string
  hint?: string
}) {
  const fr = value.fr.trim()
  const canFill = fr !== "" && locales.some((l) => value[l].trim() === "")
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-zinc-200">{label}</legend>
      {hint && <p className="text-xs text-zinc-500">{hint}</p>}
      <div className="grid gap-2 sm:grid-cols-2">
        {locales.map((l) => (
          <LocaleInput key={l} locale={l} value={value[l]} path={`${path}.${l}`} onChange={(v) => onChange({ ...value, [l]: v })} />
        ))}
      </div>
      {canFill && (
        <button
          type="button"
          onClick={() => onChange(Object.fromEntries(locales.map((l) => [l, value[l].trim() || value.fr])) as LocalizedText)}
          className="text-xs text-zinc-400 underline underline-offset-2 hover:text-white"
        >
          Copier le français dans les langues vides
        </button>
      )}
    </fieldset>
  )
}

function LocaleInput({ locale, value, path, onChange }: { locale: Locale; value: string; path: string; onChange: (v: string) => void }) {
  const error = useIssue(path)
  return (
    <div className="space-y-1">
      <div className="relative">
        <span className="absolute inset-y-0 start-2 flex items-center">
          <LocaleTag locale={locale} />
        </span>
        <input
          aria-label={LOCALE_META[locale].label}
          value={value}
          dir={LOCALE_META[locale].dir}
          aria-invalid={Boolean(error)}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} ps-11`}
        />
      </div>
      {error && <p className="text-xs font-medium text-red-400">{error}</p>}
    </div>
  )
}

export function Card({ title, description, children, actions }: { title: string; description?: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          {description && <p className="mt-1 text-sm text-zinc-400">{description}</p>}
        </div>
        {actions}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

export const buttonClass = {
  primary:
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
  secondary:
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
  danger:
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-500/40 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400",
  icon: "inline-flex size-9 items-center justify-center rounded-lg border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
}

/** Move item `from` one step up (-1) or down (+1) in a copy of the list. */
export function moveItem<T>(list: T[], from: number, step: -1 | 1): T[] {
  const to = from + step
  if (to < 0 || to >= list.length) return list
  const next = [...list]
  ;[next[from], next[to]] = [next[to], next[from]]
  return next
}
