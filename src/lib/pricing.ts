import { experimentConfig } from "@/config/experiment";
import type { Product } from "@/data/products";

/** All money in this project is handled as integer cents. */
export type Money = number;

const EURO = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

export function formatEuro(cents: Money): string {
  return EURO.format(cents / 100);
}

export type ResolvedPrice = {
  /** Crossed-out reference price. */
  readonly compareAtCents: Money;
  /** Price actually charged in the current experiment arm. */
  readonly priceCents: Money;
  /** Difference between the two. */
  readonly savingsCents: Money;
  /** Rounded, never negative. */
  readonly discountPercent: number;
};

export function discountPercent(compareAtCents: Money, priceCents: Money): number {
  if (compareAtCents <= 0 || priceCents >= compareAtCents) return 0;
  return Math.round(((compareAtCents - priceCents) / compareAtCents) * 100);
}

/**
 * Applies the discount policy of the active experiment arm.
 *
 * `closure-story` and `combined` use the deep clearance prices from the
 * catalogue. `control` and `missing-information` fall back to an
 * unremarkable percentage off the same reference price, so the arms differ
 * only in the signal being tested -- never in the product range itself.
 */
export function resolvePrice(
  product: Pick<Product, "compareAtCents" | "salePriceCents">,
  options: {
    useDeepDiscounts?: boolean;
    moderateDiscountRate?: number;
  } = {},
): ResolvedPrice {
  const useDeep = options.useDeepDiscounts ?? experimentConfig.pricing.useDeepDiscounts;
  const rate = options.moderateDiscountRate ?? experimentConfig.pricing.moderateDiscountRate;

  const compareAtCents = product.compareAtCents;
  const priceCents = useDeep
    ? product.salePriceCents
    : Math.round((compareAtCents / 100) * (1 - rate)) * 100;

  return {
    compareAtCents,
    priceCents,
    savingsCents: Math.max(0, compareAtCents - priceCents),
    discountPercent: discountPercent(compareAtCents, priceCents),
  };
}
