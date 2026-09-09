# Sicherheitsgrenzen

Dieses Dokument beschreibt, welche Grenzen dieses Projekt einhält, wo sie im Code stehen und
welcher Test sie absichert. Die Grenzen haben Vorrang vor jedem Design- und Funktionswunsch.

---

## 1. Keine Transaktion

**Es gibt keinen Checkout — nicht abgeschaltet, sondern nicht gebaut.**

| Massnahme                                                                                                                             | Ort                                     |
| ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| „Zur Kasse“ verlinkt direkt auf `/experiment`                                                                                         | `src/components/CartView.tsx`           |
| `/checkout`, `/kasse`, `/payment`, `/bestellung`, `/zahlung`, `/warenkorb/kasse` und deren Unterseiten leiten serverseitig mit 307 um | `src/proxy.ts`, `src/lib/site-state.ts` |
| Kein Zahlungsanbieter, kein SDK, kein Kreditkartenfeld                                                                                | im gesamten Repository nicht vorhanden  |
| Sicherheitsschalter dauerhaft auf `false`                                                                                             | `src/config/experiment.ts` → `safety`   |

### Die Zahlungsangabe ist Text, kein Zahlungsweg

In den Varianten `missing-information` und `combined` nennt der Shop Vorkasse per Überweisung als
einzige Zahlungsart. Das ist eines der untersuchten Warnzeichen — und ausschliesslich eine
Behauptung im Seitentext.

**Es wird nirgends eine Bankverbindung genannt.** Keine IBAN, keine BIC, kein Kontoinhaber, keine
Kontonummer, keine Bankleitzahl — weder auf den Produktseiten noch in der FAQ noch sonst im
Repository. Damit bleibt die Angabe eine Aussage über den Shop, ohne dass ein Cent fliessen
könnte. Die Auflösungsseite erklärt genau das.

Zwei Tests halten die Grenze: `tests/unit/safety-boundaries.test.ts` sucht im Quelltext nach
IBAN-Mustern und den Begriffen BIC, Kontoinhaber, Kontonummer und Bankleitzahl;
`tests/e2e/safety.spec.ts` prüft zusätzlich den ausgelieferten Text jeder Shopseite im Browser.

Abgesichert durch: `tests/unit/site-state.test.ts`, `tests/unit/safety-boundaries.test.ts`,
`tests/e2e/safety.spec.ts`, `tests/e2e/cart.spec.ts`.

## 2. Keine personenbezogenen Daten

**Es existiert kein einziges `<form>` auf der Website.** Damit gibt es kein Absendeziel, und die
Eingabetaste löst nirgends etwas aus.

Nicht vorhanden: Kundenkonto, Anmeldung, Kontaktformular, Zahlungsdaten, Bestellabschluss.

Eingabefelder gibt es, aber keines davon überträgt oder speichert etwas:

- **Mengenwahl** auf der Produktseite — verändert nur den lokalen Warenkorb.
- **Produktsuche** im Kopfbereich — filtert den lokalen Katalog im Browser. Keine Anfrage, keine
  Speicherung des Suchbegriffs.
- **Adressfelder in der Kasse** (`/kasse`) — Attrappen, siehe unten.
- **Newsletter-Feld** (`/newsletter`) — Attrappe, siehe unten.

### Die Attrappen-Felder

Der Shop zeigt eine Kasse mit Adresseingabe und eine Newsletter-Anmeldung. Beides sieht aus wie
eine Eingabemaske und ist keine. Ein Shop ganz ohne Kasse und ohne Newsletter wäre so ungewöhnlich,
dass er allein dadurch die Bewertung verzerren würde, die dieses Experiment misst.

Die Sicherheit ergibt sich hier aus dem, was **nicht** da ist:

| Eigenschaft                                                                | Wirkung                                                                                                                                          |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CheckoutAddressFields` ist eine Server Component                          | Für die Adressfelder wird kein Client-JavaScript ausgeliefert. Es existiert kein Code, der lesen könnte, was jemand tippt.                       |
| Die Felder sind unkontrolliert und haben kein `name`                       | Die Werte leben nur im DOM und sind mit dem Verlassen der Seite weg.                                                                             |
| Kein `<form>`, kein Absende-Button                                         | Es gibt kein Ziel. „Weiter" ist ein Link auf `/experiment`.                                                                                      |
| `autoComplete="off"`, `type="text"` statt `type="email"` oder `type="tel"` | Der Browser füllt keine echte Adresse ein, die niemand eingeben wollte. Das ist das realistischste Restrisiko und deshalb gesondert abgesichert. |
| `NewsletterField` setzt nur ein Boolean                                    | Die Komponente referenziert das Eingabefeld nirgends. Der Knopf zeigt eine Fehlermeldung, sonst nichts.                                          |

Die Kasse hat genau einen Schritt. Die Anzeige nennt drei; Schritt zwei und drei sind Beschriftungen
ohne Route. Jede Route, die eine Zahlung oder eine aufgegebene Bestellung nahelegt — `/checkout`,
`/payment`, `/bestellung`, `/zahlung`, `/kasse/zahlung`, `/kasse/bestaetigung` — leitet weiterhin
auf `/experiment` um.

Die Auflösungsseite spricht das ausdrücklich an: Wer etwas eingetippt hat, liest dort, dass es
Attrappen waren und nichts abgeschickt, gespeichert oder übertragen wurde.

Abgesichert durch `tests/e2e/checkout.spec.ts`: Der Test füllt jedes Feld aus, klickt auf „Weiter"
und prüft danach, dass keine Anfrage nach draussen ging, keine Anfrage ausser GET gestellt wurde,
weder localStorage noch sessionStorage noch Cookies einen der eingetippten Werte enthalten und die
Felder nach einem Neuladen leer sind. Auf Quelltextebene prüft
`tests/unit/safety-boundaries.test.ts`, dass kein Feld ein `name` trägt, kein `autocomplete`-Wert
ausser `off` vorkommt und die Felder nirgends ausgelesen werden.

Der Warenkorb liegt ausschliesslich im `localStorage` des Besuchers und enthält nur
Produktkennung, Farbe und Menge. Er verlässt den Browser nicht. Es werden keine Cookies gesetzt.

Abgesichert durch: `tests/unit/safety-boundaries.test.ts` (Quelltextprüfung auf Formulare,
verbotene Feldtypen, Speicherschlüssel, `document.cookie`) und `tests/e2e/safety.spec.ts`.

## 3. Verbindliche Auflösung

`/experiment` ist die einzige Seite, die dieses Projekt vertretbar macht. Sie ist deshalb besonders
geschützt:

- Sie wird **nie** umgeleitet, auch nicht durch den Kill-Switch (`isAlwaysReachable` in
  `src/lib/site-state.ts`).
- Sie liegt ausserhalb der Route-Gruppe `(shop)` und damit ausserhalb des Kill-Switch-Guards.
- Sie ist als einzige Seite auf `index, follow` gesetzt und wird in keiner Robots-Regel
  ausgeschlossen.
- Sie nennt die realen Verantwortlichen aus der Umgebung.
- **Der Produktionsbuild bricht ab, wenn diese Angaben fehlen** —
  `scripts/check-operator-env.mjs` läuft vor `next build`.
- Fehlen die Angaben zur Laufzeit, rendert die Seite trotzdem: die vier Sicherheitshinweise
  erscheinen weiterhin, ergänzt um einen sichtbaren Konfigurationsfehler. Ein Ausfall darf nicht
  dazu führen, dass gar keine Auflösung erscheint.

Abgesichert durch: `tests/unit/operator-env.test.ts`, `tests/e2e/safety.spec.ts`.

## 4. Keine technische Täuschung gegenüber Prüfsystemen

**Alle Besucher und alle Prüfsysteme erhalten byte-identische Antworten.**

Nicht vorhanden und ausdrücklich ausgeschlossen:

- Cloaking jeder Art
- Auswertung von User-Agent, IP-Adresse, Geolocation oder Referrer im Request-Layer
- Inhalte, die von der Herkunft eines Anzeigenklicks abhängen
- versteckte Weiterleitungen
- Inhalte, die erst nach Freigabe der Anzeigen ausgetauscht werden
- Manipulation des Fakeshop-Finders

`src/proxy.ts` trifft seine Entscheidung ausschliesslich anhand des Pfades und der
Umgebungsvariablen. Ein Test liest die Datei und schlägt fehl, sobald dort `user-agent`,
`x-forwarded-for`, `request.ip`, `geo.` oder `referrer` auftaucht:
`tests/unit/safety-boundaries.test.ts`.

Die Varianten unterscheiden sich pro **Deployment**, nie pro Besucher. Die Variante steht zum
Buildzeitpunkt fest und wird auf `/experiment` offen genannt.

## 5. Kill-Switch

```bash
SITE_ENABLED=false
```

Wirkung: sämtliche Shoprouten antworten mit 307 auf `/experiment`.

Zwei Ebenen:

1. **`src/app/(shop)/layout.tsx`** — läuft bei jeder Anfrage auf dem Server (`force-dynamic`) und
   liest die Variable zur Laufzeit. Deshalb wirkt der Schalter **ohne neuen Build**.
2. **`src/proxy.ts`** — greift zusätzlich im Request-Layer.

Erlaubte Falsch-Werte: `false`, `0`, `off`, `no`, `nein`, `aus` (Groß- und Kleinschreibung egal).
Ist die Variable nicht gesetzt, ist der Shop eingeschaltet.

Abgesichert durch: `tests/unit/site-state.test.ts` und `tests/e2e/kill-switch.spec.ts`, das einen
eigenen Serverprozess mit `SITE_ENABLED=false` startet — ohne neuen Build, genau wie im Betrieb.

## 6. Kein Tracking, keine externen Ressourcen

Nicht eingebunden: Google Analytics, Google Tag Manager, Meta Pixel, Hotjar, Microsoft Clarity,
Matomo, Segment, Sentry, PostHog, externe Chat-Tools, externe Bewertungswidgets, Session Recording,
Fingerprinting.

Zur Laufzeit lädt die Seite **ausschliesslich eigene Ressourcen**:

- Schriften werden über `next/font` zum Buildzeitpunkt geholt und vom eigenen Server ausgeliefert.
- Alle Bilder liegen unter `public/images`.
- Kein `<script src="https://…">`, kein `<link href="https://…">`.

Der einzige externe Verweis der gesamten Website ist ein **Link** (kein geladener Inhalt) auf den
Fakeshop-Finder der Verbraucherzentrale, ausschliesslich auf `/experiment`.

Abgesichert durch: `tests/unit/safety-boundaries.test.ts` und `tests/e2e/safety.spec.ts`, das jede
ausgehende Netzwerkanfrage des Browsers mitschneidet und auf die eigene Herkunft prüft.

## 7. Sicherheitskopfzeilen

Gesetzt in `next.config.ts` (statisch) und `src/proxy.ts` (Content-Security-Policy mit Nonce):

| Kopfzeile                   | Wert                                                    |
| --------------------------- | ------------------------------------------------------- |
| `Content-Security-Policy`   | siehe unten                                             |
| `X-Content-Type-Options`    | `nosniff`                                               |
| `X-Frame-Options`           | `DENY`                                                  |
| `Referrer-Policy`           | `no-referrer`                                           |
| `Permissions-Policy`        | Kamera, Mikrofon, Standort, `payment` u. a. deaktiviert |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload`          |
| `X-DNS-Prefetch-Control`    | `off`                                                   |
| `X-Robots-Tag`              | pfadabhängig, siehe Abschnitt 8                         |
| `X-Powered-By`              | entfernt                                                |

Die Content-Security-Policy:

```
default-src 'self';
script-src 'self' 'nonce-<pro Anfrage>' 'strict-dynamic';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
font-src 'self';
connect-src 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
frame-src 'none';
worker-src 'self' blob:;
manifest-src 'self';
upgrade-insecure-requests
```

Zwei bewusste Abweichungen von der strengstmöglichen Form:

- `style-src 'unsafe-inline'` ist nötig, weil Next.js und Tailwind kritische Styles inline
  ausliefern. Für Skripte gilt diese Lockerung **nicht**.
- Im Entwicklungsmodus kommen `'unsafe-eval'` (React Refresh) und `ws:`/`wss:` (Hot Reload) hinzu.
  Im Produktionsbuild sind beide nicht gesetzt.

`dangerouslyAllowSVG` ist in `next.config.ts` aktiviert, damit die SVG-Platzhalter durch
`next/image` laufen. Das ist hier unbedenklich, weil **keine** `remotePatterns` konfiguriert sind:
optimiert werden können ausschliesslich Dateien aus dem eigenen `public/`-Verzeichnis. Zusätzlich
gilt für ausgelieferte Bilder eine eigene, sehr enge Content-Security-Policy mit `sandbox`.

## 8. Indexierung und Crawler

| Bereich         | `X-Robots-Tag`    | `<meta name="robots">` | robots.txt              |
| --------------- | ----------------- | ---------------------- | ----------------------- |
| Alle Shopseiten | `noindex, follow` | `noindex, follow`      | erlaubt                 |
| `/experiment`   | `noindex, follow` | `noindex, follow`      | `Disallow: /experiment` |

Nichts auf dieser Seite gehört in einen Suchindex. Crawler dürfen den internen Links folgen, damit
Prüfsysteme den Shop vollständig sehen.

### Crawler-Gruppen

| Gruppe                                                                  | Shop     | `/experiment` |
| ----------------------------------------------------------------------- | -------- | ------------- |
| `*` (Suchmaschinen, Anzeigenprüfung von Google, Microsoft und Meta)     | erlaubt  | gesperrt      |
| OpenAI (`GPTBot`, `OAI-SearchBot`, `ChatGPT-User`)                      | erlaubt  | gesperrt      |
| Übrige KI-Crawler (ClaudeBot, CCBot, Google-Extended, PerplexityBot, …) | gesperrt | gesperrt      |

OpenAI ist bewusst freigegeben: Ein Teil der Untersuchung fragt, ob sich Anzeigen bei ChatGPT
schalten lassen. Eine Landingpage, die OpenAI nicht abrufen darf, liesse sich dort nicht testen.

Die übrigen KI-Crawler sind für die **gesamte Domain** gesperrt, nicht nur für einzelne Seiten. Sie
spielen für diese Untersuchung keine Rolle, und die erfundene Marke hat in Trainingsdaten nichts zu
suchen.

### Die Sperre der Auflösungsseite

`/experiment` ist für jeden Crawler gesperrt. Das weicht von der ursprünglichen Anlage des Projekts
ab und ist bewusst so entschieden. Was die Sperre tut und was nicht:

- Sie **verbirgt die Auflösung nicht vor Menschen.** Die Seite wird unverändert an jeden
  ausgeliefert, der sie aufruft, und die Kasse führt mit einem Klick dorthin. Diese Zusage bleibt
  unangetastet und ist die Grundlage, auf der das Projekt überhaupt vertretbar ist.
- Sie **liefert niemandem eine andere Seite.** Es wird nicht nach Kennung unterschieden;
  `robots.txt` ist eine öffentlich lesbare Datei, die die Regel benennt. Ein Prüfsystem, das die
  Adresse aufruft, bekommt die vollständige Auflösung.
- Sie bedeutet aber, dass eine **automatische Prüfung den Shop ohne die Auflösung sehen kann.** Das
  ist der Preis dieser Entscheidung. Er ist in [`LEGAL-REVIEW.md`](./LEGAL-REVIEW.md),
  Abschnitt 3.6, als eigener Prüfpunkt vermerkt.

Crawler, die `robots.txt` ignorieren, werden **nicht** serverseitig abgewiesen: Anfragen nach ihrer
Kennung unterschiedlich zu behandeln wäre der Einstieg in genau das Cloaking, das Abschnitt 4
ausschliesst. `tests/e2e/safety.spec.ts` ruft `/experiment` mit fünf verschiedenen Kennungen ab —
Browser, Googlebot, GPTBot, ClaudeBot, AdsBot-Google — und prüft, dass alle fünf denselben
Statuscode und denselben Seiteninhalt bekommen.

## 9. Umgang mit realen Daten

- Reale Betreiberdaten stehen ausschliesslich in Umgebungsvariablen, nie im Repository.
- `.env`, `.env.local` und `.env.*.local` sind über `.gitignore` ausgeschlossen.
- `src/config/operator.ts` ist mit `server-only` markiert und kann nicht versehentlich in ein
  Client-Bundle geraten.
- `.env.example` enthält nur Platzhalter.

## 10. Was zu tun ist, wenn etwas schiefgeht

1. **Anzeigen sofort stoppen.**
2. **`SITE_ENABLED=false`** in der Hostingumgebung setzen. Wirkt ohne neuen Build.
3. Prüfen, ob `/experiment` erreichbar ist und die realen Verantwortlichen nennt.
4. Vorfall, Zeitpunkt und Ursache in [`EXPERIMENT.md`](./EXPERIMENT.md) festhalten.

Die Abbruchkriterien stehen in [`EXPERIMENT.md`](./EXPERIMENT.md), Abschnitt 10.

## 11. Sicherheitsprobleme melden

Wer ein Sicherheitsproblem oder eine verletzte Grenze aus diesem Dokument findet, meldet sie an die
E-Mail-Adresse, die auf `/experiment` unter „Wer diese Seite tatsächlich betreibt“ steht. Bitte
keine öffentlichen Issues für sicherheitsrelevante Funde.
