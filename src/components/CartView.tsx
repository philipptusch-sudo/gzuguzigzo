"use client";

import Image from "next/image";
import Link from "next/link";
import { COLORS } from "@/data/products";
import { experimentConfig, REVEAL_ROUTE } from "@/config/experiment";
import { MAX_QUANTITY_PER_LINE } from "@/lib/cart";
import { formatEuro } from "@/lib/pricing";
import { useCart } from "@/context/CartContext";
import { ChevronRightIcon, MinusIcon, PlusIcon, TrashIcon } from "@/components/icons";

/**
 * The basket.
 *
 * "Zur Kasse" is a plain link to the reveal page. There is no order step, no
 * address step and no payment step between the two -- not hidden, not
 * disabled, simply not built.
 */
export function CartView() {
  const { totals, items, update, remove, clear, hydrated } = useCart();
  const savingsLabel = experimentConfig.signals.closureNarrative
    ? "Ersparnis im Abschiedsverkauf"
    : "Ersparnis";

  if (!hydrated) {
    return (
      <p className="text-ink-600 py-16" role="status">
        Warenkorb wird geladen …
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-16" data-testid="cart-empty">
        <p className="text-ink-700">Dein Warenkorb ist leer.</p>
        <Link
          href="/kollektion"
          className="bg-ink-900 text-cream-50 hover:bg-ink-800 mt-6 inline-flex items-center gap-2 rounded-sm px-7 py-3.5 text-sm font-medium"
        >
          Zur Kollektion
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
      <section aria-label="Artikel im Warenkorb">
        <ul className="divide-cream-300 border-cream-300 divide-y border-y">
          {totals.lines.map(({ line, product, unitPriceCents, lineTotalCents }) => {
            const cover = product.images[0];
            return (
              <li
                key={`${line.slug}-${line.color}`}
                data-testid="cart-line"
                data-slug={line.slug}
                className="flex gap-5 py-6"
              >
                {cover ? (
                  <Link href={`/koffer/${product.slug}`} className="shrink-0" tabIndex={-1}>
                    <Image
                      src={cover.src}
                      alt=""
                      width={200}
                      height={200}
                      sizes="120px"
                      className="bg-cream-200 h-24 w-24 rounded-sm object-cover sm:h-28 sm:w-28"
                    />
                  </Link>
                ) : null}

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                    <h3 className="text-ink-900 font-serif text-lg">
                      <Link
                        href={`/koffer/${product.slug}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {product.name}
                      </Link>
                    </h3>
                    <p
                      data-testid="cart-line-total"
                      className="text-ink-900 font-medium tabular-nums"
                    >
                      {formatEuro(lineTotalCents)}
                    </p>
                  </div>

                  <p className="text-ink-600 mt-1 text-sm">
                    {product.type} · {COLORS[line.color].label}
                  </p>
                  <p className="text-ink-600 text-sm tabular-nums">
                    {formatEuro(unitPriceCents)} je Stück
                  </p>

                  <div className="mt-auto flex flex-wrap items-center gap-4 pt-4">
                    <div className="border-cream-400 inline-flex items-center rounded-sm border">
                      <button
                        type="button"
                        data-testid="cart-decrease"
                        onClick={() => update(line.slug, line.color, line.quantity - 1)}
                        className="text-ink-800 hover:bg-cream-200 px-2.5 py-2"
                      >
                        <MinusIcon className="h-4 w-4" />
                        <span className="sr-only">Menge von {product.name} verringern</span>
                      </button>
                      <span
                        data-testid="cart-quantity"
                        className="text-ink-900 min-w-9 px-1 text-center text-sm tabular-nums"
                      >
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        data-testid="cart-increase"
                        disabled={line.quantity >= MAX_QUANTITY_PER_LINE}
                        onClick={() => update(line.slug, line.color, line.quantity + 1)}
                        className="text-ink-800 hover:bg-cream-200 disabled:text-ink-300 px-2.5 py-2"
                      >
                        <PlusIcon className="h-4 w-4" />
                        <span className="sr-only">Menge von {product.name} erhöhen</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      data-testid="cart-remove"
                      onClick={() => remove(line.slug, line.color)}
                      className="text-ink-600 hover:text-ink-900 inline-flex items-center gap-1.5 text-sm underline-offset-4 hover:underline"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Entfernen
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          data-testid="cart-clear"
          onClick={clear}
          className="text-ink-600 hover:text-ink-900 mt-6 text-sm underline underline-offset-4"
        >
          Warenkorb leeren
        </button>
      </section>

      <aside aria-label="Zusammenfassung" className="lg:sticky lg:top-28 lg:self-start">
        <div className="border-cream-300 bg-cream-50 rounded-md border p-7">
          <h2 className="text-ink-900 font-serif text-xl">Zusammenfassung</h2>

          <dl className="mt-6 space-y-3 text-sm">
            <Row label="Zwischensumme" value={formatEuro(totals.subtotalCents)} testId="subtotal" />
            {totals.savingsCents > 0 ? (
              <Row
                label={savingsLabel}
                value={`− ${formatEuro(totals.savingsCents)}`}
                testId="savings"
                accent
              />
            ) : null}
            <Row label="Versand" value="Kostenlos" testId="shipping" />
          </dl>

          <div className="border-cream-300 mt-5 flex items-baseline justify-between border-t pt-5">
            <span className="text-ink-900 font-serif text-lg">Gesamtsumme</span>
            <span data-testid="total" className="text-ink-900 text-xl font-semibold tabular-nums">
              {formatEuro(totals.totalCents)}
            </span>
          </div>

          {/*
            The checkout link goes straight to the reveal page. `src/proxy.ts`
            additionally intercepts /checkout, /kasse, /payment and /bestellung
            in case anyone reaches those by hand.
          */}
          <Link
            href={REVEAL_ROUTE}
            data-testid="checkout"
            className="bg-ink-900 text-cream-50 hover:bg-ink-800 mt-7 flex w-full items-center justify-center gap-2 rounded-sm px-8 py-4 text-sm font-medium tracking-wide transition-colors"
          >
            Zur Kasse
            <ChevronRightIcon className="h-4 w-4" />
          </Link>

          <p className="text-ink-600 mt-4 text-center text-xs">inkl. MwSt.</p>
        </div>
      </aside>
    </div>
  );
}

function Row({
  label,
  value,
  testId,
  accent = false,
}: {
  label: string;
  value: string;
  testId: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-ink-600">{label}</dt>
      <dd
        data-testid={testId}
        className={`tabular-nums ${accent ? "text-burgund-700" : "text-ink-900"}`}
      >
        {value}
      </dd>
    </div>
  );
}
