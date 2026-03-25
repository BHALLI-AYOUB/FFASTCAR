"use client"

import { Instagram, Facebook, Mail, Phone, MapPin, Clock, Award, Sparkles } from "lucide-react"

const translations = {
  fr: {
    company: "AB FAST CAR",
    tagline: "Location de voitures de luxe au Maroc",
    description: "Votre partenaire de confiance pour une expérience de conduite exceptionnelle",
    rights: "Tous droits réservés.",
    terms: "Conditions",
    privacy: "Confidentialité",
    phone: "+212 601 66 66 65",
    email: "Abfastcar@gmail.com",
    address: "Rabat, Maroc",
    hours: "Disponible 24/7",
    quality: "Service Premium Garanti",
  },
  en: {
    company: "AB FAST CAR",
    tagline: "Luxury car rental in Morocco",
    description: "Your trusted partner for an exceptional driving experience",
    rights: "All rights reserved.",
    terms: "Terms",
    privacy: "Privacy",
    phone: "+212 601 66 66 65",
    email: "Abfastcar@gmail.com",
    address: "Rabat, Morocco",
    hours: "Available 24/7",
    quality: "Premium Service Guaranteed",
  },
}

export function Footer({ language }: { language: "fr" | "en" }) {
  const t = translations[language]

  return (
    <>
      <style>{`
        @keyframes float-icon {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        @keyframes shimmer-line {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(250, 204, 21, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(250, 204, 21, 0.6);
          }
        }
        
        .social-icon {
          transition: all 0.3s ease;
        }
        
        .social-icon:hover {
          animation: float-icon 0.6s ease-in-out;
        }
        
        .shimmer-border {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(250, 204, 21, 0.5),
            transparent
          );
          background-size: 200% auto;
          animation: shimmer-line 3s linear infinite;
        }
      `}</style>

      <footer className="relative overflow-hidden bg-gradient-to-b from-zinc-950 to-black border-t-2 border-yellow-400/20">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl" />
        </div>

        {/* Top Decorative Line */}
        <div className="shimmer-border h-1 w-full" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h3 className="text-4xl font-black mb-2">
                  <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                    {t.company.split(" ")[0]} {t.company.split(" ")[1]}
                  </span>{" "}
                  <span className="text-white">{t.company.split(" ")[2]}</span>
                </h3>
                <p className="text-yellow-400 text-lg font-semibold mb-3">{t.tagline}</p>
                <p className="text-zinc-400 leading-relaxed max-w-md">{t.description}</p>
              </div>

              {/* Quality Badge */}
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400/10 to-amber-500/10 border-2 border-yellow-400/30 rounded-full px-6 py-3 backdrop-blur-sm">
                <Award className="h-6 w-6 text-yellow-400" />
                <span className="text-white font-bold">{t.quality}</span>
              </div>
            </div>

            {/* Quick Contact */}
            <div>
              <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                Contact Rapide
              </h4>
              <div className="space-y-4">
                <a
                  href={`tel:${t.phone}`}
                  className="flex items-center gap-3 text-zinc-400 hover:text-yellow-400 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center group-hover:bg-yellow-400/20 transition-colors">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span className="text-sm">{t.phone}</span>
                </a>
                <a
                  href={`mailto:${t.email}`}
                  className="flex items-center gap-3 text-zinc-400 hover:text-yellow-400 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center group-hover:bg-yellow-400/20 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <span className="text-sm">{t.email}</span>
                </a>
                <div className="flex items-center gap-3 text-zinc-400">
                  <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="text-sm">{t.address}</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                  <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center">
                    <Clock className="h-5 w-5" />
                  </div>
                  <span className="text-sm">{t.hours}</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                Suivez-nous
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://www.instagram.com/abfastcar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon group"
                >
                  <div className="relative bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl p-6 hover:scale-110 transition-all duration-300">
                    <Instagram className="h-8 w-8 text-white" />
                    <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/10 transition-all" />
                  </div>
                </a>
                <a
                  href="https://facebook.com/abfastcar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon group"
                >
                  <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 hover:scale-110 transition-all duration-300">
                    <Facebook className="h-8 w-8 text-white" />
                    <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/10 transition-all" />
                  </div>
                </a>
                <a
                  href="https://wa.me/212601666665"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon group"
                >
                  <div className="relative bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 hover:scale-110 transition-all duration-300">
                    <Phone className="h-8 w-8 text-white" />
                    <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/10 transition-all" />
                  </div>
                </a>
                <a
                  href={`mailto:${t.email}`}
                  className="social-icon group"
                >
                  <div className="relative bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 hover:scale-110 transition-all duration-300">
                    <Mail className="h-8 w-8 text-white" />
                    <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/10 transition-all" />
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-zinc-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Copyright */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <p className="text-zinc-400 text-sm">
                  © 2025 <span className="text-yellow-400 font-semibold">{t.company}</span>. {t.rights}
                </p>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-6 text-sm">
                <a href="#" className="text-zinc-400 hover:text-yellow-400 transition-colors font-medium">
                  {t.terms}
                </a>
                <span className="text-zinc-700">•</span>
                <a href="#" className="text-zinc-400 hover:text-yellow-400 transition-colors font-medium">
                  {t.privacy}
                </a>
                <span className="text-zinc-700">•</span>
                <span className="text-zinc-500">{t.phone}</span>
              </div>
            </div>

            {/* Made with love */}
            <div className="text-center mt-8">
              <p className="text-zinc-600 text-xs flex items-center justify-center gap-2">
                Made with <span className="text-red-500 animate-pulse">❤️</span> in Morocco
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Glow Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50" />
      </footer>
    </>
  )
}
