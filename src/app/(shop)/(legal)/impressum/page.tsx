import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { experimentConfig } from "@/config/experiment";
import { getOperator } from "@/config/operator";
import { LegalPage, LegalSection } from "../LegalPage";

export const metadata: Metadata = { title: "Impressum" };

export default function ImpressumPage() {
  if (!experimentConfig.signals.showImprint) notFound();
  const operator = getOperator();

  return (
    <LegalPage
      title="Impressum"
      intro="Angaben zum Anbieter dieser Website. Diese Angaben sind real und beziehen sich auf die Projektverantwortlichen, nicht auf die dargestellte Marke."
    >
      <LegalSection title="Anbieter">
        <p>
          {operator.name}
          <br />
          {operator.legalForm}
          <br />
          {operator.address}
        </p>
      </LegalSection>

      <LegalSection title="Kontakt">
        <p>
          E-Mail:{" "}
          <a href={`mailto:${operator.email}`} className="underline underline-offset-4">
            {operator.email}
          </a>
        </p>
      </LegalSection>

      <LegalSection title="Verantwortlich für den Inhalt">
        <p>{operator.name}, Anschrift wie oben.</p>
      </LegalSection>

      <LegalSection title="Zweck dieser Website">
        <p>{operator.projectDescription}</p>
        <p>
          Die Marke {experimentConfig.brand.name}, die dargestellten Produkte und die
          Unternehmensgeschichte sind erfunden. Es findet kein Verkauf statt.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
