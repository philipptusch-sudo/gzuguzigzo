import { describe, expect, it } from "vitest";
import {
  EMPTY_CART,
  MAX_QUANTITY_PER_LINE,
  addLine,
  clearCart,
  computeTotals,
  parseStoredCart,
  removeLine,
  serialiseCart,
  setQuantity,
  totalQuantity,
} from "@/lib/cart";
import { getProduct } from "@/data/products";

const KABINE = "auenfels-kabine-38"; // 219,00 € -> 69,00 €
const REISE = "auenfels-reise-68"; // 289,00 € -> 89,00 €

const deep = { useDeepDiscounts: true } as const;

describe("Warenkorb: Produkte hinzufügen", () => {
  it("legt ein Produkt in den Warenkorb", () => {
    const cart = addLine(EMPTY_CART, KABINE, "nachtblau");

    expect(cart).toHaveLength(1);
    expect(cart[0]).toEqual({ slug: KABINE, color: "nachtblau", quantity: 1 });
  });

  it("erhöht die Menge, wenn dasselbe Produkt in derselben Farbe erneut hinzugefügt wird", () => {
    let cart = addLine(EMPTY_CART, KABINE, "nachtblau", 2);
    cart = addLine(cart, KABINE, "nachtblau", 3);

    expect(cart).toHaveLength(1);
    expect(cart[0]?.quantity).toBe(5);
  });

  it("führt dasselbe Produkt in einer anderen Farbe als eigene Position", () => {
    let cart = addLine(EMPTY_CART, KABINE, "nachtblau");
    cart = addLine(cart, KABINE, "graphit");

    expect(cart).toHaveLength(2);
    expect(totalQuantity(cart)).toBe(2);
  });

  it("ignoriert unbekannte Produkte", () => {
    expect(addLine(EMPTY_CART, "gibt-es-nicht", "nachtblau")).toEqual(EMPTY_CART);
  });

  it("begrenzt die Menge nach oben", () => {
    const cart = addLine(EMPTY_CART, KABINE, "nachtblau", 999);
    expect(cart[0]?.quantity).toBe(MAX_QUANTITY_PER_LINE);
  });
});

describe("Warenkorb: Menge verändern", () => {
  it("setzt die Menge einer Position", () => {
    const cart = setQuantity(addLine(EMPTY_CART, KABINE, "nachtblau"), KABINE, "nachtblau", 4);
    expect(cart[0]?.quantity).toBe(4);
  });

  it("entfernt die Position, wenn die Menge auf null gesetzt wird", () => {
    const cart = setQuantity(addLine(EMPTY_CART, KABINE, "nachtblau"), KABINE, "nachtblau", 0);
    expect(cart).toHaveLength(0);
  });

  it("lässt andere Positionen unberührt", () => {
    let cart = addLine(EMPTY_CART, KABINE, "nachtblau");
    cart = addLine(cart, REISE, "sand");
    cart = setQuantity(cart, KABINE, "nachtblau", 7);

    expect(cart.find((line) => line.slug === KABINE)?.quantity).toBe(7);
    expect(cart.find((line) => line.slug === REISE)?.quantity).toBe(1);
  });
});

describe("Warenkorb: Produkte entfernen", () => {
  it("entfernt genau eine Position", () => {
    let cart = addLine(EMPTY_CART, KABINE, "nachtblau");
    cart = addLine(cart, REISE, "sand");
    cart = removeLine(cart, KABINE, "nachtblau");

    expect(cart).toHaveLength(1);
    expect(cart[0]?.slug).toBe(REISE);
  });

  it("entfernt nur die passende Farbvariante", () => {
    let cart = addLine(EMPTY_CART, KABINE, "nachtblau");
    cart = addLine(cart, KABINE, "graphit");
    cart = removeLine(cart, KABINE, "nachtblau");

    expect(cart).toHaveLength(1);
    expect(cart[0]?.color).toBe("graphit");
  });

  it("leert den Warenkorb vollständig", () => {
    expect(clearCart()).toHaveLength(0);
  });
});

describe("Warenkorb: Summen", () => {
  it("berechnet die Gesamtsumme über mehrere Positionen", () => {
    let cart = addLine(EMPTY_CART, KABINE, "nachtblau", 2); // 2 × 69,00 €
    cart = addLine(cart, REISE, "sand", 1); // 1 × 89,00 €

    const totals = computeTotals(cart, deep);

    expect(totals.subtotalCents).toBe(2 * 6900 + 8900);
    expect(totals.totalCents).toBe(totals.subtotalCents);
    expect(totals.itemCount).toBe(3);
  });

  it("weist Versandkosten immer mit null aus", () => {
    const totals = computeTotals(addLine(EMPTY_CART, KABINE, "nachtblau"), deep);
    expect(totals.shippingCents).toBe(0);
    expect(totals.totalCents).toBe(totals.subtotalCents);
  });

  it("berechnet die Ersparnis aus Vergleichs- und Aktionspreis", () => {
    const cart = addLine(EMPTY_CART, KABINE, "nachtblau", 2);
    const totals = computeTotals(cart, deep);

    expect(totals.compareAtTotalCents).toBe(2 * 21900);
    expect(totals.savingsCents).toBe(2 * (21900 - 6900));
  });

  it("liefert für einen leeren Warenkorb überall null", () => {
    const totals = computeTotals(EMPTY_CART, deep);
    expect(totals).toMatchObject({
      itemCount: 0,
      subtotalCents: 0,
      savingsCents: 0,
      totalCents: 0,
    });
  });

  it("überspringt Positionen, deren Produkt es nicht mehr gibt", () => {
    const totals = computeTotals([{ slug: "weg", color: "nachtblau", quantity: 2 }], deep);
    expect(totals.lines).toHaveLength(0);
    expect(totals.subtotalCents).toBe(0);
  });
});

describe("Warenkorb: Speichern und Wiederherstellen", () => {
  it("überlebt eine Serialisierungsrunde", () => {
    let cart = addLine(EMPTY_CART, KABINE, "nachtblau", 2);
    cart = addLine(cart, REISE, "sand", 3);

    expect(parseStoredCart(serialiseCart(cart))).toEqual(cart);
  });

  it("liefert einen leeren Warenkorb für fehlende oder kaputte Daten", () => {
    expect(parseStoredCart(null)).toEqual(EMPTY_CART);
    expect(parseStoredCart("kein json")).toEqual(EMPTY_CART);
    expect(parseStoredCart('{"nicht":"array"}')).toEqual(EMPTY_CART);
  });

  it("verwirft Positionen mit unbekanntem Produkt oder unpassender Farbe", () => {
    const raw = JSON.stringify([
      { slug: "gibt-es-nicht", color: "nachtblau", quantity: 1 },
      { slug: KABINE, color: "burgund", quantity: 1 }, // Kabine 38 gibt es nicht in Burgund
      { slug: KABINE, color: "nachtblau", quantity: 2 },
    ]);

    expect(parseStoredCart(raw)).toEqual([{ slug: KABINE, color: "nachtblau", quantity: 2 }]);
  });

  it("fasst doppelte Positionen aus manipulierten Daten zusammen", () => {
    const raw = JSON.stringify([
      { slug: KABINE, color: "nachtblau", quantity: 2 },
      { slug: KABINE, color: "nachtblau", quantity: 3 },
    ]);

    expect(parseStoredCart(raw)).toEqual([{ slug: KABINE, color: "nachtblau", quantity: 5 }]);
  });
});

describe("Produktdaten", () => {
  it("enthält genau acht Produkte mit eindeutigen Slugs", async () => {
    const { products } = await import("@/data/products");
    expect(products).toHaveLength(8);
    expect(new Set(products.map((p) => p.slug)).size).toBe(8);
  });

  it("gibt jedem Produkt drei bis fünf Bilder und drei bis fünf Eigenschaften", async () => {
    const { products } = await import("@/data/products");
    for (const product of products) {
      expect(product.images.length, product.slug).toBeGreaterThanOrEqual(3);
      expect(product.images.length, product.slug).toBeLessThanOrEqual(5);
      expect(product.features.length, product.slug).toBeGreaterThanOrEqual(3);
      expect(product.features.length, product.slug).toBeLessThanOrEqual(5);
      expect(product.colors.length, product.slug).toBeGreaterThan(0);
    }
  });

  it("nennt für jedes Produkt einen statischen Lagerhinweis", () => {
    expect(getProduct(KABINE)?.stockNote).toBeTruthy();
  });
});
