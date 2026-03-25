"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { StatsSection } from "@/components/stats-section"
import { FeaturesSection } from "@/components/features-section"
import { FleetSection } from "@/components/fleet-section"
import { ProcessSection } from "@/components/process-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ContactSection } from "@/components/contact-section"
import { BrandsSection } from "@/components/brands-section"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function Home() {
  const [language, setLanguage] = useState<"fr" | "en">("fr")

  return (
    <div className="relative min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src="/images/whatsapp-20image-202025-12-28-20at-2014.jpeg"
          alt="Background"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/20 to-background" />
      </div>

      <div className="relative z-10">
        <Navigation language={language} setLanguage={setLanguage} />
        <HeroSection language={language} />
        <BrandsSection language={language} />
        <AboutSection language={language} />
        <StatsSection language={language} />
        <FeaturesSection language={language} />
        <FleetSection language={language} />
        <ProcessSection language={language} />
        <TestimonialsSection language={language} />
        <ContactSection language={language} />
        
        <Footer language={language} />
      </div>

      <WhatsAppButton />
    </div>
  )
}
