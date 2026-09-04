import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { experimentConfig } from "@/config/experiment";
import { CATEGORY_LABELS, CATEGORY_ORDER, getFeaturedProducts } from "@/data/products";
import { featuredFaqEntries } from "@/data/faq";
import { copy } from "@/lib/copy";
import { ProductCard } from "@/components/ProductCard";
import { ChevronRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: `${experimentConfig.brand.name} — ${copy.brandClaim}`,
};

const CATEGORY_BLURBS: Readonly<Record<string, string>> = {
  handgepaeck: "Für kurze Wege und alles, was mit in die Kabine soll.",
  reisekoffer: "Für ein bis vier Wochen, mit ruhigem Lauf auch voll beladen.",
  koffersets: "Aufeinander abgestimmte Größen, ineinander verstaubar.",
  business: "Aufrechte Form, gepolstertes Notebookfach, schmaler Griff.",
};

const PRODUCT_QUALITIES = [
  {
    title: "Leise Doppelrollen",
    body: "Acht Rollen statt vier verteilen das Gewicht. Das läuft ruhiger, besonders auf Kopfsteinpflaster und Bahnsteigen.",
  },
  {
    title: "Höhenverstellbarer Griff",
    body: "Drei Rasterstufen, ein Gestänge aus Aluminium. Der Griff soll auch nach Jahren nicht klappern.",
  },
  {
    title: "Innenaufteilung",
    body: "Gurtband auf der einen, Netzfach oder Trennwand auf der anderen Seite. Bei den grösseren Modellen herausnehmbar.",
  },
  {
    title: "Robuste Hartschale",
    body: "Verstärkte Kanten an den Auflagepunkten, weil dort zuerst etwas nachgibt.",
  },
];

export default function HomePage() {
  const { brand, signals } = experimentConfig;
  const featured = getFeaturedProducts();

  return (
    <>
      {/* ------------------------------------------------------------ Hero */}
      <section className="border-cream-300 bg-cream-50 border-b">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div>
            <p className="text-leather-600 text-xs tracking-[0.2em] uppercase">
              {copy.hero.eyebrow}
            </p>
            <h1 className="text-ink-900 mt-5 font-serif text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
              {copy.hero.headline}
            </h1>
            <p className="text-ink-700 mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
              {copy.hero.body}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/kollektion"
                className="bg-ink-900 text-cream-50 hover:bg-ink-800 inline-flex items-center gap-2 rounded-sm px-7 py-3.5 text-sm font-medium tracking-wide transition-colors"
              >
                {copy.hero.primaryCta}
                <ChevronRightIcon className="h-4 w-4" />
              </Link>
              <a
                href="#unsere-geschichte"
                className="text-ink-700 hover:text-ink-900 text-sm underline underline-offset-4"
              >
                {copy.hero.secondaryCta}
              </a>
            </div>
          </div>

          <div className="relative">
            <Image
              src="/images/products/auenfels-reise-68/01.svg"
              alt="Reisekoffer von Kofferwerk Auenfels in Nachtblau"
              width={1200}
              height={1200}
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="bg-cream-200 w-full rounded-md object-cover"
            />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Letzte Stücke */}
      <section id="letzte-stuecke" className="container-page py-section scroll-mt-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-ink-900 font-serif text-3xl sm:text-4xl">{copy.featuredHeading}</h2>
            <p className="text-ink-600 mt-3 max-w-xl">{copy.featuredIntro}</p>
          </div>
          <Link
            href="/kollektion"
            className="text-ink-700 hover:text-ink-900 text-sm underline underline-offset-4"
          >
            Alle Modelle ansehen
          </Link>
        </div>

        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product, index) => (
            <ProductCard key={product.slug} product={product} priority={index < 2} />
          ))}
        </div>
      </section>

      {/* ----------------------------------------------- Unsere Geschichte */}
      <section
        id="unsere-geschichte"
        className="border-cream-300 bg-cream-200 scroll-mt-28 border-y"
      >
        <div className="container-page py-section grid items-center gap-12 lg:grid-cols-2">
          <Image
            src="/images/editorial/werkstatt.svg"
            alt="Blick in die Werkstatt mit Werkbank und fertigen Koffern"
            width={1200}
            height={1200}
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="bg-cream-100 w-full rounded-md object-cover"
          />

          <div>
            {copy.story.yearLabel ? (
              <p className="text-brass-600 font-serif text-5xl sm:text-6xl">
                {copy.story.yearLabel}
                <span className="text-ink-600 mt-2 block font-sans text-xs tracking-[0.2em] uppercase">
                  {copy.story.yearCaption}
                </span>
              </p>
            ) : null}

            <h2 className="text-ink-900 mt-8 font-serif text-3xl sm:text-4xl">
              {copy.story.heading}
            </h2>

            <div className="text-ink-700 mt-5 space-y-4">
              {copy.story.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- Für jede Reise */}
      <section className="container-page py-section">
        <h2 className="text-ink-900 font-serif text-3xl sm:text-4xl">Für jede Reise</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_ORDER.map((category) => (
            <Link
              key={category}
              href={`/kollektion?kategorie=${category}`}
              className="group border-cream-300 bg-cream-50 hover:border-ink-300 flex flex-col rounded-md border p-6 transition-colors"
            >
              <h3 className="text-ink-900 font-serif text-xl">{CATEGORY_LABELS[category]}</h3>
              <p className="text-ink-600 mt-2.5 flex-1 text-sm leading-relaxed">
                {CATEGORY_BLURBS[category]}
              </p>
              <span className="text-ink-700 group-hover:text-ink-900 mt-5 inline-flex items-center gap-1.5 text-sm">
                Ansehen
                <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------------- Was unsere Koffer auszeichnet */}
      <section className="border-cream-300 bg-ink-900 text-cream-100 border-y">
        <div className="container-page py-section">
          <h2 className="text-cream-50 font-serif text-3xl sm:text-4xl">
            Was unsere Koffer auszeichnet
          </h2>
          <dl className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCT_QUALITIES.map((quality) => (
              <div key={quality.title}>
                <dt className="text-cream-50 font-serif text-xl">{quality.title}</dt>
                <dd className="text-cream-300 mt-2.5 text-sm leading-relaxed">{quality.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* --------------------------------------------------- Letzte Wochen */}
      {signals.closureNarrative ? (
        <section className="container-page py-section">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
            <Image
              src="/images/editorial/kartons.svg"
              alt="Gestapelte Kartons in der Werkstatt"
              width={1200}
              height={1200}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="bg-cream-200 w-full rounded-md object-cover"
            />
            <div>
              <p className="text-leather-600 text-xs tracking-[0.2em] uppercase">
                {brand.closureReason}
              </p>
              <h2 className="text-ink-900 mt-5 font-serif text-3xl sm:text-4xl">
                {copy.closingSection.heading}
              </h2>
              <p className="text-ink-700 mt-5 max-w-xl leading-relaxed">
                {copy.closingSection.body}
              </p>
              <p className="border-brass-600 text-ink-900 mt-6 border-l-2 pl-4 font-serif text-xl">
                Werkstattschliessung am {brand.closureDateLabel}
              </p>
              <Link
                href="/kollektion"
                className="border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-cream-50 mt-8 inline-flex items-center gap-2 rounded-sm border px-7 py-3.5 text-sm font-medium transition-colors"
              >
                {copy.closingSection.cta}
                <ChevronRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------------------------------------------------- FAQ-Auszug */}
      <section className="border-cream-300 bg-cream-50 border-t">
        <div className="container-page py-section">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-ink-900 font-serif text-3xl sm:text-4xl">Häufige Fragen</h2>
            <Link
              href="/faq"
              className="text-ink-700 hover:text-ink-900 text-sm underline underline-offset-4"
            >
              Alle Fragen ansehen
            </Link>
          </div>

          <div className="divide-cream-300 border-cream-300 mt-10 divide-y border-y">
            {featuredFaqEntries.map((entry) => (
              <details key={entry.id} className="group py-5">
                <summary className="text-ink-900 flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg marker:content-none">
                  {entry.question}
                  <ChevronRightIcon className="text-ink-600 h-5 w-5 shrink-0 transition-transform group-open:rotate-90" />
                </summary>
                <div className="text-ink-700 mt-3 space-y-3 pr-8 text-sm leading-relaxed">
                  {entry.answer.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
