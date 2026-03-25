"use client"

import { Search, Calendar, Key, ThumbsUp, ArrowRight, Sparkles } from "lucide-react"
import { useState } from "react"

const translations = {
  fr: {
    title: "Comment Ça",
    titleGradient: "Marche",
    subtitle: "Un processus simple en 4 étapes",
    steps: [
      {
        icon: Search,
        title: "Choisissez",
        description: "Parcourez notre flotte et sélectionnez le véhicule parfait pour vos besoins.",
        color: "from-blue-400 to-cyan-400",
        bgColor: "bg-blue-500/20",
        shadowColor: "shadow-blue-500/50"
      },
      {
        icon: Calendar,
        title: "Réservez",
        description: "Choisissez vos dates et confirmez votre réservation en quelques clics.",
        color: "from-purple-400 to-pink-400",
        bgColor: "bg-purple-500/20",
        shadowColor: "shadow-purple-500/50"
      },
      {
        icon: Key,
        title: "Récupérez",
        description: "Nous livrons votre véhicule à l'adresse de votre choix au Maroc.",
        color: "from-yellow-400 to-orange-400",
        bgColor: "bg-yellow-500/20",
        shadowColor: "shadow-yellow-500/50"
      },
      {
        icon: ThumbsUp,
        title: "Profitez",
        description: "Vivez une expérience de conduite exceptionnelle avec notre service premium.",
        color: "from-green-400 to-emerald-400",
        bgColor: "bg-green-500/20",
        shadowColor: "shadow-green-500/50"
      },
    ],
  },
  en: {
    title: "How It",
    titleGradient: "Works",
    subtitle: "A simple process in 4 steps",
    steps: [
      {
        icon: Search,
        title: "Choose",
        description: "Browse our fleet and select the perfect vehicle for your needs.",
        color: "from-blue-400 to-cyan-400",
        bgColor: "bg-blue-500/20",
        shadowColor: "shadow-blue-500/50"
      },
      {
        icon: Calendar,
        title: "Book",
        description: "Choose your dates and confirm your booking in a few clicks.",
        color: "from-purple-400 to-pink-400",
        bgColor: "bg-purple-500/20",
        shadowColor: "shadow-purple-500/50"
      },
      {
        icon: Key,
        title: "Pick Up",
        description: "We deliver your vehicle to the address of your choice in Morocco.",
        color: "from-yellow-400 to-orange-400",
        bgColor: "bg-yellow-500/20",
        shadowColor: "shadow-yellow-500/50"
      },
      {
        icon: ThumbsUp,
        title: "Enjoy",
        description: "Experience exceptional driving with our premium service.",
        color: "from-green-400 to-emerald-400",
        bgColor: "bg-green-500/20",
        shadowColor: "shadow-green-500/50"
      },
    ],
  },
}

export function ProcessSection({ language }: { language: "fr" | "en" }) {
  const t = translations[language]
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <>
      <style>{`
        @keyframes draw-line {
          from {
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.5;
          }
          100% {
            transform: scale(0.8);
            opacity: 1;
          }
        }
        
        @keyframes float-up-down {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
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
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        .step-card {
          position: relative;
          overflow: hidden;
        }
        
        .step-card::before {
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
        
        .step-card:hover::before {
          left: 100%;
        }
        
        .icon-container {
          animation: float-up-down 4s ease-in-out infinite;
        }
        
        .number-badge {
          background: linear-gradient(
            90deg,
            #fbbf24 0%,
            #fef3c7 50%,
            #fbbf24 100%
          );
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        
        .connecting-line {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: draw-line 2s ease-out forwards;
        }
        
        .pulse-ring {
          animation: pulse-ring 2s ease-out infinite;
        }
      `}</style>

      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-yellow-500/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-24">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
              <h2 className="text-5xl md:text-6xl font-black text-white">
                {t.title} <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">{t.titleGradient}</span>
              </h2>
              <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" style={{animationDelay: '0.5s'}} />
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
              <p className="text-xl text-zinc-400 font-light italic">{t.subtitle}</p>
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
            </div>
          </div>

          {/* Steps Container */}
          <div className="relative">
            {/* Connecting Lines SVG */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-1" style={{zIndex: 0}}>
              <svg className="w-full h-full" preserveAspectRatio="none">
                <line 
                  x1="12.5%" 
                  y1="50%" 
                  x2="37.5%" 
                  y2="50%" 
                  stroke="url(#gradient1)" 
                  strokeWidth="3" 
                  className="connecting-line"
                />
                <line 
                  x1="37.5%" 
                  y1="50%" 
                  x2="62.5%" 
                  y2="50%" 
                  stroke="url(#gradient2)" 
                  strokeWidth="3" 
                  className="connecting-line"
                  style={{animationDelay: '0.5s'}}
                />
                <line 
                  x1="62.5%" 
                  y1="50%" 
                  x2="87.5%" 
                  y2="50%" 
                  stroke="url(#gradient3)" 
                  strokeWidth="3" 
                  className="connecting-line"
                  style={{animationDelay: '1s'}}
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                  <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Steps Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative" style={{zIndex: 1}}>
              {t.steps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Arrow Between Steps (Mobile) */}
                  {index < t.steps.length - 1 && (
                    <div className="lg:hidden flex justify-center my-6">
                      <ArrowRight className={`h-8 w-8 text-gradient-to-r ${step.color} animate-bounce`} />
                    </div>
                  )}
                  
                  <div 
                    className="step-card text-center"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Icon Container with Pulse Rings */}
                    <div className="relative mx-auto w-40 h-40 mb-6">
                      {/* Pulse Rings */}
                      <div className={`pulse-ring absolute inset-0 rounded-full bg-gradient-to-br ${step.color} opacity-20`} style={{animationDelay: `${index * 0.2}s`}} />
                      <div className={`pulse-ring absolute inset-0 rounded-full bg-gradient-to-br ${step.color} opacity-20`} style={{animationDelay: `${index * 0.2 + 1}s`}} />
                      
                      {/* Main Icon Circle */}
                      <div className={`icon-container absolute inset-0 rounded-full bg-gradient-to-br from-zinc-900 to-black border-4 ${hoveredIndex === index ? `border-transparent` : 'border-zinc-800'} flex items-center justify-center transition-all duration-500 ${hoveredIndex === index ? 'scale-110' : ''}`} style={{animationDelay: `${index * 0.3}s`}}>
                        {/* Rotating Border */}
                        {hoveredIndex === index && (
                          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.color} opacity-100 animate-spin`} style={{animationDuration: '3s'}} />
                        )}
                        
                        {/* Icon Background */}
                        <div className={`relative z-10 w-36 h-36 rounded-full ${step.bgColor} backdrop-blur-sm flex items-center justify-center`}>
                          <step.icon className={`h-16 w-16 text-white ${hoveredIndex === index ? 'scale-125 rotate-12' : ''} transition-all duration-500`} />
                        </div>
                      </div>
                    </div>

                    {/* Number Badge */}
                    <div className={`number-badge mx-auto w-14 h-14 rounded-full text-black flex items-center justify-center font-black text-2xl mb-6 ${hoveredIndex === index ? 'scale-125 shadow-2xl' : ''} transition-all duration-500 ${hoveredIndex === index ? step.shadowColor : ''}`}>
                      {index + 1}
                    </div>

                    {/* Content Card */}
                    <div className={`relative bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-xl rounded-2xl p-6 border-2 ${hoveredIndex === index ? 'border-transparent' : 'border-zinc-800'} transition-all duration-500 ${hoveredIndex === index ? 'scale-105 shadow-2xl' : ''}`}>
                      {/* Gradient Border */}
                      {hoveredIndex === index && (
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} opacity-20 blur-sm`} />
                      )}
                      
                      <div className="relative z-10">
                        <h3 className={`text-3xl font-black mb-4 ${hoveredIndex === index ? `bg-gradient-to-r ${step.color} bg-clip-text text-transparent` : 'text-white'} transition-all duration-500`}>
                          {step.title}
                        </h3>
                        <p className={`${hoveredIndex === index ? 'text-zinc-300' : 'text-zinc-400'} leading-relaxed transition-colors duration-300`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 text-center">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 blur-xl opacity-50 animate-pulse" />
              <p className="relative text-2xl font-bold text-white px-8 py-4 bg-gradient-to-r from-zinc-900 to-black rounded-full border-2 border-yellow-400">
                🎉 Commencez votre expérience dès maintenant !
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
