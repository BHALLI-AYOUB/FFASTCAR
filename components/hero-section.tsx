import { useLocale, useTranslations } from "next-intl"
import { Instagram, Facebook, MessageCircle, Gauge, PlaneTakeoff, LayoutGrid, UserCheck, Headphones } from "lucide-react"

import type { Locale } from "@/i18n/config"
import { Link } from "@/i18n/navigation"
import type { ContactInfo, VehicleRecord, VideoRecord } from "@/lib/content/types"
import { contactLinks } from "@/lib/site"
import { carBlurSrc } from "@/components/car-image"
import { HeroVideo, type HeroClip } from "@/components/hero-video"

const FEATURE_ICONS = [Gauge, PlaneTakeoff, LayoutGrid, UserCheck, Headphones]

/**
 * Server component: the copy, calls to action and features ship as plain
 * HTML (visible on the first paint, no hydration), centred over the muted
 * background films (client island: components/hero-video.tsx).
 *
 * Without any visible video, the first vehicle's photo, blurred, is the
 * backdrop.
 */
export function HeroSection({
  vehicles,
  contact,
  videos,
}: {
  vehicles: VehicleRecord[]
  contact: ContactInfo
  /** Visible videos in the admin's order, played one after the other, muted. */
  videos: VideoRecord[]
}) {
  const t = useTranslations("hero")
  const locale = useLocale() as Locale
  const heroFeatures = t.raw("features") as { label: string; sub: string }[]
  const clips: HeroClip[] = videos.map((v) => ({
    id: v.id,
    src: v.src,
    srcSmall: v.srcSmall,
    poster: v.poster,
    width: v.width,
    height: v.height,
    pictureAspect: v.pictureAspect,
    title: v.title[locale],
    caption: v.caption[locale],
  }))
  const fallback = vehicles[0]?.image

  return (
    <>
      <style>{`
        .hero-slogan::before, .hero-slogan::after {
          content: ''; display: inline-block; width: 32px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6));
        }
        .hero-slogan::after { background: linear-gradient(90deg, rgba(255,255,255,0.6), transparent); }

        @keyframes labelIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .label-in { animation: labelIn 0.5s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .label-in { animation: none; }
        }

        .feat-card::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 110%, rgba(255,255,255,0.07) 0%, transparent 68%);
          opacity: 0; transition: opacity 0.4s ease;
        }
        .feat-card:hover::before { opacity: 1; }
        .feat-card:not(:last-child)::after {
          content: ''; position: absolute; inset-inline-end: 0; top: 22%; bottom: 22%; width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.12), transparent);
        }
        @media (max-width: 540px) {
          .feat-card:nth-child(2)::after, .feat-card:nth-child(4)::after { display: none; }
        }
      `}</style>

      {/* Copy over the films: stays dark in light mode (app/theme.css). */}
      <section
        id="home"
        data-theme="dark"
        className="relative flex min-h-[calc(100svh-4.5rem)] items-center overflow-hidden pt-24 pb-24 sm:pt-28 lg:min-h-screen lg:pt-32 lg:pb-28"
      >
        {/* ── Backdrop: the muted films, or the first car as a 24px preview.
            No CSS blur filter: a full-screen filter costs ~1 s of compositing
            on low-end/software-rendered devices. ── */}
        <div className="absolute inset-0 z-0 bg-black">
          {clips.length > 0 ? (
            <HeroVideo clips={clips} pauseLabel={t("videoPause")} playLabel={t("videoPlay")} />
          ) : (
            fallback?.blur && (
              <img
                src={carBlurSrc(fallback)}
                alt=""
                aria-hidden="true"
                width={24}
                height={30}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover opacity-40"
              />
            )
          )}
          {/* Light veil so the film stays clear; darker only behind the centred
              copy, and a fade into the strip below. */}
          <div aria-hidden="true" className="absolute inset-0 bg-black/25" />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_50%,rgba(0,0,0,0.6),rgba(0,0,0,0.2)_70%,transparent)]"
          />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-black" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center">
          <p className="hero-slogan font-display mb-6 flex items-center justify-center gap-3 text-[13px] font-bold uppercase tracking-[0.22em] text-zinc-200">
            {t("slogan")}
          </p>

          <h1 className="font-display text-5xl font-black leading-[0.95] tracking-tighter [text-shadow:0_2px_24px_rgba(0,0,0,0.45)] sm:text-6xl md:text-7xl xl:text-8xl">
            <span className="block text-white">{t("title1")}</span>
            <span className="mt-2 block text-zinc-300">{t("title2")}</span>
          </h1>

          <p className="font-serif mx-auto max-w-2xl pt-6 text-lg font-light italic text-zinc-200 md:text-xl">{t("subtitle")}</p>

          {/* CTAs: red is reserved for booking */}
          <div className="flex flex-col items-center justify-center gap-4 pt-8 sm:flex-row">
            <Link
              href="/fleet"
              className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-brand-red px-10 text-base font-black text-white shadow-lg shadow-black/40 transition-colors hover:bg-brand-red-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-red-ring sm:w-auto"
            >
              {t("cta")}
            </Link>
            <a
              href={contactLinks(contact).whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full border-2 border-white/50 bg-black/30 px-10 text-base font-bold text-white transition-colors hover:border-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              {t("whatsapp")}
            </a>
          </div>

          <div className="flex items-center justify-center gap-4 pt-8">
            <a
              href={contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Instagram className="h-5 w-5" aria-hidden="true" />
            </a>
            <a
              href={contact.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Facebook className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <div className="relative border-t border-white/10 bg-zinc-950">
        <ul className="mx-auto grid max-w-[1100px] grid-cols-2 px-4 sm:grid-cols-3 lg:grid-cols-5">
          {heroFeatures.map((f, i) => {
            const Icon = FEATURE_ICONS[i]
            return (
              <li key={i} className="feat-card group relative flex flex-col items-center gap-2.5 overflow-hidden px-3 pb-6 pt-7 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-zinc-300 transition-colors group-hover:border-white/40 group-hover:text-white">
                  {Icon && <Icon size={22} strokeWidth={1.6} aria-hidden="true" />}
                </span>
                <span className="font-display text-[12.5px] font-bold leading-tight text-white/85">{f.label}</span>
                <span className="text-[11px] font-medium leading-snug text-zinc-400">{f.sub}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
