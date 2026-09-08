import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { experimentConfig } from "@/config/experiment";
import { NewsletterField } from "@/components/NewsletterField";

export const metadata: Metadata = { title: "Newsletter" };

/**
 * A newsletter page whose signup never works.
 *
 * A non-functional element on an otherwise polished shop is itself a small
 * warning sign, and it keeps the site from looking implausible for the lack of
 * a newsletter. No address is ever read, stored or transmitted -- see
 * `NewsletterField`.
 */
export default function NewsletterPage() {
  if (!experimentConfig.display.newsletterForm) notFound();

  const { brand, signals } = experimentConfig;

  return (
    <div className="container-page max-w-3xl py-14 lg:py-20">
      <h1 className="text-ink-900 font-serif text-4xl sm:text-5xl">Newsletter</h1>

      <p className="text-ink-700 mt-5 leading-relaxed">
        {signals.closureNarrative
          ? `Bis zur Schliessung unserer Werkstatt am ${brand.closureDateLabel} schreiben wir noch ein paar Mal: welche Modelle noch da sind, was aus den Restbeständen wird und wann Schluss ist.`
          : "Ein paar Mal im Jahr: neue Modelle, kleine Änderungen an bestehenden, Hinweise zur Pflege."}
      </p>

      <NewsletterField />

      <p className="text-ink-600 mt-10 text-sm leading-relaxed">
        Abmeldung jederzeit über den Link am Ende jeder E-Mail.
      </p>
    </div>
  );
}
