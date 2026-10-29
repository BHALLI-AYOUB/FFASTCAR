"use client"

import { useEffect, useRef, useState } from "react"
import { Pause, Play } from "lucide-react"

export type HeroClip = {
  id: string
  src: string
  /** Lighter MP4, picked by the browser on small screens. */
  srcSmall?: string
  poster: string
  width: number
  height: number
  /** Aspect of the picture without baked-in black bars (see VideoRecord). */
  pictureAspect?: number
  title: string
  caption: string
}

/**
 * A clip fills the hero when its picture is at most this much wider or
 * narrower than the hero; beyond, filling would crop most of it and blow up
 * the pixels, so it is shown whole (sharp) over its own dimmed cover.
 */
const MAX_FILL_STRETCH = 2

/**
 * Muted background films of the hero, played one after the other in the
 * admin's order (Ayoub's choice: background video, two clips alternating).
 *
 * - No autoplay attribute and preload="none": nothing is downloaded before
 *   the page is interactive; playback then starts from code.
 * - The browser picks ONE source per clip: the lighter one on small screens.
 * - Each clip is framed for the hero's shape with CSS container queries
 *   (right from the first paint, no layout shift): it fills the hero when
 *   the shapes are close (the wide film on a computer, the vertical clip on
 *   a phone), and is shown whole and sharp otherwise. Baked-in cinema bars
 *   are pushed out of the frame using `pictureAspect`.
 * - Stays on the first cover for visitors who ask for reduced motion or data
 *   saving, and can be paused at any time (moving content > 5 s).
 * - Always muted: the versions with sound are in the videos section.
 */
export function HeroVideo({ clips, pauseLabel, playLabel }: { clips: HeroClip[]; pauseLabel: string; playLabel: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  /** Off for reduced motion / data saving, or once the visitor pressed pause. */
  const autoplay = useRef(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    autoplay.current = !reducedMotion && !saveData
  }, [])

  // Start each clip (the first one after hydration, the next ones on `ended`).
  useEffect(() => {
    if (autoplay.current) videoRef.current?.play().catch(() => setPlaying(false))
  }, [index])

  function toggle() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      autoplay.current = true
      video.play().catch(() => setPlaying(false))
    } else {
      autoplay.current = false
      video.pause()
    }
  }

  const clip = clips[index]
  const frameAspect = clip.width / clip.height
  const picture = clip.pictureAspect ?? frameAspect
  // Width of the picture: covering the hero (fill) or fitting inside it;
  // the <video> frame is wider than the picture when bars are on its sides.
  const width = (fn: "max" | "min") => {
    const pictureWidth = `${fn}(100cqw, ${(picture * 100).toFixed(2)}cqh)`
    return picture < frameAspect ? `calc(${pictureWidth} * ${(frameAspect / picture).toFixed(4)})` : pictureWidth
  }
  const ratio = (n: number) => `${n.toFixed(4)}/1`
  // Clip the baked-in bars off the frame (visible when the clip is shown whole).
  const barsY = picture > frameAspect ? (((1 - frameAspect / picture) / 2) * 100).toFixed(2) : "0"
  const barsX = picture < frameAspect ? (((1 - picture / frameAspect) / 2) * 100).toFixed(2) : "0"
  const css = `
    .hv-video-${clip.id} { width: ${width("max")}; }
    .hv-cover-${clip.id} { display: none; }
    @container (max-aspect-ratio: ${ratio(picture / MAX_FILL_STRETCH)}) or (min-aspect-ratio: ${ratio(picture * MAX_FILL_STRETCH)}) {
      .hv-video-${clip.id} { width: ${width("min")}; }
      .hv-cover-${clip.id} { display: block; }
    }`

  return (
    <>
      <style>{css}</style>
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden [container-type:size]">
        {/* Behind a clip shown whole: its own cover, enlarged and dimmed (no
            CSS blur filter: too costly to composite on low-end phones). */}
        <img src={clip.poster} alt="" loading="lazy" className={`hv-cover-${clip.id} absolute inset-0 h-full w-full scale-110 object-cover opacity-30`} />
        <video
          key={clip.id}
          ref={videoRef}
          muted
          playsInline
          loop={clips.length === 1}
          preload="none"
          poster={clip.poster}
          tabIndex={-1}
          disablePictureInPicture
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setIndex((i) => (i + 1) % clips.length)}
          style={{ aspectRatio: `${clip.width} / ${clip.height}`, clipPath: `inset(${barsY}% ${barsX}%)` }}
          className={`hv-video-${clip.id} absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2`}
        >
          {clip.srcSmall && <source src={clip.srcSmall} type="video/mp4" media="(max-width: 767px)" />}
          <source src={clip.src} type="video/mp4" />
        </video>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-6 pb-4 sm:pb-6">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? pauseLabel : playLabel}
            className="pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4 translate-x-px fill-current" aria-hidden="true" />}
          </button>
          <p className="min-w-0 text-start text-xs text-zinc-300 sm:text-sm">
            <span className="font-bold text-white">{clip.title}</span>
            {clip.caption && <span className="hidden sm:inline"> · {clip.caption}</span>}
          </p>
          {clips.length > 1 && (
            <span aria-hidden="true" className="flex gap-1.5">
              {clips.map((c, i) => (
                <span key={c.id} className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-white" : "w-1.5 bg-white/40"}`} />
              ))}
            </span>
          )}
        </div>
      </div>
    </>
  )
}
