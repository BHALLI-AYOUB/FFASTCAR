import { setRequestLocale } from "next-intl/server"

import type { Locale } from "@/i18n/config"
import { buildMetadata } from "@/lib/seo"
import { getPublicContent, getSiteContent } from "@/lib/content"
import { SiteShell } from "@/components/site-shell"
import { HeroSection } from "@/components/hero-section"
import { BrandsSection } from "@/components/brands-section"
import { AboutSection } from "@/components/about-section"
import { FeaturesSection } from "@/components/features-section"
import { FleetSection } from "@/components/fleet-section"
import { ProcessSection } from "@/components/process-section"
import { VideoSection } from "@/components/video-section"
import { ContactSection } from "@/components/contact-section"

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return buildMetadata({ locale, page: "home", path: "/" })
}

export default async function Home({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const [{ vehicles: visible, contact }, { videos }] = await Promise.all([getPublicContent(), getSiteContent()])
  // Background films of the hero: the visible videos, in the admin's order.
  const heroVideos = videos.filter((v) => !v.hidden)
  const brands = [...new Set(visible.map((v) => v.brand))]

  return (
    <SiteShell>
      <HeroSection vehicles={visible} contact={contact} videos={heroVideos} />
      <BrandsSection brands={brands} />
      <AboutSection vehicles={visible} city={contact.city[locale]} />
      <FeaturesSection />
      <FleetSection />
      <VideoSection />
      <ProcessSection />
      <ContactSection contact={contact} />
    </SiteShell>
  )
}
