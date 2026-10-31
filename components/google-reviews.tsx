"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useLocale } from "next-intl"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { LOCALE_META, type Locale } from "@/i18n/config"
import type { CustomerReview } from "@/lib/customer-reviews"
import styles from "@/components/google-reviews.module.css"

type Labels = Record<"previous" | "next" | "carousel" | "ownerResponse" | "source" | "position", string>

function ReviewCard({ review, ownerResponseLabel }: { review: CustomerReview; ownerResponseLabel: string }) {
  const [avatarFailed, setAvatarFailed] = useState(false)
  const initials = review.authorName.trim().split(/\s+/).map(part => Array.from(part)[0]).slice(0, 2).join("")

  return (
    <article className={styles.card} data-review-id={review.id} aria-labelledby={`review-${review.id}`}>
      <header className={styles.author}>
        <span className={styles.avatar} aria-hidden="true">
          {review.avatarUrl && !avatarFailed ? (
            // Keep the supplied Google URL: no copied portrait or optimizer cache.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={review.avatarUrl} alt="" width={48} height={48} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setAvatarFailed(true)} />
          ) : <span>{initials}</span>}
        </span>
        <h3 id={`review-${review.id}`}><bdi translate="no">{review.authorName}</bdi></h3>
        <Quote aria-hidden="true" className={styles.quoteMark} size={25} strokeWidth={1.25} />
      </header>
      <blockquote className={`${styles.quote} ${review.text.length < 70 ? styles.shortQuote : ""}`}>
        <p dir={review.language === "ar" ? "rtl" : "ltr"} lang={review.language} translate="no">{review.text}</p>
      </blockquote>
      {review.ownerResponse && <details className={styles.ownerResponse}>
        <summary>{ownerResponseLabel}</summary>
        <p lang={review.ownerResponse.language} dir="ltr" translate="no">{review.ownerResponse.text}</p>
      </details>}
      <footer className={styles.cardFooter}>
        <span translate="no" className={styles.attribution}>Google Maps</span>
        <span aria-hidden="true" className={styles.signature} />
      </footer>
    </article>
  )
}

/** Reviews render in the initial HTML. JavaScript enhances navigation only. */
export function GoogleReviews({ reviews, labels }: { reviews: readonly CustomerReview[]; labels: Labels }) {
  const locale = useLocale() as Locale
  const { intlLocale, dir } = LOCALE_META[locale]
  const [position, setPosition] = useState({ index: 0, previous: false, next: false })
  const railRef = useRef<HTMLDivElement>(null)
  const railId = useId()
  const number = new Intl.NumberFormat(intlLocale)

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    let frame = 0
    const measure = () => {
      const cards = Array.from(rail.children) as HTMLElement[]
      const bounds = rail.getBoundingClientRect()
      const offsets = cards.map(card => {
        const rect = card.getBoundingClientRect()
        return dir === "rtl" ? bounds.right - rect.right : rect.left - bounds.left
      })
      const index = offsets.reduce((closest, offset, i) => Math.abs(offset) < Math.abs(offsets[closest]) ? i : closest, 0)
      const nextPosition = { index, previous: (offsets[0] ?? 0) < -3, next: cards.some(card => {
        const rect = card.getBoundingClientRect()
        return dir === "rtl" ? rect.left < bounds.left - 3 : rect.right > bounds.right + 3
      }) }
      setPosition(current => current.index === nextPosition.index && current.previous === nextPosition.previous && current.next === nextPosition.next ? current : nextPosition)
    }
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure) }
    const resize = new ResizeObserver(measure)
    resize.observe(rail)
    rail.addEventListener("scroll", onScroll, { passive: true })
    measure()
    return () => { resize.disconnect(); rail.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame) }
  }, [dir])

  function move(delta: number) {
    const rail = railRef.current
    if (!rail) return
    const target = rail.children[Math.max(0, Math.min(rail.children.length - 1, position.index + delta))] as HTMLElement | undefined
    if (!target) return
    const bounds = rail.getBoundingClientRect()
    const card = target.getBoundingClientRect()
    rail.scrollBy({ left: dir === "rtl" ? card.right - bounds.right : card.left - bounds.left,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })
  }

  return (
    <div className={styles.content}>
      <div id={railId} ref={railRef} className={styles.rail} role="region" aria-roledescription={labels.carousel} aria-label={labels.carousel} tabIndex={0}
        onKeyDown={event => {
          if (event.target !== event.currentTarget) return
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault()
            move((event.key === "ArrowRight" ? 1 : -1) * (dir === "rtl" ? -1 : 1))
          }
        }}>
        {reviews.map(review => <ReviewCard key={review.id} review={review} ownerResponseLabel={labels.ownerResponse} />)}
      </div>
      <div className={styles.carouselFooter}>
        <p className={styles.source}>{labels.source}</p>
        <div className={styles.controls}>
          <span className={styles.progress} aria-hidden="true">
            <span style={{ width: `${((position.index + 1) / reviews.length) * 100}%` }} />
          </span>
          <span className={styles.position} dir="ltr" aria-live="polite" aria-atomic="true">
            {labels.position.replace("{current}", number.format(position.index + 1)).replace("{total}", number.format(reviews.length))}
          </span>
          <button type="button" aria-label={labels.previous} aria-controls={railId} disabled={!position.previous} onClick={() => move(-1)}>{dir === "rtl" ? <ChevronRight /> : <ChevronLeft />}</button>
          <button type="button" aria-label={labels.next} aria-controls={railId} disabled={!position.next} onClick={() => move(1)}>{dir === "rtl" ? <ChevronLeft /> : <ChevronRight />}</button>
        </div>
      </div>
    </div>
  )
}
