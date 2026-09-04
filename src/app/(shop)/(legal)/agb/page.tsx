import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { experimentConfig } from "@/config/experiment";
import { LegalPage, LegalSection } from "../LegalPage";

export const metadata: Metadata = { title: "Allgemeine Geschäftsbedingungen" };

export default function AgbPage() {
  if (!experimentConfig.signals.showTermsPage) notFound();

  return (
    <LegalPage
      title="Allgemeine Geschäftsbedingungen"
      intro="Geschäftsbedingungen, wie sie ein Shop dieser Art ausweisen würde."
    >
      <LegalSection title="1. Geltungsbereich">
        <p>
          Diese Bedingungen gelten für alle Bestellungen über diesen Onlineshop durch
          Verbraucherinnen und Verbraucher sowie Unternehmen.
        </p>
      </LegalSection>

      <LegalSection title="2. Vertragsschluss">
        <p>
          Die Darstellung der Produkte stellt kein bindendes Angebot dar. Ein Vertrag kommt erst mit
          der Annahme einer Bestellung zustande.
        </p>
      </LegalSection>

      <LegalSection title="3. Preise">
        <p>Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer.</p>
      </LegalSection>

      <LegalSection title="4. Gewährleistung">
        <p>Es gilt das gesetzliche Mängelhaftungsrecht.</p>
      </LegalSection>

      <LegalSection title="5. Wichtiger Hinweis">
        <p>
          Über diese Website kann keine Bestellung aufgegeben werden. Es kommt kein Vertrag
          zustande. Die Angaben auf dieser Seite gehören zur Simulation.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
