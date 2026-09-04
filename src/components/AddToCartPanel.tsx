"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { COLORS, type ColorKey, type Product } from "@/data/products";
import { MAX_QUANTITY_PER_LINE } from "@/lib/cart";
import { useCart } from "@/context/CartContext";
import { CheckIcon, MinusIcon, PlusIcon } from "@/components/icons";

/**
 * Colour, quantity and "add to cart".
 *
 * This is the last interactive step of the shop. It writes to the local cart
 * and nothing else -- no order is created, nothing is sent anywhere.
 */
export function AddToCartPanel({ product }: { product: Product }) {
  const { add } = useCart();
  const colorGroupId = useId();
  const quantityId = useId();

  const firstColor = product.colors[0] as ColorKey;
  const [color, setColor] = useState<ColorKey>(firstColor);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 6000);
    return () => window.clearTimeout(timer);
  }, [added]);

  return (
    <div className="mt-8">
      <fieldset>
        <legend
          id={colorGroupId}
          className="text-ink-700 text-xs font-semibold tracking-[0.14em] uppercase"
        >
          Farbe
        </legend>
        <div
          className="mt-3.5 flex flex-wrap gap-2.5"
          role="radiogroup"
          aria-labelledby={colorGroupId}
        >
          {product.colors.map((key) => {
            const option = COLORS[key];
            const selected = key === color;
            return (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setColor(key)}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition ${
                  selected
                    ? "border-ink-900 bg-cream-50 text-ink-900"
                    : "border-cream-400 text-ink-700 hover:border-ink-400"
                }`}
              >
                <span
                  aria-hidden
                  style={{ backgroundColor: option.hex }}
                  className="ring-ink-900/20 h-4 w-4 rounded-full ring-1"
                />
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-7 flex flex-wrap items-end gap-4">
        <div>
          <label
            htmlFor={quantityId}
            className="text-ink-700 block text-xs font-semibold tracking-[0.14em] uppercase"
          >
            Menge
          </label>
          <div className="border-cream-400 bg-cream-50 mt-3.5 inline-flex items-center rounded-sm border">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              disabled={quantity <= 1}
              className="text-ink-800 disabled:text-ink-300 px-3 py-3"
            >
              <MinusIcon className="h-4 w-4" />
              <span className="sr-only">Menge verringern</span>
            </button>
            <input
              id={quantityId}
              type="number"
              inputMode="numeric"
              min={1}
              max={MAX_QUANTITY_PER_LINE}
              value={quantity}
              onChange={(event) => {
                const next = Number.parseInt(event.target.value, 10);
                setQuantity(
                  Number.isNaN(next) ? 1 : Math.min(MAX_QUANTITY_PER_LINE, Math.max(1, next)),
                );
              }}
              aria-label="Menge"
              className="border-cream-400 text-ink-900 w-12 border-x bg-transparent py-3 text-center tabular-nums focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.min(MAX_QUANTITY_PER_LINE, value + 1))}
              disabled={quantity >= MAX_QUANTITY_PER_LINE}
              className="text-ink-800 disabled:text-ink-300 px-3 py-3"
            >
              <PlusIcon className="h-4 w-4" />
              <span className="sr-only">Menge erhöhen</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          data-testid="add-to-cart"
          onClick={() => {
            add(product.slug, color, quantity);
            setAdded(true);
          }}
          className="bg-ink-900 text-cream-50 hover:bg-ink-800 flex-1 rounded-sm px-8 py-4 text-sm font-medium tracking-wide transition-colors sm:flex-none"
        >
          In den Warenkorb
        </button>
      </div>

      <p aria-live="polite" className="min-h-[1.5rem]">
        {added ? (
          <span
            data-testid="added-confirmation"
            className="text-ink-800 mt-4 inline-flex items-center gap-2 text-sm"
          >
            <CheckIcon className="text-brass-600 h-4 w-4" />
            In den Warenkorb gelegt.{" "}
            <Link href="/warenkorb" className="underline underline-offset-4">
              Warenkorb ansehen
            </Link>
          </span>
        ) : null}
      </p>
    </div>
  );
}
