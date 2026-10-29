import { getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"
import { SiteShell } from "@/components/site-shell"

export default async function NotFound() {
  const t = await getTranslations("notFound")

  return (
    <SiteShell>
      <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center gap-6 px-6 pt-28 pb-20 text-center">
        <p className="text-sm font-bold tracking-[0.2em] text-zinc-400">404</p>
        <h1 className="text-4xl font-black text-white sm:text-5xl">{t("title")}</h1>
        <p className="text-lg text-zinc-300">{t("text")}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-full border border-white/30 px-6 py-3 font-bold text-white hover:bg-white hover:text-black">
            {t("home")}
          </Link>
          <Link href="/fleet" className="rounded-full bg-brand-red px-6 py-3 font-bold text-white hover:bg-brand-red-hover">
            {t("fleet")}
          </Link>
        </div>
      </section>
    </SiteShell>
  )
}
