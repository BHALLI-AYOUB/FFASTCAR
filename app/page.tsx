"use client"

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
  return (
    <div className="relative min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src="/abfastcar/mercedes-g63.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/20 to-background" />
      </div>

      <div className="relative z-10">
        <Navigation />
        <HeroSection />
        <BrandsSection />
        <AboutSection />
        <StatsSection />
        <FeaturesSection />
        <FleetSection />
        <ProcessSection />
        <TestimonialsSection />
        <ContactSection />
        
        <Footer />
      </div>

      <WhatsAppButton />
    </div>
  )
}
