"use client"

import { Phone } from "lucide-react"

export function WhatsAppButton() {
  const handleClick = () => {
    window.open("https://wa.me/212601666665", "_blank")
  }

  return (
    
    <button
      onClick={handleClick}
      className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center shadow-2xl hover:scale-110 transition-all animate-bounce"
      aria-label="Contact via WhatsApp"
    >
      <Phone className="h-8 w-8 text-white" />
    </button>
  )
}
