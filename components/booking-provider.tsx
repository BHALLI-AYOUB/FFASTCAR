"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

import { useVehicles } from "@/components/content-provider"

/**
 * The visitor's booking draft, shared by every "Réserver" entry point (the
 * navigation, the mobile bar, the fleet cards, the vehicle page form).
 *
 * The draft lives in sessionStorage so the chosen vehicle and whatever was
 * typed survive moving from page to page and reloads, without lingering on a
 * shared computer after the tab is closed.
 */
export type BookingDraft = {
  vehicle: string
  pickup: string
  ret: string
  name: string
  countryCode: string
  phone: string
}

const EMPTY_DRAFT: BookingDraft = {
  vehicle: "",
  pickup: "",
  ret: "",
  name: "",
  countryCode: "+212",
  phone: "",
}

const DRAFT_KEY = "abfastcar.booking"

type BookingContextValue = {
  draft: BookingDraft
  updateDraft: (patch: Partial<BookingDraft>) => void
  /** Open the booking dialog, optionally with a vehicle preselected. */
  openBooking: (vehicleSlug?: string) => void
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  /** True once the saved draft has been restored from sessionStorage. */
  ready: boolean
}

const BookingContext = createContext<BookingContextValue | null>(null)

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>")
  return ctx
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<BookingDraft>(EMPTY_DRAFT)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const vehicles = useVehicles()

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY) ?? "null") as Partial<BookingDraft> | null
      if (saved) {
        setDraft((current) => ({
          ...EMPTY_DRAFT,
          ...saved,
          // A vehicle removed from the fleet must not stay selected.
          vehicle: saved.vehicle && vehicles.some((v) => v.slug === saved.vehicle) ? saved.vehicle : current.vehicle,
        }))
      }
    } catch {
      // unreadable or blocked storage: start empty
    }
    setReady(true)
    // Restore once, with the vehicles published when the page was rendered.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    } catch {
      // non-fatal: the draft just won't survive a reload
    }
  }, [draft, ready])

  const updateDraft = useCallback((patch: Partial<BookingDraft>) => {
    setDraft((current) => ({ ...current, ...patch }))
  }, [])

  const openBooking = useCallback((vehicleSlug?: string) => {
    if (vehicleSlug) setDraft((current) => ({ ...current, vehicle: vehicleSlug }))
    setDialogOpen(true)
  }, [])

  const value = useMemo(
    () => ({ draft, updateDraft, openBooking, dialogOpen, setDialogOpen, ready }),
    [draft, updateDraft, openBooking, dialogOpen, ready],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}
