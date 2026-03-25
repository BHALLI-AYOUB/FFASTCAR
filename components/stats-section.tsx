const translations = {
  fr: {
    stats: [
      { value: "24/7", label: "Service disponible", type: "text" },
      { value: "100%", label: "Véhicules premium", type: "text" },
      { value: null, label: "Livraison nationale", type: "flag" },
      { value: "500+", label: "Clients satisfaits", type: "text" },
    ],
  },
  en: {
    stats: [
      { value: "24/7", label: "Available service", type: "text" },
      { value: "100%", label: "Premium vehicles", type: "text" },
      { value: null, label: "National delivery", type: "flag" },
      { value: "500+", label: "Happy clients", type: "text" },
    ],
  },
}

const MoroccoFlag = () => (
  <svg
    width="80"
    height="60"
    viewBox="0 0 900 600"
    className="mx-auto mb-2"
  >
    {/* Fond rouge */}
    <rect width="900" height="600" fill="#C1272D" />
    
    {/* Étoile verte */}
    <path
      d="M 450,150 L 489,267 L 612,267 L 511,342 L 550,459 L 450,384 L 350,459 L 389,342 L 288,267 L 411,267 Z"
      fill="#006233"
      stroke="#006233"
      strokeWidth="8"
    />
  </svg>
)

export function StatsSection({ language }: { language: "fr" | "en" }) {
  const t = translations[language]

  return (
    <section className="py-20 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {t.stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8 text-center hover:scale-105 hover:border-primary/50 transition-all duration-300"
            >
              {stat.type === "flag" ? (
                <MoroccoFlag />
              ) : (
                <div className="text-5xl font-black text-gradient-gold mb-2">{stat.value}</div>
              )}
              <p className="text-muted-foreground font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
