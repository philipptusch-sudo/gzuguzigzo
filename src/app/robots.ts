import type { MetadataRoute } from "next";

/**
 * Crawl rules.
 *
 * Two groups, and the split matters:
 *
 *  1. Everything else (`*`) may crawl the whole site, including `/experiment`.
 *     Search engines, ad-review systems and the Fakeshop-Finder must be able
 *     to reach the reveal page — hiding it from them would make this project
 *     indefensible. The shop itself carries `noindex, follow`, so it can be
 *     inspected without accumulating organic visibility.
 *
 *  2. AI crawlers are excluded from the **whole site**, not just from the
 *     reveal page. A rule that singled out `/experiment` would be exactly the
 *     kind of selective hiding this project rules out; excluding the entire
 *     domain treats every page alike and additionally keeps the fabricated
 *     brand out of training corpora and AI answers, which is desirable in its
 *     own right.
 *
 * robots.txt is a request, not an enforcement mechanism. Crawlers that ignore
 * it are not blocked at the server: turning them away by user agent would mean
 * treating visitors differently depending on who they are, and this project
 * serves every request the same response.
 */

/**
 * Crawlers used for AI training, AI answers and AI-assisted browsing.
 *
 * Deliberately NOT on this list, because they must keep working:
 * Googlebot, AdsBot-Google, AdsBot-Google-Mobile (Google Ads review),
 * bingbot, AdIdxBot (Microsoft Ads review), Slurp, DuckDuckBot,
 * and facebookexternalhit (Meta link and ad preview).
 */
const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "CCBot",
  "Google-Extended",
  "Applebot-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "Bytespider",
  "Amazonbot",
  "meta-externalagent",
  "Meta-ExternalAgent",
  "cohere-ai",
  "Diffbot",
  "Omgilibot",
  "ImagesiftBot",
  "Timpibot",
  "YouBot",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: [...AI_CRAWLERS], disallow: "/" },
    ],
  };
}
