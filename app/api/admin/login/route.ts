import {
  adminJson,
  checkCredentials,
  clearFailures,
  clientIp,
  createSession,
  isRateLimited,
  isSameOrigin,
  recordFailure,
} from "@/lib/admin/auth"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return adminJson({ error: "unauthorized" }, 403)

  const ip = clientIp(request)
  if (isRateLimited(ip)) return adminJson({ error: "too_many_attempts" }, 429)

  let email = ""
  let password = ""
  try {
    const body = (await request.json()) as { email?: unknown; password?: unknown }
    email = typeof body.email === "string" ? body.email : ""
    password = typeof body.password === "string" ? body.password : ""
  } catch {
    // treated as wrong credentials below
  }

  if (!(await checkCredentials(email, password))) {
    recordFailure(ip)
    return adminJson({ error: "invalid_credentials" }, 401)
  }

  clearFailures(ip)
  await createSession()
  return adminJson({ ok: true })
}
