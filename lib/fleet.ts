import type { Locale } from "@/i18n/config"

/**
 * The fleet as published on the original site: the starting point of the
 * content store (lib/content/defaults.ts). Pages do not read this file
 * directly — they read lib/content, which returns these vehicles until the
 * admin saves its own list.
 *
 * `priceMad` is the reference daily rate in MAD. Never store converted
 * prices here: lib/currency.ts converts for display.
 * Model names are proper nouns and are not translated.
 */
export type Vehicle = {
  slug: string
  name: string
  brand: string
  /** Path of the original photo under /public. */
  image: string
  year: number
  priceMad: number
  category: Record<Locale, string>
  features: Record<Locale, string[]>
}

const SPORT_SUV = { fr: "SUV Sport", en: "Sport SUV", nl: "Sport-SUV", ar: "سيارة دفع رباعي رياضية" }
const SPORT_SEDAN = { fr: "Berline Sport", en: "Sport Sedan", nl: "Sportsedan", ar: "سيدان رياضية" }
const COMPACT_SUV = { fr: "SUV Compact", en: "Compact SUV", nl: "Compacte SUV", ar: "سيارة دفع رباعي مدمجة" }
const CITY_CAR = { fr: "Citadine", en: "City Car", nl: "Stadsauto", ar: "سيارة حضرية" }

export const VEHICLES: Vehicle[] = [
  {
    slug: "lamborghini-urus",
    name: "Lamborghini Urus",
    brand: "Lamborghini",
    image: "/abfastcar/lamborghini-urus.jpg",
    year: 2025,
    priceMad: 15000,
    category: { fr: "Super SUV", en: "Super SUV", nl: "Super-SUV", ar: "سيارة دفع رباعي فائقة" },
    features: {
      fr: ["Full Options", "Noir Mat", "640 CV"],
      en: ["Full Options", "Matte Black", "640 HP"],
      nl: ["Full options", "Mat zwart", "640 pk"],
      ar: ["تجهيز كامل", "أسود مطفأ", "640 حصانًا"],
    },
  },
  {
    slug: "mercedes-g63",
    name: "Mercedes G63",
    brand: "Mercedes-Benz",
    image: "/abfastcar/mercedes-g63.jpg",
    year: 2025,
    priceMad: 8000,
    category: { fr: "SUV Ultra Luxe", en: "Ultra Luxury SUV", nl: "Ultraluxe SUV", ar: "سيارة دفع رباعي فاخرة جدًا" },
    features: {
      fr: ["Full Options", "Noir Mat", "V8 Biturbo"],
      en: ["Full Options", "Matte Black", "V8 Biturbo"],
      nl: ["Full options", "Mat zwart", "V8 Biturbo"],
      ar: ["تجهيز كامل", "أسود مطفأ", "V8 Biturbo"],
    },
  },
  {
    slug: "range-rover-sport",
    name: "Range Rover Sport Dynamic SE 2025",
    brand: "Land Rover",
    image: "/abfastcar/range-rover-sport.jpg",
    year: 2025,
    priceMad: 2999,
    category: { fr: "SUV Prestige", en: "Prestige SUV", nl: "Prestige-SUV", ar: "سيارة دفع رباعي فخمة" },
    features: {
      fr: ["Full Options", "Full Black", "4x4"],
      en: ["Full Options", "Full Black", "4x4"],
      nl: ["Full options", "Volledig zwart", "4x4"],
      ar: ["تجهيز كامل", "أسود بالكامل", "دفع رباعي"],
    },
  },
  {
    slug: "mercedes-classe-e-w214",
    name: "Mercedes-Benz E-Class W214",
    brand: "Mercedes-Benz",
    image: "/abfastcar/mercedes-e-class-w214.jpg",
    year: 2025,
    priceMad: 2500,
    category: { fr: "Berline Luxe", en: "Luxury Sedan", nl: "Luxesedan", ar: "سيدان فاخرة" },
    features: {
      fr: ["Full Options", "Noire", "Berline Luxe"],
      en: ["Full Options", "Black", "Luxury Sedan"],
      nl: ["Full options", "Zwart", "Luxesedan"],
      ar: ["تجهيز كامل", "سوداء", "سيدان فاخرة"],
    },
  },
  {
    slug: "porsche-cayenne",
    name: "Porsche Cayenne",
    brand: "Porsche",
    image: "/abfastcar/porsche-cayenne.jpg",
    year: 2025,
    priceMad: 3500,
    category: SPORT_SUV,
    features: {
      fr: ["Full Options", "Noir", "Turbo"],
      en: ["Full Options", "Black", "Turbo"],
      nl: ["Full options", "Zwart", "Turbo"],
      ar: ["تجهيز كامل", "أسود", "توربو"],
    },
  },
  {
    slug: "porsche-macan",
    name: "Porsche Macan",
    brand: "Porsche",
    image: "/abfastcar/porsche-macan.jpg",
    year: 2025,
    priceMad: 2300,
    category: SPORT_SUV,
    features: {
      fr: ["Full Options", "Noir", "Performance"],
      en: ["Full Options", "Black", "Performance"],
      nl: ["Full options", "Zwart", "Performance"],
      ar: ["تجهيز كامل", "أسود", "أداء عالٍ"],
    },
  },
  {
    slug: "porsche-macan-t",
    name: "Porsche Macan T 2025",
    brand: "Porsche",
    image: "/abfastcar/porsche-macan-t.jpg",
    year: 2025,
    priceMad: 1999,
    category: SPORT_SUV,
    features: {
      fr: ["Full Options", "Gris Nardo", "Sport"],
      en: ["Full Options", "Nardo Grey", "Sport"],
      nl: ["Full options", "Nardo-grijs", "Sport"],
      ar: ["تجهيز كامل", "رمادي ناردو", "رياضية"],
    },
  },
  {
    slug: "mercedes-vito",
    name: "Mercedes Vito 2025",
    brand: "Mercedes-Benz",
    image: "/abfastcar/mercedes-vito.jpg",
    year: 2025,
    priceMad: 1499,
    category: { fr: "Van", en: "Van", nl: "Bestelbus", ar: "حافلة صغيرة" },
    features: {
      fr: ["Automatique", "Noire", "8 places"],
      en: ["Automatic", "Black", "8 seats"],
      nl: ["Automaat", "Zwart", "8 zitplaatsen"],
      ar: ["ناقل حركة أوتوماتيكي", "سوداء", "8 مقاعد"],
    },
  },
  {
    slug: "volkswagen-touareg",
    name: "Volkswagen Touareg",
    brand: "Volkswagen",
    image: "/abfastcar/volkswagen-touareg.jpg",
    year: 2025,
    priceMad: 1399,
    category: { fr: "SUV Luxe", en: "Luxury SUV", nl: "Luxe-SUV", ar: "سيارة دفع رباعي فاخرة" },
    features: {
      fr: ["Full Options", "Noir", "4x4"],
      en: ["Full Options", "Black", "4x4"],
      nl: ["Full options", "Zwart", "4x4"],
      ar: ["تجهيز كامل", "أسود", "دفع رباعي"],
    },
  },
  {
    slug: "mercedes-cla-amg-line-plus",
    name: "Mercedes CLA Pack AMG Line Plus",
    brand: "Mercedes-Benz",
    image: "/abfastcar/mercedes-amg-cla-45-s.jpg",
    year: 2025,
    priceMad: 1300,
    category: SPORT_SEDAN,
    features: {
      fr: ["Pack AMG", "Gris Nardo", "4MATIC+"],
      en: ["AMG Pack", "Nardo Grey", "4MATIC+"],
      nl: ["AMG-pakket", "Nardo-grijs", "4MATIC+"],
      ar: ["باقة AMG", "رمادي ناردو", "4MATIC+"],
    },
  },
  {
    slug: "range-rover-evoque",
    name: "Range Rover Evoque Dynamic SE 2025",
    brand: "Land Rover",
    image: "/abfastcar/range-rover-evoque.jpg",
    year: 2025,
    priceMad: 1299,
    category: COMPACT_SUV,
    features: {
      fr: ["Full Options", "Gris Métallisé", "R-Dynamic"],
      en: ["Full Options", "Metallic Grey", "R-Dynamic"],
      nl: ["Full options", "Metallic grijs", "R-Dynamic"],
      ar: ["تجهيز كامل", "رمادي معدني", "R-Dynamic"],
    },
  },
  {
    slug: "audi-a3-s-line",
    name: "Audi A3 S-Line Berline",
    brand: "Audi",
    image: "/abfastcar/audi-a3-s-line.jpg",
    year: 2024,
    priceMad: 1200,
    category: SPORT_SEDAN,
    features: {
      fr: ["Pack S-Line", "Bleu Turbo", "Berline"],
      en: ["S-Line Pack", "Turbo Blue", "Sedan"],
      nl: ["S-Line-pakket", "Turboblauw", "Sedan"],
      ar: ["باقة S-Line", "أزرق توربو", "سيدان"],
    },
  },
  {
    slug: "hyundai-accent",
    name: "Hyundai Accent",
    brand: "Hyundai",
    image: "/abfastcar/hyundai-sonata.jpg",
    year: 2025,
    priceMad: 1200,
    category: { fr: "Berline", en: "Sedan", nl: "Sedan", ar: "سيدان" },
    features: {
      fr: ["Automatique", "Noire", "Confort"],
      en: ["Automatic", "Black", "Comfort"],
      nl: ["Automaat", "Zwart", "Comfort"],
      ar: ["ناقل حركة أوتوماتيكي", "سوداء", "راحة"],
    },
  },
  {
    slug: "hyundai-tucson",
    name: "Hyundai Tucson 2025",
    brand: "Hyundai",
    image: "/abfastcar/hyundai-tucson.jpg",
    year: 2025,
    priceMad: 1100,
    category: COMPACT_SUV,
    features: {
      fr: ["Automatique", "Noire", "SUV"],
      en: ["Automatic", "Black", "SUV"],
      nl: ["Automaat", "Zwart", "SUV"],
      ar: ["ناقل حركة أوتوماتيكي", "سوداء", "دفع رباعي"],
    },
  },
  {
    slug: "mercedes-cla-pack-amg",
    name: "Mercedes CLA Pack AMG 2025",
    brand: "Mercedes-Benz",
    image: "/abfastcar/mercedes-cla-pack-amg.jpg",
    year: 2025,
    priceMad: 1000,
    category: SPORT_SEDAN,
    features: {
      fr: ["Pack AMG Line", "Noire", "Sport"],
      en: ["AMG Line Pack", "Black", "Sport"],
      nl: ["AMG Line-pakket", "Zwart", "Sport"],
      ar: ["باقة AMG Line", "سوداء", "رياضية"],
    },
  },
  {
    slug: "mercedes-classe-a-pack-amg",
    name: "Mercedes Classe A Pack AMG 2025",
    brand: "Mercedes-Benz",
    image: "/abfastcar/mercedes-classe-a-pack-amg.jpg",
    year: 2025,
    priceMad: 999,
    category: SPORT_SEDAN,
    features: {
      fr: ["Pack AMG Line", "Blanche", "Sport"],
      en: ["AMG Line Pack", "White", "Sport"],
      nl: ["AMG Line-pakket", "Wit", "Sport"],
      ar: ["باقة AMG Line", "بيضاء", "رياضية"],
    },
  },
  {
    slug: "cupra-formentor",
    name: "Cupra Formentor",
    brand: "Cupra",
    image: "/abfastcar/cupra-formentor.jpg",
    year: 2025,
    priceMad: 899,
    category: SPORT_SUV,
    features: {
      fr: ["Full Options", "Gris", "Performance"],
      en: ["Full Options", "Grey", "Performance"],
      nl: ["Full options", "Grijs", "Performance"],
      ar: ["تجهيز كامل", "رمادية", "أداء عالٍ"],
    },
  },
  {
    slug: "cupra-leon",
    name: "Cupra Leon 2025",
    brand: "Cupra",
    image: "/abfastcar/cupra-leon.jpg",
    year: 2025,
    priceMad: 699,
    category: SPORT_SEDAN,
    features: {
      fr: ["Full Options", "Gris", "Sport"],
      en: ["Full Options", "Grey", "Sport"],
      nl: ["Full options", "Grijs", "Sport"],
      ar: ["تجهيز كامل", "رمادية", "رياضية"],
    },
  },
  {
    slug: "peugeot-208",
    name: "Peugeot 208",
    brand: "Peugeot",
    image: "/abfastcar/peugeot-208.jpg",
    year: 2025,
    priceMad: 399,
    category: CITY_CAR,
    features: {
      fr: ["Automatique", "Noire", "Économique"],
      en: ["Automatic", "Black", "Economical"],
      nl: ["Automaat", "Zwart", "Zuinig"],
      ar: ["ناقل حركة أوتوماتيكي", "سوداء", "اقتصادية"],
    },
  },
  {
    slug: "hyundai-i20",
    name: "Hyundai i20",
    brand: "Hyundai",
    image: "/abfastcar/hyundai-i20.jpg",
    year: 2025,
    priceMad: 349,
    category: CITY_CAR,
    features: {
      fr: ["Automatique", "Rouge", "Économique"],
      en: ["Automatic", "Red", "Economical"],
      nl: ["Automaat", "Rood", "Zuinig"],
      ar: ["ناقل حركة أوتوماتيكي", "حمراء", "اقتصادية"],
    },
  },
  {
    slug: "renault-clio-5",
    name: "Clio 5 Automatique 2025",
    brand: "Renault",
    image: "/abfastcar/clio-5-automatique.jpg",
    year: 2025,
    priceMad: 349,
    category: CITY_CAR,
    features: {
      fr: ["Automatique", "Bleue", "Économique"],
      en: ["Automatic", "Blue", "Economical"],
      nl: ["Automaat", "Blauw", "Zuinig"],
      ar: ["ناقل حركة أوتوماتيكي", "زرقاء", "اقتصادية"],
    },
  },
]

export function vehicleBySlug(slug: string): Vehicle | undefined {
  return VEHICLES.find((v) => v.slug === slug)
}
