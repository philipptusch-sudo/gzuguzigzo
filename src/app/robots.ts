import type { MetadataRoute } from "next";

/**
 * Crawling is allowed everywhere.
 *
 * The shop carries `noindex, follow` as a meta tag and as an `X-Robots-Tag`
 * header, so it can be crawled and inspected but will not accumulate organic
 * visibility. There is deliberately no rule that hides `/experiment` -- the
 * reveal page must be as reachable for a crawler or a review system as it is
 * for a visitor.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
  };
}
