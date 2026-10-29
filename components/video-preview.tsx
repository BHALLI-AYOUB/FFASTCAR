"use client"

import { useEffect, useRef, useState } from "react"
import { VolumeX } from "lucide-react"

import { PLAYER_EVENT } from "@/components/video-launcher"

/**
 * Muted looping preview inside a video card: it starts when the card is at
 * least half on screen and pauses when it leaves (or when the player with
 * sound opens). Nothing is downloaded before the card is first seen: the
 * <source> elements are only added then. Visitors who ask for reduced motion
 * or data saving keep the cover image.
 */
export function VideoPreview({ src, srcSmall, label }: { src: string; srcSmall?: string; label: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [armed, setArmed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const visible = useRef(false)
  const playerOpen = useRef(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    if (reducedMotion || saveData || !rootRef.current) return

    const sync = () => {
      const video = videoRef.current
      if (!video) return
      if (visible.current && !playerOpen.current) video.play().catch(() => {})
      else video.pause()
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting
        if (entry.isIntersecting) setArmed(true)
        sync()
      },
      { threshold: 0.5 },
    )
    observer.observe(rootRef.current)
    const onPlayer = (e: Event) => {
      playerOpen.current = (e as CustomEvent<boolean>).detail
      sync()
    }
    window.addEventListener(PLAYER_EVENT, onPlayer)
    return () => {
      observer.disconnect()
      window.removeEventListener(PLAYER_EVENT, onPlayer)
    }
  }, [])

  // Sources were just added: load them and start if still on screen.
  useEffect(() => {
    const video = videoRef.current
    if (!armed || !video) return
    video.load()
    if (visible.current && !playerOpen.current) video.play().catch(() => {})
  }, [armed])

  return (
    <div ref={rootRef} aria-hidden="true" className="absolute inset-0">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        tabIndex={-1}
        disablePictureInPicture
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget
          if (v.duration) setProgress(v.currentTime / v.duration)
        }}
        className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 group-hover:scale-[1.03] motion-reduce:transition-none ${
          playing ? "opacity-100" : "opacity-0"
        }`}
      >
        {armed && srcSmall && <source src={srcSmall} type="video/mp4" media="(max-width: 767px)" />}
        {armed && <source src={src} type="video/mp4" />}
      </video>

      {playing && (
        <>
          <span className="absolute start-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white sm:start-4 sm:top-4">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white motion-reduce:animate-none" />
            <VolumeX className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </span>
          <span className="absolute inset-x-0 bottom-0 z-10 h-0.5 bg-white/15">
            <span className="block h-full bg-white" style={{ width: `${(progress * 100).toFixed(1)}%` }} />
          </span>
        </>
      )}
    </div>
  )
}
