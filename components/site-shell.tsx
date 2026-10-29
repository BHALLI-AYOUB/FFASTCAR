import type React from "react"
import { getTranslations } from "next-intl/server"

import { getPublicContent } from "@/lib/content"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { BookingProvider } from "@/components/booking-provider"
import { BookingDialog } from "@/components/booking-dialog"

/** Navigation, footer, booking dialog and contact shortcuts shared by every page. */
export async function SiteShell({ children }: { children: React.ReactNode }) {
  const [t, { contact }] = await Promise.all([getTranslations("common"), getPublicContent()])

  return (
    <BookingProvider>
      <div className="relative min-h-screen bg-background">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:font-bold focus:text-black"
        >
          {t("skipToContent")}
        </a>
        <Navigation />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer contact={contact} />
        <WhatsAppButton />
      </div>
      <BookingDialog />
    </BookingProvider>
  )
}
