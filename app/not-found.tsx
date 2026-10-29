import "./globals.css"

// 404 for paths outside any language (e.g. /index.html, which the locale
// proxy does not handle because it has a file extension). Pages inside a
// language use app/[locale]/not-found.tsx instead.
export default function RootNotFound() {
  return (
    <html lang="fr">
      <body className="flex min-h-screen items-center justify-center bg-black px-6 text-center text-white">
        <main>
          <p className="text-sm font-bold tracking-[0.2em] text-zinc-400">404</p>
          <h1 className="mt-4 text-4xl font-black">Page introuvable</h1>
          <p className="mt-4 text-zinc-300">Page not found · الصفحة غير موجودة</p>
          <a href="/" className="mt-8 inline-flex min-h-12 items-center rounded-full border border-white/30 px-6 font-bold hover:bg-white hover:text-black">
            AB FAST CAR
          </a>
        </main>
      </body>
    </html>
  )
}
