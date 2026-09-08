import Link from "next/link";
import type { Metadata } from "next";
import { experimentConfig } from "@/config/experiment";
import {
  FAKESHOP_FINDER_URL,
  findMissingOperatorEnvVars,
  getOperator,
  type Operator,
} from "@/config/operator";
import { CaseMark, CheckIcon, InfoIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Über dieses Experiment",
  description:
    "Kofferwerk Auenfels ist ein erfundener Onlineshop. Diese Seite erklärt das Verbraucherschutzexperiment dahinter.",
  // The shop is noindex; the reveal page is deliberately not hidden from
  // crawlers or from any inspection system.
  robots: { index: true, follow: true },
};

/** The four statements that must always be visible, in every variant. */
const SAFETY_STATEMENTS = [
  "Es findet kein Verkauf statt.",
  "Es wurde keine Bestellung ausgelöst.",
  "Es wurden keine Zahlungsdaten abgefragt.",
  "Es wurden keine persönlichen Kundendaten gespeichert.",
] as const;

export default function ExperimentPage() {
  const { brand, signals, variant } = experimentConfig;

  // The production build cannot succeed without these values
  // (scripts/check-operator-env.mjs). Should they ever go missing at runtime,
  // the disclosure itself must still render -- it is the whole point of the page.
  let operator: Operator | null = null;
  let missingOperatorVars: readonly string[] = [];
  try {
    operator = getOperator();
  } catch {
    missingOperatorVars = findMissingOperatorEnvVars(process.env);
  }

  const builtInSignals = [
    {
      active: signals.extremeDiscounts,
      title: "Ungewöhnlich hohe Rabatte",
      body: `Preisnachlässe von rund 65 bis ${brand.maxDiscountLabel} auf die gesamte Kollektion. Rabatte in dieser Höhe über ein komplettes Sortiment hinweg sind im seriösen Handel selten.`,
    },
    {
      active: signals.closureNarrative,
      title: "Erfundene Markenhistorie",
      body: `Die Behauptung, seit ${brand.foundedYearClaim} Reisegepäck zu fertigen, ist frei erfunden. Es gab nie eine Werkstatt, nie einen Familienbetrieb und nie eine Kollektion.`,
    },
    {
      active: signals.closureNarrative,
      title: "Erfundene Geschäftsaufgabe",
      body: `Die angekündigte Werkstattschliessung zum ${brand.closureDateLabel} ist erfunden. Ein zeitlicher Druck, der nicht existiert, ist ein verbreitetes Mittel in betrügerischen Shops.`,
    },
    {
      active: signals.scarcityMessages,
      title: "Knappheitshinweise",
      body: "Hinweise wie „Nur noch wenige Exemplare verfügbar“ stehen hier fest im Quelltext. Sie beruhen auf keinem Lagerbestand.",
    },
    {
      active: signals.prepaymentOnly,
      title: "Zahlung nur per Vorkasse",
      body: "Der Shop nennt Vorkasse per Überweisung als einzige Zahlungsart. Wer im Voraus überweist, hat bei ausbleibender Lieferung kaum eine Möglichkeit, das Geld zurückzuholen – anders als bei Lastschrift, Kreditkarte oder Käuferschutz. Genau deshalb ist Vorkasse als einzige Option ein verbreitetes Merkmal betrügerischer Shops. Eine Bankverbindung wurde hier zu keinem Zeitpunkt genannt, und es konnte nichts überwiesen werden.",
    },
    {
      active: !signals.showImprint,
      title: "Fehlende Anbieterkennzeichnung",
      body: "Der Shop nennt keinen Anbieter, keine Rechtsform und keine Registerangaben. Wer hinter einem Shop steht, muss erkennbar sein.",
    },
    {
      active: !signals.showContactPage,
      title: "Fehlende Kontaktadresse",
      body: "Es gibt keine Anschrift, keine Telefonnummer und keine E-Mail-Adresse. Ohne Kontaktweg lassen sich Ansprüche nicht geltend machen.",
    },
    {
      active: !signals.showWithdrawalPage,
      title: "Fehlende Widerrufsinformationen",
      body: "Der Shop informiert nicht über ein Widerrufsrecht. Im Fernabsatz an Verbraucherinnen und Verbraucher gehört diese Information zum Standard.",
    },
    {
      active: !signals.showShippingPage,
      title: "Fehlende Versandinformationen",
      body: "Zu Lieferzeiten, Versandkosten und Rücksendungen steht nichts auf der Seite – obwohl im Warenkorb „Versand: Kostenlos“ angezeigt wird.",
    },
    {
      active: true,
      title: "Kasse und Newsletter ohne Funktion",
      body: "Die Kasse zeigt drei Schritte an, von denen nur der erste existiert; das Newsletter-Feld meldet beim Absenden einen Fehler. Nicht funktionierende Bestell- und Anmeldewege sind ein häufiges Merkmal überstürzt aufgesetzter Shops. Hier sind sie zugleich die Sicherheitsvorkehrung: Weil nichts angebunden ist, kann auch nichts abfliessen.",
    },
    {
      active: true,
      title: "Neue Shop-Domain",
      body: "Die Domain wurde eigens für dieses Experiment registriert und hat keine Historie. Sehr junge Domains sind ein wiederkehrendes Merkmal von Fake-Shops.",
    },
  ].filter((signal) => signal.active);

  return (
    <div className="bg-cream-100 min-h-dvh">
      <header className="border-cream-300 bg-ink-900 text-cream-100 border-b">
        <div className="container-page flex items-center gap-3 py-5">
          <CaseMark className="text-brass-500 h-7 w-9" />
          <span className="font-serif text-lg">{brand.name}</span>
          <span className="text-cream-300 ml-auto text-xs tracking-[0.16em] uppercase">
            Auflösung
          </span>
        </div>
      </header>

      <main className="container-page max-w-3xl py-14 lg:py-20">
        <h1 className="text-ink-900 font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
          Dieser Shop ist Teil eines Verbraucherschutzexperiments.
        </h1>

        <p className="text-ink-700 mt-7 text-lg leading-relaxed">
          {brand.name}, seine Produkte, seine Unternehmensgeschichte und die angekündigte
          Werkstattschliessung sind frei erfunden. Mit diesem Projekt wird untersucht, wie
          Werbeplattformen und technische Prüfsysteme auf eine erfundene Online-Shop-Marke
          reagieren.
        </p>

        {/* ------------------------------------------------ Sicherheitshinweise */}
        <section
          aria-labelledby="sicherheit"
          data-testid="safety-notice"
          className="border-ink-900 bg-cream-50 mt-12 rounded-md border-2 p-7 sm:p-9"
        >
          <h2 id="sicherheit" className="text-ink-900 font-serif text-2xl">
            Was hier nicht passiert ist
          </h2>
          <ul className="mt-6 space-y-3.5">
            {SAFETY_STATEMENTS.map((statement) => (
              <li key={statement} className="flex items-start gap-3">
                <CheckIcon className="text-brass-600 mt-0.5 h-5 w-5 shrink-0" />
                <span className="text-ink-900 text-base font-medium sm:text-lg">{statement}</span>
              </li>
            ))}
          </ul>
          <p className="text-ink-700 mt-6 text-sm leading-relaxed">
            Der Warenkorb dieser Website liegt ausschliesslich in deinem Browser. Es gibt kein
            Zahlungsformular, kein Kundenkonto und kein Kontaktformular. Es wurden zu keinem
            Zeitpunkt Namen, Anschriften, Telefonnummern, E-Mail-Adressen oder Zahlungsdaten
            erhoben.
          </p>

          <p className="text-ink-700 mt-4 text-sm leading-relaxed">
            <strong className="text-ink-900 font-semibold">
              Falls du in die Adressfelder der Kasse oder in das Newsletter-Feld etwas eingetippt
              hast:
            </strong>{" "}
            Diese Felder sind Attrappen. Sie gehören zu keinem Formular, haben kein Ziel und werden
            von keiner Zeile Code ausgelesen. Es wurde nichts abgeschickt, nichts gespeichert und
            nichts übertragen — das Eingetippte war nur in deinem Browser und ist mit dem Verlassen
            der Seite verschwunden. Eine Bestellung ist nie zustande gekommen.
          </p>
        </section>

        {/* ----------------------------------------------------------- Zweck */}
        <section className="mt-14">
          <h2 className="text-ink-900 font-serif text-2xl sm:text-3xl">Worum es geht</h2>
          <div className="text-ink-700 mt-5 space-y-4 leading-relaxed">
            <p>
              Fake-Shops verkaufen Waren, die nie geliefert werden. Sie wirken oft professionell,
              sind schnell aufgesetzt und werden über bezahlte Anzeigen verbreitet. Für
              Verbraucherinnen und Verbraucher ist von aussen schwer zu erkennen, ob hinter einem
              Shop ein Unternehmen steht.
            </p>
            <p>Dieses Projekt untersucht fünf Fragen:</p>
            <ol className="ml-5 list-decimal space-y-2">
              <li>Lassen Google und Meta Anzeigen für eine frei erfundene Shop-Marke zu?</li>
              <li>Erkennen die Plattformen eine erfundene Unternehmenshistorie?</li>
              <li>Werden Anzeigen für einen erfundenen Räumungsverkauf freigegeben?</li>
              <li>Wie bewertet der Fakeshop-Finder der Verbraucherzentrale diesen Shop?</li>
              <li>Welche einzelnen Shopmerkmale beeinflussen diese Bewertung?</li>
            </ol>
            <p>
              Um die Merkmale einzeln beurteilen zu können, existiert die Seite in mehreren
              Varianten, die sich jeweils nur in einem Punkt unterscheiden. Diese Auslieferung läuft
              in der Variante <code className="text-ink-900 font-mono">{variant}</code>.
            </p>
          </div>
        </section>

        {/* -------------------------------------------------------- Warnzeichen */}
        <section className="mt-14">
          <h2 className="text-ink-900 font-serif text-2xl sm:text-3xl">
            Diese Warnzeichen sind absichtlich eingebaut
          </h2>
          <p className="text-ink-700 mt-4 leading-relaxed">
            Die folgenden Merkmale wurden bewusst gesetzt. Sie zählen zu den Hinweisen, auf die
            Verbraucherzentralen bei der Beurteilung von Onlineshops achten.
          </p>

          <dl className="mt-8 space-y-6">
            {builtInSignals.map((signal) => (
              <div key={signal.title} className="border-brass-600 border-l-2 pl-5">
                <dt className="text-ink-900 font-serif text-lg">{signal.title}</dt>
                <dd className="text-ink-700 mt-1.5 leading-relaxed">{signal.body}</dd>
              </div>
            ))}
          </dl>

          <p className="bg-cream-200 text-ink-700 mt-8 rounded-md p-5 text-sm leading-relaxed">
            <InfoIcon className="text-ink-600 mr-2 inline h-4 w-4 align-[-0.15em]" />
            Ein einzelnes dieser Merkmale beweist noch nichts. Treten mehrere gemeinsam auf, ist
            Vorsicht angebracht. Der{" "}
            <a
              href={FAKESHOP_FINDER_URL}
              className="hover:text-ink-900 underline underline-offset-4"
              rel="noopener noreferrer"
              target="_blank"
            >
              Fakeshop-Finder der Verbraucherzentrale
            </a>{" "}
            prüft eine Adresse auf solche Hinweise.
          </p>
        </section>

        {/* ---------------------------------------------------- Betreiberangaben */}
        <section className="mt-14" data-testid="operator">
          <h2 className="text-ink-900 font-serif text-2xl sm:text-3xl">
            Wer diese Seite tatsächlich betreibt
          </h2>

          {operator ? (
            <>
              <dl className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-[10rem_1fr]">
                <dt className="text-ink-600 text-sm">Verantwortlich</dt>
                <dd className="text-ink-900">{operator.name}</dd>

                <dt className="text-ink-600 text-sm">Rechtsform</dt>
                <dd className="text-ink-900">{operator.legalForm}</dd>

                <dt className="text-ink-600 text-sm">Anschrift</dt>
                <dd className="text-ink-900">{operator.address}</dd>

                <dt className="text-ink-600 text-sm">E-Mail</dt>
                <dd className="text-ink-900">
                  <a
                    href={`mailto:${operator.email}`}
                    className="hover:text-ink-700 underline underline-offset-4"
                  >
                    {operator.email}
                  </a>
                </dd>

                <dt className="text-ink-600 text-sm">Pressekontakt</dt>
                <dd className="text-ink-900">
                  <a
                    href={`mailto:${operator.pressEmail}`}
                    className="hover:text-ink-700 underline underline-offset-4"
                  >
                    {operator.pressEmail}
                  </a>
                </dd>

                <dt className="text-ink-600 text-sm">Projekt</dt>
                <dd className="text-ink-900 leading-relaxed">{operator.projectDescription}</dd>
              </dl>

              <p className="text-ink-700 mt-6 leading-relaxed">
                Rückfragen zu diesem Projekt sind ausdrücklich erwünscht. Schreib uns an{" "}
                <a
                  href={`mailto:${operator.email}`}
                  className="hover:text-ink-900 underline underline-offset-4"
                >
                  {operator.email}
                </a>
                . Wenn du über eine Anzeige hierher gekommen bist und wissen möchtest, welche
                Anzeige das war, nennen wir dir die genaue Formulierung.
              </p>

              <p className="text-ink-700 mt-5 leading-relaxed">
                {operator.reportUrl ? (
                  <>
                    Die Ergebnisse sind im{" "}
                    <a
                      href={operator.reportUrl}
                      className="hover:text-ink-900 underline underline-offset-4"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Untersuchungsbericht
                    </a>{" "}
                    veröffentlicht.
                  </>
                ) : (
                  "Der Untersuchungsbericht wird nach Abschluss des Tests veröffentlicht und an dieser Stelle verlinkt."
                )}
              </p>
            </>
          ) : (
            <p className="border-burgund-700 bg-cream-50 text-ink-900 mt-6 rounded-md border-2 p-5 leading-relaxed">
              Die Betreiberangaben sind in dieser Auslieferung nicht konfiguriert (fehlend:{" "}
              {missingOperatorVars.join(", ")}). Das ist ein Konfigurationsfehler. Diese Seite darf
              in diesem Zustand nicht öffentlich beworben werden.
            </p>
          )}
        </section>

        {/* ------------------------------------------------------ Was tun bei */}
        <section className="border-cream-300 mt-14 border-t pt-10">
          <h2 className="text-ink-900 font-serif text-2xl sm:text-3xl">
            Wenn du auf einen echten Fake-Shop stösst
          </h2>
          <ul className="text-ink-700 mt-5 ml-5 list-disc space-y-2.5 leading-relaxed">
            <li>Prüfe die Adresse zuerst mit dem Fakeshop-Finder der Verbraucherzentrale.</li>
            <li>
              Achte darauf, ob Anbieter, Anschrift und Widerrufsbelehrung vorhanden und vollständig
              sind.
            </li>
            <li>
              Misstraue extremen Rabatten über ein ganzes Sortiment und künstlichem Zeitdruck.
            </li>
            <li>
              Zahle nach Möglichkeit nicht per Vorkasse oder Überweisung an unbekannte Empfänger.
            </li>
            <li>
              Hast du bereits gezahlt, wende dich an deine Bank und an die Verbraucherzentrale.
            </li>
          </ul>

          <p className="mt-8">
            <a
              href={FAKESHOP_FINDER_URL}
              rel="noopener noreferrer"
              target="_blank"
              className="bg-ink-900 text-cream-50 hover:bg-ink-800 inline-flex items-center rounded-sm px-7 py-3.5 text-sm font-medium"
            >
              Zum Fakeshop-Finder der Verbraucherzentrale
            </a>
          </p>
        </section>

        <p className="border-cream-300 text-ink-600 mt-14 border-t pt-8 text-sm">
          <Link href="/" className="hover:text-ink-900 underline underline-offset-4">
            Zurück zur Shop-Ansicht
          </Link>{" "}
          — sie bleibt erreichbar, damit nachvollziehbar bleibt, was Prüfsysteme und
          Werbeplattformen zu sehen bekommen.
        </p>
      </main>
    </div>
  );
}
