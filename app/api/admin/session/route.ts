import { adminJson, getAdminSession } from "@/lib/admin/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await getAdminSession()
  return adminJson(session ? { authenticated: true, email: session.email } : { authenticated: false })
}
