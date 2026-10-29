import { LOCALE_META, locales } from "@/i18n/config"
import { getSiteContent } from "@/lib/content"
import type { SiteContent } from "@/lib/content/types"
import { absoluteUrl, contactLinks, formatAddress } from "@/lib/site"

/**
 * /llms.txt — a short factual summary of the site in Markdown for AI tools.
 * Optional: it is not a Google requirement and guarantees no ranking or
 * citation. Generated from the content store (the same data the pages render),
 * so it never drifts from the fleet, prices and contact shown on the site.
 * Contains only facts published on the site; hidden vehicles are left out.
 */
export const dynamic = "force-static"

function body(content: SiteContent): string {
  const contact = content.contact
  const links = contactLinks(contact)
  const fleet = content.vehicles
    .filter((v) => !v.hidden)
    .map(
    (v) => `- [${v.name}](${absoluteUrl("fr", `/fleet/${v.slug}`)}): ${v.category.en}, ${v.year}, ${v.priceMad} MAD per day`,
  ).join("\n")

  const languages = locales
    .map((l) => `- ${LOCALE_META[l].label} (${LOCALE_META[l].htmlLang}): ${absoluteUrl(l, "/")}`)
    .join("\n")

  return `# AB FAST CAR

> Car rental agency based in ${contact.city.en}, ${contact.country.en}. City cars, sedans, SUVs, a van and luxury models, rented by the day. Available 24/7, with vehicle delivery anywhere in Morocco, including airports.

## Key facts

- Address: ${formatAddress(contact, "en")} (map: ${links.mapsUrl})
- Phone and WhatsApp: ${contact.phoneDisplay}
- Email: ${contact.email}
- Availability: 24 hours a day, 7 days a week
- Delivery: to the address of your choice anywhere in Morocco, including airports
- Mileage and fuel: according to the rental contract. Excess mileage or missing fuel may be charged at rates communicated before rental (article 14).
- Driver: available as an option
- Prices: per day, in Moroccan dirhams (MAD). Amounts shown in EUR or GBP on the site are indicative conversions; the booking is confirmed in MAD.
- Booking: choose a vehicle on the site, enter the dates and a WhatsApp number; the request is sent to the agency on WhatsApp and confirmed by the team. Bookings can also be made by phone.
- Rental conditions: 16 articles published in French (source text), English, Dutch and Arabic. Deposit, payment and cancellation arrangements are specified in the contract; contact the agency for the required customer documents and minimum age.
- Insurance excess: article 4 provides for 5 % of the vehicle value when the customer's full or partial liability is established, according to the contractual calculation basis and subject to the insurance policy and applicable liability limits. This is not a general deposit.
- Washing: article 11 provides for 150 MAD only if the vehicle is returned dirty and requires a full wash; exceptional specialist cleaning may incur additional substantiated charges under the contract.

## Main pages

- [Home](${absoluteUrl("fr", "/")})
- [Fleet and daily prices](${absoluteUrl("fr", "/fleet")})
- [FAQ](${absoluteUrl("fr", "/faq")})
- [Contact](${absoluteUrl("fr", "/contact")})
- [Rental conditions — French source](${absoluteUrl("fr", "/conditions")})
- [Rental conditions — English](${absoluteUrl("en", "/conditions")})
- [Huurvoorwaarden — Nederlands](${absoluteUrl("nl", "/conditions")})
- [شروط الكراء — العربية](${absoluteUrl("ar", "/conditions")})

## Languages

${languages}

## Fleet

${fleet}

## Social profiles

- Instagram: ${contact.instagramUrl}
- Facebook: ${contact.facebookUrl}
`
}

export async function GET() {
  return new Response(body(await getSiteContent()), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
