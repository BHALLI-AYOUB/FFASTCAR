import { getLocale, getTranslations } from "next-intl/server"
import { Play } from "lucide-react"

import type { Locale } from "@/i18n/config"
import { getSiteContent } from "@/lib/content"
import { BookButton } from "@/components/book-button"
import { SectionHeading } from "@/components/section-heading"
import { VideoPlayButton, VideoPlayerProvider } from "@/components/video-launcher"

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
              const title = video.title[locale as Locale]
              const caption = video.caption[locale as Locale]
              return (
                <li
                  key={video.id}
                  className="min-w-0 basis-full lg:basis-[calc(var(--ratio)*18rem)] lg:grow-[var(--ratio)]"
                  style={{ "--ratio": ratio, maxWidth: `calc(${ratio} * min(70svh, 34rem))` } as React.CSSProperties}
                >
                  <figure>
                    <div
                      data-theme="dark"
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 sm:rounded-3xl"
                      style={{ aspectRatio: ratio }}
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
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <VideoPlayButton
                        video={{ id: video.id, title, src: video.src, srcSmall: video.srcSmall, width: video.width, height: video.height }}
                        label={t("play", { title })}
                        className="absolute inset-0 flex items-center justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white"
                      >
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none sm:h-20 sm:w-20">
                          <Play aria-hidden="true" className="h-7 w-7 translate-x-0.5 fill-current rtl:-translate-x-0.5 rtl:-scale-x-100 sm:h-8 sm:w-8" />
                        </span>
                      </VideoPlayButton>
                    </div>
                    <figcaption className="mt-4 px-1">
                      <h3 className="text-lg font-black text-white sm:text-xl">{title}</h3>
                      {caption && <p className="mt-1 text-sm leading-relaxed text-zinc-400 sm:text-base">{caption}</p>}
                    </figcaption>
                  </figure>
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
