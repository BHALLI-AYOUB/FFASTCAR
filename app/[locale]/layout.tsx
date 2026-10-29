import type React from "react"
import { notFound } from "next/navigation"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import type { AbstractIntlMessages } from "next-intl"
import { Analytics } from "@vercel/analytics/next"

import "../globals.css"
import "../perf.css"
import "../theme.css"
import { fontVariables } from "@/app/fonts"
import { LOCALE_META, type Locale } from "@/i18n/config"
import { routing } from "@/i18n/routing"
import { CurrencyProvider } from "@/components/locale-provider"
import { ContentProvider } from "@/components/content-provider"
import { getPublicContent } from "@/lib/content"
import { toClientContent } from "@/lib/client-content"
import { JsonLd, businessSchema } from "@/components/structured-data"
import { THEME_STORAGE_KEY } from "@/lib/theme"

/**
 * Message namespaces used by client components (navigation, language and
 * currency switcher, booking dialog/form, prices). Server
 * components read their texts on the server, so the rest of the catalogue
 * (about, FAQ, meta…) is not shipped to the browser.
 */
const CLIENT_NAMESPACES = ["common", "navigation", "switcher", "booking"] as const

/**
 * Applies a saved light theme before the first paint (no dark flash); dark
 * is the default and needs nothing. Runs before React, hence plain JS.
 */
const THEME_SCRIPT = `try{if(localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})==="light")document.documentElement.dataset.theme="light"}catch(e){}`

function pickMessages(messages: AbstractIntlMessages): AbstractIntlMessages {
  return Object.fromEntries(CLIENT_NAMESPACES.filter((ns) => ns in messages).map((ns) => [ns, messages[ns]]))
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const meta = LOCALE_META[locale as Locale]
  const [messages, content] = await Promise.all([getMessages(), getPublicContent()])

  return (
    // The next/font variables go on <html>: app/perf.css derives --font-sans,
    // --font-display and the Arabic stack from them on :root, so they must
    // exist there (on <body> the derived variables were invalid and Arabic
    // text fell back to Times New Roman).
    // suppressHydrationWarning: THEME_SCRIPT may set data-theme before React hydrates.
    <html lang={meta.htmlLang} dir={meta.dir} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={pickMessages(messages)}>
          <ContentProvider content={toClientContent(content)}>
            <CurrencyProvider>{children}</CurrencyProvider>
          </ContentProvider>
        </NextIntlClientProvider>
        <JsonLd data={businessSchema(locale as Locale, content)} />
        <Analytics />
      </body>
    </html>
  )
}
