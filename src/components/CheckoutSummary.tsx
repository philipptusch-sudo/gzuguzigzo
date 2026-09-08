"use client";

import { COLORS } from "@/data/products";
import { experimentConfig } from "@/config/experiment";
import { formatEuro } from "@/lib/pricing";
import { useCart } from "@/context/CartContext";

/** Read-only order summary beside the address step. Reads the local cart, nothing else. */
export function CheckoutSummary() {
  const { totals, hydrated } = useCart();
  const savingsLabel = experimentConfig.signals.closureNarrative
    ? "Ersparnis im Abschiedsverkauf"
    : "Ersparnis";

  if (!hydrated) {
    return (
      <p className="text-ink-600 text-sm" role="status">
        Bestellübersicht wird geladen …
      </p>
    );
  }

  return (
    <div className="border-cream-300 bg-cream-50 rounded-md border p-6">
      <h2 className="text-ink-900 font-serif text-lg">Deine Bestellung</h2>

      {totals.lines.length === 0 ? (
        <p className="text-ink-600 mt-4 text-sm">Dein Warenkorb ist leer.</p>
      ) : (
        <ul className="divide-cream-300 mt-4 divide-y text-sm">
          {totals.lines.map(({ line, product, lineTotalCents }) => (
            <li key={`${line.slug}-${line.color}`} className="flex justify-between gap-4 py-3">
              <span className="text-ink-700">
                {line.quantity} × {product.name}
                <span className="text-ink-600 block text-xs">{COLORS[line.color].label}</span>
              </span>
              <span className="text-ink-900 tabular-nums">{formatEuro(lineTotalCents)}</span>
            </li>
          ))}
        </ul>
      )}

      <dl className="border-cream-300 mt-4 space-y-2 border-t pt-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-600">Zwischensumme</dt>
          <dd className="text-ink-900 tabular-nums">{formatEuro(totals.subtotalCents)}</dd>
        </div>
        {totals.savingsCents > 0 ? (
          <div className="flex justify-between gap-4">
            <dt className="text-ink-600">{savingsLabel}</dt>
            <dd className="text-burgund-700 tabular-nums">− {formatEuro(totals.savingsCents)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-ink-600">Versand</dt>
          <dd className="text-ink-900">Kostenlos</dd>
        </div>
      </dl>

      <div className="border-cream-300 mt-4 flex items-baseline justify-between border-t pt-4">
        <span className="text-ink-900 font-serif">Gesamtsumme</span>
        <span
          data-testid="checkout-total"
          className="text-ink-900 text-lg font-semibold tabular-nums"
        >
          {formatEuro(totals.totalCents)}
        </span>
      </div>
    </div>
  );
}
