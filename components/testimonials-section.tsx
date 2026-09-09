"use client"

import { Card } from "@/components/ui/card"
import { Star, Quote, Sparkles } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "next-intl"

type Testimonial = {
  name: string
  role: string
  image: string
  rating: number
  text: string
}

export function TestimonialsSection() {
  const t = useTranslations("testimonials")
  const testimonials = t.raw("testimonials") as Testimonial[]
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

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
        
        @keyframes star-twinkle {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }
        
        @keyframes quote-float {
          0%, 100% {
            transform: translateY(0px) rotate(-10deg);
          }
          50% {
            transform: translateY(-15px) rotate(-10deg);
          }
        }
        
        .testimonial-card {
          position: relative;
          overflow: hidden;
        }
        
        .testimonial-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(250, 204, 21, 0.1),
            transparent
          );
          transition: left 0.5s;
        }
        
        .testimonial-card:hover::before {
          left: 100%;
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
        
        .star-icon {
          animation: star-twinkle 2s ease-in-out infinite;
        }
        
        .quote-icon {
          animation: quote-float 4s ease-in-out infinite;
        }
        
        .float-sparkle {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <section id="testimonials" className="py-20 sm:py-32 relative overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-24">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Sparkles className="float-sparkle h-10 w-10 text-yellow-400" />
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight">
                <span className="text-white">{t("title")} </span>
                <span className="shimmer-text">{t("titleGradient")}</span>
              </h2>
              <Sparkles className="float-sparkle h-10 w-10 text-yellow-400" style={{animationDelay: '1s'}} />
            </div>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
              <p className="text-xl text-zinc-400 font-light italic">{t("subtitle")}</p>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
            </div>

            {/* 5 Stars Rating Display */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="star-icon h-8 w-8 fill-yellow-400 text-yellow-400" 
                    style={{animationDelay: `${i * 0.2}s`}}
                  />
                ))}
              </div>
              <span className="text-yellow-400 font-bold text-2xl">5.0</span>
              <span className="text-zinc-500">/ 5</span>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="testimonial-card group bg-gradient-to-br from-zinc-900/90 to-black/90 backdrop-blur-xl border-2 border-zinc-800 hover:border-yellow-400/50 rounded-3xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Quote Icon */}
                <div className="quote-icon absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="h-10 w-10 sm:h-16 sm:w-16 text-yellow-400" />
                </div>

                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-400/0 to-amber-500/0 ${hoveredIndex === index ? 'from-yellow-400/5 to-amber-500/5' : ''} transition-all duration-500`} />

                {/* Content */}
                <div className="relative z-10">
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 fill-yellow-400 text-yellow-400 transition-transform duration-300 ${hoveredIndex === index ? 'scale-125' : ''}`}
                        style={{transitionDelay: `${i * 0.05}s`}}
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-zinc-300 leading-relaxed mb-8 group-hover:text-white transition-colors duration-300 relative">
                    <span className="text-yellow-400 text-3xl font-serif absolute -left-2 -top-2">"</span>
                    {testimonial.text}
                    <span className="text-yellow-400 text-3xl font-serif">"</span>
                  </p>

                  {/* Author Section */}
                  <div className="flex items-center gap-4 pt-6 border-t border-zinc-800">
                    <div className="relative">
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 blur-md ${hoveredIndex === index ? 'opacity-50' : 'opacity-0'} transition-opacity duration-300`} />
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="relative h-14 w-14 rounded-full border-3 border-yellow-400 group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <div className={`font-bold text-lg ${hoveredIndex === index ? 'text-yellow-400' : 'text-white'} transition-colors duration-300`}>
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Accent Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl`} />
              </Card>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-20 text-center">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 blur-xl opacity-50 animate-pulse" />
              <p className="relative text-2xl font-bold text-white px-10 py-5 bg-gradient-to-r from-zinc-900 to-black rounded-full border-2 border-yellow-400">
                ⭐ Plus de 500+ avis 5 étoiles !
              </p>
            </div>
          </div>

          {/* Bottom Decorative Line */}
          <div className="mt-16 flex justify-center">
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
