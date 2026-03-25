"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Instagram, Sparkles, MessageCircle, Navigation, Clock, Star } from "lucide-react"

const translations = {
  fr: {
    title: "RESTONS EN",
    titleGradient: "CONTACT",
    subtitle: "Notre équipe est à votre disposition 24/7 pour répondre à tous vos besoins",
    name: "Nom complet",
    email: "Email",
    phone: "Téléphone",
    message: "Message",
    whatsapp: "Réserver sur WhatsApp",
    instagram: "Suivez-nous",
    findUs: "Nous Trouver",
    findUsSubtitle: "Venez nous rendre visite à Rabat",
    openNow: "Ouvert 24h/24",
    getDirections: "Obtenir l'itinéraire",
    rating: "4.9/5 sur Google",
    info: {
      phone: "+212 601 66 66 65",
      email: "Abfastcar@gmail.com",
      address: "Rabat, Maroc",
      instagram: "@abfastcar",
    },
  },
  en: {
    title: "GET IN",
    titleGradient: "TOUCH",
    subtitle: "Our team is at your disposal 24/7 to meet all your needs",
    name: "Full name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    whatsapp: "Reserve on WhatsApp",
    instagram: "Follow us",
    findUs: "Find Us",
    findUsSubtitle: "Come visit us in Rabat",
    openNow: "Open 24/7",
    getDirections: "Get Directions",
    rating: "4.9/5 on Google",
    info: {
      phone: "+212 601 66 66 65",
      email: "Abfastcar@gmail.com",
      address: "Rabat, Morocco",
      instagram: "@abfastcar",
    },
  },
}

const contactCards = [
  {
    icon: Phone,
    key: "phone",
    color: "from-blue-400 to-cyan-400",
    bgGlow: "bg-blue-500/20",
  },
  {
    icon: Mail,
    key: "email",
    color: "from-purple-400 to-pink-400",
    bgGlow: "bg-purple-500/20",
  },
  {
    icon: MapPin,
    key: "address",
    color: "from-green-400 to-emerald-400",
    bgGlow: "bg-green-500/20",
  },
  {
    icon: Instagram,
    key: "instagram",
    color: "from-orange-400 to-red-400",
    bgGlow: "bg-orange-500/20",
  },
]

export function ContactSection({ language }: { language: "fr" | "en" }) {
  const t = translations[language]
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [mapHovered, setMapHovered] = useState(false)

  const handleWhatsApp = () => {
    window.open(`https://wa.me/212601666665`, "_blank")
  }

  const handleInstagram = () => {
    window.open(`https://www.instagram.com/abfastcar/`, "_blank")
  }

  const handleDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=Rabat,Maroc`, "_blank")
  }

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes mapPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        @keyframes borderFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pinBounce {
          0%, 100% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-12px) scale(1.1); }
          60% { transform: translateY(-5px) scale(1.05); }
        }
        @keyframes scanline {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        @keyframes radarPing {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .contact-card {
          position: relative;
          overflow: hidden;
        }
        .contact-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
          transform: rotate(45deg);
          transition: all 0.6s;
        }
        .contact-card:hover::before {
          left: 100%;
        }
        .icon-float {
          animation: float 4s ease-in-out infinite;
        }
        .shimmer-text {
          background: linear-gradient(90deg, #fbbf24 0%, #fef3c7 50%, #fbbf24 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .map-border-glow {
          background: linear-gradient(270deg, #fbbf24, #f59e0b, #d97706, #fbbf24);
          background-size: 400% 400%;
          animation: borderFlow 4s ease infinite;
        }
        .pin-bounce {
          animation: pinBounce 2s ease-in-out infinite;
        }
        .scanline {
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, rgba(251,191,36,0.6), transparent);
          animation: scanline 4s linear infinite;
          pointer-events: none;
          z-index: 5;
        }
        .radar-ping {
          animation: radarPing 2s ease-out infinite;
        }
        .radar-ping-delay {
          animation: radarPing 2s ease-out infinite 0.7s;
        }
        .map-iframe-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 1.5rem;
        }
        .map-iframe-wrapper iframe {
          filter: saturate(0.9) contrast(1.05) brightness(0.95);
          transition: filter 0.5s ease;
        }
        .map-iframe-wrapper:hover iframe {
          filter: saturate(1.1) contrast(1.1) brightness(1);
        }
      `}</style>

      <section id="contact" className="py-32 relative overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Sparkles className="h-10 w-10 text-yellow-400 animate-pulse" />
              <h2 className="text-6xl md:text-7xl font-black tracking-tight">
                <span className="text-white">{t.title} </span>
                <span className="shimmer-text">{t.titleGradient}</span>
              </h2>
              <Sparkles className="h-10 w-10 text-yellow-400 animate-pulse" style={{animationDelay: '0.5s'}} />
            </div>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
              <p className="text-xl text-zinc-400 font-light italic max-w-2xl">{t.subtitle}</p>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
            </div>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactCards.map((card, index) => (
              <div
                key={index}
                className="contact-card group cursor-pointer"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={card.key === 'instagram' ? handleInstagram : undefined}
              >
                <div className={`relative bg-gradient-to-br from-zinc-900 to-black rounded-3xl p-8 text-center transition-all duration-500 border-2 ${hoveredCard === index ? 'border-transparent scale-105' : 'border-zinc-800'}`}>
                  {hoveredCard === index && (
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${card.color} opacity-20 blur-xl`} />
                  )}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 ${card.bgGlow} rounded-full blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500`} />
                  <div className="relative z-10 mb-6">
                    <div className={`icon-float inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${card.color} p-1 group-hover:scale-110 transition-transform duration-500`} style={{animationDelay: `${index * 0.2}s`}}>
                      <div className="w-full h-full bg-black rounded-xl flex items-center justify-center">
                        <card.icon className="h-10 w-10 text-white group-hover:scale-125 transition-transform duration-500" />
                      </div>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <h3 className={`text-xl font-bold mb-3 ${hoveredCard === index ? `bg-gradient-to-r ${card.color} bg-clip-text text-transparent` : 'text-white'} transition-all duration-300`}>
                      {t[card.key as keyof typeof t] as string}
                    </h3>
                    <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors text-sm">
                      {t.info[card.key as keyof typeof t.info]}
                    </p>
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl`} />
                </div>
              </div>
            ))}
          </div>

          {/* ═══════════════════════════════════════════════════
              STUNNING MAP SECTION
          ═══════════════════════════════════════════════════ */}
          <div className="relative mb-16">
            {/* Section label */}
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />
              <div className="flex items-center gap-3 px-8 py-3 rounded-full bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 backdrop-blur-sm">
                <Navigation className="w-5 h-5 text-yellow-400 animate-pulse" />
                <span className="text-yellow-400 font-black text-sm tracking-widest uppercase">{t.findUs}</span>
                <Navigation className="w-5 h-5 text-yellow-400 animate-pulse" style={{animationDelay: '0.5s'}} />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />
            </div>

            {/* Map container — the masterpiece */}
            <div
              className="relative group"
              onMouseEnter={() => setMapHovered(true)}
              onMouseLeave={() => setMapHovered(false)}
            >
              {/* Outer animated glow ring */}
              <div className="absolute -inset-1 map-border-glow rounded-[2rem] opacity-70 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              <div className="absolute -inset-0.5 map-border-glow rounded-[2rem] opacity-50 group-hover:opacity-80 transition-opacity duration-500" />

              {/* Main map card */}
              <div className="relative rounded-[1.75rem] overflow-hidden bg-black border border-yellow-500/20">

                {/* Top HUD bar */}
                <div className="relative z-20 flex items-center justify-between px-8 py-5 bg-gradient-to-r from-black via-zinc-950 to-black border-b border-yellow-500/20">
                  {/* Left: branding */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/40">
                        <MapPin className="w-6 h-6 text-black" strokeWidth={2.5} />
                      </div>
                      {/* Radar rings */}
                      <div className="absolute inset-0 rounded-xl border-2 border-yellow-400/60 radar-ping" />
                      <div className="absolute inset-0 rounded-xl border-2 border-yellow-400/40 radar-ping-delay" />
                    </div>
                    <div>
                      <div className="text-white font-black text-lg tracking-wide">ABFastCar</div>
                      <div className="text-yellow-400/80 text-xs font-medium tracking-widest uppercase">Rabat, Maroc</div>
                    </div>
                  </div>

                  {/* Center: status indicators */}
                  <div className="hidden md:flex items-center gap-6">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-green-400 text-xs font-bold tracking-wider">{t.openNow}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400 text-xs font-bold">{t.rating}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-blue-400 text-xs font-bold">24/7</span>
                    </div>
                  </div>

                  {/* Right: directions button */}
                  <button
                    onClick={handleDirections}
                    className="group/btn flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-sm hover:from-yellow-500 hover:to-amber-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-500/30"
                  >
                    <Navigation className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                    {t.getDirections}
                  </button>
                </div>

                {/* MAP IFRAME — big and gorgeous */}
                <div className="map-iframe-wrapper relative" style={{height: '580px'}}>
                  {/* Scanline effect */}
                  <div className="scanline" />

                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106376.83796027674!2d-6.9068908!3d33.9715904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76b871f50c5c1%3A0x7ac946ed7408076b!2sRabat!5e0!3m2!1sfr!2sma!4v1710000000000!5m2!1sfr!2sma"
                    width="100%"
                    height="100%"
                    style={{ border: 0, display: 'block' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="ABFastCar Location - Rabat, Maroc"
                  />

                  {/* Corner overlays for cinematic framing */}
                  {/* Top-left corner */}
                  <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none z-10">
                    <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-yellow-400 rounded-tl-lg" />
                  </div>
                  {/* Top-right corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none z-10">
                    <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-yellow-400 rounded-tr-lg" />
                  </div>
                  {/* Bottom-left corner */}
                  <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none z-10">
                    <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-yellow-400 rounded-bl-lg" />
                  </div>
                  {/* Bottom-right corner */}
                  <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none z-10">
                    <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-yellow-400 rounded-br-lg" />
                  </div>

                  {/* Subtle vignette edges */}
                  <div className="absolute inset-0 pointer-events-none z-10"
                    style={{
                      background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)'
                    }}
                  />
                </div>

                {/* Bottom HUD bar */}
                <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 px-8 py-5 bg-gradient-to-r from-black via-zinc-950 to-black border-t border-yellow-500/20">
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-yellow-400" />
                      <span className="text-zinc-300 text-sm font-medium">{t.info.phone}</span>
                    </div>
                    <div className="w-px h-4 bg-zinc-700" />
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-yellow-400" />
                      <span className="text-zinc-300 text-sm font-medium">{t.info.email}</span>
                    </div>
                    <div className="w-px h-4 bg-zinc-700" />
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-yellow-400" />
                      <span className="text-zinc-300 text-sm font-medium">{t.info.address}</span>
                    </div>
                  </div>
                  {/* Live indicator */}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                    <span className="text-yellow-400/70 text-xs font-mono tracking-widest uppercase">Live Location</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col items-center gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 blur-2xl opacity-50 group-hover:opacity-75 transition-opacity rounded-full" />
              <Button
                onClick={handleWhatsApp}
                className="relative bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-black font-bold text-lg px-16 py-8 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 border-4 border-black"
              >
                <MessageCircle className="mr-3 h-7 w-7" />
                {t.whatsapp}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 blur-xl opacity-30" />
              <p className="relative text-2xl font-bold text-white px-8 py-4 bg-gradient-to-r from-zinc-900 to-black rounded-full border-2 border-yellow-400/50">
                ⚡ Réponse rapide garantie !
              </p>
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <div className="mt-20 flex justify-center">
            <div className="relative">
              <div className="h-1 w-96 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}