"use client"

import { DayPicker } from "react-day-picker"
import { ar, enUS, fr, nl } from "date-fns/locale"

import { LOCALE_META, type Locale } from "@/i18n/config"

const DATE_LOCALES = { fr, en: enUS, nl, ar }

/** YYYY-MM-DD in local time (the booking draft's format). */
export function toIso(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function fromIso(iso: string): Date | undefined {
  if (!iso) return undefined
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

/**
 * Month calendar of the booking form (react-day-picker, styled with the site's
 * palette, no extra stylesheet). Loaded only when the visitor first opens a
 * date: components/booking-dates.tsx imports it lazily.
 *
 * It shows the pick-up → return range; the parent decides what a click on a
 * day means (pick-up or return), so it only reports the clicked date.
 */
export function BookingCalendar({
  locale,
  pickup,
  ret,
  today,
  onPick,
}: {
  locale: Locale
  pickup: string
  ret: string
  today: string
  onPick: (iso: string) => void
}) {
  const from = fromIso(pickup)
  const to = fromIso(ret)
  const min = fromIso(today) ?? new Date()

  return (
    <DayPicker
      mode="range"
      locale={DATE_LOCALES[locale]}
      dir={LOCALE_META[locale].dir}
      weekStartsOn={1}
      selected={from ? { from, to } : undefined}
      onDayClick={(day, modifiers) => {
        if (!modifiers.disabled) onPick(toIso(day))
      }}
      defaultMonth={from ?? min}
      startMonth={min}
      disabled={{ before: min }}
      showOutsideDays={false}
      classNames={{
        root: "w-full",
        months: "relative",
        month: "w-full",
        month_caption: "flex h-10 items-center justify-center",
        caption_label: "text-sm font-bold capitalize text-white",
        nav: "absolute inset-x-0 top-0 z-10 flex h-10 items-center justify-between",
        button_previous:
          "flex h-10 w-10 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-25",
        button_next:
          "flex h-10 w-10 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-25",
        chevron: "h-4 w-4 fill-current",
        month_grid: "mt-2 w-full border-collapse",
        weekdays: "",
        weekday: "pb-2 text-center text-[11px] font-semibold uppercase tracking-wide text-zinc-500",
        week: "",
        day: "p-0 text-center",
        day_button:
          "mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-zinc-100 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-10 sm:w-10",
        today: "[&>button]:font-black [&>button]:underline [&>button]:decoration-2 [&>button]:underline-offset-4",
        selected: "",
        range_start: "[&>button]:bg-white [&>button]:text-black [&>button]:hover:bg-white",
        range_end: "[&>button]:bg-white [&>button]:text-black [&>button]:hover:bg-white",
        range_middle: "bg-white/10 [&>button]:rounded-none [&>button]:text-white",
        disabled: "[&>button]:cursor-not-allowed [&>button]:text-zinc-600 [&>button]:hover:bg-transparent",
        outside: "invisible",
        hidden: "invisible",
      }}
    />
  )
}
