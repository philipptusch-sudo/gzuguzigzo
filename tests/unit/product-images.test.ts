import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { products } from "@/data/products";

const PUBLIC_DIR = join(process.cwd(), "public");

const EDITORIAL_IMAGES = [
  "/images/editorial/werkstatt.svg",
  "/images/editorial/werkbank.svg",
  "/images/editorial/reparatur.svg",
  "/images/editorial/gepaeckanhaenger.svg",
  "/images/editorial/kartons.svg",
];

describe("Bilder", () => {
  it("liefert jedes Produktbild lokal aus", () => {
    for (const product of products) {
      for (const image of product.images) {
        expect(image.src.startsWith("/images/"), `${product.slug}: ${image.src}`).toBe(true);
        expect(existsSync(join(PUBLIC_DIR, image.src)), `fehlt: ${image.src}`).toBe(true);
      }
    }
  });

  it("hat auch die redaktionellen Motive lokal vorliegen", () => {
    for (const src of EDITORIAL_IMAGES) {
      expect(existsSync(join(PUBLIC_DIR, src)), `fehlt: ${src}`).toBe(true);
    }
  });

  it("gibt jedem Produktbild einen beschreibenden Alternativtext", () => {
    for (const product of products) {
      for (const image of product.images) {
        expect(image.alt.length, `${product.slug}: ${image.src}`).toBeGreaterThan(12);
      }
    }
  });

  it("bindet in den Platzhaltern keine externen Ressourcen ein", () => {
    for (const product of products) {
      for (const image of product.images) {
        const svg = readFileSync(join(PUBLIC_DIR, image.src), "utf8");
        expect(svg, image.src).not.toMatch(/https?:\/\/(?!www\.w3\.org)/);
      }
    }
  });
});
