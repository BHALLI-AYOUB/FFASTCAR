"use client"

import { Car, Users, MapPin, Clock, Star } from "lucide-react"

const translations = {
  fr: {
    title: "Nos Avantages",
    titleGradient: "Pourquoi Nous Choisir ?",
    subtitle: "Une expérience premium et personnalisée",
    features: [
      {
        icon: Users,
        title: "Service Chauffeur VIP",
        description: "Des chauffeurs professionnels et discrets pour vos déplacements d'affaires ou événements privés.",
        color: "from-blue-400 to-cyan-400",
        bgGlow: "bg-blue-500/20"
      },
      {
        icon: MapPin,
        title: "Livraison à Domicile",
        description: "Nous livrons votre véhicule directement à l'adresse de votre choix, partout au Maroc.",
        color: "from-purple-400 to-pink-400",
        bgGlow: "bg-purple-500/20"
      },
      {
        icon: Car,
        title: "Voitures Récentes & Luxe",
        description: "Une flotte exclusivement composée de véhicules récents, entretenus avec le plus grand soin.",
        color: "from-yellow-400 to-orange-400",
        bgGlow: "bg-yellow-500/20"
      },
      {
        icon: Clock,
        title: "Assistance 24/7",
        description: "Notre équipe est disponible jour et nuit pour répondre à vos besoins et garantir votre sérénité.",
        color: "from-green-400 to-emerald-400",
        bgGlow: "bg-green-500/20"
      },
    ],
  },
  en: {
    title: "Our Advantages",
    titleGradient: "Why Choose Us?",
    subtitle: "A premium and personalized experience",
    features: [
      {
        icon: Users,
        title: "VIP Chauffeur Service",
        description: "Professional and discreet drivers for your business trips or private events.",
        color: "from-blue-400 to-cyan-400",
        bgGlow: "bg-blue-500/20"
      },
      {
        icon: MapPin,
        title: "Home Delivery",
        description: "We deliver your vehicle directly to the address of your choice, anywhere in Morocco.",
        color: "from-purple-400 to-pink-400",
        bgGlow: "bg-purple-500/20"
      },
      {
        icon: Car,
        title: "Recent & Luxury Cars",
        description: "A fleet exclusively composed of recent vehicles, maintained with the utmost care.",
        color: "from-yellow-400 to-orange-400",
        bgGlow: "bg-yellow-500/20"
      },
      {
        icon: Clock,
        title: "24/7 Assistance",
        description: "Our team is available day and night to meet your needs and ensure your peace of mind.",
        color: "from-green-400 to-emerald-400",
        bgGlow: "bg-green-500/20"
      },
    ],
  },
}

export function FeaturesSection({ language }: { language: "fr" | "en" }) {
  const t = translations[language]

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
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
        
        @keyframes rotate-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes shimmer-slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .feature-card {
          position: relative;
          overflow: hidden;
        }
        
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: left 0.5s;
        }
        
        .feature-card:hover::before {
          left: 100%;
        }
        
        .icon-container {
          animation: float 6s ease-in-out infinite;
        }
        
        .star-icon {
          animation: rotate-slow 20s linear infinite;
        }
      `}</style>

      <section id="services" className="py-32 relative overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-24">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Star className="star-icon h-10 w-10 text-yellow-400" />
              <h2 className="text-5xl md:text-6xl font-black text-white">
                {t.title}
              </h2>
              <Star className="star-icon h-10 w-10 text-yellow-400" style={{animationDirection: 'reverse'}} />
            </div>
            
            <p className="text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent mb-6">
              {t.titleGradient}
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
              <p className="text-xl text-zinc-400 font-light italic">{t.subtitle}</p>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.features.map((feature, index) => (
              <div
                key={index}
                className="feature-card group relative bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-xl border-2 border-zinc-800 rounded-3xl p-8 hover:border-transparent transition-all duration-500 cursor-pointer"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* Gradient Border on Hover */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl`} />
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                
                {/* Glow Effect Background */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 ${feature.bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-700`} />
                
                {/* Icon Container */}
                <div className="icon-container mb-8 relative" style={{animationDelay: `${index * 0.2}s`}}>
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} p-1 group-hover:scale-110 transition-transform duration-500`}>
                    <div className="w-full h-full bg-black rounded-xl flex items-center justify-center">
                      <feature.icon className="h-10 w-10 text-white group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
                    </div>
                  </div>
                  
                  {/* Decorative Circles */}
                  <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className={`absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} style={{transitionDelay: '0.1s'}} />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className={`text-2xl font-bold mb-4 text-white group-hover:bg-gradient-to-r group-hover:${feature.color} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500`}>
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Number Badge */}
                <div className={`absolute top-6 right-6 w-10 h-10 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center text-black font-black text-lg opacity-20 group-hover:opacity-100 transition-opacity duration-500`}>
                  {index + 1}
                </div>

                {/* Bottom Accent Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl`} />
              </div>
            ))}
          </div>

          {/* Bottom Decorative Element */}
          <div className="mt-24 flex justify-center">
            <div className="relative">
              <div className="h-1 w-64 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
