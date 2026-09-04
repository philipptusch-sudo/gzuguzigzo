# Versuchsprotokoll

Dieses Dokument ist das laufende Protokoll des Verbraucherschutzexperiments. Es wird während des
Tests fortgeschrieben, nicht rückwirkend geglättet. Abgelehnte Anzeigen, zurückgezogene Varianten
und Fehlschläge gehören genauso hinein wie Freigaben.

---

## 1. Fragestellung

1. Lassen Google und Meta Anzeigen für eine frei erfundene Shop-Marke zu?
2. Erkennen die Plattformen eine erfundene Unternehmenshistorie?
3. Werden Anzeigen für einen erfundenen Räumungsverkauf freigegeben?
4. Wie bewertet der Fakeshop-Finder der Verbraucherzentrale den Shop?
5. Welche einzelnen Shopmerkmale beeinflussen diese Bewertung?

## 2. Untersuchungsgegenstand

- **Marke:** Kofferwerk Auenfels (erfunden)
- **Unterzeile:** Reisegepäck seit 1999 (erfunden)
- **Kampagnenzeile:** Nach 27 Jahren endet unsere Reise. (erfunden)
- **Domain-Arbeitstitel:** kofferwerk-auenfels.de
- **Sortiment:** acht erfundene Modelle, Vergleichspreise 129 € bis 699 €

Real ist ausschliesslich: die Identität der Projektverantwortlichen, die auf `/experiment`
ausgewiesen wird, und das dort genannte Projektziel.

## 3. Versuchsvarianten

Jede Variante wird als eigenes Deployment mit eigener Build-Konfiguration ausgeliefert. Inhalte
wechseln während eines laufenden Tests nicht.

| Variante              | Getestetes Merkmal                                                      |
| --------------------- | ----------------------------------------------------------------------- |
| `control`             | Neutraler Shop mit vollständigen Angaben und unauffälligen Rabatten.    |
| `closure-story`       | Erfundene Historie und Geschäftsaufgabe bei vollständigen Angaben.      |
| `missing-information` | Fehlende Anbieter- und Verbraucherinformationen bei neutralem Auftritt. |
| `combined`            | Alle Merkmale gleichzeitig.                                             |

Der Sinn der Aufteilung: erst der Vergleich zwischen den Varianten erlaubt eine Aussage darüber,
**welches einzelne Merkmal** eine Ablehnung oder eine Warnung auslöst.

## 4. Messgrössen

Erhoben wird ausschliesslich, was die Werbeplattformen und der Fakeshop-Finder von sich aus
ausweisen. Auf der Website selbst wird nichts gemessen:

- Impressionen und Klicks aus den Anzeigenplattformen
- Anzeigenkosten
- Freigabe- oder Ablehnungsstatus samt Prüfdauer
- Ablehnungsgründe im Wortlaut
- Ergebnis des Fakeshop-Finders
- manuell dokumentierte Screenshots

**Nicht** erhoben werden: individuelle Nutzerpfade, Verweildauer, Warenkorbinhalte, IP-Adressen
oder sonstige besucherbezogene Daten. Es ist kein Analysedienst eingebunden.

## 5. Ergebnistabelle

| Datum | Variante | Plattform | Anzeigenstatus | Prüfzeit | Impressionen | Klicks | Kosten | Fakeshop-Finder | Bemerkungen |
| ----- | -------- | --------- | -------------- | -------- | ------------ | ------ | ------ | --------------- | ----------- |
|       |          |           |                |          |              |        |        |                 |             |

> Eine Zeile je Anzeigenvariante und Plattform. „Anzeigenstatus“: eingereicht, in Prüfung,
> freigegeben, abgelehnt, nachträglich gesperrt. „Prüfzeit“: Zeitspanne von der Einreichung bis
> zur Entscheidung.

## 6. Deployment-Protokoll

Für jeden getesteten Build festhalten:

| Feld                           | Wert |
| ------------------------------ | ---- |
| Git-Commit                     |      |
| Variante                       |      |
| Deployment-URL                 |      |
| Zeitpunkt der Veröffentlichung |      |
| Zeitpunkt der Abschaltung      |      |
| `SITE_ENABLED` beim Test       |      |
| Screenshot Landingpage         |      |
| Screenshot Auflösungsseite     |      |

Der Git-Commit ist die Voraussetzung dafür, dass ein Prüfergebnis später einem exakten Stand der
Website zugeordnet werden kann. Ohne ihn ist eine Zeile in der Ergebnistabelle nicht auswertbar.

## 7. Anzeigenprotokoll

Für jede geschaltete Anzeige festhalten:

| Feld                           | Wert |
| ------------------------------ | ---- |
| Anzeigenvariante (A, B oder C) |      |
| Plattform und Anzeigenformat   |      |
| Genaue Formulierung (Wortlaut) |      |
| Ziel-URL                       |      |
| Zielgruppe und Ausschlüsse     |      |
| Budgetlimit                    |      |
| Screenshot der Anzeige         |      |
| Screenshot der Vorschau        |      |
| Ablehnungsgrund im Wortlaut    |      |
| Änderungen an der Kampagne     |      |
| Meldung an die Plattform       |      |
| Reaktion nach der Meldung      |      |

Die Anzeigentexte stehen in [`AD-COPY.md`](./AD-COPY.md).

## 8. Fakeshop-Finder

Für jede Variante getrennt dokumentieren:

| Feld                                 | Wert |
| ------------------------------------ | ---- |
| Geprüfte URL                         |      |
| Datum und Uhrzeit der Prüfung        |      |
| Ausgegebene Bewertung                |      |
| Genannte Kriterien im Wortlaut       |      |
| Screenshot des Ergebnisses           |      |
| Abweichung gegenüber der Vorvariante |      |

## 9. Ablauf eines Testlaufs

1. Variante festlegen (`NEXT_PUBLIC_EXPERIMENT_VARIANT`), Build erzeugen, Commit notieren.
2. Betreiberangaben in der Hostingumgebung setzen. Ohne sie schlägt der Build fehl.
3. Deployment prüfen: `/experiment` erreichbar, „Zur Kasse“ führt dorthin, `/checkout` und
   `/kasse` leiten um, keine externen Anfragen im Netzwerk-Tab.
4. Screenshots von Landingpage und Auflösungsseite anlegen.
5. Fakeshop-Finder-Prüfung durchführen und dokumentieren.
6. Anzeigen einreichen, Zeitpunkt notieren.
7. Prüfstatus verfolgen und dokumentieren, auch Zwischenstände.
8. Nach Testende: Anzeigen stoppen, `SITE_ENABLED=false` setzen, Abschaltzeitpunkt notieren.

## 10. Abbruchkriterien

Der Test wird **sofort** gestoppt — Anzeigen pausieren, `SITE_ENABLED=false` —, wenn eines davon
eintritt:

- Die Auflösungsseite `/experiment` ist nicht erreichbar oder fehlerhaft.
- Die realen Betreiberangaben werden auf `/experiment` nicht angezeigt.
- Eine Weiterleitung von einer Kassenroute funktioniert nicht.
- Es erreichen uns Hinweise, dass Besucher den Shop für echt halten und Schaden befürchten.
- Eine Plattform meldet einen Verstoss, der über eine reine Anzeigenablehnung hinausgeht.
- Die rechtliche Freigabe nach [`LEGAL-REVIEW.md`](./LEGAL-REVIEW.md) wird zurückgezogen.

## 11. Auswertung

Der Untersuchungsbericht hält mindestens fest:

- welche Variante auf welcher Plattform freigegeben oder abgelehnt wurde,
- wie lange die Prüfung jeweils dauerte,
- welche Ablehnungsgründe genannt wurden,
- wie der Fakeshop-Finder die einzelnen Varianten bewertet hat,
- welches einzelne Merkmal die Bewertung nachweislich verändert hat,
- und welche Merkmale **ohne** Wirkung blieben.

Eine Anzeigenfreigabe ist als Ergebnis des Prüfprozesses zu dokumentieren, **nicht** als Beleg
dafür, dass die Anzeige zulässig gewesen wäre. Google verbietet die Falschdarstellung von
Unternehmen ausdrücklich; eine Freigabe zeigt lediglich, dass die Prüfung den Verstoss nicht
erkannt hat.

Nach Veröffentlichung wird der Bericht über `REAL_REPORT_URL` auf `/experiment` verlinkt.

## 12. Aufbewahrung

- Screenshots und Plattform-Exporte werden ausserhalb dieses Repositories abgelegt.
- Reale Betreiberdaten stehen ausschliesslich in der Hostingumgebung, nie im Repository.
- Serverprotokolle werden beim Hostinganbieter möglichst abgeschaltet oder stark verkürzt
  aufbewahrt. Die Abstimmung dazu gehört in [`LEGAL-REVIEW.md`](./LEGAL-REVIEW.md).
