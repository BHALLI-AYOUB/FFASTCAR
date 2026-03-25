"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Sparkles } from "lucide-react"

interface NavigationProps {
  language: "fr" | "en"
  setLanguage: (lang: "fr" | "en") => void
}

const translations = {
  fr: {
    home: "Accueil",
    about: "À Propos",
    fleet: "Flotte",
    services: "Services",
    testimonials: "Témoignages",
    contact: "Contact",
  },
  en: {
    home: "Home",
    about: "About",
    fleet: "Fleet",
    services: "Services",
    testimonials: "Testimonials",
    contact: "Contact",
  },
}

export function Navigation({ language, setLanguage }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const t = translations[language]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      
      // Track active section
      const sections = ["home", "about", "fleet", "services", "testimonials", "contact"]
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setMobileMenuOpen(false)
      setActiveSection(id)
    }
  }

  const navItems = [
    { id: "home", label: t.home },
    { id: "about", label: t.about },
    { id: "fleet", label: t.fleet },
    { id: "services", label: t.services },
    { id: "testimonials", label: t.testimonials },
    { id: "contact", label: t.contact },
  ]

  return (
    <>
      <style>{`
        @keyframes shimmer-nav {
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
        
        .nav-shimmer {
          background: linear-gradient(
            90deg,
            rgba(0, 0, 0, 0.9) 0%,
            rgba(250, 204, 21, 0.1) 50%,
            rgba(0, 0, 0, 0.9) 100%
          );
          background-size: 200% auto;
          animation: shimmer-nav 3s linear infinite;
        }
        
        .mobile-menu-slide {
          animation: slideDown 0.3s ease-out;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-black/95 backdrop-blur-xl border-b-2 border-yellow-400/30 shadow-2xl shadow-yellow-400/10' 
          : 'bg-black/80 backdrop-blur-lg border-b border-yellow-500/20'
      }`}>
        {/* Top Shimmer Line */}
        <div className="nav-shimmer absolute top-0 left-0 right-0 h-1" />
        
        <div className="mx-auto max-w-7xl px-6">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>
            {/* Logo */}
            <button 
              onClick={() => scrollToSection("home")} 
              className="flex items-center gap-3 group relative"
            >
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className={`relative transition-all duration-300 ${scrolled ? 'h-10 w-auto' : 'h-12 w-auto'}`}>
                  <img
                    src="/images/logo-20ab-20300pp-20.png"
                    alt="AB FAST CAR"
                    className="h-full w-auto object-contain brightness-0 invert group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              
              {/* Text Logo */}
              <div className="hidden sm:block">
                <div className="text-xl font-black">
                  <span className="bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">AB FAST</span>
                  <span className="text-white ml-1">CAR</span>
                </div>
                <div className="text-[10px] text-yellow-400/70 tracking-widest">LUXURY RENTAL</div>
              </div>
            </button>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg group ${
                    activeSection === item.id
                      ? 'text-yellow-400'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {/* Active Indicator */}
                  {activeSection === item.id && (
                    <div className="absolute inset-0 bg-yellow-400/10 rounded-lg border border-yellow-400/30" />
                  )}
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/5 rounded-lg transition-all duration-300" />
                  
                  <span className="relative z-10">{item.label}</span>
                  
                  {/* Bottom Line */}
                  <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-300 ${
                    activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
                  className="relative bg-gradient-to-br from-zinc-900 to-black text-yellow-400 hover:text-yellow-300 font-bold rounded-xl px-5 py-2 border-2 border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 hover:scale-105"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {language === "fr" ? "FR" : "EN"}
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden relative w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg shadow-yellow-400/30"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-black" />
                ) : (
                  <Menu className="h-6 w-6 text-black" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="mobile-menu-slide lg:hidden py-6 space-y-2 border-t border-yellow-400/20">
              {navItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-yellow-400/20 text-yellow-400 border-l-4 border-yellow-400'
                      : 'text-white/80 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
                  }`}
                  style={{animationDelay: `${index * 0.05}s`}}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Glow Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50" />
      </nav>
    </>
  )
}
