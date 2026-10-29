"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

/**
 * The editor (vehicles, photos, contact, texts) is loaded only once the
 * session is open: the login screen never downloads it.
 */
const AdminEditor = dynamic(() => import("@/components/admin/admin-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center gap-3 text-zinc-300" role="status">
      <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
      Chargement de l&apos;éditeur…
    </div>
  ),
})

export function AdminApp({ email }: { email: string }) {
  return <AdminEditor email={email} />
}
