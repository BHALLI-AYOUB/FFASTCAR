"use client"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookingModal } from "@/components/booking-modal"
import { ChevronLeft, ChevronRight, Sparkles, Zap, Shield, X } from "lucide-react"

const translations = {
  fr: {
    title: "Notre Flotte",
    titleGradient: "Exceptionnelle",
    subtitle: "Découvrez notre sélection de véhicules de luxe",
    perDay: "/jour",
    book: "Réserver",
    explore: "Explorer",
    vehicles: [
      {
        name: "Mercedes G63",
        category: "Ultra Luxe SUV",
        year: "2025",
        price: 8000,
        images: [
          "/G63FULLBLACK.jpeg",
          "/23C0228_002_0.png",
          "/23C0228_004_0.png"
        ],
        features: ["Full Options", "Noir Mat", "V8 Biturbo"],
      },
      {
        name: "Porsche Cayenne",
        category: "Sport SUV",
        year: "2025",
        price: 3500,
        images: [
          "/A.png",
          "/11.png",
          "/22.png"
        ],
        features: ["Full Options", "Noir", "Turbo"],
      },
      {
        name: "Range Rover Sport Dynamic SE 2025",
        category: "SUV Prestige",
        year: "2025",
        price: 2999,
        images: [
          "/rangersport1.png",
          "/rangersport3.png",
          "/rangersport2.png",
          "/range-rover-sport-dynamic2.jpeg",
          "/range-rover-sport-dynamic3.jpeg",
          "/1R.png.jpeg"
        ],
        features: ["Full Options", "Full Black", "4x4"],
      },
      {
        name: "hyundai i20 2025",
        category: "Citadine",
        year: "2025",
        price: 349,
        images: [
          "/i201.png",
          "/i202.png",
          "/i203.png",
        ],
        features: ["Full Options", "Full Black", "4x4"],
      },
      {
        name: "Porsche Macan T 2025",
        category: "Sport SUV",
        year: "2025",
        price: 1999,
        images: [
          "/macanT1.png",
          "/macanT2.png",
          "/macanT3.png"
        ],
        features: ["Full Options", "Gris Nardo", "Sport"],
      },
      {
        name: "Porsche macan 2025",
        category: "Sport SUV",
        year: "2025",
        price: 2300,
        images: [
          "/porche-macan20251.jpeg",
          "/porche-macan20252.jpeg",
          "/porche-macan20253.jpeg"
        ],
        features: ["Full Options", "Noir", "Performance"],
      },
      {
        name: "Volkswagen Touareg",
        category: "SUV Luxe",
        year: "2025",
        price: 1399,
        images: [
          "/touareg1.png",
          "/volkswagentouareg2.jpg",
          "/touareg4.png",
          "/touareg5.png",
          "/touareg6.png"
        ],
        features: ["Full Options", "Noir", "4x4"],
      },
      {
        name: "Range Rover Evoque Dynamic SE 2025",
        category: "SUV Compact",
        year: "2025",
        price: 1299,
        images: [
          "/range-rover-evoque-dynamic1.jpeg",
          "/rangerover1.png",
          "/range-rover-evoque-dynamic2.jpeg",
          "/range-rover-evoque-dynamic3.jpeg"
        ],
        features: ["Full Options", "Gris Métallisé", "R-Dynamic"],
      },
      {
        name: "Mercedes Classe A Pack AMG 2025",
        category: "Berline Sport",
        year: "2025",
        price: 999,
        images: [
          "/Mercedes-classe-A-pack-amg-20251.jpeg",
          "/classa.png",
          "/Mercedes-classe-A-pack-amg-20252.jpeg",
          "/cla4.png"
        ],
        features: ["Pack AMG Line", "Gris Nardo", "Sport"],
      },
      {
        name: "Mercedes CLA Pack AMG 2025",
        category: "Berline Sport",
        year: "2025",
        price: 1300,
        images: [
          "/cla1.png",
          "/cla2.png",
          "/cla3.png",
        ],
        features: ["Pack AMG Line", "Gris Nardo", "Sport"],
      },
      {
        name: "Mercedes A200 Pack AMG 2025",
        category: "Berline Sport",
        year: "2025",
        price: 999,
        images: [
          "/a2001.png",
          "/a2002.png",
          "/a2003.png",
          "/a2004.png",
          "/a2005.png"
        ],
        features: ["Pack AMG Line", "Gris Nardo", "Sport"],
      },
      {
        name: "Audi A3 S-Line Berline",
        category: "Berline Sport",
        year: "2024",
        price: 1200,
        images: [
          "/audia31.jpg",
          "/audia32.jpg",
          "/audia33.jpg",
          "/audia34.jpg",
          "/audia35.jpg",
          "/audia36.jpg"
        ],
        features: ["Pack RS3", "Bleu Turbo", "S-Line"],
      },
      {
        name: "Mercedes Vito 2025",
        category: "Utilitaire",
        year: "2025",
        price: 1499,
        images: [
          "/Mercedes-Vito-20251.jpeg",
          "/Mercedes-Vito-20252.jpeg",
          "/Mercedes-Vito-20253.jpeg"
        ],
        features: ["Automatique", "Blanche", "Pratique"],
      },
      {
        name: "Hyundai Accent 2025",
        category: "Commercial",
        year: "2025",
        price: 1499,
        images: [
          "/hyundai1.png",
          "/hyundai2.png",
          "/hyundai3.png",
          "/hyundai4.png",
          "/hyundai5.png",
          "/hyundai6.png"
        ],
        features: ["Automatic", "White", "Practical"],
      },
      {
        name: "Mercedes GLA 2025",
        category: "SUV Compact",
        year: "2025",
        price: 1100,
        images: [
          "/Mercedes-GLA-20251.jpeg",
          "/gla2.png",
          "/gla1.png",
          "/Mercedes-GLA-20252.jpeg",
          "/Mercedes-GLA-20253.jpeg"
        ],
        features: ["Automatique", "Noire", "Économique"],
      },
      {
        name: "Hyundai Tucson 2025",
        category: "SUV Compact",
        year: "2025",
        price: 1100,
        images: [
          "/hyundaitucson1.png",
          "/hyundaitucson2.png",
          "/hyundaitucson3.png",
          "/hyundaitucson4.png",
          "/hyundaitucson5.png"
        ],
        features: ["Automatique", "Noire", "Économique"],
      },
      {
        name: "Cupra Formentor",
        category: "SUV Sport",
        year: "2025",
        price: 899,
        images: [
          "/Cupraformentor-20252.jpeg",
          "/cupra-formentor-2025-grey-interior.jpg",
          "/Cupraformentor.jpeg"
        ],
        features: ["Full Options", "Gris", "Performance"],
      },
      {
        name: "Cupra Leon 2025",
        category: "Berline Sport",
        year: "2025",
        price: 699,
        images: [
          "/cupra2025.jpeg",
          "/cupra1.png",
          "/Cupra-Leon-20252.jpeg",
          "/cupra2.png",
          "/cupra3.png"
        ],
        features: ["Full Options", "Gris", "Sport"],
      },
      {
        name: "Clio 5 Automatique 2025",
        category: "Citadine",
        year: "2025",
        price: 349,
        images: [
          "/Clio-5-automatique-20251.jpeg",
          "/Clio-5-automatique-20252.jpeg",
          "/Clio-5-automatique-20253.jpeg",
          "/Clio-5-automatique-20254.jpeg"
        ],
        features: ["Automatique", "Blanche", "Économique"],
      },
    ],
  },
  en: {
    title: "Our",
    titleGradient: "Exceptional Fleet",
    subtitle: "Discover our selection of luxury vehicles",
    perDay: "/day",
    book: "Book Now",
    explore: "Explore",
    vehicles: [
      // ── 1 ──────────────────────────────────────────────────────────
      {
        name: "Mercedes G63",
        category: "Ultra Luxury SUV",
        year: "2025",
        price: 8000,
        images: [
          "/G63FULLBLACK.jpeg",
          "/23C0228_002_0.png",
          "/23C0228_004_0.png"
        ],
        features: ["Full Options", "Matte Black", "V8 Biturbo"],
      },
      // ── 2 ──────────────────────────────────────────────────────────
      {
        name: "Porsche Cayenne",
        category: "Sport SUV",
        year: "2025",
        price: 3500,
        images: [
          "/A.png",
          "/11.png",
          "/22.png"
        ],
        features: ["Full Options", "Black", "Turbo"],
      },
      // ── 3 ──────────────────────────────────────────────────────────
      {
        name: "Range Rover Sport Dynamic SE 2025",
        category: "Prestige SUV",
        year: "2025",
        price: 2999,
        images: [
          "/rangersport1.png",
          "/rangersport3.png",
          "/rangersport2.png",
          "/range-rover-sport-dynamic2.jpeg",
          "/range-rover-sport-dynamic3.jpeg",
          "/1R.png.jpeg"
        ],
        features: ["Full Options", "Full Black", "4x4"],
      },
      // ── 4 ──────────────────────────────────────────────────────────
      {
        name: "Hyundai i20 2025",
        category: "City Car",
        year: "2025",
        price: 349,
        images: [
          "/i201.png",
          "/i202.png",
          "/i203.png",
        ],
        features: ["Full Options", "Full Black", "Compact"],
      },
      // ── 5 ──────────────────────────────────────────────────────────
      {
        name: "Porsche Macan T 2025",
        category: "Sport SUV",
        year: "2025",
        price: 1999,
        images: [
          "/macanT1.png",
          "/macanT2.png",
          "/macanT3.png"
        ],
        features: ["Full Options", "Nardo Grey", "Sport"],
      },
      // ── 6 ──────────────────────────────────────────────────────────
      {
        name: "Porsche Macan 2025",
        category: "Sport SUV",
        year: "2025",
        price: 2300,
        images: [
          "/porche-macan20251.jpeg",
          "/porche-macan20252.jpeg",
          "/porche-macan20253.jpeg"
        ],
        features: ["Full Options", "Black", "Performance"],
      },
      // ── 7 ──────────────────────────────────────────────────────────
      {
        name: "Volkswagen Touareg",
        category: "Luxury SUV",
        year: "2025",
        price: 1399,
        images: [
          "/touareg1.png",
          "/volkswagentouareg2.jpg",
          "/touareg4.png",
          "/touareg5.png",
          "/touareg6.png"
        ],
        features: ["Full Options", "Black", "4x4"],
      },
      // ── 8 ──────────────────────────────────────────────────────────
      {
        name: "Range Rover Evoque Dynamic SE 2025",
        category: "Compact SUV",
        year: "2025",
        price: 1299,
        images: [
          "/range-rover-evoque-dynamic1.jpeg",
          "/rangerover1.png",
          "/range-rover-evoque-dynamic2.jpeg",
          "/range-rover-evoque-dynamic3.jpeg"
        ],
        features: ["Full Options", "Metallic Grey", "R-Dynamic"],
      },
      // ── 9 ── Mercedes Classe A (synced exactly from FR) ────────────
      {
        name: "Mercedes Class A Pack AMG 2025",
        category: "Sport Sedan",
        year: "2025",
        price: 999,
        images: [
          "/Mercedes-classe-A-pack-amg-20251.jpeg",
          "/classa.png",
          "/Mercedes-classe-A-pack-amg-20252.jpeg",
          "/cla4.png"
        ],
        features: ["AMG Line Pack", "Nardo Grey", "Sport"],
      },
      // ── 10 ── Mercedes CLA (new vehicle added from FR) ─────────────
      {
        name: "Mercedes CLA Pack AMG 2025",
        category: "Sport Sedan",
        year: "2025",
        price: 1300,
        images: [
          "/cla1.png",
          "/cla2.png",
          "/cla3.png",
        ],
        features: ["AMG Line Pack", "Nardo Grey", "Sport"],
      },
      // ── 11 ── Mercedes A200 ─────────────────────────────────────────
      {
        name: "Mercedes A200 Pack AMG 2025",
        category: "Sport Sedan",
        year: "2025",
        price: 999,
        images: [
          "/a2001.png",
          "/a2002.png",
          "/a2003.png",
          "/a2004.png",
          "/a2005.png"
        ],
        features: ["AMG Line Pack", "Nardo Grey", "Sport"],
      },
      // ── 12 ──────────────────────────────────────────────────────────
      {
        name: "Audi A3 S-Line Sedan",
        category: "Sport Sedan",
        year: "2024",
        price: 1200,
        images: [
          "/audia31.jpg",
          "/audia32.jpg",
          "/audia33.jpg",
          "/audia34.jpg",
          "/audia35.jpg",
          "/audia36.jpg"
        ],
        features: ["RS3 Pack", "Turbo Blue", "S-Line"],
      },
      // ── 13 ──────────────────────────────────────────────────────────
      {
        name: "Mercedes Vito 2025",
        category: "Commercial",
        year: "2025",
        price: 1499,
        images: [
          "/Mercedes-Vito-20251.jpeg",
          "/Mercedes-Vito-20252.jpeg",
          "/Mercedes-Vito-20253.jpeg"
        ],
        features: ["Automatic", "White", "Practical"],
      },
      // ── 14 ──────────────────────────────────────────────────────────
      {
        name: "Hyundai Accent 2025",
        category: "Commercial",
        year: "2025",
        price: 1499,
        images: [
          "/hyundai1.png",
          "/hyundai2.png",
          "/hyundai3.png",
          "/hyundai4.png",
          "/hyundai5.png",
          "/hyundai6.png"
        ],
        features: ["Automatic", "White", "Practical"],
      },
      // ── 15 ──────────────────────────────────────────────────────────
      {
        name: "Mercedes GLA 2025",
        category: "Compact SUV",
        year: "2025",
        price: 1100,
        images: [
          "/Mercedes-GLA-20251.jpeg",
          "/gla2.png",
          "/gla1.png",
          "/Mercedes-GLA-20252.jpeg",
          "/Mercedes-GLA-20253.jpeg"
        ],
        features: ["Automatic", "Black", "Economical"],
      },
      // ── 16 ──────────────────────────────────────────────────────────
      {
        name: "Hyundai Tucson 2025",
        category: "Compact SUV",
        year: "2025",
        price: 1100,
        images: [
          "/hyundaitucson1.png",
          "/hyundaitucson2.png",
          "/hyundaitucson3.png",
          "/hyundaitucson4.png",
          "/hyundaitucson5.png"
        ],
        features: ["Automatic", "Black", "Economical"],
      },
      // ── 17 ──────────────────────────────────────────────────────────
      {
        name: "Cupra Formentor",
        category: "Sport SUV",
        year: "2025",
        price: 899,
        images: [
          "/Cupraformentor-20252.jpeg",
          "/cupra-formentor-2025-grey-interior.jpg",
          "/Cupraformentor.jpeg"
        ],
        features: ["Full Options", "Grey", "Performance"],
      },
      // ── 18 ──────────────────────────────────────────────────────────
      {
        name: "Cupra Leon 2025",
        category: "Sport Sedan",
        year: "2025",
        price: 699,
        images: [
          "/cupra2025.jpeg",
          "/cupra1.png",
          "/Cupra-Leon-20252.jpeg",
          "/cupra2.png",
          "/cupra3.png"
        ],
        features: ["Full Options", "Grey", "Sport"],
      },
      // ── 19 ──────────────────────────────────────────────────────────
      {
        name: "Renault Clio 5 Automatic 2025",
        category: "City Car",
        year: "2025",
        price: 349,
        images: [
          "/Clio-5-automatique-20251.jpeg",
          "/Clio-5-automatique-20252.jpeg",
          "/Clio-5-automatique-20253.jpeg",
          "/Clio-5-automatique-20254.jpeg"
        ],
        features: ["Automatic", "White", "Economical"],
      },
    ],
  },
}

export function FleetSection({ language }: { language: "fr" | "en" }) {
  const t = translations[language]
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<(typeof t.vehicles)[0] | null>(null)
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<number, number>>({})
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [zoomedVehicle, setZoomedVehicle] = useState<{ vehicle: typeof t.vehicles[0], index: number } | null>(null)
  const [zoomedImageIndex, setZoomedImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndices((prev) => {
        const newIndices: Record<number, number> = {}
        t.vehicles.forEach((vehicle, index) => {
          const currentIndex = prev[index] || 0
          newIndices[index] = (currentIndex + 1) % vehicle.images.length
        })
        return newIndices
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [t.vehicles])

  const handleBooking = (vehicle: (typeof t.vehicles)[0]) => {
    setSelectedVehicle(vehicle)
    setIsModalOpen(true)
  }

  const nextImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndices(prev => ({
      ...prev,
      [index]: ((prev[index] || 0) + 1) % t.vehicles[index].images.length
    }))
  }

  const prevImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndices(prev => ({
      ...prev,
      [index]: ((prev[index] || 0) - 1 + t.vehicles[index].images.length) % t.vehicles[index].images.length
    }))
  }

  const handleCardClick = (vehicle: typeof t.vehicles[0], index: number) => {
    setZoomedVehicle({ vehicle, index })
    setZoomedImageIndex(currentImageIndices[index] || 0)
  }

  const nextZoomedImage = () => {
    if (zoomedVehicle) {
      setZoomedImageIndex((prev) => (prev + 1) % zoomedVehicle.vehicle.images.length)
    }
  }

  const prevZoomedImage = () => {
    if (zoomedVehicle) {
      setZoomedImageIndex((prev) => (prev - 1 + zoomedVehicle.vehicle.images.length) % zoomedVehicle.vehicle.images.length)
    }
  }

  return (
    <section id="fleet" className="py-32 relative overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black">
      {/* Animated background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span className="text-yellow-400 font-bold text-sm tracking-wider uppercase">Premium Collection</span>
            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>
          <h2 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
            <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">{t.title}</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent animate-gradient">
              {t.titleGradient}
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto font-light">
            {t.subtitle}
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {t.vehicles.map((vehicle, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden bg-gradient-to-br from-zinc-900/50 to-black border border-zinc-800/50 hover:border-yellow-500/50 transition-all duration-700 rounded-3xl backdrop-blur-sm cursor-pointer"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleCardClick(vehicle, index)}
              style={{
                transform: hoveredCard === index ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: hoveredCard === index ? '0 25px 50px -12px rgba(234, 179, 8, 0.25)' : 'none'
              }}
            >
              {/* Glowing edge effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-transparent to-amber-500/20 blur-xl"></div>
              </div>

              {/* Image container */}
              <div className="relative overflow-hidden rounded-t-3xl h-72 md:h-80 lg:h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black"></div>
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <img
                    src={vehicle.images[currentImageIndices[index] || 0] || "/placeholder.svg"}
                    alt={vehicle.name}
                    className="w-full h-full object-contain transition-all duration-700 group-hover:scale-110"
                    style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.6))' }}
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Navigation arrows */}
                {vehicle.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => prevImage(index, e)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/80 backdrop-blur-md border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-yellow-500 hover:border-yellow-500 hover:scale-110 z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-7 h-7 text-white" />
                    </button>
                    <button
                      onClick={(e) => nextImage(index, e)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/80 backdrop-blur-md border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-yellow-500 hover:border-yellow-500 hover:scale-110 z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-7 h-7 text-white" />
                    </button>
                  </>
                )}

                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {vehicle.images.map((_, imgIndex) => (
                    <div
                      key={imgIndex}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        (currentImageIndices[index] || 0) === imgIndex
                          ? 'w-8 bg-yellow-400 shadow-lg shadow-yellow-400/50'
                          : 'w-2 bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>

                {/* Year badge */}
                <Badge className="absolute top-6 left-6 bg-black/90 backdrop-blur-md text-white border border-yellow-500/50 font-bold px-5 py-2.5 text-sm shadow-2xl shadow-yellow-500/30 z-10">
                  <Zap className="w-4 h-4 mr-1.5 inline text-yellow-400" />
                  {vehicle.year}
                </Badge>

                {/* Category badge */}
                <Badge className="absolute top-6 right-6 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black border-0 font-black px-6 py-3 text-xs rounded-full shadow-2xl shadow-yellow-500/40 tracking-wider uppercase z-10">
                  {vehicle.category}
                </Badge>
              </div>

              {/* Content section */}
              <div className="p-8">
                <h3 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-yellow-400 transition-colors duration-300">
                  {vehicle.name}
                </h3>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {vehicle.features.map((feature, i) => (
                    <Badge
                      key={i}
                      className="bg-zinc-900/80 backdrop-blur-sm text-zinc-300 border border-zinc-700/50 text-xs px-4 py-2 rounded-lg font-medium hover:border-yellow-500/50 hover:text-yellow-400 hover:bg-zinc-800/80 transition-all duration-300"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>

                {/* Price and CTA */}
                <div className="flex items-end justify-between pt-6 border-t border-zinc-800/50">
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                        {vehicle.price}
                      </span>
                      <span className="text-lg text-zinc-500 font-bold">DH</span>
                    </div>
                    <div className="text-sm text-zinc-500 font-medium">{t.perDay}</div>
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBooking(vehicle)
                    }}
                    className="relative bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-500 hover:via-amber-500 hover:to-yellow-600 text-black font-black px-8 py-6 rounded-2xl shadow-2xl shadow-yellow-500/30 transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/50 group/btn overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {t.book}
                      <Shield className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></div>
                  </Button>
                </div>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Card>
          ))}
        </div>
      </div>

      {/* ZOOMED MODAL */}
      {zoomedVehicle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-fadeIn"
          onClick={() => setZoomedVehicle(null)}
        >
          <button
            onClick={() => setZoomedVehicle(null)}
            className="absolute top-8 right-8 w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-yellow-500 hover:border-yellow-500 transition-all duration-300 z-50 group"
          >
            <X className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <div className="relative w-full max-w-7xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full h-[80vh] flex items-center justify-center">
              <img
                src={zoomedVehicle.vehicle.images[zoomedImageIndex]}
                alt={zoomedVehicle.vehicle.name}
                className="max-w-full max-h-full object-contain"
                style={{ filter: 'drop-shadow(0 30px 60px rgba(234, 179, 8, 0.3))' }}
              />
              {zoomedVehicle.vehicle.images.length > 1 && (
                <>
                  <button
                    onClick={prevZoomedImage}
                    className="absolute left-8 w-20 h-20 rounded-full bg-black/80 backdrop-blur-md border-2 border-white/30 flex items-center justify-center hover:bg-yellow-500 hover:border-yellow-500 hover:scale-110 transition-all duration-300"
                  >
                    <ChevronLeft className="w-10 h-10 text-white" />
                  </button>
                  <button
                    onClick={nextZoomedImage}
                    className="absolute right-8 w-20 h-20 rounded-full bg-black/80 backdrop-blur-md border-2 border-white/30 flex items-center justify-center hover:bg-yellow-500 hover:border-yellow-500 hover:scale-110 transition-all duration-300"
                  >
                    <ChevronRight className="w-10 h-10 text-white" />
                  </button>
                </>
              )}
            </div>

            <div className="mt-8 text-center">
              <h3 className="text-4xl font-black text-white mb-4">
                {zoomedVehicle.vehicle.name}
              </h3>
              <div className="flex gap-4 justify-center items-center mt-6 flex-wrap">
                {zoomedVehicle.vehicle.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setZoomedImageIndex(idx)}
                    className={`relative w-24 h-24 rounded-xl overflow-hidden border-4 transition-all duration-300 ${
                      idx === zoomedImageIndex
                        ? 'border-yellow-400 scale-110 shadow-lg shadow-yellow-400/50'
                        : 'border-white/20 hover:border-yellow-400/50 hover:scale-105'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${zoomedVehicle.vehicle.name} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
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