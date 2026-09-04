# Anzeigentexte

Dieses Dokument ist reine Dokumentation. Es schaltet nichts und ist nicht Teil der Website.

Die drei Varianten bilden eine Eskalationsstufe: von einer neutralen Produktanzeige über eine
Traditionsbehauptung bis zur erfundenen Geschäftsaufgabe. Sie werden **einzeln** geschaltet und
**einzeln** dokumentiert, damit sich eine Ablehnung einem konkreten Merkmal zuordnen lässt.

---

## Variante A — Kontrollanzeige

**Titel**

```
Kofferwerk Auenfels
```

**Text**

```
Reisegepäck für kurze Wege und grosse Reisen. Entdecke unsere aktuelle Kollektion.
```

Getestet wird: Wird eine unbekannte, neu registrierte Shop-Marke ohne besondere Behauptung
überhaupt zugelassen? Diese Variante enthält keine Aussage über Alter, Herkunft oder
Geschäftsaufgabe des Unternehmens.

Passende Deployment-Variante: `control`.

---

## Variante B — Traditionsbehauptung

**Titel**

```
Reisegepäck seit 1999
```

**Text**

```
Seit 27 Jahren fertigt Kofferwerk Auenfels Koffer und Reisetaschen für Menschen, die unterwegs sind.
```

Getestet wird: Erkennt die Plattform, dass eine Marke ohne jede Historie ein Gründungsjahr und
27 Jahre Betriebszugehörigkeit behauptet? Die Behauptung ist nachweislich falsch — die Domain ist
neu, es gibt keinen Registereintrag und keine Spur des Unternehmens.

Passende Deployment-Variante: `closure-story`.

---

## Variante C — Geschäftsaufgabe

**Titel**

```
Nach 27 Jahren endet unsere Reise.
```

**Text**

```
Wir schliessen unsere Werkstatt. Entdecke die letzten Stücke unserer Kollektion mit bis zu 72 % Preisnachlass.
```

Getestet wird: Wird ein erfundener Räumungsverkauf mit hohem Preisnachlass und Zeitdruck
freigegeben? Diese Kombination — Geschäftsaufgabe, Frist, Rabatt über das gesamte Sortiment — ist
ein wiederkehrendes Muster tatsächlicher Fake-Shops.

Passende Deployment-Variante: `combined`.

---

## Regeln für die Schaltung

Diese Regeln gelten für jede Variante und jede Plattform. Sie sind nicht verhandelbar.

### Identität

- **Das Anzeigenkonto verwendet die echte Identität des Projektbetreibers.** Es wird kein Konto
  auf den Namen der erfundenen Marke angelegt.
- **Es werden keine fiktiven Ausweise oder Unternehmensdokumente eingereicht.** Verlangt eine
  Plattform im Rahmen der Werbetreibendenverifizierung Nachweise, werden ausschliesslich echte
  Unterlagen der realen Verantwortlichen eingereicht. Lässt sich eine Verifizierung nur mit
  falschen Angaben abschliessen, wird sie abgebrochen und der Abbruch dokumentiert.
- Google führt eine Werbetreibendenverifizierung durch und kann Angaben über den Werbetreibenden
  in der Anzeige und im Ads Transparency Center ausweisen. Dass dort die realen Verantwortlichen
  erscheinen, ist gewollt.

### Inhalte

- **Anzeigen und Landingpage zeigen für alle Nutzer dieselben Inhalte.** Kein Cloaking, keine
  Sonderbehandlung von Prüfsystemen, keine nachträglich ausgetauschten Inhalte.
- Die Ziel-URL ist immer die reguläre Startseite oder eine reguläre Produktseite — nie eine
  eigens für die Prüfung gebaute Seite.
- Jede Anzeigenvariante wird mit ihrem genauen Wortlaut in [`EXPERIMENT.md`](./EXPERIMENT.md)
  dokumentiert, ebenso jede spätere Änderung.

### Reichweite und Zielgruppe

- **Das Budget erhält vorab ein festes Gesamtlimit.** Es wird nicht nachgeschossen, wenn eine
  Anzeige gut läuft — Reichweite ist hier kein Erfolgsmass.
- **Minderjährige werden aus der Zielgruppe ausgeschlossen.**
- Es werden **keine** gesundheitsbezogenen, finanziellen oder anderweitig sensiblen Interessen
  angesprochen und keine besonders schutzbedürftigen Gruppen adressiert.
- Kein Retargeting, keine Lookalike-Zielgruppen, keine hochgeladenen Kundenlisten.

### Abbruch

- **Die Anzeigen werden sofort gestoppt, falls die Auflösungsseite ausfällt.** Ohne erreichbare
  Auflösung darf keine Anzeige laufen.
- Ebenso bei jedem anderen Abbruchkriterium aus [`EXPERIMENT.md`](./EXPERIMENT.md), Abschnitt 10.

### Einordnung der Ergebnisse

Eine Freigabe ist ein Befund über den Prüfprozess, **keine** Bestätigung, dass die Anzeige zulässig
war. Google untersagt die Falschdarstellung von Unternehmen und Angebote für Produkte, die der
Werbetreibende nicht liefern kann; die Anzeigenvarianten B und C verstossen ihrem Inhalt nach
dagegen. Genau deshalb ist ihre Freigabe der interessante Befund — und genau deshalb ist sie im
Bericht als Prüflücke zu beschreiben, nicht als Erlaubnis.

---

## Nicht verwendete Formulierungen

Bewusst ausgeschlossen, weil sie über die Fragestellung hinausgehen oder zusätzlichen Schaden
anrichten könnten:

- Angaben zu Lieferzeiten oder Verfügbarkeit („Lieferung in 24 Stunden“)
- Gütesiegel, Testurteile oder Auszeichnungen realer Organisationen
- Kundenstimmen, Bewertungen oder Sternebewertungen
- Nennung realer Wettbewerber oder Vergleiche mit ihnen
- Zahlungsarten, Ratenzahlung oder Finanzierungsangebote
- Countdown-Formate mit laufender Uhr
- Behauptungen zu Umwelt- oder Nachhaltigkeitseigenschaften
