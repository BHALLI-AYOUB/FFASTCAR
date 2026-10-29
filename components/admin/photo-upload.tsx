"use client"

import { useRef, useState } from "react"
import { ImagePlus, Loader2 } from "lucide-react"

import type { ImageAsset } from "@/lib/content/types"
import { buttonClass } from "@/components/admin/fields"

/** Same limit as MAX_UPLOAD_BYTES in lib/admin/images.ts (Vercel caps request bodies at 4.5 MB). */
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024
/** Longest side when a photo has to be shrunk before upload; the server makes 960 px variants at most. */
const SHRINK_TO = 2400

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif"

const UPLOAD_ERRORS: Record<string, string> = {
  unsupported_type: "Format non accepté. Utilisez une photo JPEG, PNG, WebP, AVIF ou HEIC.",
  invalid_file: "Fichier illisible, ou photo trop petite (320 px minimum de chaque côté).",
  too_large: "Photo trop lourde (4 Mo maximum).",
  unauthorized: "Session expirée. Rechargez la page et reconnectez-vous.",
  storage_unavailable: "Le stockage des photos est indisponible. Réessayez plus tard.",
}

/**
 * Phone photos are often over the 4 MB limit: re-encode them as a JPEG of at
 * most SHRINK_TO px in the browser. Only possible for formats the browser can
 * decode (HEIC only in Safari); otherwise the file is sent as is and the
 * server answers too_large.
 */
async function shrinkIfNeeded(file: File): Promise<File> {
  if (file.size <= MAX_UPLOAD_BYTES) return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, SHRINK_TO / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement("canvas")
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.88))
    if (!blob) return file
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" })
  } catch {
    return file
  }
}

async function uploadPhoto(file: File): Promise<ImageAsset> {
  const body = new FormData()
  body.append("file", await shrinkIfNeeded(file))
  const res = await fetch("/api/admin/upload", { method: "POST", body })
  const data = (await res.json().catch(() => ({}))) as { image?: ImageAsset; error?: string }
  if (res.ok && data.image) return data.image
  throw new Error(UPLOAD_ERRORS[data.error ?? ""] ?? "L'envoi a échoué. Vérifiez votre connexion et réessayez.")
}

/**
 * A button that uploads one or several photos. The server converts each one
 * to AVIF and WebP and strips its metadata, which takes a few seconds.
 */
export function PhotoUploadButton({
  label,
  multiple = false,
  max = 1,
  onUploaded,
}: {
  label: string
  multiple?: boolean
  /** Maximum number of photos accepted in this pick. */
  max?: number
  onUploaded: (images: ImageAsset[]) => void
}) {
  const input = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleFiles(files: File[]) {
    setError(null)
    const picked = files.slice(0, max)
    const uploaded: ImageAsset[] = []
    setProgress({ done: 0, total: picked.length })
    for (const file of picked) {
      try {
        uploaded.push(await uploadPhoto(file))
      } catch (e) {
        setError(`${file.name} : ${(e as Error).message}`)
        break
      }
      setProgress({ done: uploaded.length, total: picked.length })
    }
    setProgress(null)
    if (files.length > max) setError((prev) => prev ?? `Seules ${max} photo(s) ont été ajoutées : la limite est atteinte.`)
    if (uploaded.length) onUploaded(uploaded)
  }

  return (
    <div className="space-y-1.5">
      <input
        ref={input}
        type="file"
        accept={ACCEPT}
        multiple={multiple}
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? [])
          e.target.value = ""
          if (files.length) void handleFiles(files)
        }}
      />
      <button type="button" className={buttonClass.secondary} disabled={progress !== null || max < 1} onClick={() => input.current?.click()}>
        {progress ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <ImagePlus className="size-4" aria-hidden />}
        {progress ? `Conversion… ${progress.done}/${progress.total}` : label}
      </button>
      <p role="status" className="text-xs text-red-400">
        {error}
      </p>
    </div>
  )
}

/** Thumbnail of a stored photo (smallest WebP variant when there is one). */
export function PhotoThumb({ image, alt, className = "" }: { image: ImageAsset; alt: string; className?: string }) {
  const src = image.webp?.[0]?.url ?? image.src
  if (!src) {
    return <div className={`flex items-center justify-center bg-zinc-800 text-xs text-zinc-500 ${className}`}>Pas de photo</div>
  }
  return <img src={src} alt={alt} width={image.width} height={image.height} loading="lazy" className={`object-cover ${className}`} />
}
