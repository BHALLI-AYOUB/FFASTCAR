import { adminJson, requireAdmin } from "@/lib/admin/auth"
import { InvalidImageError, MAX_UPLOAD_BYTES, UnsupportedImageError, processUpload } from "@/lib/admin/images"
import { StorageUnavailableError } from "@/lib/content/store"

export const dynamic = "force-dynamic"
// Encoding AVIF variants takes a few seconds for a large photo.
export const maxDuration = 60

/** multipart/form-data with one `file` field → {image: ImageAsset}. */
export async function POST(request: Request) {
  const auth = await requireAdmin(request, { write: true })
  if (auth instanceof Response) return auth

  // Reject oversized bodies before reading them.
  const declared = Number(request.headers.get("content-length") ?? 0)
  if (declared > MAX_UPLOAD_BYTES + 64 * 1024) return adminJson({ error: "too_large" }, 413)

  let file: FormDataEntryValue | null = null
  try {
    file = (await request.formData()).get("file")
  } catch {
    return adminJson({ error: "invalid_file" }, 400)
  }
  if (!(file instanceof File) || file.size === 0) return adminJson({ error: "invalid_file" }, 400)
  if (file.size > MAX_UPLOAD_BYTES) return adminJson({ error: "too_large" }, 413)

  try {
    return adminJson({ image: await processUpload(file) })
  } catch (error) {
    if (error instanceof UnsupportedImageError) return adminJson({ error: "unsupported_type" }, 415)
    if (error instanceof InvalidImageError) return adminJson({ error: "invalid_file" }, 400)
    if (error instanceof StorageUnavailableError) return adminJson({ error: "storage_unavailable" }, 503)
    console.error("[admin] upload failed:", error)
    return adminJson({ error: "storage_unavailable" }, 503)
  }
}
