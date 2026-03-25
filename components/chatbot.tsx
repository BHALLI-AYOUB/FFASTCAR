"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Send, MessageCircle, ArrowLeft } from "lucide-react"

export function Chatbot({ language: initialLanguage }: { language: "fr" | "en" }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([])
  const [input, setInput] = useState("")
  const [chatLanguage, setChatLanguage] = useState<"fr" | "en">(initialLanguage)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const translations = {
    fr: {
      greeting: "Bonjour 👋 Je suis l'assistant virtuel AB FAST CAR, ici pour vous aider a trouver ce que vous cherchez. Comment puis-je vous aider?",
      placeholder: "Tapez votre message...",
      send: "Envoyer",
      online: "En ligne",
      brandName: "AB FAST CAR",
      today: "Aujourd'hui",
      suggestions: [
        "💰 Voir les prix",
        "🚗 Disponibilite",
        "📝 Reserver",
        "📍 Livraison",
        "⏰ Horaires",
        "🎯 Meilleure voiture"
      ],
      responses: {
        prix: "💰 Nos prix varient de 349 DH/jour (Clio 5) a 8000 DH/jour (Mercedes G63). Prix moyens: Citadines 350-600 DH, Berlines 700-1200 DH, SUV Luxe 1300-3000 DH, Ultra Luxe 3500-8000 DH.",
        disponibilite: "✅ Toutes nos 14 voitures sont disponibles! Mercedes G63, Porsche Cayenne, Range Rover Sport, Porsche Macan T, VW Touareg, Range Evoque, Mercedes GLA, Cupra Formentor, Cupra Leon, Clio 5 et plus!",
        reservation: "📝 Reservation facile: 1️⃣ Choisissez votre voiture 2️⃣ Cliquez 'Reserver' 3️⃣ Remplissez le formulaire avec dates et infos 4️⃣ Nous vous contactons sous 2h pour confirmation!",
        livraison: "🚗 Livraison GRATUITE a Rabat! Service disponible dans tout le Maroc (Casablanca, Marrakech, Tanger, Fes...). Livraison a l'aeroport possible. Demandez un devis!",
        horaires: "⏰ Service 24/7 disponible! Reservations: 9h-20h tous les jours. Livraison flexible selon vos besoins. Assistance d'urgence disponible!",
        meilleure: "🎯 Pour vous recommander: Budget? Nombre de passagers? Usage (ville/voyage)? Nos tops: Mercedes G63 (ultra luxe), Porsche Cayenne (sport), Range Rover (prestige), Cupra Leon (economique sport)!",
        assurance: "🛡️ Assurance COMPLETE incluse! Couverture tous risques, assistance 24/7, kilometrage illimite sur certains modeles. Franchise variable selon vehicule.",
        carburant: "⛽ Politique carburant: Prise avec plein, retour avec plein. Option carburant prepaye disponible. Consommation moyenne fournie.",
        permis: "📜 Documents requis: Permis de conduire valide (+1 an min), Carte identite/Passeport, Justificatif de domicile, Caution par carte bancaire.",
        merci: "De rien! Je suis toujours la pour vous aider. N'hesitez pas si vous avez d'autres questions! 😊",
        contact: "📞 Contactez-nous: WhatsApp disponible (voir bouton vert), Email, ou reservez directement sur le site. Reponse garantie sous 2h!",
        default: "Je peux vous aider avec: Prix, Disponibilite, Reservation, Livraison, Horaires, Assurance, Documents requis, Recommandations. Que voulez-vous savoir? 🚗✨"
      }
    },
    en: {
      greeting: "Hello 👋 I'm AB FAST CAR virtual assistant, here to help you find what you're looking for. How can I help you?",
      placeholder: "Type your message...",
      send: "Send",
      online: "Online",
      brandName: "AB FAST CAR",
      today: "Today",
      suggestions: [
        "💰 See prices",
        "🚗 Availability",
        "📝 Book now",
        "📍 Delivery",
        "⏰ Schedule",
        "🎯 Best car"
      ],
      responses: {
        prix: "💰 Our prices range from 349 DH/day for a Clio 5 to 8000 DH/day for a Mercedes G63. Would you like to see our entire fleet?",
        disponibilite: "✅ All our cars are available for booking! Which car interests you?",
        reservation: "📝 To book: 1️⃣ Choose your car 2️⃣ Click 'Book' 3️⃣ Fill the form 4️⃣ We contact you quickly!",
        merci: "You're welcome! I'm always here to help. Don't hesitate if you have more questions! 😊",
        default: "I'm here to help! Ask me about our cars, prices or bookings. 🚗✨"
      }
    }
  }

  const t = translations[chatLanguage]

  const switchLanguage = () => {
    const newLang = chatLanguage === "fr" ? "en" : "fr"
    setChatLanguage(newLang)
    if (messages.length > 0 && messages[0].isBot) {
      const updatedMessages = [...messages]
      updatedMessages[0] = { text: translations[newLang].greeting, isBot: true }
      setMessages(updatedMessages)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = { text: input, isBot: false }
    setMessages([...messages, userMessage])

    setTimeout(() => {
      const botResponse = getBotResponse(input.toLowerCase())
      setMessages(prev => [...prev, { text: botResponse, isBot: true }])
    }, 800)

    setInput("")
  }

  const getBotResponse = (userInput: string) => {
    if (userInput.includes("prix") || userInput.includes("price") || userInput.includes("💰")) {
      return t.responses.prix
    }
    if (userInput.includes("disponib") || userInput.includes("availab") || userInput.includes("🚗")) {
      return t.responses.disponibilite
    }
    if (userInput.includes("reser") || userInput.includes("book") || userInput.includes("📝")) {
      return t.responses.reservation
    }
    if (userInput.includes("merci") || userInput.includes("thank")) {
      return t.responses.merci
    }
    return t.responses.default
  }

  const handleSuggestionClick = (suggestion: string) => {
    const userMessage = { text: suggestion, isBot: false }
    setMessages([...messages, userMessage])

    setTimeout(() => {
      const botResponse = getBotResponse(suggestion.toLowerCase())
      setMessages(prev => [...prev, { text: botResponse, isBot: true }])
    }, 800)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => {
          setIsOpen(true)
          if (messages.length === 0) {
            setMessages([{ text: t.greeting, isBot: true }])
          }
        }}
        className="fixed bottom-24 right-6 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 hover:from-yellow-500 hover:to-amber-700 shadow-2xl shadow-yellow-500/50 transition-all duration-300 hover:scale-110"
      >
        <MessageCircle className="h-8 w-8 text-black" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] bg-white flex flex-col overflow-hidden rounded-3xl shadow-2xl">
      {/* Header avec switch langue intégré */}
      <div className="p-4 bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white font-black text-base">{t.brandName}</span>
            </div>
            <p className="text-xs text-white/80 font-medium">{t.online}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Switch langue dans le header */}
          <Button
            onClick={switchLanguage}
            className="bg-white/20 hover:bg-white/30 text-white font-black px-4 py-2 rounded-full text-sm backdrop-blur-sm border border-white/30"
          >
            {chatLanguage === "fr" ? "EN" : "FR"}
          </Button>
          
          <Button
            onClick={() => {
              setIsOpen(false)
              setMessages([])
            }}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="text-center mb-4">
            <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
              {t.today}
            </span>
          </div>

          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${message.isBot ? "justify-start" : "justify-end"}`}
            >
              {message.isBot && (
                <div className="flex gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center flex-shrink-0 shadow-md">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="max-w-[70%] bg-white p-3 rounded-2xl rounded-tl-none shadow-md">
                    <p className="text-sm text-gray-800 leading-relaxed">{message.text}</p>
                  </div>
                </div>
              )}
              {!message.isBot && (
                <div className="max-w-[70%] bg-gradient-to-r from-yellow-400 to-amber-500 p-3 rounded-2xl rounded-tr-none shadow-md">
                  <p className="text-sm text-black font-medium">{message.text}</p>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        <div className="p-3 bg-white border-t border-gray-200">
          <div className="flex flex-wrap gap-2 justify-center">
            {t.suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 bg-white text-gray-700 text-xs font-medium rounded-full border border-gray-300 hover:border-yellow-500 hover:bg-yellow-50 transition-all shadow-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder={t.placeholder}
              className="flex-1 bg-gray-100 text-gray-800 px-4 py-3 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-gray-500"
            />
            <Button
              onClick={handleSend}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-full shadow-lg transition-all hover:scale-105"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-gray-50 text-center border-t border-gray-200">
          <p className="text-xs text-gray-400">Powered by AB FAST CAR</p>
        </div>
    </Card>
  )
}
