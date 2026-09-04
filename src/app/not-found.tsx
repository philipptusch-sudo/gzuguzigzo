import Link from "next/link";
import type { Metadata } from "next";
import { experimentConfig } from "@/config/experiment";
import { CaseMark } from "@/components/icons";

export const metadata: Metadata = { title: "Seite nicht gefunden" };

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-cream-300 border-b">
        <div className="container-page flex items-center gap-3 py-5">
          <CaseMark className="text-brass-600 h-7 w-9" />
          <Link href="/" className="text-ink-900 font-serif text-lg">
            {experimentConfig.brand.name}
          </Link>
        </div>
      </header>

      <main className="container-page flex flex-1 flex-col justify-center py-24">
        <p className="text-ink-600 text-xs tracking-[0.2em] uppercase">Fehler 404</p>
        <h1 className="text-ink-900 mt-4 font-serif text-4xl sm:text-5xl">
          Diese Seite gibt es nicht.
        </h1>
        <p className="text-ink-700 mt-5 max-w-lg leading-relaxed">
          Vielleicht ist der Link veraltet oder das Modell ist nicht mehr Teil unserer Kollektion.
        </p>

        <ul className="mt-9 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <li>
            <Link href="/" className="hover:text-ink-900 underline underline-offset-4">
              Zur Startseite
            </Link>
          </li>
          <li>
            <Link href="/kollektion" className="hover:text-ink-900 underline underline-offset-4">
              Zur Kollektion
            </Link>
          </li>
          <li>
            <Link href="/faq" className="hover:text-ink-900 underline underline-offset-4">
              Häufige Fragen
            </Link>
          </li>
        </ul>
      </main>
    </div>
  );
}
