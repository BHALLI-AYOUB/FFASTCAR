import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Chatbot } from "@/components/chatbot"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
  title: "AB FAST CAR - Location Voiture de Luxe Rabat | Luxury Car Rental Morocco",
  description:
    "Location de voitures de luxe à Rabat, Maroc. Service 24/7, livraison nationale. Mercedes, BMW, Audi, Range Rover et plus. Premium luxury car rental in Rabat, Morocco with exceptional service.",
  keywords: [
    "location voiture luxe rabat",
    "luxury car rental morocco",
    "location mercedes rabat",
    "location bmw maroc",
    "voiture de luxe rabat",
    "car rental rabat",
    "ab fast car",
  ],
  authors: [{ name: "AB FAST CAR" }],
  creator: "AB FAST CAR",
  publisher: "AB FAST CAR",
  openGraph: {
    type: "website",
    locale: "fr_MA",
    alternateLocale: "en_US",
    url: "https://abfastcar.com",
    title: "AB FAST CAR - Location Voiture de Luxe Rabat",
    description: "Service premium de location de voitures de luxe à Rabat. Mercedes, BMW, Audi et plus.",
    siteName: "AB FAST CAR",
  },
  twitter: {
    card: "summary_large_image",
    title: "AB FAST CAR - Location Voiture de Luxe",
    description: "Service premium de location de voitures de luxe à Rabat",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="canonical" href="https://abfastcar.com" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
        <Analytics />
        {/* Chatbot global - visible sur toutes les pages */}
      
      </body>
    </html>
  )
}
