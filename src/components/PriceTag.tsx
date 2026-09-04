import { formatEuro, type ResolvedPrice } from "@/lib/pricing";

/** Discount badge. Static text, never a live counter. */
export function DiscountBadge({
  percent,
  className = "",
}: {
  percent: number;
  className?: string;
}) {
  if (percent <= 0) return null;
  return (
    <span
      data-testid="discount-badge"
      className={`bg-burgund-700 text-cream-50 inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-semibold tracking-wide tabular-nums ${className}`}
    >
      −{percent} %
    </span>
  );
}

export function PriceTag({
  price,
  size = "md",
  className = "",
}: {
  price: ResolvedPrice;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const hasDiscount = price.discountPercent > 0;

  const priceClass = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-3xl",
  }[size];

  const compareClass = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size];

  return (
    <p className={`flex flex-wrap items-baseline gap-x-2.5 gap-y-1 ${className}`}>
      <span
        data-testid="current-price"
        className={`text-ink-900 font-sans font-semibold tabular-nums ${priceClass}`}
      >
        {formatEuro(price.priceCents)}
      </span>
      {hasDiscount ? (
        <>
          <s
            data-testid="compare-price"
            className={`text-ink-400 tabular-nums ${compareClass}`}
            aria-label={`Bisheriger Preis ${formatEuro(price.compareAtCents)}`}
          >
            {formatEuro(price.compareAtCents)}
          </s>
          <DiscountBadge percent={price.discountPercent} />
        </>
      ) : null}
    </p>
  );
}
