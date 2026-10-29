import type { ContactInfo, VehicleRecord } from "@/lib/content/types"

/**
 * The slice of the published content that client components receive (via
 * <ContentProvider>). The booking form needs each vehicle's slug, name and
 * price; photos, translations and galleries stay on the server — they are
 * already in the HTML — which keeps them out of the page's JS payload.
 */
export type ClientVehicle = Pick<VehicleRecord, "slug" | "name" | "priceMad">
export type ClientContent = { vehicles: ClientVehicle[]; contact: ContactInfo }

export function toClientContent(content: { vehicles: VehicleRecord[]; contact: ContactInfo }): ClientContent {
  return {
    vehicles: content.vehicles.map(({ slug, name, priceMad }) => ({ slug, name, priceMad })),
    contact: content.contact,
  }
}
