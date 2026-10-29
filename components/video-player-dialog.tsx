"use client"

import { useEffect, useId, useRef, useState } from "react"
import { Loader2, RotateCcw, X } from "lucide-react"

import type { PlayableVideo, PlayerLabels } from "@/components/video-launcher"

/** Below this width the lighter variant (720p) is played when one exists. */
const SMALL_SCREEN = "(max-width: 767px)"

/**
 * Modal video player, loaded only after a click (see video-launcher.tsx).
 *
 * - Native <dialog> + showModal(): the page behind is inert, focus stays in
 *   the dialog, Escape closes it; focus then returns to the card's button.
 * - The source is chosen once, at launch, and set on the element by code:
 *   the <video> has no src in the markup, so nothing is fetched before this
 *   point, and only one variant is ever downloaded.
 * - Native controls (volume, seeking, full screen). Sound stays under the
 *   visitor's control: playback starts from their click, never on load.
 * - Closing pauses, removes the source and frees the download.
 */
export function VideoPlayerDialog({ video, labels, onClose }: { video: PlayableVideo; labels: PlayerLabels; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const titleId = useId()
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [src] = useState(() => (video.srcSmall && window.matchMedia(SMALL_SCREEN).matches ? video.srcSmall : video.src))

  useEffect(() => {
    const dialog = dialogRef.current!
    const player = videoRef.current!
    if (!dialog.open) dialog.showModal()

    // No scrolling of the page behind the player.
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = "hidden"

    player.src = src
    // Autoplay can still be refused (e.g. slow import on iOS): the native
    // play button then starts it.
    player.play().catch(() => {})

    return () => {
      player.pause()
      player.removeAttribute("src")
      player.load()
      root.style.overflow = previousOverflow
      if (dialog.open) dialog.close()
    }
  }, [src])

  function retry() {
    const player = videoRef.current!
    setStatus("loading")
    player.src = src
    player.load()
    player.play().catch(() => {})
  }

  function close() {
    // Release the native modal's inert state before the launcher restores
    // focus. Focusing a card while showModal() is still active is ignored.
    dialogRef.current?.close()
    onClose()
  }

  const ratio = video.width / video.height
  const maxWidth = ratio >= 1 ? "72rem" : "30rem"

  return (
    <dialog
      ref={dialogRef}
      data-theme="dark"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault()
        close()
      }}
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 text-white backdrop:bg-black/90"
    >
      <div
        className="flex h-full w-full items-center justify-center p-3 sm:p-6"
        onClick={(e) => {
          // A click on the dark area around the player closes it.
          if (e.target === e.currentTarget) close()
        }}
      >
        <div style={{ width: `min(100%, calc((100svh - 6.5rem) * ${ratio}), ${maxWidth})` }}>
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 id={titleId} className="min-w-0 truncate text-base font-bold sm:text-lg">
              {video.title}
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label={labels.close}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black" style={{ aspectRatio: `${video.width} / ${video.height}` }}>
            <video
              ref={videoRef}
              controls
              playsInline
              preload="metadata"
              onCanPlay={() => setStatus("ready")}
              onPlaying={() => setStatus("ready")}
              onError={() => setStatus("error")}
              className="absolute inset-0 h-full w-full bg-black object-contain"
            />

            {status === "loading" && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <Loader2 aria-hidden="true" className="h-10 w-10 animate-spin text-white/80 motion-reduce:animate-none" />
              </div>
            )}

            {status === "error" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/85 p-6 text-center">
                <p className="max-w-sm text-sm text-zinc-200 sm:text-base">{labels.error}</p>
                <button
                  type="button"
                  onClick={retry}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 font-bold text-black hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <RotateCcw aria-hidden="true" className="h-4 w-4" />
                  {labels.retry}
                </button>
              </div>
            )}
          </div>
          <p role="status" className="sr-only">
            {status === "loading" ? labels.loading : status === "error" ? labels.error : ""}
          </p>
        </div>
      </div>
    </dialog>
  )
}
