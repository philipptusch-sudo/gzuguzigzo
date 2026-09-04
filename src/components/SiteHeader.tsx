"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { copy, NAV_LINKS } from "@/lib/copy";
import { useCart } from "@/context/CartContext";
import { Logo } from "@/components/Logo";
import { SearchDialog } from "@/components/SearchDialog";
import { CartIcon, CloseIcon, MenuIcon, SearchIcon } from "@/components/icons";

/**
 * Announcement bar and header.
 *
 * The announcement never counts down and never changes on its own -- the
 * closing date is a fixed label from the experiment configuration.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, hydrated } = useCart();

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <>
      <div className="bg-ink-900 text-cream-100">
        <p className="container-page py-2.5 text-center text-xs tracking-[0.12em] uppercase sm:text-[0.78rem]">
          {copy.announcement}
        </p>
      </div>

      <header className="border-cream-300 bg-cream-100/95 sticky top-0 z-40 border-b backdrop-blur">
        <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              className="text-ink-800 hover:bg-cream-200 -ml-2 rounded p-2 lg:hidden"
            >
              {menuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              <span className="sr-only">{menuOpen ? "Menü schliessen" : "Menü öffnen"}</span>
            </button>
            <Logo />
          </div>

          <nav aria-label="Hauptnavigation" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-ink-800 text-sm underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="text-ink-800 hover:bg-cream-200 rounded p-2 sm:p-2.5"
            >
              <SearchIcon className="h-5 w-5" />
              <span className="sr-only">Suche öffnen</span>
            </button>

            <Link
              href="/warenkorb"
              className="text-ink-800 hover:bg-cream-200 relative rounded p-2 sm:p-2.5"
              data-testid="cart-link"
            >
              <CartIcon className="h-5 w-5" />
              <span className="sr-only">Warenkorb</span>
              {hydrated && count > 0 ? (
                <span
                  data-testid="cart-count"
                  className="bg-ink-900 text-cream-50 absolute top-0.5 right-0.5 flex h-[1.15rem] min-w-[1.15rem] items-center justify-center rounded-full px-1 text-[0.68rem] font-medium tabular-nums"
                >
                  {count}
                </span>
              ) : null}
            </Link>
          </div>
        </div>

        {menuOpen ? (
          <nav
            id="mobile-nav"
            aria-label="Navigation"
            className="border-cream-300 bg-cream-50 border-t lg:hidden"
          >
            <ul className="container-page flex flex-col py-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="border-cream-200 text-ink-800 block border-b py-3.5 last:border-0"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  className="text-ink-800 flex w-full items-center gap-2 py-3.5 text-left"
                >
                  <SearchIcon className="h-4 w-4" />
                  Suche
                </button>
              </li>
            </ul>
          </nav>
        ) : null}
      </header>

      {searchOpen ? <SearchDialog onClose={() => setSearchOpen(false)} /> : null}
    </>
  );
}
