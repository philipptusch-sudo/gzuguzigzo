import Link from "next/link";
import type { Metadata } from "next";
import { experimentConfig } from "@/config/experiment";
import { CATEGORY_LABELS, CATEGORY_ORDER, products, type ProductCategory } from "@/data/products";
import { copy } from "@/lib/copy";
import { ProductCard } from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Kollektion",
  description:
    "Alle Modelle von Kofferwerk Auenfels: Handgepäck, Reisekoffer, Koffersets, Business.",
};

function isCategory(value: string | undefined): value is ProductCategory {
  return typeof value === "string" && (CATEGORY_ORDER as readonly string[]).includes(value);
}

export default async function CollectionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = params.kategorie;
  const requested = Array.isArray(raw) ? raw[0] : raw;
  const active = isCategory(requested) ? requested : null;

  const visible = active ? products.filter((product) => product.category === active) : products;

  return (
    <div className="container-page py-14 lg:py-20">
      <header className="max-w-2xl">
        <h1 className="text-ink-900 font-serif text-4xl sm:text-5xl">
          {active ? CATEGORY_LABELS[active] : copy.collection.heading}
        </h1>
        <p className="text-ink-700 mt-5 leading-relaxed">{copy.collection.intro}</p>
      </header>

      <nav aria-label="Nach Kategorie filtern" className="border-cream-300 mt-10 border-b pb-5">
        <ul className="flex flex-wrap gap-2.5">
          <li>
            <FilterChip href="/kollektion" active={active === null}>
              Alle Modelle
            </FilterChip>
          </li>
          {CATEGORY_ORDER.map((category) => (
            <li key={category}>
              <FilterChip href={`/kollektion?kategorie=${category}`} active={active === category}>
                {CATEGORY_LABELS[category]}
              </FilterChip>
            </li>
          ))}
        </ul>
      </nav>

      <p className="text-ink-600 mt-6 text-sm" aria-live="polite">
        {visible.length} {visible.length === 1 ? "Modell" : "Modelle"}
        {copy.campaignNote ? ` · ${copy.campaignNote}` : ""}
      </p>

      <div className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((product, index) => (
          <ProductCard key={product.slug} product={product} priority={index < 3} />
        ))}
      </div>

      {experimentConfig.signals.closureNarrative ? (
        <p className="border-cream-300 text-ink-600 mt-16 border-t pt-8 text-sm">
          Unsere Werkstatt schliesst am {experimentConfig.brand.closureDateLabel}. Nachbestellungen
          sind nicht mehr möglich.
        </p>
      ) : null}
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "bg-ink-900 text-cream-50 inline-flex rounded-full px-4 py-2 text-sm"
          : "border-cream-400 text-ink-700 hover:border-ink-400 hover:text-ink-900 inline-flex rounded-full border px-4 py-2 text-sm"
      }
    >
      {children}
    </Link>
  );
}
