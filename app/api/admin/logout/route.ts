import { adminJson, destroySession, isSameOrigin } from "@/lib/admin/auth"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return adminJson({ error: "unauthorized" }, 403)
  await destroySession()
  return adminJson({ ok: true })
}
