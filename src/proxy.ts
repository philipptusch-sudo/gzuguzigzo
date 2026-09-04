import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { REVEAL_ROUTE } from "@/config/experiment";
import { shouldRedirectToReveal } from "@/lib/site-state";

/**
 * Request layer of the experiment.
 *
 * Three jobs, in this order:
 *
 *  1. Send every checkout-shaped route to the reveal page, so that no visitor
 *     can reach anything resembling an order or a payment step.
 *  2. Apply the `SITE_ENABLED` kill switch.
 *  3. Attach a nonce-based Content-Security-Policy.
 *
 * What this file deliberately does NOT do: branch on the user agent, the
 * client IP, the referrer, or any other property of the visitor. Crawlers,
 * ad-platform reviewers, the Fakeshop-Finder and ordinary visitors all receive
 * byte-identical responses. Cloaking would invalidate the experiment and is
 * out of scope for this project in every variant.
 */

function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV !== "production";

  return [
    "default-src 'self'",
    // 'unsafe-eval' is only needed by the development-mode React refresh runtime.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // Inline styles are emitted by Next.js and Tailwind's runtime-critical CSS.
    "style-src 'self' 'unsafe-inline'",
    // Only local artwork; `data:` covers inlined SVG placeholders.
    "img-src 'self' data:",
    "font-src 'self'",
    // No analytics, no pixels, no third-party endpoints. In development the
    // websocket used for hot reloading needs to be allowed.
    `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    // There is no form on this site at all; this keeps it that way.
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

export default function proxy(request: NextRequest): NextResponse {
  const { pathname, search } = request.nextUrl;

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = buildCsp(nonce);

  if (shouldRedirectToReveal(pathname, process.env)) {
    const target = request.nextUrl.clone();
    target.pathname = REVEAL_ROUTE;
    target.search = "";

    // 307 keeps the method and makes it obvious in devtools that this is a
    // deliberate interception rather than a permanent site structure.
    const redirect = NextResponse.redirect(target, 307);
    redirect.headers.set("Content-Security-Policy", csp);
    redirect.headers.set("X-Robots-Tag", "noindex, follow");
    redirect.headers.set("X-Experiment-Redirect", "reveal");
    return redirect;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  // Next.js reads the nonce from this request header and applies it to its own
  // bootstrap scripts.
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);

  // The shop itself must not end up in a search index; the reveal page must
  // stay crawlable. This is a per-path rule, never a per-visitor one.
  const isReveal = pathname === REVEAL_ROUTE || pathname.startsWith(`${REVEAL_ROUTE}/`);
  response.headers.set("X-Robots-Tag", isReveal ? "index, follow" : "noindex, follow");

  if (search.includes("__variant")) {
    // Guard against accidentally introducing a per-visitor content switch.
    response.headers.set("X-Experiment-Variant-Override", "ignored");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Everything except Next.js internals and static files. Static assets do
     * not need a nonce and are not shop routes.
     */
    "/((?!_next/static|_next/image|images/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico|woff|woff2)$).*)",
  ],
};
