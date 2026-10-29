import { getLocale, getTranslations } from "next-intl/server"
import { Play } from "lucide-react"

import type { Locale } from "@/i18n/config"
import { getSiteContent } from "@/lib/content"
import { BookButton } from "@/components/book-button"
import { SectionHeading } from "@/components/section-heading"
import { VideoPlayButton, VideoPlayerProvider } from "@/components/video-launcher"
import { VideoPreview } from "@/components/video-preview"

/**
 * "L'univers AB FAST CAR": the client's videos, after the fleet and before
 * the booking steps.
 *
 * Server component: the cards are plain HTML (cover + caption). Nothing
 * video-related is downloaded before a click: no <video> element exists until
 * the player module is loaded by VideoPlayButton.
 *
 * Layout: the cards share one row on desktop with equal media heights (each
 * card grows in proportion to its aspect ratio), and stack on smaller
 * screens. A portrait card is capped in height (70svh / 34rem) so it never
 * dominates the page.
 */
export async function VideoSection() {
  const [t, locale, content] = await Promise.all([getTranslations("videos"), getLocale(), getSiteContent()])
  const videos = content.videos.filter((v) => !v.hidden)
  if (videos.length === 0) return null

  return (
    <section id="videos" aria-labelledby="videos-title" className="scroll-mt-20 border-t border-white/10 bg-black py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="videos-title" eyebrow={t("eyebrow")} title={t("title")} subtitle={t("intro")} />

        <VideoPlayerProvider labels={{ close: t("close"), loading: t("loading"), error: t("error"), retry: t("retry") }}>
          <ul className="flex flex-wrap justify-center gap-6 lg:flex-nowrap lg:gap-8">
            {videos.map((video) => {
              // The picture without baked-in black bars: the cover is cropped to it.
              const ratio = video.pictureAspect ?? video.width / video.height
              // Stacked cards (below lg) are full width: a very wide film would be a
              // thin strip, so it is cropped to 16:10 there.
              const stackedRatio = Math.min(ratio, 1.6)
              const title = video.title[locale as Locale]
              const caption = video.caption[locale as Locale]
              return (
                <li
                  key={video.id}
                  className="min-w-0 basis-full lg:basis-[calc(var(--ratio)*18rem)] lg:grow-[var(--ratio)]"
                  style={{ "--ratio": ratio, maxWidth: `calc(${ratio} * min(70svh, 34rem))` } as React.CSSProperties}
                >
                  {/* The card: cover, then a muted preview that plays while the card is
                      on screen; a click opens the player with sound. */}
                  <div
                    data-theme="dark"
                    className="group @container relative aspect-(--stacked-ratio) overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/40 ring-white/30 transition-shadow hover:ring-1 lg:aspect-(--ratio)"
                    style={{ "--stacked-ratio": stackedRatio } as React.CSSProperties}
                  >
                    <img
                      src={video.poster}
                      alt=""
                      width={video.width}
                      height={video.height}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <VideoPreview src={video.src} srcSmall={video.srcSmall} label={t("preview")} />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-6">
                      <h3 className="text-lg font-black text-white sm:text-2xl">{title}</h3>
                      {caption && <p className="mt-1 max-w-md text-sm leading-relaxed text-zinc-300">{caption}</p>}
                    </div>

                    <VideoPlayButton
                      video={{ id: video.id, title, src: video.src, srcSmall: video.srcSmall, width: video.width, height: video.height }}
                      label={t("play", { title })}
                      className="absolute inset-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white"
                    >
                      <span className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white/95 px-2 @[16rem]:px-4 text-sm font-bold text-black shadow-xl shadow-black/40 transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none sm:px-5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
                          <Play aria-hidden="true" className="h-4 w-4 translate-x-px fill-current rtl:-translate-x-px rtl:-scale-x-100" />
                        </span>
                        {/* Narrow (portrait) cards keep only the round play icon. */}
                        <span className="hidden pe-1 @[16rem]:inline">{t("watchWithSound")}</span>
                      </span>
                    </VideoPlayButton>
                  </div>
                </li>
              )
            })}
          </ul>
        </VideoPlayerProvider>

        <div className="mt-10 flex justify-center sm:mt-12">
          <BookButton className="inline-flex min-h-12 items-center justify-center rounded-full bg-red-600 px-7 text-base font-bold text-white transition-colors hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black">
            {t("cta")}
          </BookButton>
        </div>
      </div>
    </section>
  )
}
