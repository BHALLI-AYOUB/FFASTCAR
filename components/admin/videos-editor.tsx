"use client"

import { ArrowDown, ArrowUp } from "lucide-react"

import type { VideoRecord } from "@/lib/content/types"
import { LocalizedField, NumberField, TextField, Toggle, buttonClass, moveItem } from "@/components/admin/fields"

export function VideosEditor({ videos, onChange }: { videos: VideoRecord[]; onChange: (videos: VideoRecord[]) => void }) {
  const update = (i: number, patch: Partial<VideoRecord>) => onChange(videos.map((video, index) => index === i ? { ...video, ...patch } : video))
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Vidéos de l’accueil</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">Utilisez les fichiers MP4 et couvertures déjà préparés sous /videos/ ou des liens HTTPS. Les fichiers vidéo ne sont pas téléversés ni convertis par cet outil. L’ordre ci-dessous est celui du site.</p>
      </div>
      {videos.map((video, i) => (
        <section key={video.id} className="space-y-5 rounded-2xl border border-white/15 bg-zinc-900/40 p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold">{i + 1}. {video.title.fr}</h2>
            <div className="flex gap-1">
              <button type="button" className={buttonClass.icon} disabled={i === 0} onClick={() => onChange(moveItem(videos, i, -1))} aria-label={`Monter ${video.title.fr}`}><ArrowUp className="size-4" aria-hidden /></button>
              <button type="button" className={buttonClass.icon} disabled={i === videos.length - 1} onClick={() => onChange(moveItem(videos, i, 1))} aria-label={`Descendre ${video.title.fr}`}><ArrowDown className="size-4" aria-hidden /></button>
            </div>
          </div>
          <Toggle label="Visible sur le site" checked={!video.hidden} onChange={(visible) => update(i, { hidden: !visible })} />
          <LocalizedField label="Titre" value={video.title} onChange={(title) => update(i, { title })} path={`videos.${i}.title`} />
          <LocalizedField label="Légende" value={video.caption} onChange={(caption) => update(i, { caption })} path={`videos.${i}.caption`} />
          <TextField label="Vidéo principale (.mp4)" value={video.src} onChange={(src) => update(i, { src })} path={`videos.${i}.src`} dir="ltr" />
          <TextField label="Variante petit écran (.mp4, facultative)" value={video.srcSmall ?? ""} onChange={(srcSmall) => update(i, { srcSmall: srcSmall || undefined })} path={`videos.${i}.srcSmall`} dir="ltr" />
          <TextField label="Couverture (webp, jpg, png ou avif)" value={video.poster} onChange={(poster) => update(i, { poster })} path={`videos.${i}.poster`} dir="ltr" />
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField label="Largeur réelle de la vidéo (px)" integer value={video.width} onChange={(width) => update(i, { width })} path={`videos.${i}.width`} />
            <NumberField label="Hauteur réelle de la vidéo (px)" integer value={video.height} onChange={(height) => update(i, { height })} path={`videos.${i}.height`} />
          </div>
        </section>
      ))}
    </div>
  )
}
