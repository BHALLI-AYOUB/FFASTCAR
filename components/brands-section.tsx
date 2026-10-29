import { useTranslations } from "next-intl"

/**
 * Logos self-hosted in public/brands/ (single-colour SVGs, 0.3–24 KB): from
 * Simple Icons (CC0; Mercedes and Land Rover from v13.0.0, removed from later
 * versions) and Wikimedia Commons for Cupra (public domain, trademarked).
 * Keyed by the lower-cased brand name used in the fleet.
 */
const BRAND_LOGOS: Record<string, { file: string; width: number; height: number }> = {
  lamborghini: { file: "lamborghini", width: 24, height: 24 },
  "mercedes-benz": { file: "mercedes", width: 24, height: 24 },
  mercedes: { file: "mercedes", width: 24, height: 24 },
  "land rover": { file: "landrover", width: 24, height: 24 },
  porsche: { file: "porsche", width: 24, height: 24 },
  volkswagen: { file: "volkswagen", width: 24, height: 24 },
  audi: { file: "audi", width: 24, height: 24 },
  hyundai: { file: "hyundai", width: 24, height: 24 },
  cupra: { file: "cupra", width: 132, height: 102 },
  peugeot: { file: "peugeot", width: 24, height: 24 },
  renault: { file: "renault", width: 24, height: 24 },
}

/**
 * Brands present in the fleet. The page passes them in, derived from the
 * visible vehicles, so the list can never advertise a brand that is not
 * rentable. Each card shows the brand's logo with its name; a brand added
 * in the admin without a logo file keeps a text wordmark.
 */
export function BrandsSection({ brands = [] }: { brands?: string[] }) {
  const t = useTranslations("brands")
  if (brands.length === 0) return null

  return (
    <section className="cv-auto relative bg-gradient-to-b from-black via-zinc-950 to-black py-16 sm:py-24">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-14">
          <h2 className="font-display text-3xl font-black tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-white">{t("title")} </span>
            <span className="text-zinc-400">{t("titleHighlight")}</span>
          </h2>
          <div className="mt-5 flex items-center justify-center gap-4">
            <div className="hidden h-px w-16 bg-gradient-to-r from-transparent to-white/40 sm:block" />
            <p className="text-lg font-light italic text-zinc-400 sm:text-xl">{t("subtitle")}</p>
            <div className="hidden h-px w-16 bg-gradient-to-l from-transparent to-white/40 sm:block" />
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {brands.map((brand) => (
            <li
              key={brand}
              className="flex min-h-28 flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-zinc-950/80 px-4 py-5 text-center transition-colors hover:border-white/30 sm:min-h-32"
            >
              <BrandMark brand={brand} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function BrandMark({ brand }: { brand: string }) {
  const logo = BRAND_LOGOS[brand.trim().toLowerCase()]
  if (!logo) {
    return <span className="font-display text-base font-extrabold uppercase tracking-[0.18em] text-zinc-200 sm:text-lg">{brand}</span>
  }
  return (
    <>
      {/* The name below is the accessible label; the logo is decorative. */}
      <img
        src={`/brands/${logo.file}.svg`}
        alt=""
        width={logo.width}
        height={logo.height}
        loading="lazy"
        decoding="async"
        className="h-10 w-auto max-w-[7rem] object-contain sm:h-12"
      />
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400 sm:text-xs">{brand}</span>
    </>
  )
}
