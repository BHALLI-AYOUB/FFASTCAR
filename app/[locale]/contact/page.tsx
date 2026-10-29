import { getTranslations, setRequestLocale } from "next-intl/server"

import type { Locale } from "@/i18n/config"
import { buildMetadata } from "@/lib/seo"
import { getPublicContent } from "@/lib/content"
import { SiteShell } from "@/components/site-shell"
import { ContactSection } from "@/components/contact-section"
import { JsonLd, breadcrumbSchema } from "@/components/structured-data"

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return buildMetadata({ locale, page: "contact", path: "/contact" })
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, { contact }] = await Promise.all([getTranslations("navigation"), getPublicContent()])

  return (
    <SiteShell>
      <div className="pt-20">
        <ContactSection contact={contact} headingLevel="h1" />
      </div>
      <JsonLd
        data={breadcrumbSchema(locale, [
          { name: t("home"), path: "/" },
          { name: t("contact"), path: "/contact" },
        ])}
      />
    </SiteShell>
  )
}
