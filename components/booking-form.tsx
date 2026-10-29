"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { CheckCircle2, MessageCircle, Phone } from "lucide-react"

import { LOCALE_META, type Locale } from "@/i18n/config"
import { Link } from "@/i18n/navigation"
import { formatPrice, isIndicative } from "@/lib/currency"
import { contactLinks } from "@/lib/site"
import type { ClientVehicle } from "@/lib/client-content"
import { cn } from "@/lib/utils"
import { useCurrency } from "@/components/locale-provider"
import { useBooking, type BookingDraft } from "@/components/booking-provider"
import { useContact, useVehicles } from "@/components/content-provider"
import { BookingDates } from "@/components/booking-dates"

const COUNTRY_CODES = [
  { code: "+212", flag: "🇲🇦" },
  { code: "+33", flag: "🇫🇷" },
  { code: "+32", flag: "🇧🇪" },
  { code: "+44", flag: "🇬🇧" },
  { code: "+31", flag: "🇳🇱" },
  { code: "+34", flag: "🇪🇸" },
  { code: "+49", flag: "🇩🇪" },
  { code: "+39", flag: "🇮🇹" },
  { code: "+41", flag: "🇨🇭" },
  { code: "+351", flag: "🇵🇹" },
  { code: "+1", flag: "🇺🇸" },
  { code: "+213", flag: "🇩🇿" },
  { code: "+216", flag: "🇹🇳" },
  { code: "+20", flag: "🇪🇬" },
  { code: "+966", flag: "🇸🇦" },
  { code: "+971", flag: "🇦🇪" },
]

type Field = "vehicle" | "pickup" | "ret" | "name" | "phone"
type Errors = Partial<Record<Field, string>>

/** Today's date as YYYY-MM-DD in the visitor's own time zone. */
function todayIso(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function parseIso(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d)
}

/**
 * Rental days, counting both the pick-up and the return day — the rule the
 * original site used (pick-up and return on the same day = 1 day).
 */
function rentalDays(pickup: string, ret: string): number {
  if (!pickup || !ret) return 0
  const diff = Math.round((parseIso(ret).getTime() - parseIso(pickup).getTime()) / 86_400_000)
  return diff >= 0 ? diff + 1 : 0
}

function validate(draft: BookingDraft, vehicles: ClientVehicle[]): Errors {
  const errors: Errors = {}
  if (!vehicles.some((v) => v.slug === draft.vehicle)) errors.vehicle = "vehicle"
  if (!draft.pickup) errors.pickup = "pickup"
  else if (draft.pickup < todayIso()) errors.pickup = "pickupPast"
  if (!draft.ret) errors.ret = "return"
  else if (draft.pickup && draft.ret < draft.pickup) errors.ret = "returnBefore"
  if (!draft.name.trim()) errors.name = "name"
  if (!/^\d{6,15}$/.test(draft.phone)) errors.phone = "phone"
  return errors
}

const FIELD_ORDER: Field[] = ["vehicle", "pickup", "ret", "name", "phone"]

const inputClass =
  "h-12 w-full min-w-0 rounded-xl border border-white/15 bg-white/5 px-4 text-base text-white placeholder:text-zinc-500 transition-colors hover:bg-white/10 focus:border-white focus:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 aria-[invalid=true]:border-red-400 [color-scheme:dark]"

/**
 * Booking request form. It does not book anything by itself: it validates the
 * request and opens WhatsApp with a ready-made message to the agency, which
 * the visitor sends. The confirmation says exactly that.
 */
export function BookingForm({ headingLevel = "h2", lockVehicle = false }: { headingLevel?: "h2" | "h3"; lockVehicle?: boolean }) {
  const t = useTranslations("booking")
  const locale = useLocale() as Locale
  const { priceFormat } = useCurrency()
  const { draft, updateDraft } = useBooking()
  const vehicles = useVehicles()
  const contact = useContact()
  const links = contactLinks(contact)
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null)
  const [today, setToday] = useState("")
  const id = useId()
  const refs = useRef<Partial<Record<Field, HTMLElement | null>>>({})
  const summaryRef = useRef<HTMLDivElement>(null)
  const Heading = headingLevel

  // The minimum date depends on the visitor's clock, so set it after mount.
  useEffect(() => setToday(todayIso()), [])

  const vehicle = vehicles.find((v) => v.slug === draft.vehicle)
  const days = rentalDays(draft.pickup, draft.ret)
  const totalMad = vehicle && days > 0 ? vehicle.priceMad * days : 0
  const madFormat = useMemo(() => ({ currency: "MAD" as const, intlLocale: LOCALE_META[locale].intlLocale }), [locale])

  const fieldId = (f: Field) => `${id}-${f}`
  const errorId = (f: Field) => `${id}-${f}-error`

  const change = (patch: Partial<BookingDraft>) => {
    updateDraft(patch)
    setWhatsappUrl(null)
    // Re-validate live only once the visitor has tried to submit.
    if (submitted) setErrors(validate({ ...draft, ...patch }, vehicles))
  }

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(LOCALE_META[locale].intlLocale, { dateStyle: "long" }).format(parseIso(iso))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const found = validate(draft, vehicles)
    setErrors(found)
    const firstInvalid = FIELD_ORDER.find((f) => found[f])
    if (firstInvalid) {
      refs.current[firstInvalid]?.focus()
      return
    }

    const message = t("whatsappMessage", {
      vehicle: vehicle!.name,
      start: formatDate(draft.pickup),
      end: formatDate(draft.ret),
      duration: t("days", { count: days }),
      total: formatPrice(totalMad, priceFormat),
      // The MAD amount actually charged, only when the total shown is a conversion.
      totalMad: isIndicative(priceFormat.currency) ? ` (${formatPrice(totalMad, madFormat)})` : "",
      name: draft.name.trim(),
      phone: `${draft.countryCode} ${draft.phone}`,
    })
    const url = `${links.whatsappUrl}?text=${encodeURIComponent(message)}`
    setWhatsappUrl(url)
    window.open(url, "_blank", "noopener,noreferrer")
  }

  useEffect(() => {
    if (whatsappUrl) summaryRef.current?.focus()
  }, [whatsappUrl])

  const errorText = (f: Field) => (errors[f] ? t(`errors.${errors[f]}`) : null)
  const invalidProps = (f: Field) => ({
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] ? errorId(f) : undefined,
  })
  const Label = ({ field, children }: { field: Field; children: React.ReactNode }) => (
    <label htmlFor={fieldId(field)} className="mb-2 block text-sm font-semibold text-zinc-200">
      {children} <span className="font-normal text-zinc-400">({t("required")})</span>
    </label>
  )
  const FieldError = ({ field }: { field: Field }) =>
    errors[field] ? (
      <p id={errorId(field)} className="mt-2 text-sm font-medium text-red-300">
        {errorText(field)}
      </p>
    ) : null

  if (whatsappUrl) {
    return (
      <div ref={summaryRef} tabIndex={-1} role="status" className="space-y-5 text-center outline-none">
        <CheckCircle2 aria-hidden="true" className="mx-auto h-10 w-10 text-white" />
        <Heading className="text-2xl font-black text-white">{t("sentTitle")}</Heading>
        <p className="text-zinc-300">{t("sentText")}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-whatsapp px-6 font-bold text-black hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <MessageCircle aria-hidden="true" className="h-5 w-5" />
            {t("openAgain")}
          </a>
          <button
            type="button"
            onClick={() => setWhatsappUrl(null)}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 font-bold text-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {t("edit")}
          </button>
        </div>
        <p className="text-sm text-zinc-400">
          <a href={links.tel} className="inline-flex items-center gap-1.5 underline-offset-4 hover:text-white hover:underline">
            <Phone aria-hidden="true" className="h-4 w-4" />
            {t("orCall", { phone: contact.phoneDisplay })}
          </a>
        </p>
      </div>
    )
  }

  const errorCount = Object.keys(errors).length

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      {errorCount > 0 && (
        <p role="alert" className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
          {t("errorSummary")}
        </p>
      )}

      <div>
        <Label field="vehicle">{t("vehicle")}</Label>
        <select
          id={fieldId("vehicle")}
          ref={(el) => {
            refs.current.vehicle = el
          }}
          value={draft.vehicle}
          disabled={lockVehicle && !!vehicle}
          onChange={(e) => change({ vehicle: e.target.value })}
          className={cn(inputClass, "disabled:opacity-80")}
          {...invalidProps("vehicle")}
        >
          <option value="" className="bg-zinc-900">
            {t("chooseVehicle")}
          </option>
          {vehicles.map((v) => (
            <option key={v.slug} value={v.slug} className="bg-zinc-900">
              {v.name} — {formatPrice(v.priceMad, priceFormat)}
            </option>
          ))}
        </select>
        <FieldError field="vehicle" />
      </div>

      <BookingDates
        pickup={draft.pickup}
        ret={draft.ret}
        today={today || todayIso()}
        days={days}
        ids={{ pickup: fieldId("pickup"), ret: fieldId("ret") }}
        onChange={change}
        fieldRef={(field, el) => {
          refs.current[field] = el
        }}
        invalidProps={invalidProps}
        errors={{ pickup: <FieldError field="pickup" />, ret: <FieldError field="ret" /> }}
      />

      <div>
        <Label field="name">{t("name")}</Label>
        <input
          id={fieldId("name")}
          ref={(el) => {
            refs.current.name = el
          }}
          type="text"
          autoComplete="name"
          value={draft.name}
          onChange={(e) => change({ name: e.target.value })}
          className={inputClass}
          {...invalidProps("name")}
        />
        <FieldError field="name" />
      </div>

      <div>
        <Label field="phone">{t("phone")}</Label>
        {/* Phone numbers are written left to right in every language. */}
        <div className="flex gap-3" dir="ltr">
          <label htmlFor={`${id}-cc`} className="sr-only">
            {t("countryCode")}
          </label>
          <select
            id={`${id}-cc`}
            value={draft.countryCode}
            onChange={(e) => change({ countryCode: e.target.value })}
            className={cn(inputClass, "w-[7.5rem] shrink-0 px-3")}
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code} className="bg-zinc-900">
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <input
            id={fieldId("phone")}
            ref={(el) => {
              refs.current.phone = el
            }}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder={t("phonePlaceholder")}
            value={draft.phone}
            onChange={(e) => change({ phone: e.target.value.replace(/\D/g, "") })}
            className={cn(inputClass, "flex-1")}
            {...invalidProps("phone")}
          />
        </div>
        <FieldError field="phone" />
      </div>

      {vehicle && days > 0 && (
        <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-5" aria-live="polite">
          <p className="mb-3 font-bold text-white">{t("summary")}</p>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-400">{t("duration")}</dt>
              <dd className="font-semibold text-white">{t("days", { count: days })}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-zinc-400">{t("pricePerDay")}</dt>
              <dd className="font-semibold text-white">{formatPrice(vehicle.priceMad, priceFormat)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-white/10 pt-2">
              <dt className="font-bold text-white">{t("total")}</dt>
              <dd className="text-end">
                <span className="text-xl font-black text-white">{formatPrice(totalMad, priceFormat)}</span>
                {isIndicative(priceFormat.currency) && (
                  <span className="block text-xs text-zinc-400">{formatPrice(totalMad, madFormat)}</span>
                )}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-zinc-400">{t("totalNote")}</p>
        </div>
      )}

      <p className="text-sm leading-relaxed text-zinc-300">
        {t.rich("conditionsNote", { link: (chunks) => <Link href="/conditions" target="_blank" rel="noopener noreferrer" className="inline-block rounded underline underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">{chunks}</Link> })}
      </p>

      <button
        type="submit"
        className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-brand-red px-6 text-base font-black text-white shadow-lg shadow-black/40 transition-colors hover:bg-brand-red-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-ring focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        <MessageCircle aria-hidden="true" className="h-5 w-5" />
        {t("submit")}
      </button>
    </form>
  )
}
