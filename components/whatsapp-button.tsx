"use client"

import { Phone } from "lucide-react"

export function WhatsAppButton() {
  const handleClick = () => {
    window.open("https://wa.me/212601666665", "_blank")
  }

  return (
    
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
      aria-label="Contact via WhatsApp"
    >
      <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
    </button>
  )
}
