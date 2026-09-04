import { describe, expect, it } from "vitest";
import { discountPercent, formatEuro, resolvePrice } from "@/lib/pricing";
import { products } from "@/data/products";

describe("Rabattberechnung", () => {
  it("berechnet den Prozentsatz aus Vergleichs- und Aktionspreis", () => {
    expect(discountPercent(21900, 6900)).toBe(68);
    expect(discountPercent(28900, 8900)).toBe(69);
    expect(discountPercent(12900, 3900)).toBe(70);
    expect(discountPercent(69900, 18900)).toBe(73);
  });

  it("gibt null zurück, wenn es keinen Nachlass gibt", () => {
    expect(discountPercent(10000, 10000)).toBe(0);
    expect(discountPercent(10000, 12000)).toBe(0);
    expect(discountPercent(0, 0)).toBe(0);
  });

  it("hält die Aktionsrabatte im gewollten Korridor von 65 bis 73 Prozent", () => {
    for (const product of products) {
      const price = resolvePrice(product, { useDeepDiscounts: true });
      expect(price.discountPercent, product.slug).toBeGreaterThanOrEqual(65);
      expect(price.discountPercent, product.slug).toBeLessThanOrEqual(73);
    }
  });

  it("liefert in Varianten ohne Aktionspreise einen unauffälligen Nachlass", () => {
    for (const product of products) {
      const price = resolvePrice(product, {
        useDeepDiscounts: false,
        moderateDiscountRate: 0.1,
      });
      expect(price.discountPercent, product.slug).toBeLessThanOrEqual(10);
      expect(price.priceCents, product.slug).toBeLessThan(price.compareAtCents);
    }
  });

  it("berechnet Ersparnis und Preis konsistent", () => {
    const price = resolvePrice(
      { compareAtCents: 21900, salePriceCents: 6900 },
      {
        useDeepDiscounts: true,
      },
    );

    expect(price.priceCents).toBe(6900);
    expect(price.compareAtCents).toBe(21900);
    expect(price.savingsCents).toBe(15000);
  });
});

describe("Preisformatierung", () => {
  it("formatiert Beträge in deutscher Schreibweise", () => {
    // Intl verwendet ein schmales geschütztes Leerzeichen vor dem Euro-Zeichen.
    expect(formatEuro(6900).replace(/ | /g, " ")).toBe("69,00 €");
    expect(formatEuro(18900).replace(/ | /g, " ")).toBe("189,00 €");
    expect(formatEuro(0).replace(/ | /g, " ")).toBe("0,00 €");
  });
});

describe("Katalogpreise", () => {
  it("entspricht den im Briefing festgelegten Preisen", () => {
    const expected: Record<string, [number, number]> = {
      "auenfels-kabine-38": [21900, 6900],
      "auenfels-reise-68": [28900, 8900],
      "auenfels-grande-76": [32900, 9900],
      "auenfels-business-42": [24900, 7900],
      "auenfels-weekender": [18900, 5900],
      "auenfels-duo": [49900, 13900],
      "auenfels-familie": [69900, 18900],
      "auenfels-reisebox": [12900, 3900],
    };

    for (const product of products) {
      expect([product.compareAtCents, product.salePriceCents], product.slug).toEqual(
        expected[product.slug],
      );
    }
  });
});
