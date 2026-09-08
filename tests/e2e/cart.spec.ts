import { expect, test } from "@playwright/test";

async function addToCart(page: import("@playwright/test").Page, slug: string) {
  await page.goto(`/koffer/${slug}`);
  await page.getByTestId("add-to-cart").click();
  await expect(page.getByTestId("added-confirmation")).toBeVisible();
}

test.describe("Warenkorb", () => {
  test("legt ein Produkt in den Warenkorb", async ({ page }) => {
    await addToCart(page, "auenfels-kabine-38");

    await expect(page.getByTestId("cart-count")).toHaveText("1");

    await page.goto("/warenkorb");
    await expect(page.getByTestId("cart-line")).toHaveCount(1);
    await expect(page.getByTestId("cart-line-total")).toContainText("69,00");
  });

  test("verändert die Menge im Warenkorb", async ({ page }) => {
    await addToCart(page, "auenfels-kabine-38");
    await page.goto("/warenkorb");

    await page.getByTestId("cart-increase").click();
    await expect(page.getByTestId("cart-quantity")).toHaveText("2");
    await expect(page.getByTestId("cart-line-total")).toContainText("138,00");

    await page.getByTestId("cart-decrease").click();
    await expect(page.getByTestId("cart-quantity")).toHaveText("1");
  });

  test("entfernt ein Produkt aus dem Warenkorb", async ({ page }) => {
    await addToCart(page, "auenfels-kabine-38");
    await page.goto("/warenkorb");

    await page.getByTestId("cart-remove").click();
    await expect(page.getByTestId("cart-empty")).toBeVisible();
  });

  test("leert den gesamten Warenkorb", async ({ page }) => {
    await addToCart(page, "auenfels-kabine-38");
    await addToCart(page, "auenfels-reise-68");
    await page.goto("/warenkorb");

    await expect(page.getByTestId("cart-line")).toHaveCount(2);
    await page.getByTestId("cart-clear").click();
    await expect(page.getByTestId("cart-empty")).toBeVisible();
  });

  test("berechnet Zwischensumme, Ersparnis und Gesamtsumme", async ({ page }) => {
    await addToCart(page, "auenfels-kabine-38"); // 219,00 -> 69,00
    await addToCart(page, "auenfels-reise-68"); // 289,00 -> 89,00
    await page.goto("/warenkorb");

    await expect(page.getByTestId("subtotal")).toContainText("158,00");
    await expect(page.getByTestId("savings")).toContainText("350,00");
    await expect(page.getByTestId("shipping")).toHaveText("Kostenlos");
    await expect(page.getByTestId("total")).toContainText("158,00");
  });

  test("bleibt nach einem Neuladen erhalten", async ({ page }) => {
    await addToCart(page, "auenfels-kabine-38");
    await page.goto("/warenkorb");
    await page.getByTestId("cart-increase").click();
    await expect(page.getByTestId("cart-quantity")).toHaveText("2");

    await page.reload();

    await expect(page.getByTestId("cart-quantity")).toHaveText("2");
    await expect(page.getByTestId("cart-line-total")).toContainText("138,00");
    await expect(page.getByTestId("cart-count")).toHaveText("2");
  });

  test("führt „Zur Kasse“ zur Adresseingabe und von dort zur Auflösung", async ({ page }) => {
    await addToCart(page, "auenfels-kabine-38");
    await page.goto("/warenkorb");

    await page.getByTestId("checkout").click();
    await expect(page).toHaveURL(/\/kasse$/);

    // Ein Schritt, ein Button, und der führt zur Auflösung.
    await page.getByTestId("checkout-continue").click();

    await expect(page).toHaveURL(/\/experiment$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Dieser Shop ist Teil eines Verbraucherschutzexperiments.",
    );
  });

  test("kennt zwischen Adresseingabe und Auflösung keinen weiteren Schritt", async ({ page }) => {
    await addToCart(page, "auenfels-kabine-38");
    await page.goto("/kasse");

    // Weder Formular noch Absende-Button, also kein zweiter Schritt.
    await expect(page.locator("form")).toHaveCount(0);
    await expect(page.locator('button[type="submit"]')).toHaveCount(0);

    await page.getByTestId("checkout-continue").click();
    await page.waitForURL(/\/experiment$/);

    await expect(page.locator("form")).toHaveCount(0);
    await expect(page.locator("input")).toHaveCount(0);
  });
});
