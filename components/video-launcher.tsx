"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"

/**
 * Opens the video player. The player (components/video-player-dialog.tsx) is
 * a separate module imported on first intent (hover, focus, touch) or click,
 * so neither its code nor any video file is part of the page load.
 */

export type PlayableVideo = {
  id: string
  title: string
  src: string
  srcSmall?: string
  width: number
  height: number
}

export type PlayerLabels = { close: string; loading: string; error: string; retry: string }

/**
 * Window event fired when the player with sound opens (detail: true) or
 * closes (false), so the muted card previews pause meanwhile.
 */
export const PLAYER_EVENT = "abfc-player"

type PlayerModule = typeof import("@/components/video-player-dialog")

let playerModule: Promise<PlayerModule> | null = null
function loadPlayer(): Promise<PlayerModule> {
  playerModule ??= import("@/components/video-player-dialog")
  return playerModule
}

type Open = { video: PlayableVideo; trigger: HTMLElement; Dialog: PlayerModule["VideoPlayerDialog"] }

const LauncherContext = createContext<((video: PlayableVideo, trigger: HTMLElement) => void) | null>(null)

/** Holds the one video that is open: opening another replaces it. */
export function VideoPlayerProvider({ labels, children }: { labels: PlayerLabels; children: React.ReactNode }) {
  const [open, setOpen] = useState<Open | null>(null)
  const [failed, setFailed] = useState<{ video: PlayableVideo; trigger: HTMLElement } | null>(null)
  const [loading, setLoading] = useState(false)
  const pending = useRef(0)

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(PLAYER_EVENT, { detail: open !== null }))
  }, [open])

  const play = useCallback((video: PlayableVideo, trigger: HTMLElement) => {
    const request = ++pending.current
    setFailed(null)
    setLoading(true)
    void loadPlayer().then(
      ({ VideoPlayerDialog }) => {
        // Ignore a slow import if another card was clicked meanwhile.
        if (request === pending.current) {
          setLoading(false)
          setOpen({ video, trigger, Dialog: VideoPlayerDialog })
        }
      },
      () => {
        playerModule = null // network error: allow a new attempt on the next click
        if (request === pending.current) {
          setLoading(false)
          setFailed({ video, trigger })
        }
      },
    )
  }, [])

  return (
    <LauncherContext.Provider value={play}>
      {children}
      <p role="status" className="sr-only">{loading ? labels.loading : ""}</p>
      {failed && (
        <div role="alert" className="mt-6 text-center text-sm text-zinc-200">
          <p>{labels.error}</p>
          <button type="button" onClick={() => play(failed.video, failed.trigger)} className="mt-3 min-h-11 rounded-full border border-white/30 px-5 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            {labels.retry}
          </button>
        </div>
      )}
      {open && (
        <open.Dialog
          key={open.video.id}
          video={open.video}
          labels={labels}
          onClose={() => {
            const trigger = open.trigger
            setOpen(null)
            requestAnimationFrame(() => trigger.focus({ preventScroll: true }))
          }}
        />
      )}
    </LauncherContext.Provider>
  )
}

export function VideoPlayButton({
  video,
  label,
  className,
  children,
}: {
  video: PlayableVideo
  label: string
  className?: string
  children: React.ReactNode
}) {
  const play = useContext(LauncherContext)
  const preload = () => void loadPlayer().catch(() => (playerModule = null))

  return (
    <button
      type="button"
      aria-label={label}
      aria-haspopup="dialog"
      className={className}
      onPointerEnter={preload}
      onFocus={preload}
      onTouchStart={preload}
      onClick={(e) => play?.(video, e.currentTarget)}
    >
      {children}
    </button>
  )
}
