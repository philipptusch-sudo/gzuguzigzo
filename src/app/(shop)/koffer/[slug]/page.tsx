import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { experimentConfig } from "@/config/experiment";
import { CATEGORY_LABELS, getProduct, getRelatedProducts } from "@/data/products";
import { resolvePrice } from "@/lib/pricing";
import { copy } from "@/lib/copy";
import { ProductGallery } from "@/components/ProductGallery";
import { AddToCartPanel } from "@/components/AddToCartPanel";
import { ProductCard } from "@/components/ProductCard";
import { PriceTag } from "@/components/PriceTag";
import { ChevronRightIcon } from "@/components/icons";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Modell nicht gefunden" };

  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const price = resolvePrice(product);
  const related = getRelatedProducts(product.slug, 3);
  const stockNote = copy.scarcityNote(product.stockNote);

  return (
    <div className="container-page py-8 lg:py-12">
      <nav aria-label="Brotkrumennavigation" className="text-ink-600 text-sm">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="underline-offset-4 hover:underline">
              Start
            </Link>
          </li>
          <ChevronRightIcon className="h-3.5 w-3.5" aria-hidden />
          <li>
            <Link href="/kollektion" className="underline-offset-4 hover:underline">
              Kollektion
            </Link>
          </li>
          <ChevronRightIcon className="h-3.5 w-3.5" aria-hidden />
          <li>
            <Link
              href={`/kollektion?kategorie=${product.category}`}
              className="underline-offset-4 hover:underline"
            >
              {CATEGORY_LABELS[product.category]}
            </Link>
          </li>
          <ChevronRightIcon className="h-3.5 w-3.5" aria-hidden />
          <li aria-current="page" className="text-ink-900">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <p className="text-ink-600 text-xs tracking-[0.16em] uppercase">{product.type}</p>
          <h1 className="text-ink-900 mt-2.5 font-serif text-3xl sm:text-4xl">{product.name}</h1>

          <p className="text-ink-700 mt-4 leading-relaxed">{product.shortDescription}</p>

          <PriceTag price={price} size="lg" className="mt-7" />
          <p className="text-ink-600 mt-1.5 text-xs">inkl. MwSt.</p>

          {stockNote ? (
            <p
              data-testid="stock-note"
              className="bg-cream-200 text-leather-700 mt-5 inline-flex rounded-sm px-3.5 py-2 text-sm"
            >
              {stockNote}
            </p>
          ) : null}

          <AddToCartPanel product={product} />

          {copy.campaignNote ? (
            <p className="border-cream-300 text-ink-600 mt-6 border-t pt-5 text-sm">
              {copy.campaignNote}. Solange der Vorrat reicht.
            </p>
          ) : null}

          <div className="divide-cream-300 border-cream-300 mt-8 divide-y border-y">
            <Accordion title="Produktbeschreibung" defaultOpen>
              <div className="space-y-3.5">
                {product.longDescription.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </Accordion>

            <Accordion title="Technische Details">
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5">
                <SpecRow label="Abmessungen" value={product.specs.dimensions} />
                <SpecRow label="Gewicht" value={product.specs.weight} />
                <SpecRow label="Volumen" value={product.specs.volume} />
                <SpecRow label="Material" value={product.specs.material} />
              </dl>
            </Accordion>

            <Accordion title="Ausstattung">
              <ul className="space-y-2">
                {product.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5">
                    <span aria-hidden className="bg-brass-600 mt-2 h-1 w-1 shrink-0 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Accordion>

            <Accordion title="Größenübersicht">
              <ul className="space-y-2">
                {product.sizeNotes.map((note) => (
                  <li key={note.slice(0, 32)}>{note}</li>
                ))}
              </ul>
            </Accordion>

            <Accordion title="Pflegehinweise">
              <ul className="space-y-2">
                {product.care.map((note) => (
                  <li key={note.slice(0, 32)}>{note}</li>
                ))}
              </ul>
            </Accordion>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="border-cream-300 mt-24 border-t pt-14">
          <h2 className="text-ink-900 font-serif text-2xl sm:text-3xl">Ähnliche Modelle</h2>
          <div className="mt-9 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}

      {experimentConfig.signals.closureNarrative ? (
        <p className="text-ink-600 mt-16 text-sm">
          Abschiedsverkauf bis zum {experimentConfig.brand.closureDateLabel}.
        </p>
      ) : null}
    </div>
  );
}

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="group py-4" open={defaultOpen}>
      <summary className="text-ink-900 flex cursor-pointer list-none items-center justify-between gap-4 font-sans text-sm font-semibold tracking-[0.08em] uppercase marker:content-none">
        {title}
        <ChevronRightIcon className="text-ink-600 h-4 w-4 shrink-0 transition-transform group-open:rotate-90" />
      </summary>
      <div className="text-ink-700 mt-4 text-sm leading-relaxed">{children}</div>
    </details>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-ink-600">{label}</dt>
      <dd className="text-ink-900">{value}</dd>
    </>
  );
}
