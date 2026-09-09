"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookingModal } from "@/components/booking-modal"
import { Sparkles, Zap, Shield, X } from "lucide-react"

type Vehicle = {
  name: string
  image: string
  year: string
  price: number
  category: { fr: string; en: string }
  features: { fr: string[]; en: string[] }
}

const VEHICLES: Vehicle[] = [
  {
    name: "Lamborghini Urus",
    image: "/abfastcar/lamborghini-urus.jpg",
    year: "2025",
    price: 15000,
    category: { fr: "Super SUV", en: "Super SUV" },
    features: {
      fr: ["Full Options", "Noir Mat", "640 CV"],
      en: ["Full Options", "Matte Black", "640 HP"],
    },
  },
  {
    name: "Mercedes G63",
    image: "/abfastcar/mercedes-g63.jpg",
    year: "2025",
    price: 8000,
    category: { fr: "Ultra Luxe SUV", en: "Ultra Luxury SUV" },
    features: {
      fr: ["Full Options", "Noir Mat", "V8 Biturbo"],
      en: ["Full Options", "Matte Black", "V8 Biturbo"],
    },
  },
  {
    name: "Range Rover Sport Dynamic SE 2025",
    image: "/abfastcar/range-rover-sport.jpg",
    year: "2025",
    price: 2999,
    category: { fr: "SUV Prestige", en: "Prestige SUV" },
    features: {
      fr: ["Full Options", "Full Black", "4x4"],
      en: ["Full Options", "Full Black", "4x4"],
    },
  },
  {
    name: "Mercedes-Benz E-Class W214",
    image: "/abfastcar/mercedes-e-class-w214.jpg",
    year: "2025",
    price: 2500,
    category: { fr: "Berline Luxe", en: "Luxury Sedan" },
    features: {
      fr: ["Full Options", "Noire", "Berline Luxe"],
      en: ["Full Options", "Black", "Luxury Sedan"],
    },
  },
  {
    name: "Porsche Cayenne",
    image: "/abfastcar/porsche-cayenne.jpg",
    year: "2025",
    price: 3500,
    category: { fr: "Sport SUV", en: "Sport SUV" },
    features: {
      fr: ["Full Options", "Noir", "Turbo"],
      en: ["Full Options", "Black", "Turbo"],
    },
  },
  {
    name: "Porsche Macan",
    image: "/abfastcar/porsche-macan.jpg",
    year: "2025",
    price: 2300,
    category: { fr: "Sport SUV", en: "Sport SUV" },
    features: {
      fr: ["Full Options", "Noir", "Performance"],
      en: ["Full Options", "Black", "Performance"],
    },
  },
  {
    name: "Porsche Macan T 2025",
    image: "/abfastcar/porsche-macan-t.jpg",
    year: "2025",
    price: 1999,
    category: { fr: "Sport SUV", en: "Sport SUV" },
    features: {
      fr: ["Full Options", "Gris Nardo", "Sport"],
      en: ["Full Options", "Nardo Grey", "Sport"],
    },
  },
  {
    name: "Mercedes Vito 2025",
    image: "/abfastcar/mercedes-vito.jpg",
    year: "2025",
    price: 1499,
    category: { fr: "Utilitaire", en: "Van" },
    features: {
      fr: ["Automatique", "Noire", "8 Places"],
      en: ["Automatic", "Black", "8 Seats"],
    },
  },
  {
    name: "Volkswagen Touareg",
    image: "/abfastcar/volkswagen-touareg.jpg",
    year: "2025",
    price: 1399,
    category: { fr: "SUV Luxe", en: "Luxury SUV" },
    features: {
      fr: ["Full Options", "Noir", "4x4"],
      en: ["Full Options", "Black", "4x4"],
    },
  },
  {
    name: "Mercedes-AMG CLA 45 S 4MATIC+",
    image: "/abfastcar/mercedes-amg-cla-45-s.jpg",
    year: "2025",
    price: 1300,
    category: { fr: "Berline Sport", en: "Sport Sedan" },
    features: {
      fr: ["Pack AMG", "Gris Nardo", "4MATIC+"],
      en: ["AMG Pack", "Nardo Grey", "4MATIC+"],
    },
  },
  {
    name: "Range Rover Evoque Dynamic SE 2025",
    image: "/abfastcar/range-rover-evoque.jpg",
    year: "2025",
    price: 1299,
    category: { fr: "SUV Compact", en: "Compact SUV" },
    features: {
      fr: ["Full Options", "Gris Métallisé", "R-Dynamic"],
      en: ["Full Options", "Metallic Grey", "R-Dynamic"],
    },
  },
  {
    name: "Audi A3 S-Line Berline",
    image: "/abfastcar/audi-a3-s-line.jpg",
    year: "2024",
    price: 1200,
    category: { fr: "Berline Sport", en: "Sport Sedan" },
    features: {
      fr: ["Pack S-Line", "Bleu Turbo", "Berline"],
      en: ["S-Line Pack", "Turbo Blue", "Sedan"],
    },
  },
  {
    name: "Hyundai Sonata facelift (DN8)",
    image: "/abfastcar/hyundai-sonata.jpg",
    year: "2025",
    price: 1200,
    category: { fr: "Berline", en: "Sedan" },
    features: {
      fr: ["Automatique", "Noire", "Confort"],
      en: ["Automatic", "Black", "Comfort"],
    },
  },
  {
    name: "Hyundai Tucson 2025",
    image: "/abfastcar/hyundai-tucson.jpg",
    year: "2025",
    price: 1100,
    category: { fr: "SUV Compact", en: "Compact SUV" },
    features: {
      fr: ["Automatique", "Noire", "SUV"],
      en: ["Automatic", "Black", "SUV"],
    },
  },
  {
    name: "Mercedes CLA Pack AMG 2025",
    image: "/abfastcar/mercedes-cla-pack-amg.jpg",
    year: "2025",
    price: 1000,
    category: { fr: "Berline Sport", en: "Sport Sedan" },
    features: {
      fr: ["Pack AMG Line", "Noire", "Sport"],
      en: ["AMG Line Pack", "Black", "Sport"],
    },
  },
  {
    name: "Mercedes Classe A Pack AMG 2025",
    image: "/abfastcar/mercedes-classe-a-pack-amg.jpg",
    year: "2025",
    price: 999,
    category: { fr: "Berline Sport", en: "Sport Sedan" },
    features: {
      fr: ["Pack AMG Line", "Blanche", "Sport"],
      en: ["AMG Line Pack", "White", "Sport"],
    },
  },
  {
    name: "Cupra Formentor",
    image: "/abfastcar/cupra-formentor.jpg",
    year: "2025",
    price: 899,
    category: { fr: "SUV Sport", en: "Sport SUV" },
    features: {
      fr: ["Full Options", "Gris", "Performance"],
      en: ["Full Options", "Grey", "Performance"],
    },
  },
  {
    name: "Cupra Leon 2025",
    image: "/abfastcar/cupra-leon.jpg",
    year: "2025",
    price: 699,
    category: { fr: "Berline Sport", en: "Sport Sedan" },
    features: {
      fr: ["Full Options", "Gris", "Sport"],
      en: ["Full Options", "Grey", "Sport"],
    },
  },
  {
    name: "Peugeot 208",
    image: "/abfastcar/peugeot-208.jpg",
    year: "2025",
    price: 399,
    category: { fr: "Citadine", en: "City Car" },
    features: {
      fr: ["Automatique", "Noire", "Économique"],
      en: ["Automatic", "Black", "Economical"],
    },
  },
  {
    name: "Hyundai i20",
    image: "/abfastcar/hyundai-i20.jpg",
    year: "2025",
    price: 349,
    category: { fr: "Citadine", en: "City Car" },
    features: {
      fr: ["Automatique", "Rouge", "Économique"],
      en: ["Automatic", "Red", "Economical"],
    },
  },
  {
    name: "Clio 5 Automatique 2025",
    image: "/abfastcar/clio-5-automatique.jpg",
    year: "2025",
    price: 349,
    category: { fr: "Citadine", en: "City Car" },
    features: {
      fr: ["Automatique", "Bleue", "Économique"],
      en: ["Automatic", "Blue", "Economical"],
    },
  },
]

const translations = {
  fr: {
    badge: "Collection Premium",
    title: "Notre Flotte",
    titleGradient: "Exceptionnelle",
    subtitle: "Découvrez notre sélection de véhicules de luxe",
    perDay: "/jour",
    book: "Réserver",
    close: "Fermer",
  },
  en: {
    badge: "Premium Collection",
    title: "Our",
    titleGradient: "Exceptional Fleet",
    subtitle: "Discover our selection of luxury vehicles",
    perDay: "/day",
    book: "Book Now",
    close: "Close",
  },
}

export function FleetSection({ language }: { language: "fr" | "en" }) {
  const t = translations[language]
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [zoomedVehicle, setZoomedVehicle] = useState<Vehicle | null>(null)

  const handleBooking = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setIsModalOpen(true)
  }

  return (
    <section id="fleet" className="py-16 sm:py-24 md:py-32 relative overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black">
      {/* Ambient glow */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span className="text-yellow-400 font-bold text-sm tracking-wider uppercase">{t.badge}</span>
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">{t.title}</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent animate-gradient">
              {t.titleGradient}
            </span>
          </h2>
          <p className="text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto font-light">{t.subtitle}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {VEHICLES.map((vehicle) => (
            <Card
              key={vehicle.name}
              onClick={() => setZoomedVehicle(vehicle)}
              className="group relative flex flex-col overflow-hidden bg-gradient-to-br from-zinc-900/60 to-black border border-zinc-800/60 hover:border-yellow-500/60 rounded-2xl sm:rounded-3xl backdrop-blur-sm cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/20"
            >
              {/* Photo */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Scrim so the name stays readable */}
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black via-black/70 to-transparent" />

                {/* Year */}
                <Badge className="absolute top-2.5 left-2.5 sm:top-5 sm:left-5 bg-black/80 backdrop-blur-md text-white border border-yellow-500/40 font-bold px-2 py-1 sm:px-4 sm:py-2 text-[10px] sm:text-xs shadow-lg z-10">
                  <Zap className="w-3 h-3 mr-1 sm:mr-1.5 inline text-yellow-400" />
                  {vehicle.year}
                </Badge>

                {/* Category */}
                <Badge className="absolute top-2.5 right-2.5 sm:top-5 sm:right-5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black border-0 font-black px-2 py-1 sm:px-4 sm:py-2 text-[8px] sm:text-[10px] rounded-full shadow-lg tracking-wider sm:tracking-widest uppercase z-10">
                  {vehicle.category[language]}
                </Badge>

                {/* Name over the photo */}
                <h3 className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 text-xs sm:text-xl md:text-2xl font-black text-white leading-tight tracking-tight drop-shadow-lg group-hover:text-yellow-400 transition-colors duration-300 z-10">
                  {vehicle.name}
                </h3>
              </div>

              {/* Details */}
              <div className="flex flex-col flex-1 p-3 sm:p-6">
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-6">
                  {vehicle.features[language].map((feature) => (
                    <Badge
                      key={feature}
                      className="bg-zinc-900/80 text-zinc-300 border border-zinc-700/60 text-[9px] sm:text-[11px] px-1.5 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg font-medium group-hover:border-yellow-500/40 group-hover:text-yellow-400/90 transition-colors duration-300"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-2 sm:gap-3 mt-auto pt-3 sm:pt-5 border-t border-zinc-800/60">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                        {vehicle.price.toLocaleString("fr-FR")}
                      </span>
                      <span className="text-xs sm:text-base text-zinc-500 font-bold">DH</span>
                    </div>
                    <div className="text-xs text-zinc-500 font-medium">{t.perDay}</div>
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBooking(vehicle)
                    }}
                    className="relative w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-black px-3 sm:px-5 py-3 sm:py-5 rounded-lg sm:rounded-xl shadow-lg shadow-yellow-500/25 transition-all duration-300 hover:scale-105 group/btn overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      {t.book}
                      <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {zoomedVehicle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8 animate-fadeIn"
          onClick={() => setZoomedVehicle(null)}
        >
          <button
            onClick={() => setZoomedVehicle(null)}
            aria-label={t.close}
            className="absolute top-6 right-6 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-yellow-500 hover:border-yellow-500 transition-all duration-300 z-50 group"
          >
            <X className="w-7 h-7 text-white group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <div className="relative flex flex-col items-center gap-6 max-h-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={zoomedVehicle.image}
              alt={zoomedVehicle.name}
              className="max-h-[70vh] w-auto object-contain rounded-2xl shadow-2xl shadow-yellow-500/20"
            />
            <div className="text-center">
              <h3 className="text-2xl md:text-4xl font-black text-white mb-3">{zoomedVehicle.name}</h3>
              <div className="flex flex-wrap gap-2 justify-center mb-5">
                {zoomedVehicle.features[language].map((feature) => (
                  <Badge key={feature} className="bg-zinc-900/80 text-zinc-300 border border-zinc-700/60 text-xs px-3 py-1.5 rounded-lg">
                    {feature}
                  </Badge>
                ))}
              </div>
              <Button
                onClick={() => {
                  handleBooking(zoomedVehicle)
                  setZoomedVehicle(null)
                }}
                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-black px-8 py-6 rounded-xl shadow-lg shadow-yellow-500/30"
              >
                {t.book} — {zoomedVehicle.price.toLocaleString("fr-FR")} DH{t.perDay}
              </Button>
            </div>
          </div>
        </div>
      )}

      {selectedVehicle && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          vehicle={selectedVehicle}
          language={language}
        />
      )}

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  )
}
