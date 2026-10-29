"use client"

import { createContext, useContext } from "react"

import type { ContactInfo } from "@/lib/content/types"
import type { ClientContent, ClientVehicle } from "@/lib/client-content"

/**
 * The published vehicles and contact details, handed from the server layout
 * to client components. The source of truth is the content store; this is a
 * read-only copy of what was rendered, never a place to save anything.
 */
const ContentContext = createContext<ClientContent | null>(null)

export function ContentProvider({ content, children }: { content: ClientContent; children: React.ReactNode }) {
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}

function useContent(): ClientContent {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error("useContent must be used inside <ContentProvider>")
  return ctx
}

/** Published vehicles in display order (hidden ones are never sent to the client). */
export function useVehicles(): ClientVehicle[] {
  return useContent().vehicles
}

export function useContact(): ContactInfo {
  return useContent().contact
}
