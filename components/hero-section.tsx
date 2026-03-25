"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Instagram, Facebook, Phone, ChevronDown, Infinity, PlaneTakeoff, LayoutGrid, UserCheck, Headphones } from "lucide-react"

const translations = {
  fr: {
    title1: "Location de voitures",
    title2: "au Maroc",
    slogan: "Select & Drive",
    subtitle: "Service premium 24/7 – Large flotte : citadines, berline ,SUV, familiales et modèles de luxe",
    cta: "Réserver maintenant",
    secondary: "Découvrir la flotte",
    recommended: "RECOMMANDÉ PAR",
    trustText: "Partenaires avec",
    trustBold: "500+",
    trustSuffix: "agences de location certifiées",
    features: [
      { label: "Kilométrage illimité", sub: "Roulez sans limite" },
      { label: "Livraison aéroport", sub: "Partout au Maroc" },
      { label: "Large choix", sub: "50+ véhicules" },
      { label: "Chauffeur en option", sub: "Service personnalisé" },
      { label: "Assistance 24h/24", sub: "Toujours disponible" },
    ],
  },
  en: {
    title1: "Car rental",
    title2: "in Morocco",
    slogan: "Select & Drive",
    subtitle: "Premium 24/7 service – Wide fleet of high-end vehicles",
    cta: "Book now",
    secondary: "Discover fleet",
    recommended: "RECOMMENDED BY",
    trustText: "Partners with",
    trustBold: "500+",
    trustSuffix: "certified rental agencies",
    features: [
      { label: "Unlimited mileage", sub: "Drive without limits" },
      { label: "Airport delivery", sub: "All over Morocco" },
      { label: "Wide choice", sub: "50+ vehicles" },
      { label: "Driver option", sub: "Personalized service" },
      { label: "24/7 Assistance", sub: "Always available" },
    ],
  },
}

const FEATURE_ICONS = [Infinity, PlaneTakeoff, LayoutGrid, UserCheck, Headphones]

const carImages = [
  "/WHITECLAA.jpeg",
  "/A3.jpeg",
  "/cupraa.jpeg",
  "/G63FULLBLACK.jpeg",
  "/rangerover.jpeg",
  "/porchecayyene.jpeg",
  "/Q8.jpeg",
  "/whiterange.jpeg",
  "/CLAA.jpeg",
  "/touareg.jpeg",
  "/touareginside.jpeg",
  "/cupra2025.jpeg",
]

export function HeroSection({ language }: { language: "fr" | "en" }) {
  const t = translations[language]
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    carImages.forEach((src) => {
      const img = new Image()
      img.src = src
    })
    setTimeout(() => setIsLoaded(true), 100)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carImages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const scrollToFleet = () => {
    document.getElementById("fleet")?.scrollIntoView({ behavior: "smooth" })
  }

  const openWhatsApp = () => {
    window.open("https://wa.me/212601666665", "_blank")
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');

        .hero-title { font-family: 'Montserrat', sans-serif; }
        .hero-subtitle { font-family: 'Playfair Display', serif; }

        @keyframes floatIn {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hoverFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        .subtitle-animate {
          animation: floatIn 1.2s ease-out forwards, hoverFloat 3s ease-in-out infinite;
          animation-delay: 0s, 1.2s;
        }

        /* ── SLOGAN ── */
        @keyframes sloganIn {
          from { opacity: 0; letter-spacing: 0.35em; }
          to   { opacity: 1; letter-spacing: 0.22em; }
        }
        .hero-slogan {
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #f5c518;
          animation: sloganIn 1s ease-out forwards;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .hero-slogan::before,
        .hero-slogan::after {
          content: '';
          display: inline-block;
          width: 32px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #f5c518);
        }
        .hero-slogan::after {
          background: linear-gradient(90deg, #f5c518, transparent);
        }

        /* ── TRUST BAR ── */
        .trust-wrap {
          background: #07090e;
          border-top: 1px solid rgba(245,197,24,0.09);
          position: relative;
        }
        .trust-wrap::before {
          content: '';
          position: absolute; top: 0; left: 5%; right: 5%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(245,197,24,0.45), transparent);
        }
        .trust-grid {
          max-width: 1100px; margin: 0 auto; padding: 20px 32px;
          display: grid;
          grid-template-columns: auto 1px 1fr 1px auto;
          align-items: center; gap: 30px;
        }
        .trust-sep {
          width: 1px; height: 42px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.09), transparent);
        }

        /* Trustpilot */
        .tp-block { display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
        .tp-logo  { display: flex; align-items: center; gap: 8px; }
        .tp-ico   { width: 22px; height: 22px; fill: #00b67a; flex-shrink: 0; }
        .tp-name  { font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 800; color: #fff; }
        .tp-right { display: flex; flex-direction: column; gap: 5px; }
        .tp-stars { display: flex; gap: 3px; }
        .tp-star  {
          width: 17px; height: 17px; background: #00b67a;
          clip-path: polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
        }
        .tp-meta  { font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.38); letter-spacing: 0.04em; }
        .tp-score { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: #fff; line-height: 1; }

        /* Partner text */
        .partner-txt { font-family: 'Montserrat', sans-serif; font-size: 12px; color: rgba(255,255,255,0.38); text-align: center; line-height: 1.6; }
        .partner-txt strong { color: #fff; font-weight: 700; }

        /* Platform logos */
        .plat-wrap   { display: flex; flex-direction: column; align-items: center; gap: 9px; flex-shrink: 0; }
        .plat-eyebrow { font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.22); }
        .plat-row    { display: flex; align-items: center; gap: 8px; }
        .plat-chip {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 14px; border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          font-family: 'Montserrat', sans-serif;
          font-size: 11.5px; font-weight: 800; letter-spacing: 0.03em;
          cursor: default; transition: all 0.25s;
        }
        .plat-chip:hover { border-color: rgba(245,197,24,0.24); background: rgba(245,197,24,0.05); transform: translateY(-1px); }
        .plat-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        .klook       { color: #ff5722; } .klook .plat-dot       { background: #ff5722; }
        .expedia     { color: #4d9de0; } .expedia .plat-dot     { background: #4d9de0; }
        .tripadvisor { color: #34e0a1; } .tripadvisor .plat-dot { background: #34e0a1; }

        /* ── FEATURES STRIP ── */
        .feat-wrap {
          background: #050709;
          border-top: 1px solid rgba(245,197,24,0.07);
          position: relative;
        }
        .feat-wrap::before {
          content: '';
          position: absolute; top: 0; left: 8%; right: 8%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(245,197,24,0.38), transparent);
        }
        .feat-grid {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(5, 1fr);
          padding: 0 16px;
        }
        .feat-card {
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          padding: 28px 12px 26px;
          position: relative; overflow: hidden; cursor: default;
        }
        .feat-card::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 110%, rgba(245,197,24,0.09) 0%, transparent 68%);
          opacity: 0; transition: opacity 0.45s ease;
        }
        .feat-card:hover::before { opacity: 1; }
        .feat-card:not(:last-child)::after {
          content: '';
          position: absolute; right: 0; top: 22%; bottom: 22%;
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(245,197,24,0.17), transparent);
        }
        /* Top accent bar */
        .feat-bar {
          position: absolute; top: 0; left: 26%; right: 26%; height: 2px;
          background: linear-gradient(90deg, transparent, #f5c518, transparent);
          transform: scaleX(0);
          transition: transform 0.45s cubic-bezier(0.22,1,0.36,1);
          border-radius: 2px;
        }
        .feat-card:hover .feat-bar { transform: scaleX(1); }

        /* Icon box */
        .feat-ico {
          width: 54px; height: 54px; border-radius: 14px;
          border: 1px solid rgba(245,197,24,0.17);
          background: rgba(245,197,24,0.05);
          display: flex; align-items: center; justify-content: center;
          color: #b8860b;
          position: relative;
          transition:
            background 0.35s, border-color 0.35s, color 0.35s,
            transform 0.45s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.35s;
        }
        .feat-card:hover .feat-ico {
          background: rgba(245,197,24,0.13);
          border-color: rgba(245,197,24,0.48);
          color: #f5c518;
          transform: translateY(-6px) scale(1.1);
          box-shadow: 0 10px 28px rgba(245,197,24,0.2);
        }
        @keyframes ring { 0%{transform:scale(1);opacity:0.6;} 100%{transform:scale(1.9);opacity:0;} }
        .feat-ring {
          position: absolute; inset: 0; border-radius: 14px;
          border: 1px solid rgba(245,197,24,0.5);
          pointer-events: none; opacity: 0; transition: opacity 0.15s;
        }
        .feat-card:hover .feat-ring { opacity: 1; animation: ring 0.65s ease-out forwards; }

        /* Labels */
        .feat-lbl {
          font-family: 'Montserrat', sans-serif;
          font-size: 12.5px; font-weight: 700;
          color: rgba(255,255,255,0.84); text-align: center; line-height: 1.25;
          transition: color 0.3s, transform 0.35s;
        }
        .feat-card:hover .feat-lbl { color: #f5c518; transform: translateY(-2px); }
        .feat-sub {
          font-family: 'Montserrat', sans-serif;
          font-size: 10.5px; font-weight: 500;
          color: rgba(255,255,255,0.25); text-align: center; line-height: 1.3;
          transition: color 0.3s, transform 0.35s;
        }
        .feat-card:hover .feat-sub { color: rgba(255,255,255,0.48); transform: translateY(-2px); }

        @media (max-width: 900px) {
          .trust-grid { grid-template-columns: 1fr; gap: 16px; padding: 20px; }
          .trust-sep  { display: none; }
          .tp-block, .plat-wrap { justify-content: center; }
          .feat-grid  { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 540px) {
          .feat-grid { grid-template-columns: repeat(2, 1fr); }
          .feat-card:nth-child(2)::after,
          .feat-card:nth-child(4)::after { display: none; }
        }
      `}</style>

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
        {/* Background Slideshow */}
        <div className="absolute inset-0 z-0">
          {carImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img src={image} alt={`Car ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <div className="space-y-12">
            {/* Main Title */}
            <div className="space-y-4">
              {/* Slogan */}
              <div className="hero-slogan mb-6">{t.slogan}</div>

              <h1 className="hero-title text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter">
                <span className="block bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  {t.title1}
                </span>
                <span className="block text-white mt-2">{t.title2}</span>
              </h1>

              <div className={`flex items-center justify-center gap-4 pt-4 ${isLoaded ? "subtitle-animate" : "opacity-0"}`}>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
                <p className="hero-subtitle text-xl md:text-2xl text-gray-300 font-light max-w-3xl italic">
                  {t.subtitle}
                </p>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Button
                onClick={openWhatsApp}
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg px-16 py-8 rounded-full shadow-[0_0_30px_rgba(250,204,21,0.5)] hover:shadow-[0_0_50px_rgba(250,204,21,0.8)] transition-all duration-300 hover:scale-105"
              >
                <Phone className="mr-3 h-6 w-6" />
                {t.cta}
              </Button>

              <Button
                onClick={scrollToFleet}
                size="lg"
                variant="outline"
                className="font-semibold text-lg px-16 py-8 rounded-full border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-105"
              >
                {t.secondary}
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex gap-6 justify-center items-center pt-8">
              <a href="https://www.instagram.com/abfastcar/" target="_blank" rel="noopener noreferrer" className="group">
                <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center hover:border-yellow-400 hover:bg-yellow-400/10 transition-all duration-300">
                  <Instagram className="h-6 w-6 text-white group-hover:text-yellow-400 transition-colors" />
                </div>
              </a>
              <a href="https://facebook.com/abfastcar" target="_blank" rel="noopener noreferrer" className="group">
                <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center hover:border-yellow-400 hover:bg-yellow-400/10 transition-all duration-300">
                  <Facebook className="h-6 w-6 text-white group-hover:text-yellow-400 transition-colors" />
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Down */}
        <button
          onClick={scrollToFleet}
          className="absolute bottom-8 right-8 z-20 text-white/60 hover:text-yellow-400 transition-all duration-300 animate-bounce"
        >
          <ChevronDown className="h-8 w-8" />
        </button>
      </section>

      {/* ═══════════════════════════════════════
          TRUST BAR
      ═══════════════════════════════════════ */}
      <div className="trust-wrap">
        <div className="trust-grid">

          {/* Trustpilot */}
          <div className="tp-block">
            <div className="tp-logo">
              <svg className="tp-ico" viewBox="0 0 24 24">
                <path d="M12 0L14.7 8.3H23.4L16.4 13.4L19 21.7L12 16.6L5 21.7L7.6 13.4L0.6 8.3H9.3L12 0Z"/>
              </svg>
              <span className="tp-name">Trustpilot</span>
            </div>
            <div className="tp-right">
              <div className="tp-stars">{[...Array(5)].map((_, i) => <div key={i} className="tp-star" />)}</div>
              <span className="tp-meta">Excellent · 4.8 / 5</span>
            </div>
            <span className="tp-score">4.8</span>
          </div>

          <div className="trust-sep" />

          <p className="partner-txt">
            {t.trustText} <strong>{t.trustBold}</strong> {t.trustSuffix}
          </p>

          <div className="trust-sep" />

          {/* Platforms */}
          <div className="plat-wrap">
            <span className="plat-eyebrow">{t.recommended}</span>
            <div className="plat-row">
              <div className="plat-chip klook"><div className="plat-dot" />KLOOK</div>
              <div className="plat-chip expedia"><div className="plat-dot" />expedia</div>
              <div className="plat-chip tripadvisor"><div className="plat-dot" />tripadvisor</div>
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════
          FEATURES STRIP
      ═══════════════════════════════════════ */}
      <div className="feat-wrap">
        <div className="feat-grid">
          {t.features.map((f, i) => {
            const Icon = FEATURE_ICONS[i]
            return (
              <div key={i} className="feat-card">
                <div className="feat-bar" />
                <div className="feat-ico">
                  <div className="feat-ring" />
                  <Icon size={22} strokeWidth={1.6} />
                </div>
                <span className="feat-lbl">{f.label}</span>
                <span className="feat-sub">{f.sub}</span>
              </div>
            )
          })}
        </div>
      </div>
Livraison aéroport
Casablanca & Marrakech
    </>
  )
}