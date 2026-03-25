"use client"

import { Car, Shield, Clock, Award, Sparkles, TrendingUp } from "lucide-react"
import { useState } from "react"

interface AboutSectionProps {
  language: "fr" | "en"
}

const translations = {
  fr: {
    subtitle: "À PROPOS DE NOUS",
    title: "AB FAST CAR",
    tagline: "Votre Partenaire de Confiance pour la Location de Voitures de Luxe",
    description:
      "Depuis notre création, AB FAST CAR s'est imposé comme une référence dans la location de véhicules au Maroc. Nous proposons une expérience fiable et premium avec une flotte variée : citadines, berlines, SUV, voitures familiales et modèles de luxe Nous mettons un point d'honneur à offrir un service client personnalisé, une disponibilité 24h/7j et une prise en charge professionnelle. Notre objectif est de garantir bien plus qu'une simple location : une expérience de conduite agréable, sécurisée et adaptée à chaque besoin.",
    mission: "Notre Mission",
    missionText:
      "Offrir à nos clients une expérience fluide et de qualité, avec des véhicules adaptés à tous les budgets et à toutes les occasions. Grâce à un service irréprochable, une grande flexibilité et une équipe attentif à chaque détail, nous accompagnons nos clients dans tous leurs déplacements, qu'ils soient personnels, professionnels ou touristiques.",
    values: [
      {
        icon: Shield,
        title: "Confiance",
        description: "Des véhicules entretenus avec soin et une transparence totale.",
        color: "from-blue-400 to-cyan-400",
        bgGlow: "bg-blue-500/20"
      },
      {
        icon: Award,
        title: "Excellence",
        description: "Un large choix de voitures pour chaque occasion.",
        color: "from-yellow-400 to-orange-400",
        bgGlow: "bg-yellow-500/20"
      },
      {
        icon: Clock,
        title: "Disponibilité",
        description: "Service 24h/7j et livraison partout au Maroc.",
        color: "from-purple-400 to-pink-400",
        bgGlow: "bg-purple-500/20"
      },
      {
        icon: Car,
        title: "Innovation",
        description: "Les derniers modèles et technologies automobiles.",
        color: "from-green-400 to-emerald-400",
        bgGlow: "bg-green-500/20"
      },
    ],
  },
  en: {
    subtitle: "ABOUT US",
    title: "AB FAST CAR",
    tagline: "Your Trusted Partner for Luxury Car Rental",
    description:
      "Since our inception, AB FAST CAR has established itself as the leader in luxury vehicle rental in Morocco. We offer an exceptional experience with an exclusive fleet of high-end cars, personalized customer service, and 24/7 availability. Our commitment is to provide you with more than just a rental: an unforgettable driving experience.",
    mission: "Our Mission",
    missionText:
      "To offer our clients a premium experience with exceptional vehicles, impeccable service, and total flexibility to meet all your mobility needs.",
    values: [
      {
        icon: Shield,
        title: "Trust",
        description: "Well-maintained vehicles and complete transparency.",
        color: "from-blue-400 to-cyan-400",
        bgGlow: "bg-blue-500/20"
      },
      {
        icon: Award,
        title: "Excellence",
        description: "A premium fleet and superior quality service.",
        color: "from-yellow-400 to-orange-400",
        bgGlow: "bg-yellow-500/20"
      },
      {
        icon: Clock,
        title: "Availability",
        description: "24/7 service and delivery throughout Morocco.",
        color: "from-purple-400 to-pink-400",
        bgGlow: "bg-purple-500/20"
      },
      {
        icon: Car,
        title: "Innovation",
        description: "The latest automotive models and technologies.",
        color: "from-green-400 to-emerald-400",
        bgGlow: "bg-green-500/20"
      },
    ],
  },
}

export function AboutSection({ language }: AboutSectionProps) {
  const t = translations[language]
  const [hoveredValue, setHoveredValue] = useState<number | null>(null)

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
            transform: translateY(-15px);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(250, 204, 21, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(250, 204, 21, 0.6);
          }
        }
        
        @keyframes rotate-border {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
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
        
        .float-icon {
          animation: float 4s ease-in-out infinite;
        }
        
        .value-card {
          position: relative;
          overflow: hidden;
        }
        
        .value-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transform: rotate(45deg);
          transition: all 0.6s;
        }
        
        .value-card:hover::before {
          left: 100%;
        }
      `}</style>

      <section id="about" className="py-32 relative overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 bg-yellow-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-500/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#fbbf2480_1px,transparent_1px),linear-gradient(to_bottom,#fbbf2480_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <TrendingUp className="h-8 w-8 text-yellow-400 animate-pulse" />
              <p className="text-yellow-400 font-bold text-sm tracking-widest uppercase">{t.subtitle}</p>
              <TrendingUp className="h-8 w-8 text-yellow-400 animate-pulse" style={{animationDelay: '0.5s'}} />
            </div>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <Sparkles className="float-icon h-10 w-10 text-yellow-400" />
              <h2 className="text-6xl md:text-7xl font-black shimmer-text tracking-tight">
                {t.title}
              </h2>
              <Sparkles className="float-icon h-10 w-10 text-yellow-400" style={{animationDelay: '1s'}} />
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
              <p className="text-xl text-zinc-400 font-light italic max-w-3xl">{t.tagline}</p>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
            </div>
          </div>

          {/* Main Content Card */}
          <div className="max-w-5xl mx-auto mb-20">
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              
              <div className="relative bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-xl border-2 border-yellow-400/30 rounded-3xl p-10 md:p-14 shadow-2xl">
                {/* Description */}
                <p className="text-lg text-zinc-300 leading-relaxed mb-10">
                  {t.description}
                </p>
                
                {/* Mission Section */}
                <div className="relative pt-10">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                      <Award className="h-6 w-6 text-black" />
                    </div>
                    <h3 className="text-3xl font-black bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
                      {t.mission}
                    </h3>
                  </div>
                  
                  <p className="text-zinc-300 text-lg leading-relaxed">
                    {t.missionText}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className="value-card group"
                  onMouseEnter={() => setHoveredValue(index)}
                  onMouseLeave={() => setHoveredValue(null)}
                >
                  <div className={`relative bg-gradient-to-br from-zinc-900 to-black rounded-3xl p-8 border-2 transition-all duration-500 ${hoveredValue === index ? 'border-transparent scale-105 shadow-2xl' : 'border-zinc-800'}`}>
                    {/* Gradient Border Effect */}
                    {hoveredValue === index && (
                      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${value.color} opacity-20 blur-xl`} />
                    )}
                    
                    {/* Glow Background */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 ${value.bgGlow} rounded-full blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500`} />
                    
                    {/* Icon Container */}
                    <div className="relative z-10 mb-6">
                      <div className={`float-icon inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} p-1 group-hover:scale-110 transition-transform duration-500`} style={{animationDelay: `${index * 0.2}s`}}>
                        <div className="w-full h-full bg-black rounded-xl flex items-center justify-center">
                          <Icon className="h-8 w-8 text-white group-hover:scale-125 transition-transform duration-500" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className={`text-2xl font-black mb-3 transition-all duration-300 ${hoveredValue === index ? `bg-gradient-to-r ${value.color} bg-clip-text text-transparent` : 'text-white'}`}>
                        {value.title}
                      </h3>
                      <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                        {value.description}
                      </p>
                    </div>
                    
                    {/* Number Badge */}
                    <div className={`absolute top-6 right-6 w-10 h-10 rounded-full bg-gradient-to-br ${value.color} flex items-center justify-center text-black font-black text-lg opacity-20 group-hover:opacity-100 transition-opacity duration-500`}>
                      {index + 1}
                    </div>
                    
                    {/* Bottom Accent Line */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${value.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl`} />
                  </div>
                </div>
              )
            })}
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
