// Fonts loaded by app/[locale]/layout.tsx. next/font self-hosts them (no
// request to Google at runtime) and generates size-matched fallbacks so the
// swap does not shift the layout. The family names are wired to the page in
// app/perf.css.
import { Cairo, Inter, Montserrat, Playfair_Display } from "next/font/google"

/** Body text. */
export const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })

/** Headings, including the hero H1 — preloaded because the H1 is above the fold. */
export const display = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
})

/** Italic accent line under the hero title. Not preloaded: it is never the LCP. */
export const serif = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400"],
  variable: "--font-playfair",
  display: "swap",
  preload: false,
})

/**
 * Arabic pages (html[dir=rtl]). Not preloaded so the other languages never
 * download it; the browser fetches it only when Arabic glyphs are rendered.
 */
export const arabic = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
  display: "swap",
  preload: false,
})

/** Class names to put on <body>. */
export const fontVariables = [sans.variable, display.variable, serif.variable, arabic.variable].join(" ")
