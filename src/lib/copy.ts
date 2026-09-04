import { experimentConfig } from "@/config/experiment";

/**
 * Every string that differs between experiment arms lives here.
 *
 * Keeping the copy in one place means a variant can be reasoned about by
 * reading a single file, and it prevents the fabricated closure story from
 * leaking into an arm that is supposed to be neutral.
 */

const { brand, signals } = experimentConfig;
const tellsClosureStory = signals.closureNarrative;

export const copy = {
  /** Sub-line under the wordmark. Only claims a founding year where the arm tests that claim. */
  brandClaim: tellsClosureStory ? brand.claim : "Reisegepäck für unterwegs",

  announcement: tellsClosureStory
    ? `Werkstattschliessung: Letzte Kollektion bis zu ${brand.maxDiscountLabel} reduziert`
    : "Versandkostenfrei innerhalb Deutschlands",

  hero: {
    eyebrow: tellsClosureStory ? "Abschiedsverkauf" : "Aktuelle Kollektion",
    headline: tellsClosureStory
      ? brand.campaignLine
      : "Reisegepäck für kurze Wege und grosse Reisen.",
    body: tellsClosureStory
      ? `Seit ${brand.foundedYearClaim} entstehen bei ${brand.name} Reisebegleiter für kurze Wege und grosse Reisen. Nun schliessen wir unsere Werkstatt. Entdecke die letzten Stücke unserer Kollektion – solange der Vorrat reicht.`
      : `Koffer, Trolleys und Reisetaschen von ${brand.name}. Ruhige Rollen, durchdachte Innenaufteilung, robuste Schalen – für Menschen, die viel unterwegs sind.`,
    primaryCta: tellsClosureStory ? "Zum Abschiedsverkauf" : "Zur Kollektion",
    secondaryCta: "Unsere Geschichte",
  },

  featuredHeading: tellsClosureStory ? "Letzte Stücke" : "Aus der Kollektion",
  featuredIntro: tellsClosureStory
    ? "Vier Modelle aus dem verbleibenden Bestand unserer Werkstatt."
    : "Vier Modelle, die wir besonders gerne mitgeben.",

  story: {
    heading: tellsClosureStory ? `${brand.claimedYears} Jahre Reisegepäck` : "Unsere Werkstatt",
    paragraphs: tellsClosureStory
      ? [
          `Seit ${brand.foundedYearClaim} fertigt ${brand.name} Reisegepäck für Menschen, die viel unterwegs sind. Was als kleine Werkstatt begann, wurde über die Jahre zu einem Familienbetrieb.`,
          `Nach ${brand.claimedYears} Jahren endet diese Reise. Steigende Kosten und eine fehlende Nachfolge zwingen uns dazu, unsere Werkstatt zum Monatsende zu schliessen.`,
          "Die letzten Stücke unserer Kollektion geben wir im Rahmen unseres Abschiedsverkaufs weiter. Was hier steht, kommt nicht nach.",
        ]
      : [
          "In unserer Werkstatt entstehen Koffer, Trolleys und Reisetaschen. Wir arbeiten in kleinen Serien und ändern lieber Kleinigkeiten, als jede Saison ein neues Modell aufzulegen.",
          "Was uns dabei wichtig ist: ruhige Rollen, ein Griff, der nicht klappert, und eine Innenaufteilung, die man nach der ersten Reise nicht mehr erklärt bekommen muss.",
          "Ersatzteile halten wir für unsere Modelle über Jahre vor.",
        ],
    yearLabel: tellsClosureStory ? String(brand.foundedYearClaim) : null,
    yearCaption: tellsClosureStory ? "Gegründet" : null,
  },

  closingSection: {
    heading: "Die letzten Wochen",
    body: `Unsere Werkstatt schliesst am ${brand.closureDateLabel}. Bis dahin geben wir den verbleibenden Bestand ab. Nachbestellungen sind nicht mehr möglich.`,
    cta: "Zur Kollektion",
  },

  collection: {
    heading: tellsClosureStory ? "Unsere letzte Kollektion" : "Unsere Kollektion",
    intro: tellsClosureStory
      ? `Acht Modelle, die bei uns entstanden sind. Was verkauft ist, kommt nicht nach – die Werkstatt schliesst am ${brand.closureDateLabel}.`
      : "Acht Modelle für kurze Wege und grosse Reisen.",
  },

  productBadge: tellsClosureStory ? "Abschiedsverkauf" : null,
  campaignNote: tellsClosureStory ? `Abschiedsverkauf bis zum ${brand.closureDateLabel}` : null,

  /** Static scarcity notice, or null where the arm does not test scarcity. */
  scarcityNote: (fallback: string): string | null => (signals.scarcityMessages ? fallback : null),

  /**
   * Payment claim.
   *
   * This is copy and nothing else. No bank details are published anywhere on
   * this site, no payment method is wired up and no payment can be made --
   * "Zur Kasse" leads to the reveal page. Naming advance transfer as the only
   * option is itself one of the signals under test: the consumer advice
   * centres list restrictive payment terms among the typical warning signs.
   */
  payment: {
    /** Short line next to the buy button. */
    note: signals.prepaymentOnly
      ? "Zahlung nur per Vorkasse (Überweisung)"
      : "Zahlung per Überweisung, Lastschrift oder Kreditkarte",
    accordionTitle: "Zahlung",
    accordionBody: signals.prepaymentOnly
      ? [
          "Wir liefern ausschliesslich gegen Vorkasse per Überweisung. Andere Zahlungsarten bieten wir nicht an.",
          "Die Zahlungsinformationen erhältst du im Anschluss an die Bestellung. Sobald der Betrag bei uns eingegangen ist, geht dein Gepäckstück in den Versand.",
        ]
      : [
          "Du kannst per Überweisung, per SEPA-Lastschrift oder mit Kreditkarte bezahlen.",
          "Die Zahlungsart wählst du im Bestellabschluss aus.",
        ],
  },
} as const;

export const NAV_LINKS: readonly { href: string; label: string }[] = [
  { href: "/kollektion", label: "Kollektion" },
  ...(tellsClosureStory ? [{ href: "/#letzte-stuecke", label: "Unsere letzten Stücke" }] : []),
  { href: "/faq", label: "FAQ" },
];
