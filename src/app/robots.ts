import type { MetadataRoute } from "next";
import { REVEAL_ROUTE } from "@/config/experiment";

/**
 * Crawl rules.
 *
 * Three groups:
 *
 *  1. `*` — search engines and the review systems of the ad platforms may
 *     crawl the shop. They are the systems whose judgement this experiment
 *     measures, so they must see it.
 *
 *  2. OpenAI's crawlers are deliberately allowed alongside them, because one
 *     arm of the study asks whether ads can be placed on ChatGPT. A landing
 *     page that OpenAI cannot fetch could not be tested there at all.
 *
 *  3. Every other AI crawler is excluded from the whole domain. Blocking them
 *     per page would single out individual URLs; the domain-wide rule treats
 *     every page alike and keeps the fabricated brand out of training corpora
 *     that have nothing to do with this study.
 *
 * `/experiment` is excluded for every crawler, including the ones that may
 * otherwise crawl. This is a deliberate change to the original design and it
 * is worth being precise about what it does and does not do:
 *
 *   - It does NOT hide the reveal from people. The page is served, unchanged,
 *     to anyone who opens it, and the checkout leads straight to it. That is
 *     the guarantee this project rests on, and it is untouched.
 *   - It does NOT serve anyone a different page. Nobody is treated differently
 *     by user agent; robots.txt is a publicly readable file stating the rule.
 *   - It DOES mean an automated review may see the shop without the
 *     disclosure. That is the cost, and it is recorded in SECURITY.md and in
 *     LEGAL-REVIEW.md so the review can weigh it.
 *
 * robots.txt is a request, not an enforcement mechanism. Crawlers that ignore
 * it are not turned away at the server: refusing requests by user agent would
 * be the first step into the cloaking this project rules out. The reveal page
 * additionally carries `noindex, follow`, so a crawler that fetches it anyway
 * still learns that it should not be indexed.
 */

/** OpenAI's crawlers. Allowed, so the ChatGPT ad arm of the study is testable. */
const OPENAI_CRAWLERS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User"] as const;

/**
 * AI crawlers with no role in this study.
 *
 * Deliberately absent, because they must keep working:
 * Googlebot, AdsBot-Google, AdsBot-Google-Mobile (Google Ads review),
 * bingbot, AdIdxBot (Microsoft Ads review), Slurp, DuckDuckBot,
 * and facebookexternalhit (Meta link and ad preview).
 */
const BLOCKED_AI_CRAWLERS = [
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
      { userAgent: "*", allow: "/", disallow: REVEAL_ROUTE },
      { userAgent: [...OPENAI_CRAWLERS], allow: "/", disallow: REVEAL_ROUTE },
      { userAgent: [...BLOCKED_AI_CRAWLERS], disallow: "/" },
    ],
  };
}
