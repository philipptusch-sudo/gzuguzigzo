import { expect, test } from "@playwright/test";

test.describe("Shopansicht", () => {
  test("zeigt die Startseite mit Kampagnenzeile und Ankündigungsleiste", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Nach 27 Jahren endet unsere Reise.",
    );
    await expect(
      page.getByText("Werkstattschliessung: Letzte Kollektion bis zu 72 % reduziert"),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Zum Abschiedsverkauf" })).toBeVisible();
  });

  test("hebt vier Produkte auf der Startseite hervor", async ({ page }) => {
    await page.goto("/");
    const featured = page.locator("#letzte-stuecke [data-testid='product-card']");
    await expect(featured).toHaveCount(4);
  });

  test("führt den Sprunglink zur Geschichte auf derselben Seite aus", async ({ page }) => {
    await page.goto("/");
    await page.locator("main").getByRole("link", { name: "Unsere Geschichte" }).first().click();

    await expect(page).toHaveURL(/#unsere-geschichte$/);
    await expect(page.locator("#unsere-geschichte")).toBeVisible();
  });

  test("listet alle acht Modelle in der Kollektion", async ({ page }) => {
    await page.goto("/kollektion");
    await expect(page.getByTestId("product-card")).toHaveCount(8);
  });

  test("filtert die Kollektion nach Kategorie", async ({ page }) => {
    await page.goto("/kollektion?kategorie=koffersets");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Koffersets");
    await expect(page.getByTestId("product-card")).toHaveCount(2);
  });

  test("zeigt auf der Produktseite Preis, Rabatt und Produktangaben", async ({ page }) => {
    await page.goto("/koffer/auenfels-kabine-38");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Auenfels Kabine 38");
    await expect(page.getByTestId("current-price").first()).toContainText("69,00");
    await expect(page.getByTestId("compare-price").first()).toContainText("219,00");
    await expect(page.getByTestId("discount-badge").first()).toContainText("68");
    await expect(page.getByTestId("stock-note")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Brotkrumennavigation" })).toBeVisible();

    // Die technischen Daten liegen in einem Akkordeon.
    await page
      .getByRole("group")
      .filter({ hasText: "Technische Details" })
      .getByText("Technische Details")
      .click();
    await expect(page.getByText("55 × 38 × 22 cm", { exact: true })).toBeVisible();
  });

  test("verweist von der Produktseite auf ähnliche Modelle", async ({ page }) => {
    await page.goto("/koffer/auenfels-kabine-38");
    await expect(page.getByRole("heading", { name: "Ähnliche Modelle" })).toBeVisible();
  });

  test("beantwortet in der FAQ nur Produktfragen", async ({ page }) => {
    await page.goto("/faq");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Häufige Fragen");
    const text = (await page.locator("body").innerText()).toLowerCase();

    for (const forbidden of ["widerruf", "rücksendung", "retoure", "lieferzeit"]) {
      expect(text, `FAQ darf ${forbidden} nicht behandeln`).not.toContain(forbidden);
    }
  });

  test("findet Modelle über die Suche", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Suche öffnen" }).click();

    const dialog = page.getByRole("dialog", { name: "Produkte durchsuchen" });
    await expect(dialog).toBeVisible();

    await dialog.getByRole("searchbox").fill("weekender");
    await dialog.getByRole("link", { name: /Weekender/ }).click();

    await expect(page).toHaveURL(/\/koffer\/auenfels-weekender$/);
  });
});

test.describe("Footer der Shopansicht", () => {
  test("enthält keine Anbieter- oder Rechtslinks", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");

    for (const label of [
      "Impressum",
      "Datenschutz",
      "AGB",
      "Widerruf",
      "Versand",
      "Kontakt",
      "Über uns",
    ]) {
      await expect(footer.getByRole("link", { name: label })).toHaveCount(0);
    }

    await expect(footer.getByRole("link", { name: "Kollektion" }).first()).toBeVisible();
    await expect(footer.getByText("Kofferwerk Auenfels").first()).toBeVisible();
  });

  test("nennt weder Anschrift noch Telefonnummer noch E-Mail-Adresse", async ({ page }) => {
    await page.goto("/");
    const footer = await page.locator("footer").innerText();

    expect(footer).not.toMatch(/@[a-z0-9-]+\.[a-z]{2,}/i);
    expect(footer).not.toMatch(/\+?\d[\d\s/-]{8,}/);
    expect(footer.toLowerCase()).not.toContain("hrb");
  });
});
