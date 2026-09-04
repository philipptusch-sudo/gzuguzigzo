/**
 * The complete range of Kofferwerk Auenfels.
 *
 * Every product on this list is invented. There are no real model names, no
 * EAN/GTIN codes and no manufacturer references, and none of the descriptions
 * were taken from an existing brand. Prices are integer cents.
 */

export type ProductCategory = "handgepaeck" | "reisekoffer" | "koffersets" | "business";

export const CATEGORY_LABELS: Readonly<Record<ProductCategory, string>> = {
  handgepaeck: "Handgepäck",
  reisekoffer: "Reisekoffer",
  koffersets: "Koffersets",
  business: "Business",
};

export const CATEGORY_ORDER: readonly ProductCategory[] = [
  "handgepaeck",
  "reisekoffer",
  "koffersets",
  "business",
];

export type ColorKey = "nachtblau" | "sand" | "graphit" | "lederbraun" | "burgund";

export type ProductColor = {
  readonly key: ColorKey;
  readonly label: string;
  /** Swatch colour, also used to tint the placeholder artwork. */
  readonly hex: string;
};

export const COLORS: Readonly<Record<ColorKey, ProductColor>> = {
  nachtblau: { key: "nachtblau", label: "Nachtblau", hex: "#1b2a41" },
  sand: { key: "sand", label: "Sand", hex: "#c8b394" },
  graphit: { key: "graphit", label: "Graphit", hex: "#3f4247" },
  lederbraun: { key: "lederbraun", label: "Lederbraun", hex: "#6b4a2f" },
  burgund: { key: "burgund", label: "Burgund", hex: "#5c2230" },
};

export type ProductImage = {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
};

export type ProductSpecs = {
  readonly dimensions: string;
  readonly weight: string;
  readonly volume: string;
  readonly material: string;
};

export type Product = {
  readonly slug: string;
  readonly name: string;
  /** Product type as shown to the visitor, e.g. "Handgepäck". */
  readonly type: string;
  readonly category: ProductCategory;
  readonly shortDescription: string;
  readonly longDescription: readonly string[];
  readonly compareAtCents: number;
  readonly salePriceCents: number;
  readonly specs: ProductSpecs;
  readonly images: readonly ProductImage[];
  readonly colors: readonly ColorKey[];
  /** Static stock note. Never randomised, never counted down. */
  readonly stockNote: string;
  readonly features: readonly string[];
  readonly care: readonly string[];
  /** Shown on the size overview of the detail page. */
  readonly sizeNotes: readonly string[];
};

function img(slug: string, index: number, alt: string): ProductImage {
  return {
    src: `/images/products/${slug}/${String(index).padStart(2, "0")}.svg`,
    alt,
    width: 1200,
    height: 1200,
  };
}

export const products: readonly Product[] = [
  {
    slug: "auenfels-kabine-38",
    name: "Auenfels Kabine 38",
    type: "Handgepäck",
    category: "handgepaeck",
    shortDescription:
      "Der kleine Begleiter für kurze Wege. 38 Liter, Kabinenmaß, leise Doppelrollen.",
    longDescription: [
      "Die Kabine 38 ist der Koffer, den wir selbst am häufigsten mitgenommen haben. Sie passt in die Gepäckablage der meisten Kurzstreckenflüge und lässt sich auch dann noch schieben, wenn der Bahnsteig voll ist.",
      "Die Hartschale ist an den Kanten verstärkt, weil dort erfahrungsgemäß zuerst etwas nachgibt. Innen teilt ein Gurtband die grosse Seite, die kleinere Seite schliesst mit einem Reissverschlussfach.",
      "Über die Jahre haben wir an diesem Modell vor allem Kleinigkeiten geändert: die Griffhöhe, den Rollendurchmesser, die Position des Seitengriffs. Geblieben ist die Grundform aus den ersten Jahren.",
    ],
    compareAtCents: 21900,
    salePriceCents: 6900,
    specs: {
      dimensions: "55 × 38 × 22 cm",
      weight: "2,7 kg",
      volume: "38 Liter",
      material: "Polycarbonat-Hartschale, Aluminiumgestänge",
    },
    images: [
      img("auenfels-kabine-38", 1, "Auenfels Kabine 38 in Nachtblau vor neutralem Hintergrund"),
      img("auenfels-kabine-38", 2, "Geöffnete Kabine 38 mit Innenaufteilung und Gurtband"),
      img("auenfels-kabine-38", 3, "Detailaufnahme der Doppelrollen der Kabine 38"),
      img("auenfels-kabine-38", 4, "Detailaufnahme des höhenverstellbaren Griffs der Kabine 38"),
    ],
    colors: ["nachtblau", "graphit", "sand"],
    stockNote: "Letzte Stücke aus unserer Kollektion",
    features: [
      "Leise Doppelrollen mit 360-Grad-Lauf",
      "Höhenverstellbarer Griff in drei Stufen",
      "Innenaufteilung mit Gurtband und Reissverschlussfach",
      "Verstärkte Kanten an den Auflagepunkten",
      "Zahlenschloss mit dreistelliger Kombination",
    ],
    care: [
      "Schale mit einem feuchten Tuch und mildem Reinigungsmittel abwischen.",
      "Rollen gelegentlich von Haaren und Fasern befreien.",
      "Koffer trocken und nicht dauerhaft in der Sonne lagern.",
    ],
    sizeNotes: [
      "Aussenmaß inklusive Rollen und Griff: 55 × 38 × 22 cm.",
      "Damit entspricht die Kabine 38 dem gängigen Handgepäckmaß vieler Fluggesellschaften.",
      "Die zulässigen Maße unterscheiden sich je nach Airline und Tarif. Prüfe sie vor der Reise.",
    ],
  },
  {
    slug: "auenfels-reise-68",
    name: "Auenfels Reise 68",
    type: "Mittelgroßer Koffer",
    category: "reisekoffer",
    shortDescription:
      "Der Koffer für ein bis zwei Wochen. 68 Liter, erweiterbar, mit ruhigem Lauf.",
    longDescription: [
      "Die Reise 68 ist unser meistverkauftes Modell. Sie fasst genug für zwei Wochen und bleibt dabei in einer Größe, die sich auf einer Treppe noch tragen lässt.",
      "Ein umlaufender Reissverschluss erweitert das Volumen um etwa fünf Liter. Wir haben ihn eingebaut, weil auf der Rückreise fast immer mehr mitkommt als auf der Hinreise.",
      "Innen liegt auf der einen Seite ein Netzfach, auf der anderen eine Trennwand mit Reissverschluss. Beide lassen sich herausnehmen, wenn du lieber frei packst.",
    ],
    compareAtCents: 28900,
    salePriceCents: 8900,
    specs: {
      dimensions: "67 × 45 × 27 cm",
      weight: "3,6 kg",
      volume: "68 Liter, erweiterbar auf 73 Liter",
      material: "Polypropylen-Hartschale, Aluminiumgestänge",
    },
    images: [
      img("auenfels-reise-68", 1, "Auenfels Reise 68 in Nachtblau vor neutralem Hintergrund"),
      img("auenfels-reise-68", 2, "Geöffnete Reise 68 mit Netzfach und Trennwand"),
      img("auenfels-reise-68", 3, "Detailaufnahme der Doppelrollen der Reise 68"),
      img("auenfels-reise-68", 4, "Detailaufnahme des Erweiterungsreissverschlusses"),
      img("auenfels-reise-68", 5, "Auenfels Reise 68 in Sand, seitliche Ansicht"),
    ],
    colors: ["nachtblau", "sand", "graphit", "burgund"],
    stockNote: "Nur noch wenige Exemplare verfügbar",
    features: [
      "Volumenerweiterung um etwa fünf Liter",
      "Leise Doppelrollen mit gedämpftem Lauf",
      "Herausnehmbare Trennwand und Netzfach",
      "Höhenverstellbarer Griff in drei Stufen",
      "Zwei Tragegriffe an Oberseite und Schmalseite",
    ],
    care: [
      "Schale mit einem feuchten Tuch und mildem Reinigungsmittel abwischen.",
      "Innenfutter bei Bedarf absaugen, nicht in der Maschine waschen.",
      "Erweiterungsreissverschluss geschlossen lagern, damit die Form erhalten bleibt.",
    ],
    sizeNotes: [
      "Aussenmaß inklusive Rollen und Griff: 67 × 45 × 27 cm.",
      "Als aufgegebenes Gepäck geeignet, für die Kabine zu groß.",
      "Leergewicht 3,6 kg — das zählt bei Airlines auf das Freigepäck mit.",
    ],
  },
  {
    slug: "auenfels-grande-76",
    name: "Auenfels Grande 76",
    type: "Großer Reisekoffer",
    category: "reisekoffer",
    shortDescription: "Für lange Reisen und Umzüge auf Zeit. 76 Liter, stabile Hartschale.",
    longDescription: [
      "Die Grande 76 ist unser größter Einzelkoffer. Wir haben sie ursprünglich für Kundinnen und Kunden gebaut, die für mehrere Monate ins Ausland gingen.",
      "Weil ein großer Koffer schnell schwer wird, sitzen die Rollen weiter aussen als bei den kleineren Modellen. Das macht den Lauf ruhiger, auch wenn der Koffer voll beladen ist.",
      "Innen gibt es zwei getrennte Packseiten, jeweils mit eigenem Gurtband. So bleibt die Aufteilung erhalten, wenn der Koffer unterwegs geöffnet wird.",
    ],
    compareAtCents: 32900,
    salePriceCents: 9900,
    specs: {
      dimensions: "76 × 51 × 30 cm",
      weight: "4,4 kg",
      volume: "76 Liter",
      material: "Polypropylen-Hartschale, verstärkter Rahmen",
    },
    images: [
      img("auenfels-grande-76", 1, "Auenfels Grande 76 in Graphit vor neutralem Hintergrund"),
      img("auenfels-grande-76", 2, "Geöffnete Grande 76 mit zwei Packseiten"),
      img("auenfels-grande-76", 3, "Detailaufnahme der aussen sitzenden Doppelrollen"),
      img("auenfels-grande-76", 4, "Detailaufnahme des Tragegriffs der Grande 76"),
    ],
    colors: ["graphit", "nachtblau", "lederbraun"],
    stockNote: "Letzte Stücke aus unserer Kollektion",
    features: [
      "Robuste Hartschale mit verstärktem Rahmen",
      "Weit aussen sitzende Doppelrollen für ruhigen Lauf",
      "Zwei getrennte Packseiten mit Gurtband",
      "Höhenverstellbarer Griff in drei Stufen",
      "Zahlenschloss mit dreistelliger Kombination",
    ],
    care: [
      "Schale mit einem feuchten Tuch und mildem Reinigungsmittel abwischen.",
      "Rollenlager gelegentlich prüfen und Fremdkörper entfernen.",
      "Koffer aufrecht und trocken lagern.",
    ],
    sizeNotes: [
      "Aussenmaß inklusive Rollen und Griff: 76 × 51 × 30 cm.",
      "Nur als aufgegebenes Gepäck geeignet.",
      "Viele Airlines begrenzen die Summe aus Länge, Breite und Höhe auf 158 cm. Die Grande 76 liegt darunter.",
    ],
  },
  {
    slug: "auenfels-business-42",
    name: "Auenfels Business 42",
    type: "Business-Trolley",
    category: "business",
    shortDescription: "Trolley mit gepolstertem Laptopfach. 42 Liter, aufrechte Form, leiser Lauf.",
    longDescription: [
      "Die Business 42 ist für Wege gedacht, die morgens beginnen und abends wieder enden. Sie steht aufrecht, ohne umzufallen, und lässt sich öffnen, ohne flach hingelegt zu werden.",
      "Das gepolsterte Fach an der Vorderseite nimmt ein Notebook bis 15,6 Zoll auf. Daneben liegen zwei kleinere Fächer für Kabel und Unterlagen.",
      "Der Griff ist etwas schmaler als bei den Reisemodellen. Das war eine Entscheidung gegen die Norm, aber sie hat sich bewährt.",
    ],
    compareAtCents: 24900,
    salePriceCents: 7900,
    specs: {
      dimensions: "55 × 40 × 23 cm",
      weight: "3,1 kg",
      volume: "42 Liter",
      material: "Hartschale mit textilem Vorderfach, Aluminiumgestänge",
    },
    images: [
      img("auenfels-business-42", 1, "Auenfels Business 42 in Graphit vor neutralem Hintergrund"),
      img("auenfels-business-42", 2, "Geöffnetes Laptopfach der Business 42"),
      img("auenfels-business-42", 3, "Detailaufnahme des schmalen Griffs der Business 42"),
      img("auenfels-business-42", 4, "Detailaufnahme der Doppelrollen der Business 42"),
    ],
    colors: ["graphit", "nachtblau"],
    stockNote: "Nur noch wenige Exemplare verfügbar",
    features: [
      "Gepolstertes Laptopfach bis 15,6 Zoll",
      "Vorderfach von aussen zugänglich",
      "Leise Doppelrollen mit 360-Grad-Lauf",
      "Höhenverstellbarer Griff in drei Stufen",
    ],
    care: [
      "Hartschale feucht abwischen, Textilfront trocken ausbürsten.",
      "Reissverschlüsse gelegentlich mit einem trockenen Tuch reinigen.",
      "Notebookfach vor längerer Lagerung leeren.",
    ],
    sizeNotes: [
      "Aussenmaß inklusive Rollen und Griff: 55 × 40 × 23 cm.",
      "Liegt im Bereich üblicher Handgepäckmaße, ist mit 40 cm Breite aber knapp bemessen.",
      "Prüfe die Vorgaben deiner Fluggesellschaft vor der Reise.",
    ],
  },
  {
    slug: "auenfels-weekender",
    name: "Auenfels Weekender",
    type: "Reisetasche",
    category: "handgepaeck",
    shortDescription: "Weiche Reisetasche für zwei bis drei Tage. 34 Liter, mit Lederdetails.",
    longDescription: [
      "Der Weekender ist die einzige weiche Tasche in unserer Kollektion. Er entstand, weil uns oft gesagt wurde, dass ein Koffer für zwei Nächte zu viel ist.",
      "Der Boden ist doppelt gearbeitet, die Griffe sind mit Leder unterlegt. Beides sind Stellen, an denen eine Tasche zuerst nachgibt.",
      "Innen gibt es ein Fach für Schuhe, das sich schliessen lässt, und zwei flache Taschen an der Längsseite.",
    ],
    compareAtCents: 18900,
    salePriceCents: 5900,
    specs: {
      dimensions: "52 × 30 × 26 cm",
      weight: "1,4 kg",
      volume: "34 Liter",
      material: "Beschichtetes Segeltuch, Lederbesatz an Griffen und Boden",
    },
    images: [
      img("auenfels-weekender", 1, "Auenfels Weekender in Lederbraun vor neutralem Hintergrund"),
      img("auenfels-weekender", 2, "Geöffneter Weekender mit Innenfächern"),
      img("auenfels-weekender", 3, "Detailaufnahme der ledergefassten Griffe"),
    ],
    colors: ["lederbraun", "nachtblau", "sand"],
    stockNote: "Solange der Vorrat reicht",
    features: [
      "Doppelt gearbeiteter Boden",
      "Griffe mit Lederbesatz",
      "Abtrennbares Schuhfach",
      "Abnehmbarer Schultergurt",
    ],
    care: [
      "Segeltuch mit einer weichen Bürste trocken reinigen.",
      "Lederteile gelegentlich mit farblosem Lederbalsam pflegen.",
      "Tasche nicht in der Maschine waschen.",
    ],
    sizeNotes: [
      "Aussenmaß: 52 × 30 × 26 cm.",
      "Weiches Material, dadurch lässt sich die Tasche etwas zusammendrücken.",
      "Für die Kabine geeignet, sofern die Airline eine Tasche dieser Größe zulässt.",
    ],
  },
  {
    slug: "auenfels-duo",
    name: "Auenfels Duo",
    type: "Zweiteiliges Kofferset",
    category: "koffersets",
    shortDescription: "Kabine 38 und Reise 68 im Set. Ineinander stellbar, gleiche Farbe.",
    longDescription: [
      "Das Duo ist die Kombination, nach der am häufigsten gefragt wurde: ein Handgepäckstück und ein mittlerer Koffer, farblich gleich, ineinander verstaubar.",
      "Beide Koffer teilen sich dasselbe Rollen- und Griffsystem. Wer den einen kennt, muss sich beim anderen nicht umgewöhnen.",
      "Zusammengestellt lassen sich die Koffer platzsparend im Schrank unterbringen. Das war für viele der eigentliche Grund für das Set.",
    ],
    compareAtCents: 49900,
    salePriceCents: 13900,
    specs: {
      dimensions: "55 × 38 × 22 cm und 67 × 45 × 27 cm",
      weight: "6,3 kg zusammen",
      volume: "38 und 68 Liter, zusammen 106 Liter",
      material: "Polycarbonat- und Polypropylen-Hartschale",
    },
    images: [
      img("auenfels-duo", 1, "Auenfels Duo, zwei Koffer in Nachtblau nebeneinander"),
      img("auenfels-duo", 2, "Auenfels Duo, kleiner Koffer im grossen verstaut"),
      img("auenfels-duo", 3, "Detailaufnahme der Rollen beider Koffer des Duo-Sets"),
      img("auenfels-duo", 4, "Geöffnete Koffer des Duo-Sets mit Innenaufteilung"),
    ],
    colors: ["nachtblau", "graphit", "sand"],
    stockNote: "Letzte Stücke aus unserer Kollektion",
    features: [
      "Zwei aufeinander abgestimmte Größen",
      "Ineinander stellbar zum Verstauen",
      "Einheitliches Rollen- und Griffsystem",
      "Jeweils mit Zahlenschloss",
    ],
    care: [
      "Schalen mit einem feuchten Tuch und mildem Reinigungsmittel abwischen.",
      "Zum Ineinanderstellen den kleinen Koffer vorher vollständig leeren.",
      "Koffer trocken lagern.",
    ],
    sizeNotes: [
      "Kabinenteil: 55 × 38 × 22 cm. Reiseteil: 67 × 45 × 27 cm.",
      "Nur der kleinere Koffer ist für die Kabine gedacht.",
      "Zusammengestellt beträgt der Platzbedarf etwa 67 × 45 × 27 cm.",
    ],
  },
  {
    slug: "auenfels-familie",
    name: "Auenfels Familie",
    type: "Dreiteiliges Kofferset",
    category: "koffersets",
    shortDescription: "Kabine 38, Reise 68 und Grande 76 im Set. Drei Größen, ineinander stellbar.",
    longDescription: [
      "Das Set Familie deckt alle drei Größen unserer Kollektion ab. Es war ursprünglich als Aussteuer gedacht und wurde später vor allem von Familien gekauft, die einmal etwas anschaffen und dann Ruhe haben wollten.",
      "Alle drei Koffer haben denselben Griff und dieselbe Rollenkonstruktion. Ersatzteile passten dadurch über Jahre hinweg auf jedes Modell.",
      "Ineinander gestellt nehmen die drei Koffer etwa so viel Platz ein wie der grosse allein.",
    ],
    compareAtCents: 69900,
    salePriceCents: 18900,
    specs: {
      dimensions: "55 × 38 × 22 cm, 67 × 45 × 27 cm und 76 × 51 × 30 cm",
      weight: "10,7 kg zusammen",
      volume: "38, 68 und 76 Liter, zusammen 182 Liter",
      material: "Polycarbonat- und Polypropylen-Hartschale",
    },
    images: [
      img("auenfels-familie", 1, "Auenfels Familie, drei Koffer in Nachtblau nebeneinander"),
      img("auenfels-familie", 2, "Auenfels Familie, Koffer ineinander gestellt"),
      img("auenfels-familie", 3, "Geöffnete Koffer des Familie-Sets"),
      img("auenfels-familie", 4, "Detailaufnahme des einheitlichen Griffsystems"),
      img("auenfels-familie", 5, "Auenfels Familie in Graphit, seitliche Ansicht"),
    ],
    colors: ["nachtblau", "graphit"],
    stockNote: "Nur noch wenige Exemplare verfügbar",
    features: [
      "Drei aufeinander abgestimmte Größen",
      "Ineinander stellbar zum Verstauen",
      "Einheitliches Rollen- und Griffsystem",
      "Jeweils mit Zahlenschloss",
      "Gleiche Farbe über alle drei Teile",
    ],
    care: [
      "Schalen mit einem feuchten Tuch und mildem Reinigungsmittel abwischen.",
      "Vor dem Ineinanderstellen alle Koffer leeren und trocknen lassen.",
      "Set aufrecht und trocken lagern.",
    ],
    sizeNotes: [
      "Einzelmaße: 55 × 38 × 22 cm, 67 × 45 × 27 cm, 76 × 51 × 30 cm.",
      "Nur der kleinste Koffer ist für die Kabine gedacht.",
      "Ineinander gestellt entspricht der Platzbedarf etwa dem grossen Koffer.",
    ],
  },
  {
    slug: "auenfels-reisebox",
    name: "Auenfels Reisebox",
    type: "Kosmetikkoffer",
    category: "handgepaeck",
    shortDescription: "Kleiner Hartschalenkoffer für Kosmetik und Kleinteile. 12 Liter.",
    longDescription: [
      "Die Reisebox ist das kleinste Stück unserer Kollektion. Sie war lange ein Restposten und wurde dann unerwartet zum Dauerläufer.",
      "Innen ist sie mit einem hellen Futter ausgeschlagen, damit man auch bei schwachem Licht findet, was man sucht. Ein herausnehmbares Einsatzfach teilt den Raum.",
      "Der Deckel steht offen, ohne gehalten werden zu müssen. Das klingt nach einer Kleinigkeit und ist im Alltag der wichtigste Teil.",
    ],
    compareAtCents: 12900,
    salePriceCents: 3900,
    specs: {
      dimensions: "28 × 22 × 20 cm",
      weight: "1,1 kg",
      volume: "12 Liter",
      material: "Polycarbonat-Hartschale, helles Innenfutter",
    },
    images: [
      img("auenfels-reisebox", 1, "Auenfels Reisebox in Burgund vor neutralem Hintergrund"),
      img("auenfels-reisebox", 2, "Geöffnete Reisebox mit hellem Innenfutter"),
      img("auenfels-reisebox", 3, "Detailaufnahme des herausnehmbaren Einsatzfachs"),
    ],
    colors: ["burgund", "nachtblau", "sand", "lederbraun"],
    stockNote: "Solange der Vorrat reicht",
    features: [
      "Deckel bleibt selbstständig offen stehen",
      "Herausnehmbares Einsatzfach",
      "Helles Innenfutter",
      "Tragegriff mit Lederbesatz",
    ],
    care: [
      "Schale feucht abwischen, Innenfutter trocken ausbürsten.",
      "Ausgelaufene Flüssigkeiten zeitnah entfernen, damit das Futter keine Ränder behält.",
      "Reisebox geöffnet trocknen lassen, bevor sie verstaut wird.",
    ],
    sizeNotes: [
      "Aussenmaß: 28 × 22 × 20 cm.",
      "Passt als zusätzliches kleines Gepäckstück unter den Vordersitz vieler Flugzeuge.",
      "Flüssigkeiten unterliegen im Handgepäck den Vorgaben der Sicherheitskontrolle.",
    ],
  },
];

export const productsBySlug: ReadonlyMap<string, Product> = new Map(
  products.map((product) => [product.slug, product]),
);

export function getProduct(slug: string): Product | undefined {
  return productsBySlug.get(slug);
}

export function getProductsByCategory(category: ProductCategory): readonly Product[] {
  return products.filter((product) => product.category === category);
}

/** The four products highlighted on the home page under "Letzte Stücke". */
export const FEATURED_SLUGS: readonly string[] = [
  "auenfels-kabine-38",
  "auenfels-reise-68",
  "auenfels-duo",
  "auenfels-business-42",
];

export function getFeaturedProducts(): readonly Product[] {
  return FEATURED_SLUGS.map((slug) => productsBySlug.get(slug)).filter(
    (product): product is Product => product !== undefined,
  );
}

/** Up to `limit` other products, preferring the same category. */
export function getRelatedProducts(slug: string, limit = 3): readonly Product[] {
  const current = productsBySlug.get(slug);
  if (!current) return [];

  const sameCategory = products.filter((p) => p.slug !== slug && p.category === current.category);
  const others = products.filter((p) => p.slug !== slug && p.category !== current.category);

  return [...sameCategory, ...others].slice(0, limit);
}
