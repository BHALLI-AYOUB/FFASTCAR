import { getAdminSession, isAdminConfigured } from "@/lib/admin/auth"
import { AdminApp } from "@/components/admin/admin-app"
import { LoginForm } from "@/components/admin/login-form"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  if (!isAdminConfigured()) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg items-center px-4">
        <div className="space-y-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-sm text-amber-100">
          <h1 className="text-lg font-semibold text-white">Administration non configurée</h1>
          <p>
            Définissez <code>ADMIN_EMAIL</code>, <code>ADMIN_PASSWORD_HASH</code> et <code>ADMIN_SESSION_SECRET</code> dans les variables
            d&apos;environnement (sur Vercel, ou dans <code>.env.local</code> en local), puis redémarrez. La procédure est dans docs/ADMIN.md.
          </p>
        </div>
      </main>
    )
  }

  const session = await getAdminSession()
  return session ? <AdminApp email={session.email} /> : <LoginForm />
}
