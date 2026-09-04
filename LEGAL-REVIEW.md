# Rechtliche Prüfung vor dem Einsatz

> **Freigabevorbehalt**
>
> **Die Experimentvariante mit fehlender Anbieterkennzeichnung darf erst nach rechtlicher Prüfung
> und Freigabe öffentlich eingesetzt werden.**
>
> Das betrifft die Varianten `missing-information` und `combined`. Bis zur dokumentierten Freigabe
> läuft in einer öffentlich erreichbaren Umgebung ausschliesslich eine Variante mit vollständigen
> Angaben (`control` oder `closure-story`) — oder gar nichts, mit `SITE_ENABLED=false`.

Dieses Dokument ist eine Arbeitsgrundlage für diese Prüfung und **keine Rechtsberatung**. Die
Einordnung des konkreten Aufbaus muss von einer qualifizierten Person vorgenommen werden, die den
tatsächlichen Einsatz kennt.

---

## 1. Warum eine Prüfung nötig ist

§ 5 DDG sieht für geschäftsmässige, in der Regel gegen Entgelt angebotene digitale Dienste unter
anderem leicht erkennbare, unmittelbar erreichbare und ständig verfügbare Angaben zu Anbieter,
Anschrift und elektronischer Kontaktaufnahme vor. Die Varianten `missing-information` und
`combined` lassen diese Angaben **bewusst** weg, weil genau ihr Fehlen das untersuchte Merkmal ist.

Ob die Vorschrift auf diesen Aufbau überhaupt anwendbar ist, hängt vom tatsächlichen Einsatz ab —
unter anderem davon, ob ein geschäftsmässiges Angebot vorliegt, wenn nichts verkauft werden kann
und jeder Kaufversuch unmittelbar zu einer Auflösungsseite führt. Diese Frage ist vor dem
öffentlichen Test zu klären, nicht danach.

## 2. Was der Aufbau bereits vorsieht

Diese Punkte sind umgesetzt und können der Prüfung zugrunde gelegt werden:

- **Es kann nichts gekauft werden.** Es existiert kein Checkout, kein Zahlungsweg und kein
  Bestellvorgang. „Zur Kasse“ verlinkt auf `/experiment`.
- **Es werden keine personenbezogenen Daten erhoben.** Kein Formular, kein Konto, kein Newsletter,
  kein Kontaktformular, kein Cookie, kein Tracking.
- **Die Auflösung ist immer erreichbar.** `/experiment` wird nie umgeleitet, nie vor Crawlern
  versteckt und in keiner Robots-Regel ausgeschlossen.
- **Die realen Verantwortlichen sind benannt.** Name, Rechtsform, Anschrift, E-Mail und
  Projektbeschreibung stehen auf `/experiment`. Ohne diese Angaben schlägt der Produktionsbuild
  fehl.
- **Es gibt kein Cloaking.** Alle Besucher und Prüfsysteme erhalten dieselbe Website.
- **Ein Kill-Switch ist vorhanden.** `SITE_ENABLED=false` nimmt den Shop ohne Codeänderung vom
  Netz und leitet auf die Auflösung um.

## 3. Prüfpunkte

### 3.1 Anbieterkennzeichnung

- [ ] Ist § 5 DDG auf diesen Aufbau anwendbar, wenn kein Vertragsschluss möglich ist?
- [ ] Genügt die Angabe der realen Verantwortlichen auf `/experiment`, oder muss sie von jeder
      Seite unmittelbar erreichbar sein?
- [ ] Falls die Angabe erforderlich ist: Lässt sich das untersuchte Merkmal anders abbilden, ohne
      die Pflichtangabe wegzulassen?

### 3.2 Wettbewerbsrecht

- [ ] Sind die erfundene Unternehmenshistorie und die erfundene Geschäftsaufgabe als irreführende
      geschäftliche Handlung einzuordnen, obwohl kein Absatz stattfindet?
- [ ] Kann ein Mitbewerber aus dem Bereich Reisegepäck betroffen sein?
- [ ] Wie sind die durchgestrichenen Vergleichspreise zu bewerten, wenn nie zu ihnen verkauft wurde?

### 3.3 Marken- und Namensrecht

- [ ] Ist „Kofferwerk Auenfels“ frei von entgegenstehenden Marken- und Firmenrechten?
- [ ] Gibt es reale Unternehmen oder Orte gleichen oder ähnlichen Namens?
- [ ] Ist die Domain frei von Rechten Dritter?

Reserve-Namen, falls die Markenprüfung dagegen spricht: Kofferwerk Nordhain, Kofferwerk Silbertal,
Kofferwerk Morgenfels, Auenfels Gepäckwerk, Auenfels Reiseatelier.

### 3.4 Datenschutz

- [ ] Bestätigung, dass ohne Formulare, Konten und Analysedienste keine Verarbeitung
      personenbezogener Daten durch die Anwendung selbst stattfindet.
- [ ] Serverprotokolle beim Hostinganbieter: Abschaltung oder verkürzte Aufbewahrung abstimmen und
      das Ergebnis hier festhalten.
- [ ] Auftragsverarbeitung mit dem Hostinganbieter prüfen, soweit erforderlich.
- [ ] Einordnung des localStorage-Warenkorbs (nur Produktkennung, Farbe, Menge; verlässt den
      Browser nicht).

### 3.5 Plattformbedingungen

- [ ] Verstösst die Schaltung gegen die Werberichtlinien von Google und Meta? (Nach jetzigem Stand:
      ja, die Varianten B und C ihrem Inhalt nach.) Ist dieser Verstoss als Untersuchungsgegenstand
      vertretbar, und welche Folgen für das Werbekonto sind einzukalkulieren?
- [ ] Werbetreibendenverifizierung: Es werden ausschliesslich echte Unterlagen eingereicht. Ist der
      Ablauf damit durchführbar?

### 3.6 Presse- und Forschungskontext

- [ ] Ist der journalistische Zweck belegbar dokumentiert?
- [ ] Ist eine ethische Begleitung oder ein Beirat vorgesehen oder erforderlich?
- [ ] Ist geklärt, wie mit Rückfragen von Besucherinnen und Besuchern umgegangen wird?

### 3.7 Betrieb

- [ ] Ist festgelegt, wer den Kill-Switch betätigen darf und wie diese Person erreichbar ist?
- [ ] Ist eine Reaktionszeit für den Fall vereinbart, dass die Auflösungsseite ausfällt?
- [ ] Ist die maximale Laufzeit des Tests begrenzt?

## 4. Freigabe

Ohne ausgefüllten Abschnitt darf keine Variante mit fehlender Anbieterkennzeichnung öffentlich
erreichbar sein.

| Feld                                              | Wert |
| ------------------------------------------------- | ---- |
| Prüfende Person oder Kanzlei                      |      |
| Datum der Prüfung                                 |      |
| Geprüfte Varianten                                |      |
| Geprüfter Git-Commit                              |      |
| Ergebnis (freigegeben / mit Auflagen / abgelehnt) |      |
| Auflagen im Wortlaut                              |      |
| Befristung der Freigabe                           |      |
| Unterschrift oder Referenz zur Freigabe           |      |

## 5. Widerruf der Freigabe

Wird die Freigabe zurückgezogen, gilt sofort:

1. Alle Anzeigen stoppen.
2. `SITE_ENABLED=false` in der Hostingumgebung setzen.
3. Zeitpunkt und Grund in [`EXPERIMENT.md`](./EXPERIMENT.md) festhalten.
