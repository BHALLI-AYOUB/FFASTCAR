"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

import { useBooking } from "@/components/booking-provider"
import { loadBookingDialog } from "@/components/booking-dialog-loader"

const BookingDialogContent = dynamic(loadBookingDialog, { ssr: false })

/**
 * The single booking dialog of the page, opened by any "Réserver" button.
 * Nothing of it is rendered or downloaded until it is first opened; after
 * that it stays mounted so closing/reopening is instant.
 */
export function BookingDialog() {
  const { dialogOpen } = useBooking()
  const [used, setUsed] = useState(false)

  useEffect(() => {
    if (dialogOpen) setUsed(true)
  }, [dialogOpen])

  return used || dialogOpen ? <BookingDialogContent /> : null
}
