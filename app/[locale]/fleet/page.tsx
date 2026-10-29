import { getTranslations, setRequestLocale } from "next-intl/server"

import type { Locale } from "@/i18n/config"
import { buildMetadata } from "@/lib/seo"
import { SiteShell } from "@/components/site-shell"
import { FleetSection } from "@/components/fleet-section"
import { JsonLd, breadcrumbSchema } from "@/components/structured-data"

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return buildMetadata({ locale, page: "fleet", path: "/fleet" })
}

export default async function FleetPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("navigation")

  return (
    <SiteShell>
      <div className="pt-20">
        <FleetSection headingLevel="h1" />
      </div>
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: t("home"), path: "/" },
          { name: t("fleet"), path: "/fleet" },
        ])}
      />
    </SiteShell>
  )
}
