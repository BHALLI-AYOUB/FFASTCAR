import { useTranslations } from "next-intl"
import { Car, Clock, MapPin, Sparkles, UserCheck } from "lucide-react"

import { SectionHeading } from "@/components/section-heading"

/** Icons of the services, in order; extra services added in the admin get the last one. */
const FEATURE_ICONS = [UserCheck, MapPin, Car, Clock, Sparkles]

/** "Nos services": numbered cards; texts come from the admin (features namespace). */
export function FeaturesSection() {
  const t = useTranslations("features")
  const features = t.raw("features") as { title: string; description: string }[]

  return (
    <section id="services" aria-labelledby="services-title" className="relative scroll-mt-20 overflow-hidden border-y border-white/10 bg-zinc-950 py-16 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="services-title" title={t("title")} subtitle={t("subtitle")} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {features.map((feature, index) => {
            const Icon = FEATURE_ICONS[Math.min(index, FEATURE_ICONS.length - 1)]
            return (
              <li
                key={feature.title}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-black p-6 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-white/30 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7"
              >
                {/* Large index in the corner, decorative. */}
                <span
                  aria-hidden="true"
                  className="font-display pointer-events-none absolute -end-2 -top-4 text-8xl font-black text-white/[0.04] transition-colors group-hover:text-white/[0.08]"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="relative mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-white transition-colors group-hover:bg-white group-hover:text-black">
                  <Icon aria-hidden="true" className="h-7 w-7" strokeWidth={1.6} />
                </span>
                <h3 className="relative text-xl font-black text-white">{feature.title}</h3>
                <p className="relative mt-2 leading-relaxed text-zinc-400">{feature.description}</p>
                <span aria-hidden="true" className="relative mt-auto block pt-6">
                  <span className="block h-px w-10 bg-white/20 transition-all duration-300 group-hover:w-16 group-hover:bg-white/60" />
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
