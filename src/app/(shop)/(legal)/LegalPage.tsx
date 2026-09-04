import Link from "next/link";
import { REVEAL_ROUTE } from "@/config/experiment";

/**
 * Shared frame for the consumer-information pages.
 *
 * These pages only exist in the experiment arms that include full consumer
 * information (`control` and `closure-story`). Everything they state about the
 * operator is real and comes from the environment; everything they state about
 * the brand belongs to the simulation, which is why each of them links to the
 * reveal page.
 */
export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-page max-w-3xl py-14 lg:py-20">
      <h1 className="text-ink-900 font-serif text-4xl sm:text-5xl">{title}</h1>
      {intro ? <p className="text-ink-700 mt-5 leading-relaxed">{intro}</p> : null}

      <div className="text-ink-700 mt-10 space-y-8 leading-relaxed">{children}</div>

      <p className="border-cream-300 text-ink-600 mt-14 border-t pt-8 text-sm">
        Hinweis: Diese Website ist Teil eines Verbraucherschutzexperiments.{" "}
        <Link href={REVEAL_ROUTE} className="hover:text-ink-900 underline underline-offset-4">
          Was das bedeutet
        </Link>
        .
      </p>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-ink-900 font-serif text-xl">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
