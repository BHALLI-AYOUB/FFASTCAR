import type { MetadataRoute } from "next"

import { IS_INDEXABLE, SITE_URL } from "@/lib/site"

/**
 * /robots.txt
 *
 * Production: every public page and asset (CSS, JS, images under /_next and
 * /abfastcar) is crawlable. The site has no private area, so nothing else is
 * excluded. Search engines and AI *search / user-retrieval* bots are allowed
 * explicitly. AI *training* crawlers are not granted access by default: that
 * is a business decision for the owner (see docs/SEO.md), and blocking them
 * does not affect visibility in search or AI answers.
 *
 * Previews and local builds: crawling stays allowed so robots can read the
 * noindex meta tag those pages carry (lib/seo.ts). A robots.txt block would
 * hide the noindex and still let bare URLs be indexed.
 */

/** Search engines and AI search / on-demand retrieval bots. */
const SEARCH_BOTS = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot", // ChatGPT search results
  "ChatGPT-User", // fetch triggered by a ChatGPT user
  "Claude-SearchBot", // Claude search index
  "Claude-User", // fetch triggered by a Claude user
  "PerplexityBot", // Perplexity search results
  "Perplexity-User", // fetch triggered by a Perplexity user
]

/**
 * Crawlers that collect content to train AI models. Set to true only if the
 * owner decides to allow training use.
 */
const ALLOW_AI_TRAINING = false
const TRAINING_BOTS = ["GPTBot", "ClaudeBot", "CCBot"]

export default function robots(): MetadataRoute.Robots {
  if (!IS_INDEXABLE) {
    return { rules: [{ userAgent: "*", allow: "/" }] }
  }

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: SEARCH_BOTS, allow: "/" },
      ALLOW_AI_TRAINING
        ? { userAgent: TRAINING_BOTS, allow: "/" }
        : { userAgent: TRAINING_BOTS, disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
