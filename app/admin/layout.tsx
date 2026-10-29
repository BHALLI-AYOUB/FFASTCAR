import type React from "react"
import type { Metadata } from "next"

import "../globals.css"

// The admin lives outside app/[locale]: French only, none of the public
// providers, fonts or analytics, and its JavaScript never ships to visitors.
export const metadata: Metadata = {
  title: "Administration — AB FAST CAR",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased [font-family:ui-sans-serif,system-ui,'Segoe_UI',Roboto,Arial,sans-serif]">
        {children}
      </body>
    </html>
  )
}
