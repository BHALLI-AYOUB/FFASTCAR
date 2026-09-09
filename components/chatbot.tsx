"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Send, MessageCircle, ArrowLeft } from "lucide-react"
import { useTranslations } from "next-intl"
import { useMarket } from "@/components/locale-provider"
import { formatPrice } from "@/lib/currency"

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const t = useTranslations("chatbot")
  const { market } = useMarket()
  const suggestions = t.raw("suggestions") as string[]

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
      return t("responses.prix", {
        min: formatPrice(349, market),
        max: formatPrice(8000, market),
      })
    }
    if (userInput.includes("disponib") || userInput.includes("availab") || userInput.includes("🚗")) {
      return t("responses.disponibilite")
    }
    if (userInput.includes("reser") || userInput.includes("book") || userInput.includes("📝")) {
      return t("responses.reservation")
    }
    if (userInput.includes("merci") || userInput.includes("thank")) {
      return t("responses.merci")
    }
    return t("responses.default")
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
            setMessages([{ text: t("greeting"), isBot: true }])
          }
        }}
        className="fixed bottom-[4.5rem] right-4 sm:bottom-24 sm:right-6 z-50 h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 hover:from-yellow-500 hover:to-amber-700 shadow-2xl shadow-yellow-500/50 transition-all duration-300 hover:scale-110"
      >
        <MessageCircle className="h-5 w-5 sm:h-8 sm:w-8 text-black" />
      </Button>
    )
  }

  return (
    <Card className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:right-6 sm:bottom-6 z-50 w-auto sm:w-[400px] h-[75vh] max-h-[600px] bg-white flex flex-col overflow-hidden rounded-3xl shadow-2xl">
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
              <span className="text-white font-black text-base">{t("brandName")}</span>
            </div>
            <p className="text-xs text-white/80 font-medium">{t("online")}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
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
              {t("today")}
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
            {suggestions.map((suggestion, index) => (
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
              placeholder={t("placeholder")}
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
