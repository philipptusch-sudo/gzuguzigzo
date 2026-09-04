import Image from "next/image";
import Link from "next/link";
import { COLORS, type Product } from "@/data/products";
import { resolvePrice } from "@/lib/pricing";
import { copy } from "@/lib/copy";
import { PriceTag } from "@/components/PriceTag";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const price = resolvePrice(product);
  const cover = product.images[0];
  const stockNote = copy.scarcityNote(product.stockNote);

  return (
    <article className="group flex h-full flex-col" data-testid="product-card">
      <Link
        href={`/koffer/${product.slug}`}
        className="bg-cream-200 block overflow-hidden rounded-md"
        tabIndex={-1}
        aria-hidden="true"
      >
        {cover ? (
          <Image
            src={cover.src}
            alt=""
            width={cover.width}
            height={cover.height}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-ink-600 text-xs tracking-[0.14em] uppercase">{product.type}</p>

        <h3 className="text-ink-900 mt-1.5 font-serif text-lg">
          <Link href={`/koffer/${product.slug}`} className="underline-offset-4 hover:underline">
            {product.name}
          </Link>
        </h3>

        <p className="text-ink-600 mt-2 line-clamp-2 text-sm">{product.shortDescription}</p>

        <div className="mt-auto pt-4">
          <PriceTag price={price} />
          <div className="mt-3 flex items-center gap-1.5">
            {product.colors.map((key) => (
              <span
                key={key}
                title={COLORS[key].label}
                style={{ backgroundColor: COLORS[key].hex }}
                className="ring-ink-900/15 h-3.5 w-3.5 rounded-full ring-1"
              >
                <span className="sr-only">{COLORS[key].label}</span>
              </span>
            ))}
          </div>
          {stockNote ? <p className="text-leather-600 mt-3 text-xs">{stockNote}</p> : null}
        </div>
      </div>
    </article>
  );
}
