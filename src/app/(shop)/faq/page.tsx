import type { Metadata } from "next";
import Link from "next/link";
import { faqEntries } from "@/data/faq";
import { ChevronRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Häufige Fragen",
  description: "Antworten zu Größen, Handgepäckmaßen, Material, Pflege und Garantie.",
};

export default function FaqPage() {
  return (
    <div className="container-page py-14 lg:py-20">
      <header className="max-w-2xl">
        <h1 className="text-ink-900 font-serif text-4xl sm:text-5xl">Häufige Fragen</h1>
        <p className="text-ink-700 mt-5 leading-relaxed">
          Antworten zu unseren Modellen: Größen, Maße, Material, Pflege und Garantie.
        </p>
      </header>

      <div className="divide-cream-300 border-cream-300 mt-12 max-w-3xl divide-y border-y">
        {faqEntries.map((entry) => (
          <details key={entry.id} id={entry.id} className="group scroll-mt-28 py-5">
            <summary className="text-ink-900 flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg marker:content-none">
              {entry.question}
              <ChevronRightIcon className="text-ink-600 h-5 w-5 shrink-0 transition-transform group-open:rotate-90" />
            </summary>
            <div className="text-ink-700 mt-3.5 space-y-3.5 pr-8 leading-relaxed">
              {entry.answer.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </details>
        ))}
      </div>

      <p className="text-ink-600 mt-12 text-sm">
        Die passenden Maße findest du auch auf jeder{" "}
        <Link href="/kollektion" className="hover:text-ink-900 underline underline-offset-4">
          Produktseite
        </Link>{" "}
        unter „Größenübersicht“.
      </p>
    </div>
  );
}
