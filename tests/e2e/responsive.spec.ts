import { expect, test } from "@playwright/test";

const ROUTES = [
  "/",
  "/kollektion",
  "/koffer/auenfels-familie",
  "/warenkorb",
  "/faq",
  "/experiment",
];

const WIDTHS = [320, 390, 768, 1280];

/**
 * Der Seitenkörper darf auf keiner Breite horizontal scrollen. Lange deutsche
 * Komposita ("Verbraucherschutzexperiments") sind hier der übliche Auslöser.
 */
test.describe("Responsive Darstellung", () => {
  for (const width of WIDTHS) {
    for (const route of ROUTES) {
      test(`${route} scrollt bei ${width} px nicht horizontal`, async ({ page }) => {
        await page.setViewportSize({ width, height: 760 });
        await page.goto(route);

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );

        expect(overflow, `${route} bei ${width} px`).toBeLessThanOrEqual(0);
      });
    }
  }

  test("blendet die Hauptnavigation auf schmalen Displays hinter dem Menü aus", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 760 });
    await page.goto("/");

    const toggle = page.getByRole("button", { name: "Menü öffnen" });
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    await expect(page.getByRole("button", { name: "Menü schliessen" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(
      page.locator("#mobile-nav").getByRole("link", { name: "Kollektion" }),
    ).toBeVisible();
  });

  test("stellt einen Sprunglink zum Inhalt bereit", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const skip = page.getByRole("link", { name: "Zum Inhalt springen" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
  });
});
