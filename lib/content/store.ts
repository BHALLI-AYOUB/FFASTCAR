import { createHash, randomBytes } from "node:crypto"
import { promises as fs } from "node:fs"
import path from "node:path"
import { del, get, list, put } from "@vercel/blob"

import { defaultContent } from "@/lib/content/defaults"
import { validateContent } from "@/lib/content/validate"
import type { SiteContent } from "@/lib/content/types"

/**
 * Where the editable content lives. One JSON document, three backends:
 *
 * - "blob"        Vercel Blob, when BLOB_READ_WRITE_TOKEN is set (production).
 *                 Each save is a new immutable version (see below).
 * - "filesystem"  .data/site-content.json, for local development only.
 * - "defaults"    nothing saved yet: lib/content/defaults.ts.
 *
 * Vercel functions have a read-only filesystem, so on Vercel without a Blob
 * token the site shows the defaults and saving answers storage_unavailable.
 */
export type StorageKind = "blob" | "filesystem" | "defaults"

export type StoredContent = { content: SiteContent; etag: string; storage: StorageKind }

/** ETag of "nothing saved yet": the first save must not overwrite anything. */
export const DEFAULTS_ETAG = "defaults"

/**
 * Blob layout: every save creates content/versions/<8-digit number>.json and
 * never overwrites anything.
 *
 * Why not one overwritten file: a public blob is read through Vercel's CDN,
 * and @vercel/blob 2.8.1 only bypasses that cache (`useCache: false`) for
 * private blobs. After an overwrite the CDN can serve the previous document
 * for up to a minute, and the page cache would then keep that stale copy
 * until the next save. With immutable versions:
 * - the latest version is found with list(), which queries the Blob API, not
 *   the CDN, so it is always current; its URL never changes content;
 * - the ETag is the version number. A save must name the version it was
 *   based on, and creates the next number with allowOverwrite: false, which
 *   the Blob service refuses if it exists: two saves based on the same
 *   version cannot both succeed.
 * The last KEEP_VERSIONS versions are kept (manual rollback), older ones are
 * deleted after each save.
 */
const BLOB_VERSION_PREFIX = "content/versions/"
const KEEP_VERSIONS = 20
/**
 * Blob access mode. Everything stored is shown on the public site anyway, so
 * "public" works with every Blob store; set BLOB_ACCESS=private for a private
 * store (uploads then need a proxy route — see docs/ADMIN.md).
 */
const BLOB_ACCESS = process.env.BLOB_ACCESS === "private" ? "private" : "public"

const DATA_DIR = path.join(process.cwd(), ".data")
const DATA_FILE = path.join(DATA_DIR, "site-content.json")
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")

export class ConflictError extends Error {}
export class StorageUnavailableError extends Error {}

type Backend = "blob" | "filesystem" | "none"

function backend(): Backend {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob"
  if (process.env.VERCEL) return "none"
  return "filesystem"
}

/** Which backend saves go to, for the admin's status line. */
export function storageKind(): "blob" | "filesystem" | "none" {
  return backend()
}

function hashEtag(raw: string): string {
  return `fs-${createHash("sha256").update(raw).digest("hex").slice(0, 32)}`
}

/**
 * Parse a stored document. A document that no longer validates (e.g. after a
 * schema change) is reported and replaced by the defaults for display, while
 * keeping its ETag so the admin can overwrite it with a valid save.
 */
function parseStored(raw: string, etag: string, storage: StorageKind): StoredContent {
  try {
    const result = validateContent(JSON.parse(raw))
    if (result.ok) return { content: result.content, etag, storage }
    console.error("[content] stored content is invalid, showing defaults:", result.issues.slice(0, 5))
  } catch (error) {
    console.error("[content] stored content is not valid JSON, showing defaults:", error)
  }
  return { content: defaultContent(), etag, storage }
}

/**
 * Read the current document. Storage errors are thrown, not hidden: a
 * failing revalidation keeps the last published pages instead of silently
 * reverting the site to the defaults.
 */
export async function readStoredContent(): Promise<StoredContent> {
  const kind = backend()

  if (kind === "blob") {
    const latest = (await listVersions()).at(-1)
    if (!latest) return { content: defaultContent(), etag: DEFAULTS_ETAG, storage: "defaults" }
    const result = await get(latest.url, { access: BLOB_ACCESS })
    if (!result || result.statusCode !== 200 || !result.stream) {
      throw new Error(`[content] version ${latest.pathname} is listed but could not be read`)
    }
    const raw = await new Response(result.stream).text()
    return parseStored(raw, versionEtag(latest.seq), "blob")
  }

  if (kind === "filesystem") {
    try {
      const raw = await fs.readFile(DATA_FILE, "utf8")
      return parseStored(raw, hashEtag(raw), "filesystem")
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
    }
  }

  return { content: defaultContent(), etag: DEFAULTS_ETAG, storage: "defaults" }
}

/**
 * Save a validated document if nobody saved since `expectedEtag` was read.
 * Throws ConflictError on a concurrent save and StorageUnavailableError when
 * there is nowhere to save. Returns the new ETag.
 */
export async function writeStoredContent(content: SiteContent, expectedEtag: string): Promise<string> {
  const kind = backend()
  const raw = JSON.stringify(content, null, 2)

  if (kind === "blob") {
    const versions = await listVersions()
    const currentEtag = versions.length ? versionEtag(versions[versions.length - 1].seq) : DEFAULTS_ETAG
    // Someone saved since this edit was loaded.
    if (currentEtag !== expectedEtag) throw new ConflictError()

    const next = (versions.at(-1)?.seq ?? 0) + 1
    const pathname = versionPath(next)
    try {
      await put(pathname, raw, {
        access: BLOB_ACCESS,
        contentType: "application/json; charset=utf-8",
        addRandomSuffix: false,
        // Exclusive create: refused if another save took this number first.
        allowOverwrite: false,
        // Immutable: a version's content never changes, so caching is safe.
        cacheControlMaxAge: 60 * 60 * 24 * 365,
      })
    } catch (error) {
      // Do not depend on the wording of the "already exists" error: if the
      // number is taken now, it was a concurrent save.
      const taken = (await listVersions()).some((v) => v.seq === next)
      if (taken) throw new ConflictError()
      throw error
    }

    // Old versions count the one just created (the newest, never deleted).
    await pruneVersions([...versions, { seq: next, url: "", pathname }]).catch((error) =>
      console.error("[content] could not delete old versions:", error),
    )
    return versionEtag(next)
  }

  if (kind === "filesystem") {
    let currentEtag = DEFAULTS_ETAG
    try {
      currentEtag = hashEtag(await fs.readFile(DATA_FILE, "utf8"))
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error
    }
    if (currentEtag !== expectedEtag) throw new ConflictError()
    await fs.mkdir(DATA_DIR, { recursive: true })
    // Write then rename, so a reader never sees a half-written file.
    const tmp = `${DATA_FILE}.${randomBytes(4).toString("hex")}.tmp`
    await fs.writeFile(tmp, raw, "utf8")
    await fs.rename(tmp, DATA_FILE)
    return hashEtag(raw)
  }

  throw new StorageUnavailableError()
}

/* ---------- Blob versions ---------- */

type Version = { seq: number; url: string; pathname: string }

function versionPath(seq: number): string {
  return `${BLOB_VERSION_PREFIX}${String(seq).padStart(8, "0")}.json`
}

function versionEtag(seq: number): string {
  return `v${seq}`
}

/** All saved versions, oldest first. Queries the Blob API (never the CDN). */
async function listVersions(): Promise<Version[]> {
  const versions: Version[] = []
  let cursor: string | undefined
  do {
    const page = await list({ prefix: BLOB_VERSION_PREFIX, limit: 1000, cursor })
    for (const blob of page.blobs) {
      const match = /\/(\d{8})\.json$/.exec(blob.pathname)
      if (match) versions.push({ seq: Number(match[1]), url: blob.url, pathname: blob.pathname })
    }
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)
  return versions.sort((a, b) => a.seq - b.seq)
}

async function pruneVersions(versions: Version[]): Promise<void> {
  const old = versions.slice(0, Math.max(0, versions.length - KEEP_VERSIONS)).filter((v) => v.url)
  if (old.length) await del(old.map((v) => v.url))
}

/**
 * Store one uploaded image file and return its public URL. File names carry
 * a random id, so URLs never change content and can be cached for a year.
 */
export async function storeImageFile(pathname: string, body: Buffer, contentType: string): Promise<string> {
  const kind = backend()

  if (kind === "blob") {
    const result = await put(`uploads/${pathname}`, body, {
      access: BLOB_ACCESS,
      contentType,
      addRandomSuffix: false,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    })
    return result.url
  }

  if (kind === "filesystem") {
    const file = path.join(LOCAL_UPLOAD_DIR, pathname)
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, body)
    return `/uploads/${pathname}`
  }

  throw new StorageUnavailableError()
}
