# Deployment auf Railway

Anleitung, um diesen Shop auf [Railway](https://railway.app) zu veröffentlichen.

> **Vorher lesen:** Die Varianten `missing-information` und `combined` lassen die
> Anbieterkennzeichnung bewusst weg. Sie dürfen erst nach der Freigabe aus
> [`LEGAL-REVIEW.md`](./LEGAL-REVIEW.md) öffentlich erreichbar sein. Für eine interne Vorschau
> nimm `control` oder `closure-story`.

---

## Was im Repository schon vorbereitet ist

| Datei                                        | Zweck                                                  |
| -------------------------------------------- | ------------------------------------------------------ |
| `railway.json`                               | Build- und Startbefehl, Healthcheck, Neustartverhalten |
| `.node-version`, `engines` in `package.json` | Legt Node 22 fest                                      |
| `packageManager` in `package.json`           | Legt pnpm 10 fest, Railway übernimmt das automatisch   |

`pnpm start` braucht keine Portangabe: `next start` liest die von Railway gesetzte Variable `PORT`
selbst und bindet an `0.0.0.0`.

---

## 1. Dienst anlegen

1. Auf <https://railway.app> anmelden und **New Project → Deploy from GitHub repo** wählen.
2. Das Repository `philipptusch-sudo/gzuguzigzo` auswählen. Beim ersten Mal fragt Railway nach
   Zugriff auf GitHub.
3. Unter **Settings → Source** als **Branch** `claude/kofferwerk-auenfels-fake-shop-246fn9`
   eintragen (oder den Branch vorher nach `main` mergen).

Der erste Build startet sofort und **wird fehlschlagen**, solange die Betreiberangaben fehlen. Das
ist beabsichtigt — siehe Schritt 2.

## 2. Umgebungsvariablen setzen

**Settings → Variables → Raw Editor**, dann diesen Block einfügen und die Werte ersetzen:

```
SITE_ENABLED=true
NEXT_PUBLIC_EXPERIMENT_VARIANT=control

REAL_OPERATOR_NAME=Vorname Nachname
REAL_OPERATOR_LEGAL_FORM=Einzelunternehmen
REAL_OPERATOR_ADDRESS=Musterstrasse 1, 12345 Musterstadt
REAL_OPERATOR_EMAIL=projekt@example.org
REAL_PROJECT_DESCRIPTION=Journalistisches Verbraucherschutzexperiment zur Pruefpraxis von Werbeplattformen und Fakeshop-Erkennung.

REAL_PRESS_EMAIL=presse@example.org
REAL_REPORT_URL=
```

Wichtig:

- **Die fünf `REAL_*`-Pflichtvariablen werden schon zum Buildzeitpunkt gebraucht.** Ohne sie bricht
  `pnpm build` mit einer Fehlermeldung ab. Das ist die eingebaute Schutzschaltung, kein Defekt: Sie
  verhindert, dass der Shop ohne funktionierende Auflösungsseite online geht.
- Werte **ohne** Anführungszeichen eintragen. Railway übernimmt die Zeile wörtlich, Anführungszeichen
  würden sonst auf der Seite auftauchen.
- Diese Werte gehören nicht ins Repository. Sie stehen nur hier.

Nach dem Speichern startet Railway den Build neu. Er sollte jetzt durchlaufen und mit
`Betreiberangaben vollständig (5 Variablen).` beginnen.

## 3. Domain vergeben

**Settings → Networking → Public Networking**:

- **Generate Domain** erzeugt eine Adresse der Form `<name>.up.railway.app`. Für interne Tests
  reicht das.
- **Custom Domain** für `kofferwerk-auenfels.de`: Domain eintragen, Railway nennt Dir einen
  CNAME-Zielwert. Diesen beim Domain-Anbieter hinterlegen:

  | Typ   | Name  | Wert                          |
  | ----- | ----- | ----------------------------- |
  | CNAME | `www` | der von Railway genannte Wert |

  Für die Domain ohne `www` braucht es beim Anbieter einen ALIAS-, ANAME- oder
  CNAME-Flattening-Eintrag; ein reiner A-Record funktioniert bei Railway nicht zuverlässig. Das
  TLS-Zertifikat stellt Railway selbst aus, sobald der DNS-Eintrag greift.

## 4. Deployment prüfen

Vor der ersten Anzeigenschaltung diese sechs Punkte durchgehen — `DEINE-URL` ersetzen:

```bash
# 1. Auflösungsseite erreichbar und liefert 200
curl -s -o /dev/null -w "%{http_code}\n" https://DEINE-URL/experiment

# 2. Bestell- und Zahlungsrouten leiten auf die Auflösung um (jeweils 307 + Location)
for p in /checkout /payment /bestellung /zahlung /kasse/zahlung; do
  curl -s -o /dev/null -w "$p -> %{http_code} %{redirect_url}\n" https://DEINE-URL$p
done

# 3. Sicherheitskopfzeilen vorhanden
curl -sI https://DEINE-URL/ | grep -iE "content-security-policy|x-frame-options|x-robots-tag"

# 4. Shop auf noindex, Auflösung auf index
curl -sI https://DEINE-URL/          | grep -i x-robots-tag   # noindex, follow
curl -sI https://DEINE-URL/experiment | grep -i x-robots-tag   # index, follow

# 5. robots.txt sperrt die Auflösung nicht aus
curl -s https://DEINE-URL/robots.txt

# 6. Richtige Variante ausgeliefert?
curl -s https://DEINE-URL/experiment | grep -o "Variante <code[^>]*>[a-z-]*"
```

Zusätzlich im Browser: Netzwerk-Tab öffnen, Startseite laden — es darf **keine** Anfrage an eine
fremde Domain erscheinen.

Dann Screenshots von Landingpage und Auflösungsseite anlegen und zusammen mit dem Git-Commit in
[`EXPERIMENT.md`](./EXPERIMENT.md) eintragen.

## 5. Variante wechseln

`NEXT_PUBLIC_EXPERIMENT_VARIANT` wird beim Build in die Seiten eingebacken. Ein Wechsel braucht
deshalb immer einen **neuen Build**:

1. Variable in Railway ändern.
2. Railway baut daraufhin automatisch neu. Falls nicht: **Deployments → Redeploy**.

Während eines laufenden Anzeigentests wird die Variante **nicht** gewechselt. Sonst lässt sich ein
Prüfergebnis keinem Stand der Seite mehr zuordnen. Für Parallelbetrieb mehrerer Varianten legst Du
besser mehrere Railway-Dienste im selben Projekt an — jeder mit eigener Domain und eigener
Variante.

---

## Kill-Switch auf Railway

Es gibt zwei Wege, je nach Dringlichkeit.

### Sofort (Sekunden)

**Settings → Networking → die Domain entfernen.** Die Seite ist damit augenblicklich nicht mehr
öffentlich erreichbar. Nutze das, wenn etwas wirklich schiefgeht.

Alternativ **Settings → Danger → Remove Service** beziehungsweise das Projekt pausieren.

### Geordnet (etwa ein bis zwei Minuten)

`SITE_ENABLED=false` setzen. Railway startet den Dienst danach neu; anschliessend leiten alle
Shoprouten auf `/experiment` um, die Auflösungsseite bleibt erreichbar.

Das ist der saubere Weg, weil Besucher weiterhin erfahren, was sie gesehen haben. Der schnelle Weg
über die Domain nimmt ihnen genau diese Information — deshalb dort nur im Notfall, und danach
möglichst zügig auf `SITE_ENABLED=false` umstellen und die Domain wieder aktivieren.

**In beiden Fällen zuerst die Anzeigen stoppen.** Eine laufende Anzeige, die ins Leere führt, ist
schlimmer als der Shop selbst.

---

## Betriebshinweise

### Serverprotokolle

Railway sammelt Deploy- und HTTP-Logs des Dienstes. Sie enthalten je nach Konfiguration
IP-Adressen. Das ist mit der Datenschutzprüfung abzustimmen (siehe
[`LEGAL-REVIEW.md`](./LEGAL-REVIEW.md), Abschnitt 3.4). Railway hält Logs standardmässig für einen
begrenzten Zeitraum vor; prüfe die Einstellung Deines Tarifs und dokumentiere das Ergebnis.

Für die Untersuchung selbst werden diese Logs **nicht** gebraucht — alle Messgrössen stammen aus
den Anzeigenplattformen und vom Fakeshop-Finder.

### Kosten

Der Dienst ist ein einzelner Node-Prozess ohne Datenbank. Auf dem Hobby-Tarif (derzeit 5 USD im
Monat inklusive Nutzungsguthaben) reicht das für einen Test dieser Grössenordnung deutlich aus.
Trage in Railway trotzdem unter **Usage** ein Ausgabenlimit ein, passend zum Budgetlimit aus
[`AD-COPY.md`](./AD-COPY.md).

### Automatische Deployments

Railway baut bei jedem Push auf den verbundenen Branch neu. Während eines laufenden Anzeigentests
willst Du das nicht: unter **Settings → Source** die automatischen Deployments abschalten oder auf
einem eigenen, eingefrorenen Branch deployen. Der getestete Commit muss dem in
[`EXPERIMENT.md`](./EXPERIMENT.md) protokollierten entsprechen.

---

## Wenn der Build fehlschlägt

| Meldung im Log                                                | Ursache und Abhilfe                                                                                                |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `Produktionsbuild abgebrochen. … Fehlende Umgebungsvariablen` | Eine der fünf `REAL_*`-Variablen fehlt oder ist leer. Schritt 2.                                                   |
| `NEXT_PUBLIC_EXPERIMENT_VARIANT ist auf "…" gesetzt`          | Tippfehler. Erlaubt sind `control`, `closure-story`, `missing-information`, `combined`.                            |
| Build findet pnpm nicht oder nimmt npm                        | `packageManager` in `package.json` prüfen. Notfalls unter **Settings → Build** den Builder auf Nixpacks umstellen. |
| Healthcheck läuft in einen Timeout                            | Prüfen, ob der Startbefehl `pnpm run start` lautet und der Healthcheck-Pfad `/experiment` ist.                     |
| Node-Version passt nicht                                      | `.node-version` und `engines.node` stehen auf 22. Notfalls `NIXPACKS_NODE_VERSION=22` als Variable setzen.         |

Die Logs stehen in Railway unter **Deployments → das jeweilige Deployment → Build Logs** bzw.
**Deploy Logs**.
