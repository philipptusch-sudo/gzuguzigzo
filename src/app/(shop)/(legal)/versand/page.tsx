import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { experimentConfig } from "@/config/experiment";
import { LegalPage, LegalSection } from "../LegalPage";

export const metadata: Metadata = { title: "Versand" };

export default function VersandPage() {
  if (!experimentConfig.signals.showShippingPage) notFound();

  return (
    <LegalPage
      title="Versand"
      intro="Angaben zu Versandkosten und Lieferzeiten, wie sie ein Shop dieser Art ausweisen würde."
    >
      <LegalSection title="Versandkosten">
        <p>
          Der Versand innerhalb Deutschlands ist kostenlos. Für Lieferungen nach Österreich und in
          die Schweiz werden 9,90 € berechnet.
        </p>
      </LegalSection>

      <LegalSection title="Lieferzeit">
        <p>
          Innerhalb Deutschlands zwei bis vier Werktage nach Versandbestätigung, in das übrige
          Ausland fünf bis acht Werktage.
        </p>
      </LegalSection>

      <LegalSection title="Rücksendung">
        <p>
          Rücksendungen innerhalb der Widerrufsfrist sind für dich kostenfrei. Das Rücksendeetikett
          liegt der Sendung bei.
        </p>
      </LegalSection>

      <LegalSection title="Wichtiger Hinweis">
        <p>
          Auf dieser Website kann keine Bestellung ausgelöst werden. Es wird nichts versendet und
          nichts berechnet. Die Angaben auf dieser Seite gehören zur Simulation.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
