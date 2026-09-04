import { CHECKOUT_ROUTES, REVEAL_ROUTE } from "@/config/experiment";

const DISABLED_VALUES = new Set(["false", "0", "off", "no", "nein", "aus"]);

/**
 * Kill switch.
 *
 * `SITE_ENABLED=false` in the hosting environment takes every shop route
 * offline and sends visitors to the reveal page instead. No code change and no
 * content edit is required. An unset value means "enabled" so that a fresh
 * checkout can be developed against; production deployments set it explicitly.
 */
export function isSiteEnabled(env: Record<string, string | undefined> = process.env): boolean {
  const raw = env.SITE_ENABLED;
  if (typeof raw !== "string" || raw.trim() === "") return true;
  return !DISABLED_VALUES.has(raw.trim().toLowerCase());
}

/** Paths that must never be redirected, or the reveal would be unreachable. */
const ALWAYS_REACHABLE = [REVEAL_ROUTE, "/robots.txt", "/favicon.ico"];

export function isAlwaysReachable(pathname: string): boolean {
  return ALWAYS_REACHABLE.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/** True for any route that pretends to start an order or a payment. */
export function isCheckoutRoute(pathname: string): boolean {
  const normalised = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return CHECKOUT_ROUTES.some(
    (route) => normalised === route || normalised.startsWith(`${route}/`),
  );
}

/**
 * Single decision function for the request layer, kept pure so it can be
 * unit-tested without a running server.
 */
export function shouldRedirectToReveal(
  pathname: string,
  env: Record<string, string | undefined> = process.env,
): boolean {
  if (isAlwaysReachable(pathname)) return false;
  if (isCheckoutRoute(pathname)) return true;
  return !isSiteEnabled(env);
}
