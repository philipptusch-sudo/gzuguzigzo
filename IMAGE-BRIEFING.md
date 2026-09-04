# Bildbriefing

Alle Bilder liegen unter `public/images` und werden vom eigenen Server ausgeliefert. Es sind
derzeit **eigens erzeugte SVG-Platzhalter** aus `scripts/generate-placeholder-images.mjs`, keine
Fotografien. Dieses Dokument hält fest, welche Motive später ersetzt werden sollen und woran sich
die Ersetzung halten muss.

Neu erzeugen:

```bash
pnpm images:generate
```

---

## Verbindliche Regeln

1. **Nur lokale Dateien.** Keine Einbindung von Stockportalen, CDNs oder fremden Servern zur
   Laufzeit. Die Content-Security-Policy erlaubt ausschliesslich `img-src 'self' data:`.
2. **Keine Logos realer Hersteller** und keine charakteristischen Produktdesigns bestehender
   Marken. Kein Motiv darf an Samsonite, Rimowa, Stratic, Horizn Studios oder eine andere reale
   Marke erinnern.
3. **Möglichst keine erkennbaren Gesichter.** Hände und Ausschnitte sind in Ordnung. Es soll keine
   konkrete Person als angeblicher Inhaber inszeniert werden.
4. **Keine Umwelt- oder Nachhaltigkeitsmotive**, die ein entsprechendes Versprechen nahelegen.
5. **Rechte klären.** Nur Aufnahmen, an denen die Projektverantwortlichen die nötigen Rechte
   halten. Herkunft und Lizenz jeder Datei dokumentieren.
6. **Formate.** Quadratisch für Produktbilder (1200 × 1200 px oder grösser), damit die vorhandenen
   `sizes`-Angaben passen. Für Fotografien WebP oder AVIF; `next/image` optimiert sie automatisch.
7. **Alternativtexte** stehen in `src/data/products.ts` und beschreiben das Motiv. Wird ein Motiv
   ausgetauscht, ist der Alternativtext mitzuändern.

## Farbwelt

| Farbe      | Hex       | Verwendung                    |
| ---------- | --------- | ----------------------------- |
| Nachtblau  | `#1b2a41` | Hauptfarbe der Koffer         |
| Sand       | `#c8b394` | helle Variante                |
| Graphit    | `#3f4247` | dunkle Variante               |
| Lederbraun | `#6b4a2f` | Leder, Weekender              |
| Burgund    | `#5c2230` | Reisebox, Rabattkennzeichnung |
| Creme      | `#f4efe6` | Hintergrund, viel Weissraum   |
| Messing    | `#a8853f` | Beschläge, dezente Akzente    |

Aufnahmen vor neutralem, warm-hellem Hintergrund. Weiches, gerichtetes Licht. Viel Luft um das
Objekt.

---

## Produktmotive

Je Produkt drei bis fünf Aufnahmen. Die Dateinamen sind durchnummeriert und dürfen nicht geändert
werden, weil `src/data/products.ts` sie referenziert.

### `auenfels-kabine-38` (Handgepäck, Nachtblau)

| Datei    | Motiv                                                       |
| -------- | ----------------------------------------------------------- |
| `01.svg` | Koffer frontal vor neutralem Hintergrund, Griff eingefahren |
| `02.svg` | geöffneter Koffer, Innenaufteilung mit Gurtband sichtbar    |
| `03.svg` | Detail: Doppelrollen von schräg unten                       |
| `04.svg` | Detail: höhenverstellbarer Griff, Rasterstufen erkennbar    |

### `auenfels-reise-68` (mittelgrosser Koffer, Nachtblau und Sand)

| Datei    | Motiv                                             |
| -------- | ------------------------------------------------- |
| `01.svg` | Koffer frontal, Nachtblau                         |
| `02.svg` | geöffnet, Netzfach und Trennwand sichtbar         |
| `03.svg` | Detail: Doppelrollen                              |
| `04.svg` | Detail: Erweiterungsreissverschluss, einmal offen |
| `05.svg` | Seitenansicht in Sand                             |

### `auenfels-grande-76` (grosser Reisekoffer, Graphit)

| Datei    | Motiv                                 |
| -------- | ------------------------------------- |
| `01.svg` | Koffer frontal                        |
| `02.svg` | geöffnet, zwei getrennte Packseiten   |
| `03.svg` | Detail: weit aussen sitzende Rollen   |
| `04.svg` | Detail: Tragegriff an der Schmalseite |

### `auenfels-business-42` (Business-Trolley, Graphit)

| Datei    | Motiv                                               |
| -------- | --------------------------------------------------- |
| `01.svg` | Trolley aufrecht stehend, frontal                   |
| `02.svg` | geöffnetes Vorderfach mit gepolstertem Notebookfach |
| `03.svg` | Detail: schmaler Griff                              |
| `04.svg` | Detail: Doppelrollen                                |

### `auenfels-weekender` (Reisetasche, Lederbraun)

| Datei    | Motiv                                         |
| -------- | --------------------------------------------- |
| `01.svg` | Tasche seitlich, Griffe aufgestellt           |
| `02.svg` | geöffnet, Schuhfach und Längstaschen sichtbar |
| `03.svg` | Detail: ledergefasste Griffe mit Nieten       |

### `auenfels-duo` (zweiteiliges Set, Nachtblau)

| Datei    | Motiv                                          |
| -------- | ---------------------------------------------- |
| `01.svg` | beide Koffer nebeneinander, gleiche Farbe      |
| `02.svg` | kleiner Koffer im grossen verstaut             |
| `03.svg` | Detail: identisches Rollensystem beider Koffer |
| `04.svg` | beide geöffnet, Innenaufteilung im Vergleich   |

### `auenfels-familie` (dreiteiliges Set, Nachtblau und Graphit)

| Datei    | Motiv                                            |
| -------- | ------------------------------------------------ |
| `01.svg` | drei Koffer nebeneinander, nach Größe gestaffelt |
| `02.svg` | ineinander gestellt                              |
| `03.svg` | alle drei geöffnet                               |
| `04.svg` | Detail: einheitliches Griffsystem                |
| `05.svg` | Seitenansicht in Graphit                         |

### `auenfels-reisebox` (Kosmetikkoffer, Burgund)

| Datei    | Motiv                                                   |
| -------- | ------------------------------------------------------- |
| `01.svg` | Box geschlossen, frontal                                |
| `02.svg` | geöffnet, helles Innenfutter, Deckel steht selbst offen |
| `03.svg` | Detail: herausnehmbares Einsatzfach                     |

---

## Redaktionelle Motive

| Datei                            | Motiv                                                 | Verwendet auf             |
| -------------------------------- | ----------------------------------------------------- | ------------------------- |
| `editorial/werkstatt.svg`        | Weiter Blick in die Werkstatt, Regale, fertige Koffer | Startseite, Geschichte    |
| `editorial/werkbank.svg`         | Werkbank mit Lederresten, Werkzeug, Koffer in Arbeit  | Reserve                   |
| `editorial/reparatur.svg`        | Hände bei einer Kofferreparatur, ohne Gesicht         | Reserve                   |
| `editorial/gepaeckanhaenger.svg` | Alte Gepäckanhänger an einer Schnur                   | Reserve                   |
| `editorial/kartons.svg`          | Gestapelte Kartons in einer Werkstatt                 | Startseite, letzte Wochen |

Die vier als „Reserve“ markierten Motive sind erzeugt, aber noch nicht eingebunden. Sie stehen für
spätere redaktionelle Abschnitte und für den Untersuchungsbericht bereit.

---

## Vorgehen beim Austausch

1. Neue Datei mit **demselben Pfad und Dateinamen** ablegen (Endung darf sich ändern).
2. Bei geänderter Endung `src/data/products.ts` anpassen — dort stehen `src`, `alt`, `width` und
   `height`.
3. `pnpm test` ausführen: `tests/unit/product-images.test.ts` prüft, dass jede referenzierte Datei
   existiert, lokal liegt und einen aussagekräftigen Alternativtext hat.
4. Herkunft und Lizenz der Aufnahme in der Projektablage dokumentieren.
