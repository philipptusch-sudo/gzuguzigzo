import { describe, expect, it } from "vitest";
import {
  isAlwaysReachable,
  isCheckoutRoute,
  isSiteEnabled,
  shouldRedirectToReveal,
} from "@/lib/site-state";
import { CHECKOUT_ROUTES } from "@/config/experiment";

describe("Kill-Switch", () => {
  it("ist ohne gesetzte Variable aktiv", () => {
    expect(isSiteEnabled({})).toBe(true);
    expect(isSiteEnabled({ SITE_ENABLED: "" })).toBe(true);
    expect(isSiteEnabled({ SITE_ENABLED: "true" })).toBe(true);
  });

  it("schaltet den Shop bei den üblichen Falsch-Werten ab", () => {
    for (const value of ["false", "FALSE", " false ", "0", "off", "no", "nein", "aus"]) {
      expect(isSiteEnabled({ SITE_ENABLED: value }), value).toBe(false);
    }
  });

  it("leitet bei abgeschaltetem Shop sämtliche Shoprouten auf die Auflösung", () => {
    const off = { SITE_ENABLED: "false" };
    for (const path of ["/", "/kollektion", "/koffer/auenfels-kabine-38", "/faq", "/warenkorb"]) {
      expect(shouldRedirectToReveal(path, off), path).toBe(true);
    }
  });

  it("lässt die Auflösungsseite auch bei abgeschaltetem Shop erreichbar", () => {
    const off = { SITE_ENABLED: "false" };
    expect(shouldRedirectToReveal("/experiment", off)).toBe(false);
    expect(shouldRedirectToReveal("/robots.txt", off)).toBe(false);
  });

  it("lässt Shoprouten bei eingeschaltetem Shop durch", () => {
    const on = { SITE_ENABLED: "true" };
    for (const path of ["/", "/kollektion", "/faq", "/warenkorb"]) {
      expect(shouldRedirectToReveal(path, on), path).toBe(false);
    }
  });
});

describe("Kassenrouten", () => {
  it("erkennt jede konfigurierte Kassenroute", () => {
    for (const route of CHECKOUT_ROUTES) {
      expect(isCheckoutRoute(route), route).toBe(true);
    }
  });

  it("erkennt Unterseiten und abschliessende Schrägstriche", () => {
    expect(isCheckoutRoute("/checkout/adresse")).toBe(true);
    expect(isCheckoutRoute("/zahlung/")).toBe(true);
    expect(isCheckoutRoute("/bestellung/bestaetigung")).toBe(true);
  });

  it("leitet Kassenrouten auch bei eingeschaltetem Shop um", () => {
    const on = { SITE_ENABLED: "true" };
    expect(shouldRedirectToReveal("/checkout", on)).toBe(true);
    expect(shouldRedirectToReveal("/payment", on)).toBe(true);
    expect(shouldRedirectToReveal("/bestellung", on)).toBe(true);
    expect(shouldRedirectToReveal("/zahlung", on)).toBe(true);
  });

  it("lässt die Adresseingabe zu, sperrt aber jeden weiteren Bestellschritt", () => {
    const on = { SITE_ENABLED: "true" };

    // Schritt 1 ist erreichbar; sein einziger Button führt zur Auflösung.
    expect(isCheckoutRoute("/kasse")).toBe(false);
    expect(shouldRedirectToReveal("/kasse", on)).toBe(false);

    // Alles, was eine Zahlung oder eine aufgegebene Bestellung nahelegt, nicht.
    for (const path of ["/kasse/zahlung", "/kasse/bestaetigung", "/warenkorb/kasse"]) {
      expect(isCheckoutRoute(path), path).toBe(true);
      expect(shouldRedirectToReveal(path, on), path).toBe(true);
    }
  });

  it("sperrt die Adresseingabe bei abgeschaltetem Shop mit", () => {
    expect(shouldRedirectToReveal("/kasse", { SITE_ENABLED: "false" })).toBe(true);
  });

  it("hält reguläre Shoprouten nicht für Kassenrouten", () => {
    for (const path of ["/", "/warenkorb", "/kollektion", "/koffer/auenfels-duo", "/faq"]) {
      expect(isCheckoutRoute(path), path).toBe(false);
    }
  });

  it("schützt die Auflösungsseite vor jeder Umleitung", () => {
    expect(isAlwaysReachable("/experiment")).toBe(true);
  });
});
