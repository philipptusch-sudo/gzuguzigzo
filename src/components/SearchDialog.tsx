"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { CATEGORY_LABELS, products } from "@/data/products";
import { formatEuro, resolvePrice } from "@/lib/pricing";
import { CloseIcon, SearchIcon } from "@/components/icons";

/**
 * Product search.
 *
 * Runs entirely in the browser against the local catalogue: no request is
 * sent, no query is stored, and the field is not part of a form. It exists so
 * the shop behaves the way visitors expect, not to collect anything.
 */
export function SearchDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  // The dialog is mounted only while it is open, so the query resets by itself.
  useEffect(() => {
    inputRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (term.length === 0) return products;
    return products.filter((product) =>
      [product.name, product.type, CATEGORY_LABELS[product.category], product.shortDescription]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [query]);

  return (
    <div
      className="bg-ink-950/45 fixed inset-0 z-50 flex items-start justify-center px-4 pt-20 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Produkte durchsuchen"
        className="bg-cream-50 w-full max-w-2xl overflow-hidden rounded-lg shadow-2xl"
      >
        <div className="border-cream-300 flex items-center gap-3 border-b px-5 py-4">
          <SearchIcon className="text-ink-600 h-5 w-5 shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Modell oder Koffertyp suchen"
            autoComplete="off"
            spellCheck={false}
            aria-controls={listId}
            className="text-ink-900 placeholder:text-ink-400 w-full bg-transparent text-base focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="text-ink-600 hover:bg-cream-200 hover:text-ink-900 rounded p-1.5"
          >
            <CloseIcon className="h-5 w-5" />
            <span className="sr-only">Suche schliessen</span>
          </button>
        </div>

        <ul id={listId} className="max-h-[60vh] overflow-y-auto py-2">
          {results.length === 0 ? (
            <li className="text-ink-600 px-5 py-8 text-center text-sm">
              Zu „{query}“ haben wir kein Modell gefunden.
            </li>
          ) : (
            results.map((product) => {
              const price = resolvePrice(product);
              return (
                <li key={product.slug}>
                  <Link
                    href={`/koffer/${product.slug}`}
                    onClick={onClose}
                    className="hover:bg-cream-200 flex items-center justify-between gap-4 px-5 py-3"
                  >
                    <span className="min-w-0">
                      <span className="text-ink-900 block truncate font-serif text-base">
                        {product.name}
                      </span>
                      <span className="text-ink-600 block text-xs">{product.type}</span>
                    </span>
                    <span className="text-ink-900 shrink-0 font-medium tabular-nums">
                      {formatEuro(price.priceCents)}
                    </span>
                  </Link>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
