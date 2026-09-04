import type { ColorKey, Product } from "@/data/products";
import { productsBySlug } from "@/data/products";
import { resolvePrice } from "@/lib/pricing";

/**
 * Cart logic, kept free of React and of browser APIs so it can be tested
 * directly. The cart never leaves the visitor's browser: there is no order
 * endpoint, no session and no server-side basket.
 */

export const CART_STORAGE_KEY = "kofferwerk-auenfels.cart.v1";
export const MAX_QUANTITY_PER_LINE = 9;

export type CartLine = {
  readonly slug: string;
  readonly color: ColorKey;
  readonly quantity: number;
};

export type CartState = readonly CartLine[];

export const EMPTY_CART: CartState = [];

/** A line is identified by product and colour, not by product alone. */
export function lineId(slug: string, color: ColorKey): string {
  return `${slug}::${color}`;
}

function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1;
  return Math.max(1, Math.min(MAX_QUANTITY_PER_LINE, Math.trunc(quantity)));
}

export function addLine(state: CartState, slug: string, color: ColorKey, quantity = 1): CartState {
  if (!productsBySlug.has(slug)) return state;

  const wanted = clampQuantity(quantity);
  const index = state.findIndex((line) => line.slug === slug && line.color === color);

  if (index === -1) {
    return [...state, { slug, color, quantity: wanted }];
  }

  const existing = state[index];
  if (!existing) return state;

  const next = [...state];
  next[index] = { ...existing, quantity: clampQuantity(existing.quantity + wanted) };
  return next;
}

export function setQuantity(
  state: CartState,
  slug: string,
  color: ColorKey,
  quantity: number,
): CartState {
  if (quantity <= 0) return removeLine(state, slug, color);

  return state.map((line) =>
    line.slug === slug && line.color === color
      ? { ...line, quantity: clampQuantity(quantity) }
      : line,
  );
}

export function removeLine(state: CartState, slug: string, color: ColorKey): CartState {
  return state.filter((line) => !(line.slug === slug && line.color === color));
}

export function clearCart(): CartState {
  return EMPTY_CART;
}

export function totalQuantity(state: CartState): number {
  return state.reduce((sum, line) => sum + line.quantity, 0);
}

export type CartLineView = {
  readonly line: CartLine;
  readonly product: Product;
  readonly unitPriceCents: number;
  readonly unitCompareAtCents: number;
  readonly lineTotalCents: number;
  readonly lineCompareAtTotalCents: number;
  readonly lineSavingsCents: number;
};

export type CartTotals = {
  readonly lines: readonly CartLineView[];
  readonly itemCount: number;
  /** Sum of the reference prices. */
  readonly compareAtTotalCents: number;
  /** Sum of the prices actually shown. */
  readonly subtotalCents: number;
  /** compareAtTotal - subtotal. */
  readonly savingsCents: number;
  /** Always zero: shipping is advertised as free and nothing is ever charged. */
  readonly shippingCents: number;
  readonly totalCents: number;
};

/**
 * Resolves a cart against the catalogue. Lines whose product no longer exists
 * are dropped, so a stale localStorage entry can never break the page.
 */
export function computeTotals(
  state: CartState,
  options: { useDeepDiscounts?: boolean; moderateDiscountRate?: number } = {},
): CartTotals {
  const lines: CartLineView[] = [];

  for (const line of state) {
    const product = productsBySlug.get(line.slug);
    if (!product) continue;

    const price = resolvePrice(product, options);
    const quantity = clampQuantity(line.quantity);

    lines.push({
      line: { ...line, quantity },
      product,
      unitPriceCents: price.priceCents,
      unitCompareAtCents: price.compareAtCents,
      lineTotalCents: price.priceCents * quantity,
      lineCompareAtTotalCents: price.compareAtCents * quantity,
      lineSavingsCents: Math.max(0, (price.compareAtCents - price.priceCents) * quantity),
    });
  }

  const subtotalCents = lines.reduce((sum, l) => sum + l.lineTotalCents, 0);
  const compareAtTotalCents = lines.reduce((sum, l) => sum + l.lineCompareAtTotalCents, 0);

  return {
    lines,
    itemCount: lines.reduce((sum, l) => sum + l.line.quantity, 0),
    compareAtTotalCents,
    subtotalCents,
    savingsCents: Math.max(0, compareAtTotalCents - subtotalCents),
    shippingCents: 0,
    totalCents: subtotalCents,
  };
}

/* -------------------------------------------------------------- persistence */

/**
 * Parses a persisted cart defensively. Anything unexpected yields an empty
 * cart rather than an exception -- the cart is a convenience, never a record.
 */
export function parseStoredCart(raw: string | null): CartState {
  if (!raw) return EMPTY_CART;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY_CART;

    const lines: CartLine[] = [];
    for (const entry of parsed) {
      if (typeof entry !== "object" || entry === null) continue;

      const { slug, color, quantity } = entry as Record<string, unknown>;
      if (typeof slug !== "string" || typeof color !== "string") continue;

      const product = productsBySlug.get(slug);
      if (!product) continue;
      if (!product.colors.includes(color as ColorKey)) continue;
      if (typeof quantity !== "number") continue;

      lines.push({ slug, color: color as ColorKey, quantity: clampQuantity(quantity) });
    }

    // Collapse duplicates that a hand-edited storage entry might contain.
    return lines.reduce<CartState>(
      (acc, line) => addLine(acc, line.slug, line.color, line.quantity),
      EMPTY_CART,
    );
  } catch {
    return EMPTY_CART;
  }
}

export function serialiseCart(state: CartState): string {
  return JSON.stringify(state);
}
