import { useTranslations } from "next-intl"
import { Car, Clock, LayoutGrid, MapPin, Shield, Sparkles } from "lucide-react"

import type { VehicleRecord } from "@/lib/content/types"
import { CarImage } from "@/components/car-image"

/** Icons of the values, in order; extra values added in the admin get the last one. */
const VALUE_ICONS = [Shield, LayoutGrid, Clock, Car, Sparkles]

/**
 * "À propos": the story on one side, two fleet photos on the other, then the
 * values. Texts come from the admin (about namespace); the photos are the
 * first two visible vehicles.
 */
export function AboutSection({ vehicles = [], city }: { vehicles?: VehicleRecord[]; city?: string }) {
  const t = useTranslations("about")
  const values = t.raw("values") as { title: string; description: string }[]
  const [main, second] = vehicles

  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-20 overflow-hidden bg-black py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Story */}
          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.22em] text-zinc-400 uppercase">{t("subtitle")}</p>
            <h2 id="about-title" className="font-display text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
              {t("title")}
            </h2>
            <p className="mt-4 text-lg font-semibold text-zinc-200 sm:text-xl">{t("tagline")}</p>
            <p className="mt-6 text-base leading-relaxed text-zinc-300 sm:text-lg">{t("description")}</p>

            <figure className="mt-8 border-s-2 border-white/80 ps-5 sm:ps-6">
              <h3 className="text-xs font-bold tracking-[0.22em] text-zinc-400 uppercase">{t("mission")}</h3>
              <blockquote className="font-serif mt-2 text-xl leading-snug text-white italic sm:text-2xl">{t("missionText")}</blockquote>
            </figure>
          </div>

          {/* Photos */}
          {main && (
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div data-theme="dark" className="relative ms-auto aspect-[4/5] w-[82%] overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl shadow-black/50">
                <CarImage image={main.image} alt={main.name} sizes="(min-width: 1024px) 480px, 80vw" className="absolute inset-0 h-full w-full object-cover" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              {second && (
                <div className="absolute start-0 bottom-[-6%] aspect-[4/5] w-[46%] overflow-hidden rounded-2xl border-4 border-black bg-zinc-900 shadow-2xl shadow-black/60">
                  <CarImage image={second.image} alt={second.name} sizes="(min-width: 1024px) 260px, 45vw" className="absolute inset-0 h-full w-full object-cover" />
                </div>
              )}
              {city && (
                <p data-theme="dark" className="absolute end-[4%] top-[6%] inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-4 py-2 text-sm font-bold text-white">
                  <MapPin aria-hidden="true" className="h-4 w-4" />
                  {city}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Values */}
        <ul className="mt-20 grid gap-4 sm:mt-24 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {values.map((value, index) => {
            const Icon = VALUE_ICONS[Math.min(index, VALUE_ICONS.length - 1)]
            return (
              <li
                key={value.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-white/30 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black">
                    <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <span aria-hidden="true" className="font-display text-3xl font-black text-white/10 transition-colors group-hover:text-white/25">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">{value.title}</h3>
                <p className="mt-2 leading-relaxed text-zinc-400">{value.description}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
