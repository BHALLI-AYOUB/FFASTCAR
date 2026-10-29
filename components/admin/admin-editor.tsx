"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { CarFront, CheckCircle2, ExternalLink, FileText, Loader2, LogOut, Phone, TriangleAlert, Video } from "lucide-react"

import { LOCALE_META, isLocale } from "@/i18n/config"
import type { SiteContent } from "@/lib/content/types"
import { IssuesProvider, buttonClass } from "@/components/admin/fields"
import { VehiclesEditor } from "@/components/admin/vehicles-editor"
import { ContactEditor } from "@/components/admin/contact-editor"
import { TextsEditor } from "@/components/admin/texts-editor"
import { VideosEditor } from "@/components/admin/videos-editor"
import { ConditionsEditor } from "@/components/admin/conditions-editor"

type Issue = { path: string; message: string }
/** Where a save goes; "none" = no Blob store connected on Vercel. */
type SaveTarget = "blob" | "filesystem" | "none"
type Tab = "vehicles" | "contact" | "texts" | "videos" | "conditions"
type Notice = { kind: "success" | "error"; text: string }

const SAVE_ERRORS: Record<string, string> = {
  conflict:
    "Le contenu a été modifié ailleurs (autre onglet ou autre appareil) depuis que vous l'avez ouvert. Rechargez pour voir la dernière version, puis refaites vos modifications.",
  storage_unavailable: "Le stockage est indisponible : rien n'a été enregistré. Réessayez dans un moment.",
  unauthorized:
    "Votre session a expiré : rien n'a été enregistré. Ouvrez /admin dans un nouvel onglet pour vous reconnecter, puis revenez ici et enregistrez à nouveau.",
}

const VEHICLE_FIELDS: Record<string, string> = {
  name: "Nom",
  brand: "Marque",
  year: "Année",
  priceMad: "Prix",
  slug: "Identifiant",
  image: "Photo principale",
  gallery: "Galerie",
  category: "Catégorie",
  features: "Équipements",
}

const TEXT_SECTIONS: Record<string, string> = {
  meta: "Référencement",
  hero: "Grand titre",
  about: "À propos",
  features: "Services",
  faq: "FAQ",
}

/** "vehicles.3.priceMad" → "Véhicule « Range Rover » · Prix", for the error summary. */
function describeIssue(path: string, content: SiteContent): { label: string; tab: Tab } {
  const [root, a, b] = path.split(".")
  if (root === "vehicles") {
    if (a === undefined) return { label: "Véhicules", tab: "vehicles" }
    const name = content.vehicles[Number(a)]?.name || `n° ${Number(a) + 1}`
    return { label: `Véhicule « ${name} »${b ? ` · ${VEHICLE_FIELDS[b] ?? b}` : ""}`, tab: "vehicles" }
  }
  if (root === "contact") return { label: "Contact", tab: "contact" }
  if (root === "videos") return { label: `Vidéo ${Number(a) + 1}${b ? ` · ${b}` : ""}`, tab: "videos" }
  if (root === "conditions") return { label: `Conditions ${isLocale(a) ? LOCALE_META[a].label : ""} · ${path.split(".").slice(2).join(" · ")}`, tab: "conditions" }
  if (root === "texts" && isLocale(a)) return { label: `Textes ${LOCALE_META[a].label}${b ? ` · ${TEXT_SECTIONS[b] ?? b}` : ""}`, tab: "texts" }
  return { label: path, tab: "vehicles" }
}

export default function AdminEditor({ email }: { email: string }) {
  const [loadError, setLoadError] = useState(false)
  const [content, setContent] = useState<SiteContent | null>(null)
  const [saved, setSaved] = useState<SiteContent | null>(null)
  const [etag, setEtag] = useState("")
  const [saveTo, setSaveTo] = useState<SaveTarget>("blob")
  const [tab, setTab] = useState<Tab>("vehicles")
  const [issues, setIssues] = useState<Issue[]>([])
  const [saving, setSaving] = useState(false)
  const [conflict, setConflict] = useState(false)
  const [notice, setNotice] = useState<Notice | null>(null)

  const load = useCallback(async () => {
    setLoadError(false)
    try {
      const res = await fetch("/api/admin/content", { cache: "no-store" })
      if (res.status === 401) return window.location.reload()
      if (!res.ok) throw new Error(String(res.status))
      const data = (await res.json()) as { content: SiteContent; etag: string; saveTo: SaveTarget }
      setContent(data.content)
      setSaved(data.content)
      setEtag(data.etag)
      setSaveTo(data.saveTo)
      setIssues([])
      setConflict(false)
    } catch {
      setLoadError(true)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const dirty = useMemo(() => content !== null && JSON.stringify(content) !== JSON.stringify(saved), [content, saved])

  // Warn before leaving the page with unsaved changes.
  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [dirty])

  const issueMap = useMemo(() => new Map(issues.map((i) => [i.path, i.message])), [issues])
  const savedSlugs = useMemo(() => new Set(saved?.vehicles.map((v) => v.slug)), [saved])

  async function save() {
    if (!content) return
    setNotice(null)
    // The server rejects these too; catching them here gives a clearer message.
    const missingPhoto = content.vehicles.flatMap((v, i) => (v.image.src ? [] : [{ path: `vehicles.${i}.image`, message: "Photo obligatoire" }]))
    if (missingPhoto.length) {
      setIssues(missingPhoto)
      setTab("vehicles")
      return
    }

    setSaving(true)
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, etag }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        content?: SiteContent
        etag?: string
        error?: string
        issues?: Issue[]
      }
      if (res.ok && data.content && data.etag) {
        setContent(data.content)
        setSaved(data.content)
        setEtag(data.etag)
        setIssues([])
        setNotice({ kind: "success", text: "Enregistré. Le site affiche déjà les modifications." })
        return
      }
      if (data.error === "invalid" && data.issues) {
        setIssues(data.issues)
        return
      }
      if (data.error === "conflict") setConflict(true)
      setNotice({ kind: "error", text: SAVE_ERRORS[data.error ?? ""] ?? "L'enregistrement a échoué. Vérifiez votre connexion et réessayez." })
    } catch {
      setNotice({ kind: "error", text: "Pas de connexion : rien n'a été enregistré. Réessayez." })
    } finally {
      setSaving(false)
    }
  }

  function discard() {
    if (!window.confirm("Annuler toutes les modifications non enregistrées ?")) return
    setContent(saved)
    setIssues([])
    setNotice(null)
  }

  async function logout() {
    if (dirty && !window.confirm("Des modifications ne sont pas enregistrées. Se déconnecter quand même ?")) return
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {})
    window.location.reload()
  }

  const tabs: { id: Tab; label: string; icon: typeof CarFront }[] = [
    { id: "vehicles", label: "Véhicules", icon: CarFront },
    { id: "contact", label: "Contact", icon: Phone },
    { id: "texts", label: "Textes", icon: FileText },
    { id: "videos", label: "Vidéos", icon: Video },
    { id: "conditions", label: "Conditions", icon: FileText },
  ]

  return (
    <div className="min-h-screen pb-28">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/95">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/images/logo-ab-fastcar-white.webp" alt="AB FAST CAR" width={240} height={107} className="h-8 w-auto" />
            <span className="text-sm font-semibold text-zinc-300">Administration</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <a href="/" target="_blank" rel="noreferrer" className={buttonClass.secondary}>
              Voir le site <ExternalLink className="size-3.5" aria-hidden />
            </a>
            <button type="button" onClick={logout} className={buttonClass.secondary} title={email}>
              <LogOut className="size-4" aria-hidden /> <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
        <nav aria-label="Sections" className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-current={tab === id ? "page" : undefined}
              className={`inline-flex min-h-11 items-center gap-2 border-b-2 px-3 text-sm font-medium ${
                tab === id ? "border-white text-white" : "border-transparent text-zinc-400 hover:text-white"
              }`}
            >
              <Icon className="size-4" aria-hidden />
              {label}
              {issues.some((i) => describeIssue(i.path, content ?? ({} as SiteContent)).tab === id) && <TriangleAlert className="size-3.5 text-red-400" aria-label="Erreur" />}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        {saveTo === "filesystem" && (
          <p className="rounded-lg border border-white/10 bg-zinc-900 px-4 py-2 text-xs text-zinc-400">
            Mode local : les modifications sont enregistrées sur cet ordinateur (dossier .data), pas sur le site en ligne.
          </p>
        )}
        {saveTo === "none" && (
          <p role="alert" className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
            Aucun stockage n&apos;est connecté : les modifications ne pourront pas être enregistrées. Connectez un store Vercel Blob au projet (voir
            docs/ADMIN.md, §1).
          </p>
        )}

        {notice && (
          <div
            role={notice.kind === "error" ? "alert" : "status"}
            className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
              notice.kind === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-red-500/30 bg-red-500/10 text-red-200"
            }`}
          >
            {notice.kind === "success" ? <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden /> : <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />}
            <div className="flex-1 space-y-2">
              <p>{notice.text}</p>
              {conflict && (
                <button
                  type="button"
                  className={buttonClass.secondary}
                  onClick={() => (!dirty || window.confirm("Recharger ? Vos modifications non enregistrées seront perdues.")) && void load().then(() => setNotice(null))}
                >
                  Recharger la dernière version
                </button>
              )}
            </div>
          </div>
        )}

        {issues.length > 0 && content && (
          <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            <p className="font-semibold">Rien n&apos;a été enregistré : corrigez {issues.length > 1 ? `ces ${issues.length} points` : "ce point"}.</p>
            <ul className="mt-2 space-y-1">
              {issues.map((issue) => {
                const { label, tab: target } = describeIssue(issue.path, content)
                return (
                  <li key={issue.path}>
                    <button type="button" onClick={() => setTab(target)} className="text-start underline-offset-2 hover:underline">
                      {label} : {issue.message}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {loadError ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-200">
            <p>Impossible de charger le contenu.</p>
            <button type="button" className={`${buttonClass.secondary} mt-3`} onClick={() => void load()}>
              Réessayer
            </button>
          </div>
        ) : !content ? (
          <p className="flex items-center gap-2 text-sm text-zinc-400">
            <Loader2 className="size-4 animate-spin" aria-hidden /> Chargement…
          </p>
        ) : (
          <IssuesProvider value={issueMap}>
            {tab === "vehicles" && <VehiclesEditor vehicles={content.vehicles} savedSlugs={savedSlugs} onChange={(vehicles) => setContent({ ...content, vehicles })} />}
            {tab === "contact" && <ContactEditor contact={content.contact} onChange={(contact) => setContent({ ...content, contact })} />}
            {tab === "texts" && <TextsEditor texts={content.texts} onChange={(texts) => setContent({ ...content, texts })} />}
            {tab === "videos" && <VideosEditor videos={content.videos} onChange={(videos) => setContent({ ...content, videos })} />}
            {tab === "conditions" && <ConditionsEditor conditions={content.conditions} onChange={(conditions) => setContent({ ...content, conditions })} />}
          </IssuesProvider>
        )}
      </main>

      {(dirty || saving) && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-zinc-900/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-zinc-300">Modifications non enregistrées</p>
            <div className="flex gap-2">
              <button type="button" onClick={discard} disabled={saving} className={buttonClass.secondary}>
                Annuler
              </button>
              <button type="button" onClick={() => void save()} disabled={saving} className={buttonClass.primary}>
                {saving && <Loader2 className="size-4 animate-spin" aria-hidden />}
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
