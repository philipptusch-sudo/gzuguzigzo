import { redirect } from "next/navigation";
import { REVEAL_ROUTE } from "@/config/experiment";
import { isSiteEnabled } from "@/lib/site-state";
import { CartProvider } from "@/context/CartContext";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

/**
 * Chrome around every shop page -- and the second layer of the kill switch.
 *
 * `src/proxy.ts` already intercepts these routes, but its `process.env` access
 * is inlined into the edge bundle at build time. This layout runs on the
 * server for every request, so flipping `SITE_ENABLED` in the hosting
 * environment takes the shop offline immediately, without a rebuild.
 */
export const dynamic = "force-dynamic";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  if (!isSiteEnabled()) {
    redirect(REVEAL_ROUTE);
  }

  return (
    <CartProvider>
      <a href="#inhalt" className="skip-link">
        Zum Inhalt springen
      </a>
      <SiteHeader />
      <main id="inhalt" className="min-h-[60vh]">
        {children}
      </main>
      <SiteFooter />
    </CartProvider>
  );
}
