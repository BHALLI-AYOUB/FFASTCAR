import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { locales, type Locale } from "@/i18n/config"
import { getSiteContent, getVehicle, getVisibleVehicles } from "@/lib/content"
import { buildMetadata } from "@/lib/seo"
import { SiteShell } from "@/components/site-shell"
import { VehicleDetail } from "@/components/vehicle-detail"
import { JsonLd, breadcrumbSchema, vehicleSchema } from "@/components/structured-data"

type Props = { params: Promise<{ locale: Locale; slug: string }> }

// Vehicles added in the admin get a page without a redeploy; unknown and
// hidden vehicles are a real 404.
export const dynamicParams = true

export async function generateStaticParams() {
  const vehicles = await getVisibleVehicles()
  return locales.flatMap((locale) => vehicles.map((v) => ({ locale, slug: v.slug })))
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const vehicle = await getVehicle(slug)
  if (!vehicle) return {}
  return buildMetadata({ locale, page: "vehicle", path: `/fleet/${slug}`, vehicle })
}

export default async function VehiclePage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const vehicle = await getVehicle(slug)
  if (!vehicle) notFound()
  const [t, content] = await Promise.all([getTranslations("navigation"), getSiteContent()])
  const others = content.vehicles.filter((v) => !v.hidden && v.slug !== vehicle.slug)

  return (
    <SiteShell>
      <VehicleDetail vehicle={vehicle} others={others} contact={content.contact} />
      <JsonLd data={vehicleSchema(locale, vehicle)} />
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: t("home"), path: "/" },
          { name: t("fleet"), path: "/fleet" },
          { name: vehicle.name, path: `/fleet/${vehicle.slug}` },
        ])}
      />
    </SiteShell>
  )
}
