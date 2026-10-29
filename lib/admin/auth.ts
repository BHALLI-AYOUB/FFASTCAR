import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"
import { cookies } from "next/headers"

/**
 * Admin authentication: one account configured by environment variables.
 *
 *   ADMIN_EMAIL           login email
 *   ADMIN_PASSWORD_HASH   scrypt:<salt>:<hash>, made by `node scripts/hash-admin-password.mjs`
 *   ADMIN_SESSION_SECRET  random string of 32+ characters
 *
 * The password itself is never stored. Sessions are a signed, HttpOnly,
 * SameSite=Strict cookie valid 8 hours; changing the password or the secret
 * signs everyone out. Nothing here is sent to the browser except the cookie.
 */

const scrypt = promisify(scryptCb) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>

const COOKIE_NAME = "abfc_admin"
const SESSION_TTL_MS = 8 * 60 * 60 * 1000
const KEY_LENGTH = 64

type AdminConfig = { email: string; passwordHash: string; secret: string }

function config(): AdminConfig | null {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim()
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!email || !passwordHash?.startsWith("scrypt:") || !secret || secret.length < 32) return null
  return { email, passwordHash, secret }
}

export function isAdminConfigured(): boolean {
  return config() !== null
}

function safeEqual(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b)
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [, saltB64, hashB64] = stored.split(":")
  if (!saltB64 || !hashB64) return false
  const expected = Buffer.from(hashB64, "base64url")
  const actual = await scrypt(password, Buffer.from(saltB64, "base64url"), expected.length || KEY_LENGTH)
  return safeEqual(actual, expected)
}

/** Check the credentials in constant time (the email check does not short-circuit). */
export async function checkCredentials(email: string, password: string): Promise<boolean> {
  const cfg = config()
  if (!cfg) {
    console.error("[admin] ADMIN_EMAIL, ADMIN_PASSWORD_HASH or ADMIN_SESSION_SECRET is missing or invalid")
    return false
  }
  if (password.length === 0 || password.length > 256) return false
  const emailOk = safeEqual(Buffer.from(email.trim().toLowerCase()), Buffer.from(cfg.email))
  const passwordOk = await verifyPassword(password, cfg.passwordHash)
  return emailOk && passwordOk
}

/* ---------- Session cookie ---------- */

type SessionPayload = { e: string; x: number; n: string }

/** Signing key bound to the password hash: a new password revokes sessions. */
function signingKey(cfg: AdminConfig): Buffer {
  return createHmac("sha256", cfg.secret).update(cfg.passwordHash).digest()
}

function sign(payload: string, cfg: AdminConfig): string {
  return createHmac("sha256", signingKey(cfg)).update(payload).digest("base64url")
}

function encodeSession(email: string, cfg: AdminConfig): string {
  const payload: SessionPayload = { e: email, x: Date.now() + SESSION_TTL_MS, n: randomBytes(9).toString("base64url") }
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url")
  return `${body}.${sign(body, cfg)}`
}

function decodeSession(token: string | undefined, cfg: AdminConfig): { email: string } | null {
  if (!token) return null
  const [body, signature] = token.split(".")
  if (!body || !signature) return null
  if (!safeEqual(Buffer.from(signature), Buffer.from(sign(body, cfg)))) return null
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload
    if (typeof payload.x !== "number" || payload.x < Date.now() || payload.e !== cfg.email) return null
    return { email: payload.e }
  } catch {
    return null
  }
}

export async function createSession(): Promise<void> {
  const cfg = config()
  if (!cfg) throw new Error("Admin is not configured")
  const store = await cookies()
  store.set(COOKIE_NAME, encodeSession(cfg.email, cfg), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  })
}

export async function destroySession(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

/** The signed-in admin, or null. */
export async function getAdminSession(): Promise<{ email: string } | null> {
  const cfg = config()
  if (!cfg) return null
  const store = await cookies()
  return decodeSession(store.get(COOKIE_NAME)?.value, cfg)
}

/* ---------- Login rate limit ---------- */

/**
 * 5 failed logins per 15 minutes per IP address. Kept in memory: on Vercel
 * each function instance has its own counter, so this slows guessing down
 * rather than being a hard global limit (see docs/ADMIN.md).
 */
const MAX_FAILURES = 5
const WINDOW_MS = 15 * 60 * 1000
const failures = new Map<string, { count: number; resetAt: number }>()

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  return forwarded || request.headers.get("x-real-ip") || "local"
}

export function isRateLimited(ip: string): boolean {
  const entry = failures.get(ip)
  if (!entry) return false
  if (entry.resetAt < Date.now()) {
    failures.delete(ip)
    return false
  }
  return entry.count >= MAX_FAILURES
}

export function recordFailure(ip: string): void {
  const now = Date.now()
  const entry = failures.get(ip)
  if (!entry || entry.resetAt < now) failures.set(ip, { count: 1, resetAt: now + WINDOW_MS })
  else entry.count += 1
  // Bound memory if someone sprays many addresses.
  if (failures.size > 10_000) {
    for (const [key, value] of failures) if (value.resetAt < now) failures.delete(key)
  }
}

export function clearFailures(ip: string): void {
  failures.delete(ip)
}

/* ---------- Request helpers for app/api/admin ---------- */

/**
 * Refuse cross-site writes. The cookie is already SameSite=Strict; this also
 * rejects any browser request whose Origin is another site. Requests without
 * an Origin header (curl, server-to-server) carry no browser cookie risk.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin")
  if (!origin) return true
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host")
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

/** JSON response that is never cached. */
export function adminJson(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } })
}

/** The session, or a ready 401/403 response to return as is. */
export async function requireAdmin(
  request: Request,
  { write = false }: { write?: boolean } = {},
): Promise<{ email: string } | Response> {
  if (write && !isSameOrigin(request)) return adminJson({ error: "unauthorized" }, 403)
  const session = await getAdminSession()
  return session ?? adminJson({ error: "unauthorized" }, 401)
}
