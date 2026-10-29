import { adminJson, requireAdmin } from "@/lib/admin/auth"
import { saveSiteContent } from "@/lib/content"
import { ConflictError, StorageUnavailableError, readStoredContent, storageKind } from "@/lib/content/store"
import { validateContent } from "@/lib/content/validate"

export const dynamic = "force-dynamic"

/**
 * The document as stored right now (never the page cache), its ETag, and
 * where a save would go ("none": no Blob token on Vercel, saving is refused).
 */
export async function GET(request: Request) {
  const auth = await requireAdmin(request)
  if (auth instanceof Response) return auth
  try {
    const { content, etag, storage } = await readStoredContent()
    return adminJson({ content, etag, storage, saveTo: storageKind() })
  } catch (error) {
    console.error("[admin] reading content failed:", error)
    return adminJson({ error: "storage_unavailable" }, 503)
  }
}

/** Save the whole document if it is valid and nobody saved since `etag`. */
export async function PUT(request: Request) {
  const auth = await requireAdmin(request, { write: true })
  if (auth instanceof Response) return auth

  let body: { content?: unknown; etag?: unknown }
  try {
    body = await request.json()
  } catch {
    return adminJson({ error: "invalid", issues: [{ path: "", message: "JSON invalide" }] }, 400)
  }
  if (typeof body.etag !== "string" || body.etag.length === 0) {
    return adminJson({ error: "invalid", issues: [{ path: "etag", message: "ETag manquant" }] }, 400)
  }

  const result = validateContent(body.content)
  if (!result.ok) return adminJson({ error: "invalid", issues: result.issues }, 400)

  try {
    const saved = await saveSiteContent(result.content, body.etag)
    return adminJson(saved)
  } catch (error) {
    if (error instanceof ConflictError) return adminJson({ error: "conflict" }, 409)
    if (error instanceof StorageUnavailableError) return adminJson({ error: "storage_unavailable" }, 503)
    console.error("[admin] saving content failed:", error)
    return adminJson({ error: "storage_unavailable" }, 503)
  }
}
