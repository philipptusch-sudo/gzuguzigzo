import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { experimentConfig } from "@/config/experiment";
import { getOperator } from "@/config/operator";
import { LegalPage, LegalSection } from "../LegalPage";

export const metadata: Metadata = { title: "Widerrufsrecht" };

export default function WiderrufPage() {
  if (!experimentConfig.signals.showWithdrawalPage) notFound();
  const operator = getOperator();

  return (
    <LegalPage
      title="Widerrufsrecht"
      intro="Widerrufsbelehrung, wie sie ein Shop dieser Art ausweisen würde."
    >
      <LegalSection title="Widerrufsrecht">
        <p>
          Verbraucherinnen und Verbraucher haben das Recht, binnen vierzehn Tagen ohne Angabe von
          Gründen einen Vertrag zu widerrufen. Die Frist beträgt vierzehn Tage ab dem Tag, an dem
          die Ware in Besitz genommen wurde.
        </p>
      </LegalSection>

      <LegalSection title="Ausübung des Widerrufs">
        <p>
          Zur Ausübung genügt eine eindeutige Erklärung in Textform an {operator.name},{" "}
          {operator.address}, {operator.email}.
        </p>
      </LegalSection>

      <LegalSection title="Folgen des Widerrufs">
        <p>
          Im Fall eines wirksamen Widerrufs werden alle erhaltenen Zahlungen unverzüglich und
          spätestens binnen vierzehn Tagen zurückgezahlt.
        </p>
      </LegalSection>

      <LegalSection title="Wichtiger Hinweis">
        <p>
          Auf dieser Website kann kein Vertrag geschlossen werden. Es kann nichts bestellt und
          nichts bezahlt werden, also entsteht auch kein Widerrufsfall. Die Angaben auf dieser Seite
          gehören zur Simulation.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
