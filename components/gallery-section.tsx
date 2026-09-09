"use client"

import { useState } from "react"
import { X } from "lucide-react"

const translations = {
  fr: {
    title: "Galerie",
    titleGradient: "Exclusive",
    subtitle: "Découvrez nos véhicules et tarifs",
    enlarge: "Cliquez pour agrandir",
  },
  en: {
    title: "Exclusive",
    titleGradient: "Gallery",
    subtitle: "Discover our vehicles and pricing",
    enlarge: "Click to enlarge",
  },
}

const galleryImages = [
  { url: "/abfastcar/lamborghini-urus.jpg", alt: "Lamborghini Urus" },
  { url: "/abfastcar/mercedes-g63.jpg", alt: "Mercedes G63" },
  { url: "/abfastcar/range-rover-sport.jpg", alt: "Range Rover Sport Dynamic SE 2025" },
  { url: "/abfastcar/porsche-cayenne.jpg", alt: "Porsche Cayenne" },
  { url: "/abfastcar/mercedes-e-class-w214.jpg", alt: "Mercedes-Benz E-Class W214" },
  { url: "/abfastcar/porsche-macan-t.jpg", alt: "Porsche Macan T 2025" },
  { url: "/abfastcar/mercedes-amg-cla-45-s.jpg", alt: "Mercedes-AMG CLA 45 S 4MATIC+" },
  { url: "/abfastcar/volkswagen-touareg.jpg", alt: "Volkswagen Touareg" },
  { url: "/abfastcar/range-rover-evoque.jpg", alt: "Range Rover Evoque Dynamic SE 2025" },
  { url: "/abfastcar/audi-a3-s-line.jpg", alt: "Audi A3 S-Line Berline" },
]

export function GallerySection({ language }: { language: "fr" | "en" }) {
  const t = translations[language]
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <section className="py-32 relative bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            {t.title} <span className="text-gradient-gold">{t.titleGradient}</span>
          </h2>
          <p className="text-xl text-muted-foreground">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl aspect-[4/5] group cursor-pointer border border-zinc-800/60 hover:border-yellow-500/50 transition-colors duration-300"
              onClick={() => setSelectedImage(image.url)}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-70 group-hover:opacity-95 transition-opacity duration-300" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-white text-xs md:text-sm font-bold leading-tight drop-shadow">{image.alt}</p>
                <p className="text-yellow-400 text-[10px] font-semibold uppercase tracking-wider mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {t.enlarge}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-yellow-400 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedImage || "/placeholder.svg"}
            alt="Price List Preview"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}
