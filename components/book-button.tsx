"use client"

import type React from "react"

import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { useBooking } from "@/components/booking-provider"
import { preloadBookingDialog } from "@/components/booking-dialog-loader"

/**
 * The red "Réserver" call to action. It is a real link to the fleet (so it
 * works without JavaScript and for crawlers) that opens the booking dialog
 * when the page is interactive.
 */
export function BookButton({
  vehicleSlug,
  className = "",
  children,
  onOpen,
}: {
  vehicleSlug?: string
  className?: string
  children: React.ReactNode
  onOpen?: () => void
}) {
  const { openBooking } = useBooking()
  const href = vehicleSlug ? `/fleet/${vehicleSlug}#booking` : "/fleet"

  return (
    <Link
      href={href}
      // Fetch the dialog as soon as the visitor shows intent.
      onPointerEnter={preloadBookingDialog}
      onFocus={preloadBookingDialog}
      onTouchStart={preloadBookingDialog}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        onOpen?.()
        openBooking(vehicleSlug)
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-brand-red font-bold text-white transition-colors hover:bg-brand-red-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-ring focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        className,
      )}
    >
      {children}
    </Link>
  )
}
