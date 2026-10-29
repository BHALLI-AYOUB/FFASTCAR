/**
 * The booking dialog and its form are a separate chunk, fetched on the first
 * "Réserver" intent (hover, focus, touch) or click — never on page load.
 */
let pending: Promise<unknown> | null = null

export function loadBookingDialog() {
  return import("@/components/booking-dialog-content")
}

/** Start downloading the dialog early; safe to call many times. */
export function preloadBookingDialog() {
  pending ??= loadBookingDialog().catch(() => {
    pending = null
  })
}
