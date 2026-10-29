import { LOCALE_META, type Locale } from "@/i18n/config"
import type { ImageAsset, PublicContent, VehicleRecord } from "@/lib/content/types"
import { SITE_URL, absoluteUrl } from "@/lib/site"

/**
 * JSON-LD builders used by layouts and pages.
 *
 * Only facts published on the site are described: no rating, review, award,
 * availability or unconfirmed condition. Entities are linked by @id so search
 * engines read one business, one website and its vehicles.
 */
export type Crumb = { name: string; path: string }

export const BUSINESS_ID = `${SITE_URL}/#business`
export const WEBSITE_ID = `${SITE_URL}/#website`

export function JsonLd({ data }: { data: object | object[] | null }) {
  if (!data) return null
  return (
    <script
      type="application/ld+json"
      // "<" is escaped so a string can never close the script element.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}

const BUSINESS_DESCRIPTION: Record<Locale, string> = {
  fr: "Agence de location de voitures à Marrakech : citadines, berlines, SUV, van et modèles de luxe. Service 24h/24 et livraison partout au Maroc.",
  en: "Car rental agency in Marrakech: city cars, sedans, SUVs, a van and luxury models. Available 24/7 with delivery anywhere in Morocco.",
  nl: "Autoverhuur in Marrakech: stadsauto's, sedans, SUV's, een bestelbus en luxemodellen. 24/7 bereikbaar, levering overal in Marokko.",
  ar: "وكالة لكراء السيارات في مراكش: سيارات حضرية وسيدان وسيارات دفع رباعي وحافلة صغيرة وطرازات فاخرة. خدمة على مدار الساعة وتوصيل إلى جميع أنحاء المغرب.",
}

function priceRange(vehicles: VehicleRecord[]): string | undefined {
  if (vehicles.length === 0) return undefined
  const prices = vehicles.map((v) => v.priceMad)
  return `${Math.min(...prices)}-${Math.max(...prices)} MAD`
}

/** Absolute URL for a bundled path ("/abfastcar/…") or an uploaded https URL. */
function absoluteAsset(url: string): string {
  return url.startsWith("https://") ? url : `${SITE_URL}${url}`
}

/** Largest WebP variant of a photo, or its fallback src. */
function imageUrl(image: ImageAsset): string {
  return absoluteAsset(image.webp?.[image.webp.length - 1]?.url ?? image.src)
}

/**
 * AutoRental entity for the business plus the WebSite, rendered on every
 * page. `content` is the published content (visible vehicles + contact).
 */
export function businessSchema(locale: Locale, content: PublicContent): object | null {
  const inLanguage = LOCALE_META[locale].htmlLang
  const contact = content.contact
  const sameAs = [contact.instagramUrl, contact.facebookUrl].filter(Boolean)
  const firstImage = content.vehicles[0]?.image
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AutoRental",
        "@id": BUSINESS_ID,
        name: "AB FAST CAR",
        url: absoluteUrl(locale, "/"),
        logo: `${SITE_URL}/images/logo-20ab-20300pp-20.png`,
        ...(firstImage ? { image: imageUrl(firstImage) } : {}),
        description: BUSINESS_DESCRIPTION[locale],
        telephone: contact.phoneE164,
        email: contact.email,
        address: {
          "@type": "PostalAddress",
          // Street and postal code only once confirmed (empty until then).
          ...(contact.street ? { streetAddress: contact.street } : {}),
          ...(contact.postalCode ? { postalCode: contact.postalCode } : {}),
          addressLocality: contact.city[locale],
          addressCountry: contact.countryCode,
        },
        // Agency pin, editable in the admin.
        geo: { "@type": "GeoCoordinates", latitude: contact.latitude, longitude: contact.longitude },
        // The site states "Ouvert 24h/24" and "Service 24h/7j".
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "00:00",
          closes: "23:59",
        },
        // The site states delivery anywhere in Morocco.
        areaServed: { "@type": "Country", name: "Morocco" },
        ...(priceRange(content.vehicles) ? { priceRange: priceRange(content.vehicles) } : {}),
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: "AB FAST CAR",
        inLanguage,
        publisher: { "@id": BUSINESS_ID },
      },
    ],
  }
}

export function breadcrumbSchema(locale: Locale, items: Crumb[]): object | null {
  if (items.length === 0) return null
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(locale, item.path),
    })),
  }
}

/**
 * A rental car with its published daily rate in MAD. No availability is
 * declared: the site does not publish it, it is confirmed per booking.
 */
export function vehicleSchema(locale: Locale, vehicle: VehicleRecord): object | null {
  const url = absoluteUrl(locale, `/fleet/${vehicle.slug}`)
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    "@id": `${url}#vehicle`,
    name: vehicle.name,
    url,
    image: [vehicle.image, ...vehicle.gallery].map(imageUrl),
    brand: { "@type": "Brand", name: vehicle.brand },
    vehicleModelDate: String(vehicle.year),
    bodyType: vehicle.category[locale],
    description: `${vehicle.category[locale]} — ${vehicle.features[locale].join(", ")}`,
    inLanguage: LOCALE_META[locale].htmlLang,
    offers: {
      "@type": "Offer",
      url,
      price: vehicle.priceMad,
      priceCurrency: "MAD",
      businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: vehicle.priceMad,
        priceCurrency: "MAD",
        unitCode: "DAY",
        referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "DAY" },
      },
      seller: { "@id": BUSINESS_ID },
    },
  }
}

export function faqSchema(locale: Locale, items: { q: string; a: string }[]): object | null {
  if (items.length === 0) return null
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: LOCALE_META[locale].htmlLang,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  }
}
