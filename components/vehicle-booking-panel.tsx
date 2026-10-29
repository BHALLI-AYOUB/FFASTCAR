"use client"

import { useEffect } from "react"

import { BookingForm } from "@/components/booking-form"
import { useBooking } from "@/components/booking-provider"

/** Inline booking form of a vehicle page, preset to that vehicle. */
export function VehicleBookingPanel({ slug }: { slug: string }) {
  const { updateDraft, ready } = useBooking()

  // Wait for the saved draft to be restored, otherwise it would overwrite
  // this page's vehicle with the one chosen earlier.
  useEffect(() => {
    if (ready) updateDraft({ vehicle: slug })
  }, [ready, slug, updateDraft])

  return <BookingForm headingLevel="h3" />
}
