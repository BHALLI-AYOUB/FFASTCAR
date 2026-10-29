"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import { buttonClass, inputClass } from "@/components/admin/fields"

const LOGIN_ERRORS: Record<string, string> = {
  invalid_credentials: "Email ou mot de passe incorrect.",
  too_many_attempts: "Trop d'essais. Réessayez dans 15 minutes.",
  unauthorized: "Connexion refusée. Ouvrez cette page directement depuis l'adresse du site.",
}

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (res.ok) return window.location.reload()
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      setError(LOGIN_ERRORS[data.error ?? ""] ?? "La connexion a échoué. Réessayez.")
    } catch {
      setError("Pas de connexion. Réessayez.")
    }
    setPending(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-2xl border border-white/10 bg-zinc-900/60 p-6 sm:p-8">
        <div className="space-y-3 text-center">
          <img src="/images/logo-ab-fastcar-white.webp" alt="AB FAST CAR" width={240} height={107} className="mx-auto h-12 w-auto" />
          <h1 className="text-lg font-semibold text-white">Administration</h1>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="admin-email" className="text-sm font-medium text-zinc-200">
            Email
          </label>
          <input id="admin-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="admin-password" className="text-sm font-medium text-zinc-200">
            Mot de passe
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>
        <p role="alert" className="min-h-5 text-sm text-red-400">
          {error}
        </p>
        <button type="submit" disabled={pending} className={`${buttonClass.primary} w-full`}>
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
          Se connecter
        </button>
      </form>
    </main>
  )
}
