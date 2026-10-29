import { useTranslations } from "next-intl"
import { CalendarCheck, KeyRound, Search, ThumbsUp } from "lucide-react"

import { BookButton } from "@/components/book-button"
import { SectionHeading } from "@/components/section-heading"

const STEP_ICONS = [Search, CalendarCheck, KeyRound, ThumbsUp]

/**
 * "Comment réserver": the steps as a timeline — horizontal on desktop (one
 * line through the numbered circles), vertical on phones (line on the start
 * side). Ends with the booking call to action.
 */
export function ProcessSection() {
  const t = useTranslations("process")
  const steps = t.raw("steps") as { title: string; description: string }[]

  return (
    <section id="process" aria-labelledby="process-title" className="relative scroll-mt-20 overflow-hidden border-y border-white/10 bg-zinc-950 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="process-title" title={t("title")} subtitle={t("subtitle")} />

        <ol className="relative mx-auto grid max-w-md gap-10 lg:max-w-none lg:grid-cols-4 lg:gap-8">
          {/* The connecting line: vertical through the circles on phones,
              horizontal between the first and last circle on desktop. */}
          <span
            aria-hidden="true"
            className="absolute start-7 top-7 bottom-7 w-px bg-gradient-to-b from-white/40 via-white/20 to-white/5 lg:start-[12.5%] lg:end-[12.5%] lg:top-7 lg:bottom-auto lg:h-px lg:w-auto lg:bg-gradient-to-r rtl:lg:bg-gradient-to-l"
          />
          {steps.map((step, index) => {
            const Icon = STEP_ICONS[Math.min(index, STEP_ICONS.length - 1)]
            const last = index === steps.length - 1
            return (
              <li key={step.title} className="group relative flex gap-5 lg:flex-col lg:items-center lg:gap-0 lg:text-center">
                <span
                  className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    last ? "border-white bg-white text-black" : "border-white/30 bg-zinc-950 text-white group-hover:border-white"
                  }`}
                >
                  <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.75} />
                  <span
                    aria-hidden="true"
                    className="absolute -end-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full border border-white/20 bg-black px-1 text-[11px] font-black text-white"
                  >
                    {index + 1}
                  </span>
                </span>
                <div className="pt-1 lg:mt-6 lg:max-w-[16rem] lg:pt-0">
                  <h3 className="text-lg font-black text-white sm:text-xl">
                    <span className="sr-only">{index + 1}. </span>
                    {step.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-zinc-400">{step.description}</p>
                </div>
              </li>
            )
          })}
        </ol>

        <div className="mt-14 flex justify-center">
          <BookButton className="min-h-12 px-8 text-base">
            <CalendarCheck aria-hidden="true" className="h-5 w-5" />
            {t("cta")}
          </BookButton>
        </div>
      </div>
    </section>
  )
}
