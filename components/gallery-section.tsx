"use client"

import { useState } from "react"
import { X } from "lucide-react"

const translations = {
  fr: {
    title: "Galerie",
    titleGradient: "Exclusive",
    subtitle: "Découvrez nos véhicules et tarifs",
  },
  en: {
    title: "Exclusive",
    titleGradient: "Gallery",
    subtitle: "Discover our vehicles and pricing",
  },
}

const galleryImages = [
  {
    url: "/images/whatsapp-20image-202025-12-28-20at-2014.jpeg",
    alt: "Mercedes G63 AMG & Porsche Cayenne",
  },
  {
    url: "/images/whatsapp-20image-202025-12-28-20at-2014.jpeg",
    alt: "Collection de voitures de luxe - Porsche, Range Rover, Focus, Bugatti",
  },
  {
    url: "/images/whatsapp-20image-202025-12-28-20at-2014.jpeg",
    alt: "Voitures Manuelles - Peugeot 208 & Renault Clio 5",
  },
  {
    url: "/images/whatsapp-20image-202025-12-28-20at-2014.jpeg",
    alt: "Voitures Standard - Touareg, Tucson, Accent, Clio 5",
  },
  {
    url: "/images/whatsapp-20image-202025-12-28-20at-2014.jpeg",
    alt: "Voitures de Luxe - Porsche, Mercedes, Range Rover",
  },
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

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl aspect-[3/4] group cursor-pointer"
              onClick={() => setSelectedImage(image.url)}
            >
              <img
                src={image.url || "/placeholder.svg"}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="text-white text-lg font-semibold">Cliquez pour agrandir</p>
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
