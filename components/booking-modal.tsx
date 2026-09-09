"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Phone, MessageCircle, X, Sparkles, Clock } from "lucide-react"
import { useTranslations } from "next-intl"
import { useMarket } from "@/components/locale-provider"
import { formatPrice } from "@/lib/currency"

const countryCodes = [
  { code: "+212", country: "Morocco", flag: "🇲🇦" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+213", country: "Algeria", flag: "🇩🇿" },
  { code: "+216", country: "Tunisia", flag: "🇹🇳" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
]

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  vehicle: {
    name: string
    price: number
  }
}

export function BookingModal({ isOpen, onClose, vehicle }: BookingModalProps) {
  const t = useTranslations("bookingmodal")
  const { market } = useMarket()
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [countryCode, setCountryCode] = useState("+212")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [numberOfDays, setNumberOfDays] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = end.getTime() - start.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

      if (diffDays > 0) {
        setNumberOfDays(diffDays)
        setTotalPrice(diffDays * vehicle.price)
      } else {
        setNumberOfDays(0)
        setTotalPrice(0)
      }
    }
  }, [startDate, endDate, vehicle.price])

  const handleWhatsAppConfirm = () => {
    if (!startDate || !endDate || !phoneNumber || numberOfDays <= 0) {
      alert(t("fillAllFields"))
      return
    }

    const fullPhoneNumber = `${countryCode}${phoneNumber}`
    const message = t("whatsappMessage", {
      vehicle: vehicle.name,
      start: startDate,
      end: endDate,
      duration: `${numberOfDays} ${numberOfDays > 1 ? t("days") : t("day")}`,
      total: formatPrice(totalPrice, market),
      phone: fullPhoneNumber,
    })

    const whatsappUrl = `https://wa.me/212601666665?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 border-0 bg-transparent overflow-hidden">
        <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl shadow-2xl border border-yellow-500/20">
          {/* Background Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-yellow-600/10 rounded-3xl" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group"
          >
            <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <div className="relative p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-3">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <h2 className="text-3xl font-black text-white">{t("title")}</h2>
              </div>
              <p className="text-yellow-400 text-xl font-light mb-2">{t("vehicle")}</p>
              <div className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-2 rounded-full">
                <p className="text-black font-black text-2xl">{vehicle.name}</p>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Start Date */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-300 text-sm font-semibold">
                  <Calendar className="w-4 h-4 text-yellow-400" />
                  {t("pickupDate")}
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl hover:bg-white/10 focus:bg-white/10 transition-all"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-300 text-sm font-semibold">
                  <Calendar className="w-4 h-4 text-yellow-400" />
                  {t("returnDate")}
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl hover:bg-white/10 focus:bg-white/10 transition-all"
                  min={startDate || new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2 mb-6">
              <label className="flex items-center gap-2 text-gray-300 text-sm font-semibold">
                <Phone className="w-4 h-4 text-yellow-400" />
                {t("phone")}
              </label>
              <div className="flex gap-3">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-white/5 border border-white/10 text-white rounded-xl px-4 h-12 w-[130px] focus:outline-none focus:ring-2 focus:ring-yellow-400 hover:bg-white/10 transition-all"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code} className="bg-gray-900">
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder={t("phonePlaceholder")}
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl flex-1 hover:bg-white/10 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {/* Price Summary */}
            {numberOfDays > 0 && (
              <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 backdrop-blur-md border border-yellow-400/30 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-white font-bold text-lg">Résumé de la réservation</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">{t("numberOfDays")}</span>
                    <span className="text-white font-bold text-lg">
                      {numberOfDays} {numberOfDays > 1 ? t("days") : t("day")}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">{t("pricePerDay")}</span>
                    <span className="text-white font-bold">{formatPrice(vehicle.price, market)}</span>
                  </div>
                  
                  <div className="h-px bg-yellow-400/20 my-3" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400 font-bold text-xl">{t("totalPrice")}</span>
                    <div className="text-right">
                      <span className="text-yellow-400 font-black text-3xl">{formatPrice(totalPrice, market)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Button */}
            <Button
              onClick={handleWhatsAppConfirm}
              disabled={!startDate || !endDate || !phoneNumber || numberOfDays <= 0}
              className="w-full h-14 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-black text-lg rounded-xl shadow-lg shadow-yellow-400/50 hover:shadow-yellow-500/70 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              {t("confirmWhatsApp")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
