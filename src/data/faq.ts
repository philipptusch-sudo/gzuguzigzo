import { experimentConfig } from "@/config/experiment";

/**
 * Frequently asked questions.
 *
 * Limited to the product itself plus the payment claim: sizes, cabin
 * dimensions, material, care, guarantee and how payment works. Delivery,
 * withdrawal, returns and how to reach a merchant are consumer-information
 * topics -- they belong on the pages that exist only in the arms which include
 * them, not in a product FAQ.
 *
 * The payment answer names a method but never a bank account: no IBAN, no BIC
 * and no account holder appear anywhere in this project.
 */

export type FaqEntry = {
  readonly id: string;
  readonly question: string;
  readonly answer: readonly string[];
  /** Shown in the short FAQ excerpt on the home page. */
  readonly featured: boolean;
};

const { brand } = experimentConfig;

export const faqEntries: readonly FaqEntry[] = [
  {
    id: "groessen",
    question: "Welche Größen gibt es?",
    answer: [
      "Unsere Kollektion umfasst vier Einzelgrößen und zwei Sets. Die Kabine 38 fasst 38 Liter, die Reise 68 mit 68 Litern deckt ein bis zwei Wochen ab, die Grande 76 mit 76 Litern ist für lange Reisen gedacht. Die Business 42 liegt mit 42 Litern dazwischen und ist auf Tagesreisen ausgelegt.",
      "Dazu kommen der Weekender mit 34 Litern als weiche Tasche und die Reisebox mit 12 Litern für Kosmetik und Kleinteile.",
    ],
    featured: true,
  },
  {
    id: "handgepaeck",
    question: "Welche Modelle erfüllen das Handgepäckmaß?",
    answer: [
      "Die Kabine 38 misst 55 × 38 × 22 cm und liegt damit im Bereich der gängigen Handgepäckmaße. Die Business 42 misst 55 × 40 × 23 cm und ist in der Breite knapper bemessen.",
      "Die zulässigen Maße unterscheiden sich je nach Fluggesellschaft und Tarif und ändern sich gelegentlich. Prüfe sie vor jeder Reise bei deiner Airline.",
    ],
    featured: true,
  },
  {
    id: "material",
    question: "Aus welchem Material bestehen die Koffer?",
    answer: [
      "Die Kabine 38 und die Reisebox haben eine Schale aus Polycarbonat. Die Reise 68 und die Grande 76 bestehen aus Polypropylen, das etwas nachgiebiger ist und Stöße besser aufnimmt.",
      "Der Weekender ist aus beschichtetem Segeltuch gefertigt, Griffe und Boden sind mit Leder verstärkt. Die Gestänge sind aus Aluminium.",
    ],
    featured: true,
  },
  {
    id: "pflege",
    question: "Wie pflege ich meinen Koffer?",
    answer: [
      "Die Hartschalen lassen sich mit einem feuchten Tuch und einem milden Reinigungsmittel abwischen. Scheuermittel hinterlassen matte Stellen.",
      "Die Rollen halten länger, wenn du gelegentlich Haare und Fasern aus den Lagern entfernst. Lederteile vertragen ein- bis zweimal im Jahr farblosen Lederbalsam.",
      "Lagere die Koffer trocken und nicht dauerhaft in direkter Sonne, damit die Farbe nicht ausbleicht.",
    ],
    featured: true,
  },
  {
    id: "garantie",
    question: "Wie lange gilt die Garantie?",
    answer: [
      "Auf Schale, Gestänge und Rollen geben wir eine Herstellergarantie von fünf Jahren ab Kaufdatum. Sie deckt Material- und Verarbeitungsfehler ab.",
      "Nicht abgedeckt sind Schäden durch normale Abnutzung, durch die Gepäckabfertigung oder durch Überladung. Die gesetzlichen Rechte bleiben davon unberührt.",
      ...(experimentConfig.signals.closureNarrative
        ? [
            `Mit der Schliessung unserer Werkstatt am ${brand.closureDateLabel} können wir keine Ersatzteile mehr nachliefern.`,
          ]
        : ["Ersatzteile für Rollen und Griffe halten wir für unsere Modelle vor."]),
    ],
    featured: true,
  },
  {
    id: "zahlung",
    question: "Wie kann ich bezahlen?",
    answer: experimentConfig.signals.prepaymentOnly
      ? [
          "Wir liefern ausschliesslich gegen Vorkasse per Überweisung. Andere Zahlungsarten bieten wir nicht an.",
          "Die Zahlungsinformationen erhältst du im Anschluss an die Bestellung. Sobald der Betrag bei uns eingegangen ist, geht dein Gepäckstück in den Versand.",
        ]
      : [
          "Du kannst per Überweisung, per SEPA-Lastschrift oder mit Kreditkarte bezahlen.",
          "Die Zahlungsart wählst du im Bestellabschluss aus. Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer.",
        ],
    featured: false,
  },
  {
    id: "innenaufteilung",
    question: "Wie sind die Koffer innen aufgeteilt?",
    answer: [
      "Alle Hartschalenmodelle öffnen sich in zwei Hälften. Auf der tieferen Seite hält ein Gurtband die Packung zusammen, die flachere Seite schliesst je nach Modell mit einem Netzfach oder einer Trennwand mit Reissverschluss.",
      "Bei der Reise 68 und der Grande 76 lassen sich Netzfach und Trennwand herausnehmen.",
    ],
    featured: false,
  },
  {
    id: "rollen",
    question: "Was bedeutet „leise Doppelrollen“?",
    answer: [
      "Jede der vier Ecken trägt zwei nebeneinander liegende Rollen statt einer breiten. Das verteilt das Gewicht auf mehr Auflagepunkte und läuft dadurch ruhiger, besonders auf Kopfsteinpflaster und Bahnsteigen.",
      "Die Rollen drehen um 360 Grad, der Koffer lässt sich also auch neben sich herschieben.",
    ],
    featured: false,
  },
  {
    id: "schloss",
    question: "Haben die Koffer ein Schloss?",
    answer: [
      "Die Kabine 38, die Reise 68, die Grande 76 und beide Sets haben ein integriertes Zahlenschloss mit dreistelliger Kombination. Ab Werk steht es auf 0-0-0 und lässt sich beim ersten Öffnen neu einstellen.",
      "Der Weekender und die Reisebox haben kein Schloss.",
    ],
    featured: false,
  },
  {
    id: "gewicht",
    question: "Wie schwer sind die Koffer leer?",
    answer: [
      "Die Kabine 38 wiegt 2,7 kg, die Business 42 3,1 kg, die Reise 68 3,6 kg und die Grande 76 4,4 kg. Der Weekender wiegt 1,4 kg, die Reisebox 1,1 kg.",
      "Das Leergewicht zählt bei Fluggesellschaften auf das Freigepäck mit.",
    ],
    featured: false,
  },
];

export const featuredFaqEntries = faqEntries.filter((entry) => entry.featured);
