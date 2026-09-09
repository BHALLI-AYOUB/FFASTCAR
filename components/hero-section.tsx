"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Instagram, Facebook, Phone, ChevronDown, Infinity, PlaneTakeoff, LayoutGrid, UserCheck, Headphones } from "lucide-react"
import { useTranslations } from "next-intl"

const FEATURE_ICONS = [Infinity, PlaneTakeoff, LayoutGrid, UserCheck, Headphones]

const carImages = [
  { src: "/abfastcar/lamborghini-urus.jpg", name: "Lamborghini Urus", tag: "Super SUV" },
  { src: "/abfastcar/mercedes-g63.jpg", name: "Mercedes G63", tag: "Ultra Luxe" },
  { src: "/abfastcar/range-rover-sport.jpg", name: "Range Rover Sport", tag: "Prestige" },
  { src: "/abfastcar/mercedes-e-class-w214.jpg", name: "Mercedes Classe E", tag: "Berline Luxe" },
  { src: "/abfastcar/porsche-cayenne.jpg", name: "Porsche Cayenne", tag: "Sport SUV" },
  { src: "/abfastcar/porsche-macan-t.jpg", name: "Porsche Macan T", tag: "Sport SUV" },
  { src: "/abfastcar/volkswagen-touareg.jpg", name: "Volkswagen Touareg", tag: "SUV Luxe" },
  { src: "/abfastcar/mercedes-amg-cla-45-s.jpg", name: "Mercedes-AMG CLA 45 S", tag: "Berline Sport" },
  { src: "/abfastcar/range-rover-evoque.jpg", name: "Range Rover Evoque", tag: "SUV Compact" },
  { src: "/abfastcar/audi-a3-s-line.jpg", name: "Audi A3 S-Line", tag: "Berline Sport" },
  { src: "/abfastcar/mercedes-classe-a-pack-amg.jpg", name: "Mercedes Classe A", tag: "Berline Sport" },
  { src: "/abfastcar/cupra-formentor.jpg", name: "Cupra Formentor", tag: "SUV Sport" },
]

export function HeroSection() {
  const t = useTranslations("hero")
  const heroFeatures = t.raw("features") as { label: string; sub: string }[]
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    carImages.forEach(({ src }) => {
      const img = new Image()
      img.src = src
    })
    setTimeout(() => setIsLoaded(true), 100)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carImages.length)
    }, 5000)
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

        /* ── STAGGERED ENTRANCE ── */
        .pre-rise { opacity: 0; }
        @keyframes rise {
          from { opacity: 0; transform: translateY(26px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .rise { opacity: 0; animation: rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .rise-1 { animation-delay: 0.05s; }
        .rise-2 { animation-delay: 0.18s; }
        .rise-3 { animation-delay: 0.30s; }
        .rise-4 { animation-delay: 0.44s; }
        .rise-5 { animation-delay: 0.58s; }
        .rise-6 { animation-delay: 0.72s; }

        /* ── SHOWCASE PANEL ── */
        @keyframes showcaseIn {
          from { opacity: 0; transform: translateY(40px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .showcase-in {
          opacity: 0;
          animation: showcaseIn 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.25s forwards;
        }
        @keyframes showcaseFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-14px); }
        }
        .showcase-float { animation: showcaseFloat 6s ease-in-out infinite; }
        .showcase-frame::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 28px;
          box-shadow: inset 0 0 60px rgba(0,0,0,0.55);
          pointer-events: none;
        }

        /* Light sweep across the frame */
        @keyframes sheen {
          0%   { transform: translateX(-130%) skewX(-18deg); }
          55%  { transform: translateX(130%)  skewX(-18deg); }
          100% { transform: translateX(130%)  skewX(-18deg); }
        }
        .showcase-sheen {
          position: absolute;
          top: 0; bottom: 0; left: 0;
          width: 55%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent);
          animation: sheen 5.5s ease-in-out infinite;
          z-index: 2;
        }

        /* Car name swap */
        @keyframes labelIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .label-in { animation: labelIn 0.7s ease-out both; }

        /* CTA breathing glow */
        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 0 30px rgba(250,204,21,0.35); }
          50%      { box-shadow: 0 0 52px rgba(250,204,21,0.72); }
        }
        .cta-pulse { animation: ctaPulse 3.2s ease-in-out infinite; }

        /* ── AMBIENT BACKDROP ── */
        .hero-blob {
          position: absolute;
          width: 46vw; height: 46vw;
          max-width: 620px; max-height: 620px;
          border-radius: 9999px;
          filter: blur(90px);
          pointer-events: none;
        }
        .hero-blob-a {
          top: -12%; left: -10%;
          background: rgba(250,204,21,0.16);
          animation: blobDrift 17s ease-in-out infinite;
        }
        .hero-blob-b {
          bottom: -18%; right: -8%;
          background: rgba(245,158,11,0.13);
          animation: blobDrift 21s ease-in-out infinite reverse;
        }
        @keyframes blobDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(60px, -45px) scale(1.15); }
        }
        .hero-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.032) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.032) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse at 50% 40%, black 10%, transparent 72%);
          -webkit-mask-image: radial-gradient(ellipse at 50% 40%, black 10%, transparent 72%);
        }

        /* Respect reduced-motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .rise, .showcase-in { animation-duration: 0.01ms; animation-delay: 0s; opacity: 1; }
          .showcase-float, .showcase-sheen, .cta-pulse, .hero-blob { animation: none; }
        }

        /* ── SLOGAN ── */
        .hero-slogan {
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #f5c518;
          display: flex;
          align-items: center;
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
      <section id="home" className="relative min-h-screen overflow-hidden pt-28 pb-20 lg:pt-32">
        {/* ── Ambient backdrop: the current car, blurred far out of focus ── */}
        <div className="absolute inset-0 z-0 bg-black">
          {carImages.map((car, index) => (
            <div
              key={car.src}
              className={`absolute inset-0 transition-opacity duration-[1600ms] ease-in-out ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={car.src}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover scale-125 blur-3xl opacity-40"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-black" />
          {/* Slow-drifting colour blobs */}
          <div className="hero-blob hero-blob-a" />
          <div className="hero-blob hero-blob-b" />
          {/* Fine grid texture */}
          <div className="hero-grid" />
        </div>

        {/* ── Content ── */}
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center min-h-[calc(100vh-13rem)]">

            {/* LEFT — copy */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <div className={`hero-slogan justify-center lg:justify-start mb-7 ${isLoaded ? "rise rise-1" : "pre-rise"}`}>
                {t("slogan")}
              </div>

              <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.95]">
                <span className={`block bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent ${isLoaded ? "rise rise-2" : "pre-rise"}`}>
                  {t("title1")}
                </span>
                <span className={`block text-white mt-2 ${isLoaded ? "rise rise-3" : "pre-rise"}`}>
                  {t("title2")}
                </span>
              </h1>

              <div className={`flex items-center justify-center lg:justify-start gap-4 pt-7 ${isLoaded ? "rise rise-4" : "pre-rise"}`}>
                <div className="h-px w-12 shrink-0 bg-gradient-to-r from-transparent via-yellow-400 to-yellow-400 hidden lg:block" />
                <p className="hero-subtitle text-lg md:text-xl text-gray-300 font-light max-w-xl italic">
                  {t("subtitle")}
                </p>
              </div>

              {/* CTAs */}
              <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center pt-10 ${isLoaded ? "rise rise-5" : "pre-rise"}`}>
                <Button
                  onClick={openWhatsApp}
                  size="lg"
                  className="cta-pulse w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-black text-base px-10 py-7 rounded-full shadow-[0_0_35px_rgba(250,204,21,0.45)] transition-all duration-300 hover:scale-105"
                >
                  <Phone className="mr-3 h-5 w-5" />
                  {t("cta")}
                </Button>

                <Button
                  onClick={scrollToFleet}
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto font-bold text-base px-10 py-7 rounded-full border-2 border-white/40 bg-white/5 backdrop-blur-sm text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 hover:scale-105"
                >
                  {t("secondary")}
                </Button>
              </div>

              {/* Socials */}
              <div className={`flex gap-4 justify-center lg:justify-start items-center pt-10 ${isLoaded ? "rise rise-6" : "pre-rise"}`}>
                <a href="https://www.instagram.com/abfastcar/" target="_blank" rel="noopener noreferrer" className="group" aria-label="Instagram">
                  <div className="w-12 h-12 rounded-full border border-white/25 flex items-center justify-center hover:border-yellow-400 hover:bg-yellow-400/10 hover:scale-110 transition-all duration-300">
                    <Instagram className="h-5 w-5 text-white group-hover:text-yellow-400 transition-colors" />
                  </div>
                </a>
                <a href="https://facebook.com/abfastcar" target="_blank" rel="noopener noreferrer" className="group" aria-label="Facebook">
                  <div className="w-12 h-12 rounded-full border border-white/25 flex items-center justify-center hover:border-yellow-400 hover:bg-yellow-400/10 hover:scale-110 transition-all duration-300">
                    <Facebook className="h-5 w-5 text-white group-hover:text-yellow-400 transition-colors" />
                  </div>
                </a>
              </div>
            </div>

            {/* RIGHT — the car, shown uncropped */}
            <div className={`order-1 lg:order-2 ${isLoaded ? "showcase-in" : "pre-rise"}`}>
              <div className="showcase-float relative mx-auto w-full max-w-[380px] lg:max-w-[460px]">
                {/* Glow behind the frame */}
                <div className="absolute -inset-6 bg-gradient-to-tr from-yellow-500/25 via-amber-400/10 to-transparent blur-3xl rounded-full pointer-events-none" />

                <div className="showcase-frame relative aspect-[4/5] rounded-[28px] overflow-hidden border border-yellow-400/25 bg-black shadow-[0_35px_80px_-15px_rgba(0,0,0,0.9)]">
                  {carImages.map((car, index) => (
                    <img
                      key={car.src}
                      src={car.src}
                      alt={car.name}
                      className={`absolute inset-0 w-full h-full object-cover transition-[opacity,transform] duration-[1600ms] ease-out ${
                        index === currentImageIndex
                          ? "opacity-100 scale-105"
                          : "opacity-0 scale-100"
                      }`}
                    />
                  ))}

                  {/* Light sweep across the glass */}
                  <div className="showcase-sheen pointer-events-none" />

                  {/* Bottom label */}
                  <div className="absolute inset-x-0 bottom-0 pointer-events-none">
                    <div className="h-28 bg-gradient-to-t from-black via-black/75 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div key={currentImageIndex} className="label-in">
                        <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-yellow-400 mb-1">
                          {carImages[currentImageIndex].tag}
                        </div>
                        <div className="text-white text-lg md:text-xl font-black leading-tight">
                          {carImages[currentImageIndex].name}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Corner accents */}
                  <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-yellow-400/70 rounded-tl-lg pointer-events-none" />
                  <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-yellow-400/70 rounded-tr-lg pointer-events-none" />
                </div>

                {/* Progress dots */}
                <div className="flex flex-wrap gap-y-1 justify-center mt-6">
                  {carImages.map((car, index) => (
                    <button
                      key={car.src}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={car.name}
                      aria-current={index === currentImageIndex}
                      // Dot stays small, but the button keeps a 24px tall touch area
                      className="group/dot flex h-8 items-center px-2.5 -my-2"
                    >
                      <span
                        className={`block h-1.5 rounded-full transition-all duration-500 ${
                          index === currentImageIndex
                            ? "w-8 bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]"
                            : "w-1.5 bg-white/25 group-hover/dot:bg-white/60"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down */}
        <button
          onClick={scrollToFleet}
          aria-label={t("secondary")}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/50 hover:text-yellow-400 transition-all duration-300 animate-bounce"
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
            {t("trustText")} <strong>{t("trustBold")}</strong> {t("trustSuffix")}
          </p>

          <div className="trust-sep" />

          {/* Platforms */}
          <div className="plat-wrap">
            <span className="plat-eyebrow">{t("recommended")}</span>
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
          {heroFeatures.map((f, i) => {
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

    </>
  )
}