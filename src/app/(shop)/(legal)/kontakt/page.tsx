import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { experimentConfig } from "@/config/experiment";
import { getOperator } from "@/config/operator";
import { LegalPage, LegalSection } from "../LegalPage";

export const metadata: Metadata = { title: "Kontakt" };

/**
 * Contact details, never a contact form. No variant of this project accepts
 * free-text input or an e-mail address from a visitor.
 */
export default function KontaktPage() {
  if (!experimentConfig.signals.showContactPage) notFound();
  const operator = getOperator();

  return (
    <LegalPage
      title="Kontakt"
      intro="Du erreichst uns per E-Mail oder per Post. Ein Kontaktformular gibt es auf dieser Website bewusst nicht."
    >
      <LegalSection title="Per E-Mail">
        <p>
          <a href={`mailto:${operator.email}`} className="underline underline-offset-4">
            {operator.email}
          </a>
        </p>
      </LegalSection>

      <LegalSection title="Per Post">
        <p>
          {operator.name}
          <br />
          {operator.address}
        </p>
      </LegalSection>

      <LegalSection title="Presse">
        <p>
          <a href={`mailto:${operator.pressEmail}`} className="underline underline-offset-4">
            {operator.pressEmail}
          </a>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
