// Checks the rental conditions against the client's original French text.
//
//   node scripts/check-conditions.mjs                 compare lib/content/conditions/*.json with the source
//   node scripts/check-conditions.mjs --write-fr      (re)generate fr.json from the source, mechanically
//   node scripts/check-conditions.mjs --html <url>…   also check rendered pages (e.g. http://localhost:3007/conditions)
//
// Source: docs/client/conditions-location-client-fr.txt (SHA-256 below). The
// French page must contain every paragraph of it unchanged; only the case of
// the titles may change (CAPITALS → sentence case, a presentation choice).
import { createHash } from "node:crypto"
import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const SOURCE = path.join(ROOT, "docs/client/conditions-location-client-fr.txt")
const SOURCE_SHA256 = "cfec541e936d9c7dc2a69f817ce9cad2a262d2420e7125405c8add8472669ef5"
const DIR = path.join(ROOT, "lib/content/conditions")
const LOCALES = ["fr", "en", "nl", "ar"]

let failures = 0
const ok = (cond, message) => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${message}`)
  if (!cond) failures++
  return cond
}

/* ---------- Parse the source ---------- */

const raw = readFileSync(SOURCE)
ok(createHash("sha256").update(raw).digest("hex") === SOURCE_SHA256, "texte source : empreinte SHA-256 attendue")
const blocks = raw
  .toString("utf8")
  .replace(/\r\n/g, "\n")
  .split(/\n\s*\n/)
  .map((b) => b.trim())
  .filter(Boolean)

const ARTICLE = /^ARTICLE (\d+) – (.+)$/
const isSubheading = (b) => !/[.:;]$/.test(b) && b.length < 90 && !ARTICLE.test(b)

const [brand, docTitle, ...rest] = blocks
const source = { brand, title: docTitle, articles: [] }
for (const block of rest) {
  const m = ARTICLE.exec(block)
  if (m) {
    source.articles.push({ number: Number(m[1]), title: m[2], sections: [{ paragraphs: [] }] })
    continue
  }
  const article = source.articles.at(-1)
  if (isSubheading(block)) article.sections.push({ heading: block, paragraphs: [] })
  else article.sections.at(-1).paragraphs.push(block)
}
for (const a of source.articles) a.sections = a.sections.filter((s) => s.heading || s.paragraphs.length)
const sourceParagraphs = source.articles.flatMap((a) => a.sections.flatMap((s) => s.paragraphs))

ok(source.articles.length === 16 && source.articles.every((a, i) => a.number === i + 1), "source : 16 articles numérotés 1 à 16")
ok(sourceParagraphs.length === 63, "source : 63 paragraphes")

/** CAPITALS → sentence case; proper nouns put back. */
function sentenceCase(text) {
  const lower = text.toLocaleLowerCase("fr")
  return (lower.charAt(0).toLocaleUpperCase("fr") + lower.slice(1)).replace(/\bmaroc\b/g, "Maroc")
}

if (process.argv.includes("--write-fr")) {
  const fr = {
    title: sentenceCase(source.title),
    intro:
      "Voici les conditions générales de location d’AB FAST CAR, telles que communiquées par l’agence. Les conditions particulières de votre location figurent dans votre contrat. Pour toute question, contactez-nous avant de réserver.",
    articles: source.articles.map((a) => ({
      title: sentenceCase(a.title),
      sections: a.sections.map((s) => (s.heading ? { heading: s.heading, paragraphs: s.paragraphs } : { paragraphs: s.paragraphs })),
    })),
  }
  writeFileSync(path.join(DIR, "fr.json"), JSON.stringify(fr, null, 2) + "\n")
  console.log("fr.json écrit depuis la source")
}

/* ---------- Compare the bundled documents ---------- */

function load(locale) {
  try {
    return JSON.parse(readFileSync(path.join(DIR, `${locale}.json`), "utf8"))
  } catch (error) {
    ok(false, `${locale}.json illisible : ${error.message}`)
    return { intro: "", articles: [] }
  }
}
const docs = Object.fromEntries(LOCALES.map((l) => [l, load(l)]))
const fr = docs.fr

const frParagraphs = fr.articles.flatMap((a) => a.sections.flatMap((s) => s.paragraphs))
ok(
  frParagraphs.length === sourceParagraphs.length && frParagraphs.every((p, i) => p === sourceParagraphs[i]),
  `FR : les ${sourceParagraphs.length} paragraphes du client sont repris à l'identique et dans l'ordre`,
)
ok(
  fr.articles.length === 16 &&
    fr.articles.every((a, i) => a.title.toLocaleUpperCase("fr") === source.articles[i].title.toLocaleUpperCase("fr")),
  "FR : 16 titres d'articles identiques à la source (seule la casse change)",
)
ok(fr.title.toLocaleUpperCase("fr") === source.title.toLocaleUpperCase("fr"), "FR : titre du document identique à la source (casse)")
const frHeadings = fr.articles.flatMap((a) => a.sections.filter((s) => s.heading).map((s) => s.heading))
const sourceHeadings = source.articles.flatMap((a) => a.sections.filter((s) => s.heading).map((s) => s.heading))
ok(JSON.stringify(frHeadings) === JSON.stringify(sourceHeadings), `FR : sous-titres identiques (${sourceHeadings.join(" / ")})`)

const shape = (doc) => doc.articles.map((a) => a.sections.map((s) => `${s.heading ? "h" : ""}${s.paragraphs.length}`).join(","))
for (const l of ["en", "nl", "ar"]) {
  const doc = docs[l]
  ok(doc.articles.length === 16, `${l.toUpperCase()} : 16 articles`)
  ok(JSON.stringify(shape(doc)) === JSON.stringify(shape(fr)), `${l.toUpperCase()} : même structure que le français (sous-titres et paragraphes par article)`)
  const text = JSON.stringify(doc)
  ok(/5\s?%|٪5|5٪/.test(text) && /150/.test(text) && /MAD/.test(text), `${l.toUpperCase()} : montants conservés (5 %, 150 MAD)`)
  const art10 = JSON.stringify(doc.articles[9])
  ok(/Rabat|الرباط/.test(art10) && !/Marrakech|مراكش/.test(art10), `${l.toUpperCase()} : article 10 désigne Rabat (pas Marrakech)`)
  ok(!/seule version|only (legally )?binding|enige bindende|prevail|prévaut sur la traduction/i.test(doc.intro), `${l.toUpperCase()} : pas de clause « seule version faisant foi » ajoutée`)
}
ok(/Rabat/.test(JSON.stringify(fr.articles[9])), "FR : article 10 désigne Rabat")

/* ---------- Rendered pages ---------- */

const decode = (html) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")

const urls = process.argv.slice(process.argv.indexOf("--html") + 1).filter((a) => process.argv.includes("--html") && /^https?:/.test(a))
for (const url of urls) {
  const res = await fetch(url)
  const html = await res.text()
  const text = decode(html)
  ok(res.status === 200, `${url} → 200`)
  const language = new URL(url).pathname.match(/^\/(en|nl|ar)\/conditions/)?.[1] ?? "fr"
  const isFr = language === "fr"
  if (isFr) {
    const missing = sourceParagraphs.filter((p) => !text.includes(p))
    ok(missing.length === 0, `${url} : les ${sourceParagraphs.length} paragraphes FR présents dans le HTML initial${missing.length ? ` — manquants : ${missing.length}` : ""}`)
    ok(sourceHeadings.every((h) => text.includes(h)), `${url} : sous-titres de l'article 4 présents`)
  }
  if (!isFr) {
    const paragraphs = docs[language].articles.flatMap((a) => a.sections.flatMap((s) => s.paragraphs))
    ok(paragraphs.length === 63 && paragraphs.every((p) => text.includes(p)), `${url} : les 63 paragraphes traduits présents dans le HTML initial`)
  }
  const anchors = [...html.matchAll(/id="article-(\d+)"/g)].map((m) => Number(m[1]))
  ok(anchors.length === 16 && anchors.every((n, i) => n === i + 1), `${url} : ancres article-1 à article-16`)
  ok((html.match(/href="#article-\d+"/g) ?? []).length >= 16, `${url} : sommaire avec 16 liens d'ancre`)
}

console.log(failures ? `\n${failures} échec(s)` : "\nTout est conforme.")
process.exit(failures ? 1 : 0)
