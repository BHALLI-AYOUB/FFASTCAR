"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { CalendarDays } from "lucide-react"

import { LOCALE_META, type Locale } from "@/i18n/config"
import { cn } from "@/lib/utils"

/** The calendar (react-day-picker + date-fns locales) loads on first open only. */
const BookingCalendar = dynamic(() => import("@/components/booking-calendar").then((m) => m.BookingCalendar), {
  ssr: false,
  loading: () => <div className="h-[22rem]" aria-hidden="true" />,
})

type DateField = "pickup" | "ret"

function parseIso(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

/**
 * Pick-up and return dates of the booking form: two buttons showing the
 * chosen dates, and one month calendar below them. The first click sets the
 * pick-up date, the second the return date (same day allowed = 1 day);
 * clicking a button re-opens the calendar on that date.
 */
export function BookingDates({
  pickup,
  ret,
  today,
  days,
  ids,
  onChange,
  fieldRef,
  invalidProps,
  errors,
}: {
  pickup: string
  ret: string
  today: string
  /** Rental days, 0 while incomplete. */
  days: number
  ids: Record<DateField, string>
  onChange: (patch: { pickup?: string; ret?: string }) => void
  fieldRef: (field: DateField, el: HTMLElement | null) => void
  invalidProps: (field: DateField) => Record<string, unknown>
  errors: Record<DateField, React.ReactNode>
}) {
  const t = useTranslations("booking")
  const locale = useLocale() as Locale
  const [editing, setEditing] = useState<DateField | null>(null)

  const format = (iso: string) =>
    new Intl.DateTimeFormat(LOCALE_META[locale].intlLocale, { weekday: "short", day: "numeric", month: "short" }).format(parseIso(iso))

  function pick(iso: string) {
    if (editing === "ret" && pickup && iso >= pickup) {
      onChange({ ret: iso })
      setEditing(null)
    } else {
      // A new pick-up date: keep the return date only if it still follows.
      onChange({ pickup: iso, ret: ret && ret >= iso ? ret : "" })
      setEditing("ret")
    }
  }

  const trigger = (field: DateField, label: string, value: string) => (
    <div className="min-w-0">
      <label htmlFor={ids[field]} className="mb-2 block text-sm font-semibold text-zinc-200">
        {label} <span className="font-normal text-zinc-400">({t("required")})</span>
      </label>
      <button
        id={ids[field]}
        ref={(el) => fieldRef(field, el)}
        type="button"
        aria-expanded={editing === field}
        aria-controls={`${ids.pickup}-calendar`}
        onClick={() => setEditing(editing === field ? null : field)}
        className={cn(
          "flex h-12 w-full min-w-0 items-center gap-3 rounded-xl border bg-white/5 px-4 text-start text-base transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 aria-[invalid=true]:border-red-400",
          editing === field ? "border-white bg-white/10" : "border-white/15",
        )}
        {...invalidProps(field)}
      >
        <CalendarDays aria-hidden="true" className="h-5 w-5 shrink-0 text-zinc-400" />
        <span className={cn("block truncate first-letter:uppercase", value ? "font-semibold text-white" : "text-zinc-500")}>
          {value ? format(value) : t("chooseDate")}
        </span>
      </button>
      {errors[field]}
    </div>
  )

  return (
    <div
      onKeyDown={(e) => {
        // Escape (from a date button or the calendar) closes the calendar,
        // not the whole booking dialog.
        if (e.key === "Escape" && editing) {
          e.preventDefault()
          e.stopPropagation()
          setEditing(null)
          document.getElementById(ids[editing])?.focus()
        }
      }}
    >
      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        {trigger("pickup", t("pickupDate"), pickup)}
        {trigger("ret", t("returnDate"), ret)}
      </div>

      {editing && (
        <div
          id={`${ids.pickup}-calendar`}
          className="mt-3 rounded-2xl border border-white/15 bg-zinc-950 p-3 shadow-xl shadow-black/40 sm:p-4"
        >
          <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-zinc-400" aria-live="polite">
            {editing === "pickup" ? t("selectPickup") : t("selectReturn")}
          </p>
          <BookingCalendar locale={locale} pickup={pickup} ret={ret} today={today} onPick={pick} />
        </div>
      )}

      {days > 0 && (
        <p className="mt-3 text-center text-sm text-zinc-300">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-semibold text-white">
            <CalendarDays aria-hidden="true" className="h-4 w-4" />
            {t("days", { count: days })}
          </span>
        </p>
      )}
    </div>
  )
}
