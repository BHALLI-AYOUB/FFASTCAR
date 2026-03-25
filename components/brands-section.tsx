"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"

const translations = {
  fr: {
    title: "NOS MARQUES",
    titleHighlight: "PREMIUM",
    subtitle: "Les plus grandes marques automobiles à votre service",
  },
  en: {
    title: "OUR",
    titleHighlight: "PREMIUM BRANDS",
    subtitle: "The world's leading automotive brands at your service",
  },
}

const brands = [
  { 
    name: "Porsche",
    logo: "https://logos-world.net/wp-content/uploads/2021/04/Porsche-Logo.png"
  },
  { 
    name: "Audi",
    logo: "https://1000logos.net/wp-content/uploads/2018/05/Audi-logo.jpg"
  },
  { 
    name: "Volkswagen",
    logo: "https://logos-world.net/wp-content/uploads/2021/04/Volkswagen-Logo.png"
  },
  { 
    name: "BMW",
    logo: "https://logos-world.net/wp-content/uploads/2020/04/BMW-Logo.png"
  },
  { 
    name: "Mercedes",
    logo: "https://logos-world.net/wp-content/uploads/2020/05/Mercedes-Benz-Logo.png"
  },
  { 
    name: "Range Rover",
    logo: "https://images.seeklogo.com/logo-png/23/1/range-rover-logo-png_seeklogo-230449.png"
  },
  { 
    name: "Renault",
    logo: "https://1000logos.net/wp-content/uploads/2021/03/Renault-logo.png"
  },
  { 
    name: "Cupra",
    logo: "https://1000logos.net/wp-content/uploads/2020/06/Cupra-Logo.png"
  },
  { 
    name: "Hyundai",
    logo: "https://1000logos.net/wp-content/uploads/2018/04/Hyundai-Logo.png"
  },
]

export function BrandsSection({ language }: { language: "fr" | "en" }) {
  const t = translations[language]
  const [currentIndex, setCurrentIndex] = useState(0)
  const brandsPerPage = 6
  const totalPages = Math.ceil(brands.length / brandsPerPage)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalPages)
    }, 5000)

    return () => clearInterval(interval)
  }, [totalPages])

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(250, 204, 21, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(250, 204, 21, 0.6);
          }
        }
        
        .shimmer-text {
          background: linear-gradient(
            90deg,
            #fbbf24 0%,
            #fef3c7 50%,
            #fbbf24 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        
        .brand-card {
          position: relative;
          overflow: hidden;
        }
        
        .brand-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(250, 204, 21, 0.2),
            transparent
          );
          transition: left 0.5s;
        }
        
        .brand-card:hover::before {
          left: 100%;
        }
        
        .sparkle-icon {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Sparkles className="sparkle-icon h-8 w-8 text-yellow-400" />
              <h2 className="text-6xl md:text-7xl font-black tracking-tight">
                <span className="text-white">{t.title} </span>
                <span className="shimmer-text">{t.titleHighlight}</span>
              </h2>
              <Sparkles className="sparkle-icon h-8 w-8 text-yellow-400" style={{animationDelay: '1s'}} />
            </div>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
              <p className="text-zinc-400 text-xl font-light italic">{t.subtitle}</p>
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
            </div>
          </div>

          {/* Carousel Section */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 border-4 border-black"
              aria-label="Previous"
            >
              <ChevronLeft className="h-8 w-8" strokeWidth={3} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 border-4 border-black"
              aria-label="Next"
            >
              <ChevronRight className="h-8 w-8" strokeWidth={3} />
            </button>

            {/* Brands Container */}
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900/50 to-black/50 backdrop-blur-sm border border-zinc-800 p-8">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {Array.from({ length: totalPages }).map((_, slideIndex) => (
                  <div key={slideIndex} className="min-w-full">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {brands.slice(slideIndex * brandsPerPage, slideIndex * brandsPerPage + brandsPerPage).map((brand, index) => (
                        <div
                          key={index}
                          className="brand-card group relative bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-10 flex items-center justify-center transition-all duration-500 border-2 border-zinc-800 hover:border-yellow-400 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20"
                        >
                          {/* Glow Effect on Hover */}
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/0 to-yellow-600/0 group-hover:from-yellow-400/5 group-hover:to-yellow-600/5 transition-all duration-500" />
                          
                          {/* Logo Container */}
                          <div className="relative w-full h-28 flex items-center justify-center">
                            <img 
                              src={brand.logo} 
                              alt={brand.name}
                              className={`max-w-full max-h-full object-contain transition-all duration-500 drop-shadow-2xl ${
                                ['Renault', 'Cupra', 'SEAT', 'Hyundai', 'Dacia'].includes(brand.name)
                                  ? 'filter invert brightness-100 group-hover:brightness-110 group-hover:scale-110'
                                  : 'filter brightness-110 contrast-110 group-hover:brightness-125 group-hover:scale-110'
                              }`}
                            />
                          </div>
                          
                          {/* Brand Name on Hover */}
                          <div className="absolute bottom-3 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-yellow-400 font-bold text-sm tracking-wider">{brand.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex 
                    ? "w-16 h-3 bg-gradient-to-r from-yellow-400 to-amber-500 shadow-lg shadow-yellow-400/50" 
                    : "w-3 h-3 bg-zinc-700 hover:bg-zinc-600"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>

          {/* Bottom Decorative Line */}
          <div className="mt-20 flex justify-center">
            <div className="relative">
              <div className="h-1 w-96 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
