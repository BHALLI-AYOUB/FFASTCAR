"use client"

import { useTranslations } from "next-intl"
import { X } from "lucide-react"

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { BookingForm } from "@/components/booking-form"
import { useBooking } from "@/components/booking-provider"

/**
 * Dialog + form, loaded on first open (see booking-dialog.tsx). The draft
 * (vehicle, dates, typed fields) lives in BookingProvider, so closing and
 * reopening keeps everything.
 */
export default function BookingDialogContent() {
  const t = useTranslations("booking")
  const tc = useTranslations("common")
  const { dialogOpen, setDialogOpen } = useBooking()

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[92dvh] overflow-y-auto rounded-3xl border border-white/15 bg-zinc-950 p-6 text-start text-white sm:max-w-xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <DialogTitle className="text-2xl font-black text-white">{t("title")}</DialogTitle>
            <DialogDescription className="mt-2 text-sm text-zinc-300">{t("intro")}</DialogDescription>
          </div>
          <DialogClose
            aria-label={tc("close")}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </DialogClose>
        </div>
        <BookingForm headingLevel="h3" />
      </DialogContent>
    </Dialog>
  )
}
