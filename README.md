# Kofferwerk Auenfels

Kontrollierte Online-Shop-Simulation für ein journalistisches Verbraucherschutzexperiment.

> **Die Marke, die Produkte, die Unternehmensgeschichte, die Werkstatt und die Geschäftsaufgabe
> sind vollständig erfunden.** Es gibt kein Unternehmen „Kofferwerk Auenfels“, keine Werkstatt und
> keine Kollektion. Die einzigen realen Angaben auf dieser Website sind die
> Projektverantwortlichen auf der Auflösungsseite `/experiment`.

---

## Worum es geht

Fake-Shops werden über bezahlte Anzeigen verbreitet und sind für Verbraucherinnen und Verbraucher
von aussen schwer zu erkennen. Dieses Projekt baut einen realistisch gestalteten, aber vollständig
erfundenen Onlineshop, um fünf Fragen zu untersuchen:

1. Lassen Google und Meta Anzeigen für eine frei erfundene Shop-Marke zu?
2. Erkennen die Plattformen eine erfundene Unternehmenshistorie?
3. Werden Anzeigen für einen erfundenen Räumungsverkauf freigegeben?
4. Wie bewertet der Fakeshop-Finder der Verbraucherzentrale den Shop?
5. Welche einzelnen Shopmerkmale beeinflussen diese Bewertung?

Ablauf und Ergebnisse werden in [`EXPERIMENT.md`](./EXPERIMENT.md) dokumentiert.

## Unveränderbare Sicherheitsgrenzen

Diese Grenzen haben Vorrang vor jedem Design- und Funktionswunsch. Sie sind im Code verankert und
durch Tests abgesichert:

| Grenze                            | Umsetzung                                                                                                             |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Keine Bestellung, keine Zahlung   | Es existiert kein Checkout. „Zur Kasse“ verlinkt direkt auf `/experiment`.                                            |
| Keine personenbezogenen Daten     | Kein Formular, kein Konto, kein Newsletter, kein Kontaktformular, kein Cookie.                                        |
| Kassenrouten führen zur Auflösung | `src/proxy.ts` leitet `/checkout`, `/kasse`, `/payment`, `/bestellung` und weitere serverseitig auf `/experiment` um. |
| Kein Tracking                     | Keine Analyse-, Werbe- oder Session-Recording-Dienste. Keine externen Ressourcen zur Laufzeit.                        |
| Keine technische Täuschung        | Kein Cloaking. Alle Besucher und Prüfsysteme erhalten dieselbe Website.                                               |
| Auflösung immer erreichbar        | `/experiment` wird nie umgeleitet und nie vor Crawlern versteckt.                                                     |
| Kill-Switch                       | `SITE_ENABLED=false` leitet sämtliche Shoprouten sofort auf `/experiment`.                                            |

Details in [`SECURITY.md`](./SECURITY.md).

## Schnellstart

```bash
pnpm install
cp .env.example .env.local   # danach die realen Betreiberangaben eintragen
pnpm dev
```

Der Entwicklungsserver läuft auf <http://localhost:3000>.

### Produktionsbuild

```bash
pnpm build
pnpm start
```

`pnpm build` ruft zuerst `scripts/check-operator-env.mjs` auf. **Fehlt eine der realen
Betreiberangaben, bricht der Build ab** — ohne sie wäre der Shop ohne Auflösung erreichbar.

## Umgebungsvariablen

| Variable                         | Pflicht | Bedeutung                                                                                  |
| -------------------------------- | ------- | ------------------------------------------------------------------------------------------ |
| `SITE_ENABLED`                   | nein    | `false` schaltet alle Shoprouten ab und leitet auf `/experiment`. Standard: eingeschaltet. |
| `NEXT_PUBLIC_EXPERIMENT_VARIANT` | nein    | `control`, `closure-story`, `missing-information` oder `combined`. Standard: `combined`.   |
| `REAL_OPERATOR_NAME`             | **ja**  | Name der Projektverantwortlichen.                                                          |
| `REAL_OPERATOR_LEGAL_FORM`       | **ja**  | Rechtsform.                                                                                |
| `REAL_OPERATOR_ADDRESS`          | **ja**  | Ladungsfähige Anschrift.                                                                   |
| `REAL_OPERATOR_EMAIL`            | **ja**  | E-Mail-Adresse für Rückfragen.                                                             |
| `REAL_PROJECT_DESCRIPTION`       | **ja**  | Kurzbeschreibung des Projekts.                                                             |
| `REAL_PRESS_EMAIL`               | nein    | Pressekontakt. Fällt auf `REAL_OPERATOR_EMAIL` zurück.                                     |
| `REAL_REPORT_URL`                | nein    | Link zum Untersuchungsbericht, sobald er veröffentlicht ist.                               |

Reale Betreiberdaten gehören **nicht** ins Repository. `.env.local` ist über `.gitignore`
ausgeschlossen.

## Versuchsvarianten

Die Variante wird zum Buildzeitpunkt über `NEXT_PUBLIC_EXPERIMENT_VARIANT` festgelegt und darf
während eines laufenden Tests nicht gewechselt werden. Alle Unterschiede leiten sich zentral aus
`src/config/experiment.ts` und `src/lib/copy.ts` ab.

| Variante              | Historie seit 1999 | Geschäftsaufgabe | Rabatte | Knappheit | Zahlung       | Anbieter- und Verbraucherinformationen |
| --------------------- | ------------------ | ---------------- | ------- | --------- | ------------- | -------------------------------------- |
| `control`             | nein               | nein             | 10 %    | nein      | mehrere Arten | vollständig                            |
| `closure-story`       | ja                 | ja               | 65–73 % | ja        | mehrere Arten | vollständig                            |
| `missing-information` | nein               | nein             | 15 %    | nein      | nur Vorkasse  | fehlen vollständig                     |
| `combined`            | ja                 | ja               | 65–73 % | ja        | nur Vorkasse  | fehlen vollständig                     |

Die Zahlungsangabe ist reine Shopkommunikation: Es wird **keine Bankverbindung** genannt, keine
Zahlungsart ist angebunden, und bezahlt werden kann nichts. „Zur Kasse“ führt zur Auflösung.

In den Varianten mit vollständigen Verbraucherinformationen existieren `/impressum`, `/kontakt`,
`/versand`, `/widerruf`, `/agb` und `/datenschutz`. Diese Seiten nennen die **realen**
Projektverantwortlichen und verweisen auf `/experiment`. In den beiden anderen Varianten liefern
dieselben Routen einen 404 aus, und es gibt keinerlei Links dorthin — ein leerer Platzhalter wäre
ein anderes Signal als eine fehlende Seite.

## Seitenstruktur

```
/                      Startseite
/kollektion            Alle Modelle, optional gefiltert (?kategorie=…)
/koffer/[slug]         Produktdetailseite (acht Modelle)
/faq                   Häufige Fragen zu Produkt, Maßen, Material, Pflege, Garantie
/warenkorb             Warenkorb, „Zur Kasse“ führt zur Adresseingabe
/kasse                 Adresseingabe (Schritt 1 von 3), „Weiter“ führt auf /experiment
/newsletter            Anmeldefeld ohne Funktion
/experiment            Auflösung — für Menschen immer erreichbar, für Crawler gesperrt
```

Zusätzlich nur in `control` und `closure-story`:
`/impressum`, `/kontakt`, `/versand`, `/widerruf`, `/agb`, `/datenschutz`.

## Attrappen: Kasse und Newsletter

Der Shop zeigt eine Kasse mit Adresseingabe und eine Newsletter-Anmeldung. Beide sehen aus wie
Eingabemasken und sind keine — ein Shop ganz ohne Kasse wäre so ungewöhnlich, dass er die Bewertung
allein dadurch verzerren würde.

Es wird nichts gelesen, nichts gespeichert und nichts übertragen. Die Adressfelder liegen in einer
Server Component, für die überhaupt kein Client-JavaScript ausgeliefert wird; die Felder sind
unkontrolliert, tragen kein `name`, liegen in keinem `<form>` und haben `autoComplete="off"`, damit
der Browser keine echte Adresse einträgt. „Weiter“ ist ein Link auf `/experiment`. Details und
Testabdeckung in [`SECURITY.md`](./SECURITY.md), Abschnitt 2.

## Kill-Switch

```bash
SITE_ENABLED=false
```

Die Variable wird bei jeder Anfrage serverseitig ausgewertet (`src/app/(shop)/layout.tsx`). Sie
lässt sich in der Hostingumgebung umlegen und wirkt **ohne Codeänderung und ohne neuen Build**.
`src/proxy.ts` wertet sie zusätzlich aus.

## Skripte

| Befehl                 | Wirkung                                              |
| ---------------------- | ---------------------------------------------------- |
| `pnpm dev`             | Entwicklungsserver                                   |
| `pnpm build`           | Betreiberangaben prüfen, danach Produktionsbuild     |
| `pnpm start`           | Produktionsserver                                    |
| `pnpm lint`            | ESLint                                               |
| `pnpm format`          | Prettier schreiben                                   |
| `pnpm typecheck`       | TypeScript im Strict Mode                            |
| `pnpm test`            | Vitest (Komponenten und Logik)                       |
| `pnpm test:e2e`        | Playwright gegen einen Produktionsbuild              |
| `pnpm verify`          | Format, Lint, Typecheck und Unit-Tests in einem Lauf |
| `pnpm check:env`       | Nur die Prüfung der Betreiberangaben                 |
| `pnpm images:generate` | SVG-Platzhalter neu erzeugen                         |

Läuft auf der Maschine bereits ein passendes Chromium, kann Playwright darauf gelenkt werden:

```bash
PLAYWRIGHT_CHROMIUM_PATH=/pfad/zu/chromium pnpm test:e2e
```

## Aufbau des Codes

```
src/
  app/
    layout.tsx              Grundgerüst, Schriften, noindex
    (shop)/                 Shopansicht, Kill-Switch-Guard, Header und Footer
    (shop)/(legal)/         Verbraucherinformationen, variantenabhängig
    experiment/             Auflösungsseite (ausserhalb des Kill-Switch)
    robots.ts               Erlaubt das Crawlen aller Seiten
  components/               Darstellung
  config/experiment.ts      Varianten, Signale, Sicherheitsschalter
  config/operator.ts        Reale Betreiberangaben aus der Umgebung (server-only)
  context/CartContext.tsx   Warenkorb für die Oberfläche
  data/products.ts          Acht erfundene Produkte
  data/faq.ts               Häufige Fragen
  lib/cart.ts               Warenkorblogik ohne React
  lib/cart-store.ts         Warenkorb als externer Store über localStorage
  lib/pricing.ts            Preis- und Rabattlogik
  lib/copy.ts               Variantenabhängige Texte
  lib/site-state.ts         Kill-Switch und Kassenrouten
  proxy.ts                  Weiterleitungen, Kill-Switch, Content-Security-Policy
```

## Bilder

Alle Bilder liegen lokal unter `public/images` und sind eigens erzeugte SVG-Platzhalter. Welche
Motive später durch echte Aufnahmen ersetzt werden sollen, steht in
[`IMAGE-BRIEFING.md`](./IMAGE-BRIEFING.md).

## Veröffentlichen

Eine Schritt-für-Schritt-Anleitung für Railway steht in
[`DEPLOY-RAILWAY.md`](./DEPLOY-RAILWAY.md). Sie deckt Variablen, Domain, Prüfschritte vor dem
ersten Anzeigentest und den Kill-Switch im Betrieb ab.

## Vor dem öffentlichen Einsatz

Die Variante mit fehlender Anbieterkennzeichnung darf **erst nach rechtlicher Prüfung und Freigabe**
öffentlich eingesetzt werden. Siehe [`LEGAL-REVIEW.md`](./LEGAL-REVIEW.md).

## Weitere Dokumente

- [`EXPERIMENT.md`](./EXPERIMENT.md) — Versuchsprotokoll und Ergebnistabelle
- [`AD-COPY.md`](./AD-COPY.md) — Anzeigentexte und Regeln für die Schaltung
- [`IMAGE-BRIEFING.md`](./IMAGE-BRIEFING.md) — Bildmotive
- [`LEGAL-REVIEW.md`](./LEGAL-REVIEW.md) — rechtliche Prüfpunkte vor dem Einsatz
- [`SECURITY.md`](./SECURITY.md) — Sicherheitsgrenzen und ihre technische Umsetzung
- [`DEPLOY-RAILWAY.md`](./DEPLOY-RAILWAY.md) — Veröffentlichung auf Railway
