import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { experimentConfig } from "@/config/experiment";
import { getOperator } from "@/config/operator";
import { LegalPage, LegalSection } from "../LegalPage";

export const metadata: Metadata = { title: "Datenschutz" };

/**
 * Unlike the other consumer-information pages, everything here is literally
 * true of the deployed site: no analytics, no pixels, no accounts, no forms.
 */
export default function DatenschutzPage() {
  if (!experimentConfig.signals.showPrivacyPage) notFound();
  const operator = getOperator();

  return (
    <LegalPage
      title="Datenschutz"
      intro="Diese Website erhebt keine personenbezogenen Daten. Die folgenden Angaben beschreiben, was tatsächlich passiert."
    >
      <LegalSection title="Verantwortlich">
        <p>
          {operator.name}, {operator.address},{" "}
          <a href={`mailto:${operator.email}`} className="underline underline-offset-4">
            {operator.email}
          </a>
        </p>
      </LegalSection>

      <LegalSection title="Welche Daten verarbeitet werden">
        <p>
          Es gibt auf dieser Website kein Kundenkonto, kein Kontaktformular, keinen Newsletter und
          keine Kasse. Es werden keine Namen, Anschriften, Telefonnummern, E-Mail-Adressen oder
          Zahlungsdaten erhoben.
        </p>
      </LegalSection>

      <LegalSection title="Warenkorb">
        <p>
          Der Warenkorb wird ausschliesslich im lokalen Speicher deines Browsers abgelegt
          (localStorage). Er enthält nur Produktkennungen, Farbe und Menge. Diese Daten verlassen
          deinen Browser nicht und werden nicht an uns übertragen. Du kannst sie jederzeit über die
          Einstellungen deines Browsers löschen.
        </p>
      </LegalSection>

      <LegalSection title="Keine Analyse und kein Tracking">
        <p>
          Es sind keine Analysedienste, keine Werbepixel, keine Session-Aufzeichnung, keine externen
          Chat- oder Bewertungswidgets und keine Fingerprinting-Verfahren eingebunden. Schriften und
          Bilder werden vom eigenen Server ausgeliefert, es werden keine externen Ressourcen
          nachgeladen.
        </p>
      </LegalSection>

      <LegalSection title="Serverprotokolle">
        <p>
          Beim Abruf der Seiten können beim Hostinganbieter technisch bedingt Zugriffsprotokolle
          anfallen. Diese werden nicht ausgewertet und nur kurz aufbewahrt.
        </p>
      </LegalSection>

      <LegalSection title="Deine Rechte">
        <p>
          Da keine personenbezogenen Daten gespeichert werden, liegen uns keine Daten vor, zu denen
          Auskunft, Berichtigung oder Löschung verlangt werden könnte. Für Rückfragen erreichst du
          uns unter{" "}
          <a href={`mailto:${operator.email}`} className="underline underline-offset-4">
            {operator.email}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
