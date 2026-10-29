import { useLocale, useTranslations } from "next-intl"
import { getTranslations } from "next-intl/server"
import { CalendarCheck } from "lucide-react"

import type { Locale } from "@/i18n/config"
import { Link } from "@/i18n/navigation"
import type { VehicleRecord } from "@/lib/content/types"
import { getVisibleVehicles } from "@/lib/content"
import { CarImage } from "@/components/car-image"
import { BookButton } from "@/components/book-button"
import { SectionHeading } from "@/components/section-heading"
import { VehiclePrice } from "@/components/vehicle-price"

export function VehicleCard({
  vehicle,
  headingLevel = "h3",
  priority = false,
}: {
  vehicle: VehicleRecord
  headingLevel?: "h2" | "h3"
  /** The card's photo is above the fold (first row of the /fleet page). */
  priority?: boolean
}) {
  const locale = useLocale() as Locale
  const t = useTranslations("common")
  const Heading = headingLevel
  const href = `/fleet/${vehicle.slug}`

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 transition-colors hover:border-white/30 sm:rounded-3xl">
      <div data-theme="dark" className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
        <CarImage
          image={vehicle.image}
          alt={vehicle.name}
          sizes="(min-width: 1280px) 400px, (min-width: 640px) 45vw, 50vw"
          priority={priority}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <span className="absolute start-2.5 top-2.5 rounded-full border border-white/20 bg-black/75 px-2 py-1 text-[10px] font-bold text-white sm:start-4 sm:top-4 sm:px-3 sm:text-xs">
          {vehicle.year}
        </span>
        <span className="absolute end-2.5 top-2.5 max-w-[60%] truncate rounded-full bg-white px-2 py-1 text-[9px] font-black tracking-wide text-black uppercase sm:end-4 sm:top-4 sm:px-3 sm:text-[10px]">
          {vehicle.category[locale]}
        </span>
        <Heading className="absolute inset-x-3 bottom-3 text-sm leading-tight font-black text-white drop-shadow-lg sm:inset-x-5 sm:bottom-5 sm:text-xl md:text-2xl">
          {/* The stretched link makes the whole photo open the vehicle page. */}
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-white focus-visible:after:ring-inset">
            {vehicle.name}
          </Link>
        </Heading>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <ul className="mb-3 flex flex-wrap gap-1 sm:mb-5 sm:gap-2">
          {vehicle.features[locale].map((feature) => (
            <li
              key={feature}
              className="rounded-md border border-white/10 bg-white/5 px-1.5 py-1 text-[10px] font-medium text-zinc-300 sm:rounded-lg sm:px-3 sm:text-xs"
            >
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-3 sm:flex-row sm:items-end sm:justify-between sm:pt-5">
          <VehiclePrice priceMad={vehicle.priceMad} />
          <BookButton vehicleSlug={vehicle.slug} className="relative z-10 min-h-11 px-4 text-xs sm:px-5 sm:text-sm">
            <CalendarCheck aria-hidden="true" className="h-4 w-4" />
            {t("book")}
            <span className="sr-only">{vehicle.name}</span>
          </BookButton>
        </div>
      </div>
    </article>
  )
}

/**
 * Server component: the cards ship as HTML. Only the price (currency
 * choice) and the "Réserver" button inside each card are client islands.
 */
export async function FleetSection({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const [t, vehicles] = await Promise.all([getTranslations("fleet"), getVisibleVehicles()])

  return (
    <section id="fleet" aria-labelledby="fleet-title" className="relative scroll-mt-20 bg-black py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <SectionHeading
          id="fleet-title"
          as={headingLevel}
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle", { count: vehicles.length })}
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3 xl:gap-8">
          {vehicles.map((vehicle, i) => (
            <VehicleCard
              key={vehicle.slug}
              vehicle={vehicle}
              headingLevel={headingLevel === "h1" ? "h2" : "h3"}
              // On /fleet the first row is the LCP; on the home page it is far below the fold.
              priority={headingLevel === "h1" && i < 2}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
