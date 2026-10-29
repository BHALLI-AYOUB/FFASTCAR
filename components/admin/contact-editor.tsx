"use client"

import { ExternalLink } from "lucide-react"

import type { ContactInfo } from "@/lib/content/types"
import { Card, LocalizedField, NumberField, TextField } from "@/components/admin/fields"

export function ContactEditor({ contact, onChange }: { contact: ContactInfo; onChange: (contact: ContactInfo) => void }) {
  const set = (patch: Partial<ContactInfo>) => onChange({ ...contact, ...patch })
  const digits = contact.phoneE164.replace(/\D/g, "")

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card title="Téléphone et WhatsApp" description="Utilisés par les boutons Appeler et WhatsApp de tout le site.">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Téléphone affiché" value={contact.phoneDisplay} onChange={(phoneDisplay) => set({ phoneDisplay })} path="contact.phoneDisplay" placeholder="+212 601 66 66 65" />
          <TextField
            label="Téléphone pour les appels"
            type="tel"
            value={contact.phoneE164}
            onChange={(phoneE164) => set({ phoneE164: phoneE164.replace(/[\s.-]/g, "") })}
            path="contact.phoneE164"
            hint="Format international sans espaces : +212601666665"
          />
        </div>
        <TextField
          label="Numéro WhatsApp"
          value={contact.whatsappNumber}
          onChange={(whatsappNumber) => set({ whatsappNumber: whatsappNumber.replace(/\D/g, "") })}
          path="contact.whatsappNumber"
          hint="Chiffres uniquement, avec l'indicatif et sans le + : 212601666665"
        />
        {digits && digits !== contact.whatsappNumber && (
          <button type="button" onClick={() => set({ whatsappNumber: digits })} className="text-xs text-zinc-400 underline underline-offset-2 hover:text-white">
            Utiliser le même numéro que le téléphone ({digits})
          </button>
        )}
      </Card>

      <Card title="Email et réseaux sociaux">
        <TextField label="Email" type="email" value={contact.email} onChange={(email) => set({ email: email.trim() })} path="contact.email" />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Lien Instagram" type="url" value={contact.instagramUrl} onChange={(instagramUrl) => set({ instagramUrl })} path="contact.instagramUrl" />
          <TextField label="Nom Instagram affiché" value={contact.instagramHandle} onChange={(instagramHandle) => set({ instagramHandle })} path="contact.instagramHandle" placeholder="@abfastcar" />
        </div>
        <TextField label="Lien Facebook" type="url" value={contact.facebookUrl} onChange={(facebookUrl) => set({ facebookUrl })} path="contact.facebookUrl" />
      </Card>

      <Card title="Adresse de l'agence" description="Affichée sur le site et transmise à Google. Laissez la rue et le code postal vides tant qu'ils ne sont pas confirmés.">
        <TextField label="Rue" value={contact.street} onChange={(street) => set({ street })} path="contact.street" />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Code postal" value={contact.postalCode} onChange={(postalCode) => set({ postalCode })} path="contact.postalCode" />
          <TextField
            label="Code pays"
            value={contact.countryCode}
            onChange={(countryCode) => set({ countryCode: countryCode.toUpperCase().slice(0, 2) })}
            path="contact.countryCode"
            hint="2 lettres : MA pour le Maroc."
          />
        </div>
        <LocalizedField label="Ville" value={contact.city} onChange={(city) => set({ city })} path="contact.city" />
        <LocalizedField label="Pays" value={contact.country} onChange={(country) => set({ country })} path="contact.country" />
      </Card>

      <Card title="Position sur la carte" description="Dans Google Maps, faites un clic droit sur l'agence : les deux premiers nombres affichés sont la latitude et la longitude.">
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField label="Latitude" value={contact.latitude} onChange={(latitude) => set({ latitude })} path="contact.latitude" />
          <NumberField label="Longitude" value={contact.longitude} onChange={(longitude) => set({ longitude })} path="contact.longitude" />
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${contact.latitude},${contact.longitude}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-zinc-300 underline underline-offset-2 hover:text-white"
        >
          Vérifier la position sur Google Maps <ExternalLink className="size-3.5" aria-hidden />
        </a>
      </Card>
    </div>
  )
}
