import { getLocale, getTranslations } from "next-intl/server"
import { ChevronLeft, MessageCircle, Phone } from "lucide-react"

import type { Locale } from "@/i18n/config"
import { Link } from "@/i18n/navigation"
import { contactLinks } from "@/lib/site"
import type { ContactInfo, VehicleRecord } from "@/lib/content/types"
import { CarImage } from "@/components/car-image"
import { VehiclePrice } from "@/components/vehicle-price"
import { VehicleBookingPanel } from "@/components/vehicle-booking-panel"
import { VehicleCard } from "@/components/fleet-section"

/** Pick three other vehicles close in price, for internal linking. */
function similarVehicles(others: VehicleRecord[], priceMad: number) {
  return [...others]
    .sort((a, b) => Math.abs(a.priceMad - priceMad) - Math.abs(b.priceMad - priceMad))
    .slice(0, 3)
}

export async function VehicleDetail({
  vehicle,
  others,
  contact,
}: {
  vehicle: VehicleRecord
  /** Other published vehicles, for the "other vehicles" links. */
  others: VehicleRecord[]
  contact: ContactInfo
}) {
  const links = contactLinks(contact)
  const locale = (await getLocale()) as Locale
  const t = await getTranslations("vehicle")
  const tc = await getTranslations("common")
  const tn = await getTranslations("navigation")
  const tb = await getTranslations("booking")

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-24 pb-12 sm:px-6 lg:px-8 lg:pt-32">
        <nav aria-label={t("breadcrumb")} className="mb-6 text-sm text-zinc-400">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-white">
                {tn("home")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/fleet" className="hover:text-white">
                {tn("fleet")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-zinc-200">
              {vehicle.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-zinc-900">
            <CarImage
              image={vehicle.image}
              alt={vehicle.name}
              sizes="(min-width: 1024px) 600px, 100vw"
              priority
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          {vehicle.gallery.length > 0 && (
            <ul aria-label={t("gallery")} className="grid grid-cols-3 gap-3 lg:col-start-1">
              {vehicle.gallery.map((photo, i) => (
                <li key={photo.src} className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900">
                  <CarImage
                    image={photo}
                    alt={t("galleryPhoto", { name: vehicle.name, n: i + 2 })}
                    sizes="(min-width: 1024px) 200px, 33vw"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-col">
            <p className="mb-3 text-xs font-bold tracking-[0.22em] text-zinc-400 uppercase">{vehicle.category[locale]}</p>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">{vehicle.name}</h1>
            <p className="mt-4 text-lg leading-relaxed text-zinc-300">{t("intro", { name: vehicle.name, year: vehicle.year })}</p>

            <dl className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div>
                <dt className="text-sm text-zinc-400">{t("category")}</dt>
                <dd className="font-bold text-white">{vehicle.category[locale]}</dd>
              </div>
              <div>
                <dt className="text-sm text-zinc-400">{t("year")}</dt>
                <dd className="font-bold text-white">{vehicle.year}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm text-zinc-400">{t("features")}</dt>
                <dd>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {vehicle.features[locale].map((f) => (
                      <li key={f} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-200">
                        {f}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div className="col-span-2 border-t border-white/10 pt-4">
                <dt className="mb-1 text-sm text-zinc-400">{t("dailyRate")}</dt>
                <dd>
                  <VehiclePrice priceMad={vehicle.priceMad} size="lg" />
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="#booking"
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-brand-red px-6 font-bold text-white transition-colors hover:bg-brand-red-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-ring focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {tc("book")}
              </a>
              <a
                href={links.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-6 font-bold text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <MessageCircle aria-hidden="true" className="h-5 w-5" />
                {tc("whatsapp")}
                <span className="sr-only">{tc("opensInNewTab")}</span>
              </a>
              <a
                href={links.tel}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-6 font-bold text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Phone aria-hidden="true" className="h-5 w-5" />
                {tc("call")}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="booking" aria-labelledby="booking-title" className="scroll-mt-24 border-t border-white/10 bg-zinc-950 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h2 id="booking-title" className="text-3xl font-black text-white">
            {t("bookTitle")}
          </h2>
          <p className="mt-2 mb-8 text-zinc-300">{tb("intro")}</p>
          <VehicleBookingPanel slug={vehicle.slug} />
        </div>
      </section>

      <section aria-labelledby="other-title" className="mx-auto max-w-7xl px-3 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 px-1">
          <h2 id="other-title" className="text-2xl font-black text-white sm:text-3xl">
            {t("otherVehicles")}
          </h2>
          <Link href="/fleet" className="inline-flex min-h-11 items-center gap-1 font-semibold text-zinc-300 hover:text-white">
            <ChevronLeft aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
            {tc("backToFleet")}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {similarVehicles(others, vehicle.priceMad).map((v) => (
            <VehicleCard key={v.slug} vehicle={v} />
          ))}
        </div>
      </section>
    </>
  )
}
