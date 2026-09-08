import { expect, test, type Page } from "@playwright/test";

const ADDRESS_FIELDS = [
  ["#feld-vorname", "Erika"],
  ["#feld-nachname", "Mustermann"],
  ["#feld-strasse", "Musterweg 12"],
  ["#feld-plz", "12345"],
  ["#feld-ort", "Musterstadt"],
  ["#feld-land", "Deutschland"],
  ["#feld-kontakt", "erika@example.org"],
] as const;

async function fillEverything(page: Page) {
  for (const [selector, value] of ADDRESS_FIELDS) {
    await page.fill(selector, value);
  }
}

test.describe("Kasse", () => {
  test("ist über den Warenkorb erreichbar", async ({ page }) => {
    await page.goto("/koffer/auenfels-kabine-38");
    await page.getByTestId("add-to-cart").click();
    await page.goto("/warenkorb");

    await page.getByTestId("checkout").click();

    await expect(page).toHaveURL(/\/kasse$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Kasse");
  });

  test("zeigt drei Schritte, von denen nur der erste aktiv ist", async ({ page }) => {
    await page.goto("/kasse");
    const steps = page.getByRole("navigation", { name: "Bestellschritte" });

    await expect(steps).toContainText("Lieferadresse");
    await expect(steps).toContainText("Versand und Zahlung");
    await expect(steps).toContainText("Prüfen und bestellen");
    await expect(steps.locator('[aria-current="step"]')).toHaveCount(1);
    await expect(steps.locator('[aria-current="step"]')).toContainText("Lieferadresse");
  });

  test("führt „Weiter“ unmittelbar zur Auflösung", async ({ page }) => {
    await page.goto("/kasse");
    await fillEverything(page);

    await page.getByTestId("checkout-continue").click();

    await expect(page).toHaveURL(/\/experiment$/);
    await expect(page.getByTestId("safety-notice")).toBeVisible();
  });

  test("hat kein Formular und keinen Absende-Button", async ({ page }) => {
    await page.goto("/kasse");

    await expect(page.locator("form")).toHaveCount(0);
    await expect(page.locator('button[type="submit"], input[type="submit"]')).toHaveCount(0);
    // Kein Feld trägt einen name, über den es abgeschickt werden könnte.
    await expect(page.locator("input[name]")).toHaveCount(0);
  });

  test("verwendet keine Feldtypen, die Browser-Autofill auslösen", async ({ page }) => {
    await page.goto("/kasse");

    await expect(
      page.locator('input[type="email"], input[type="tel"], input[type="password"]'),
    ).toHaveCount(0);

    const autocompletes = await page
      .locator("input")
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("autocomplete")));
    expect(autocompletes.every((value) => value === "off")).toBe(true);
  });

  test("schickt beim Tippen und beim Weiter nichts nach draussen", async ({ page, baseURL }) => {
    const external: string[] = [];
    const posts: string[] = [];

    page.on("request", (request) => {
      const url = request.url();
      if (request.method() !== "GET") posts.push(`${request.method()} ${url}`);
      if (url.startsWith("data:") || url.startsWith("blob:")) return;
      if (baseURL && url.startsWith(baseURL)) return;
      external.push(url);
    });

    await page.goto("/kasse", { waitUntil: "networkidle" });
    await fillEverything(page);
    await page.waitForTimeout(500);
    await page.getByTestId("checkout-continue").click();
    await page.waitForURL(/\/experiment$/);

    expect(external, "externe Anfragen").toEqual([]);
    expect(posts, "abgeschickte Daten").toEqual([]);
  });

  test("speichert nichts von dem, was eingetippt wurde", async ({ page }) => {
    await page.goto("/kasse");
    await fillEverything(page);
    await page.getByTestId("checkout-continue").click();
    await page.waitForURL(/\/experiment$/);

    const stored = await page.evaluate(() => ({
      local: Object.entries({ ...window.localStorage }),
      session: Object.entries({ ...window.sessionStorage }),
      cookies: document.cookie,
    }));

    // Nur der Warenkorb darf im Speicher liegen.
    for (const [key] of stored.local) {
      expect(key).toBe("kofferwerk-auenfels.cart.v1");
    }
    expect(stored.session).toEqual([]);
    expect(stored.cookies).toBe("");

    const dump = JSON.stringify(stored);
    for (const [, value] of ADDRESS_FIELDS) {
      expect(dump, `"${value}" darf nirgends gespeichert sein`).not.toContain(value);
    }
  });

  test("verliert das Eingetippte beim Neuladen", async ({ page }) => {
    await page.goto("/kasse");
    await fillEverything(page);
    await page.reload();

    for (const [selector] of ADDRESS_FIELDS) {
      await expect(page.locator(selector)).toHaveValue("");
    }
  });

  test("hält jeden weiteren Bestellschritt gesperrt", async ({ request }) => {
    for (const route of ["/kasse/zahlung", "/kasse/bestaetigung", "/checkout", "/bestellung"]) {
      const response = await request.get(route, { maxRedirects: 0 });
      expect(response.status(), route).toBe(307);
      expect(response.headers().location, route).toContain("/experiment");
    }
  });
});

test.describe("Newsletter", () => {
  test("zeigt ein Anmeldefeld, das nicht funktioniert", async ({ page }) => {
    await page.goto("/newsletter");

    await page.fill("#feld-newsletter", "erika@example.org");
    await page.getByTestId("newsletter-submit").click();

    await expect(page.getByTestId("newsletter-error")).toBeVisible();
    await expect(page.getByTestId("newsletter-error")).toContainText("nicht möglich");
    // Die Seite bleibt, wo sie ist: nichts wurde abgeschickt.
    await expect(page).toHaveURL(/\/newsletter$/);
  });

  test("schickt die eingetippte Adresse nirgendwohin", async ({ page, baseURL }) => {
    const external: string[] = [];
    const posts: string[] = [];

    page.on("request", (request) => {
      const url = request.url();
      if (request.method() !== "GET") posts.push(`${request.method()} ${url}`);
      if (url.startsWith("data:") || url.startsWith("blob:")) return;
      if (baseURL && url.startsWith(baseURL)) return;
      external.push(url);
    });

    await page.goto("/newsletter", { waitUntil: "networkidle" });
    await page.fill("#feld-newsletter", "erika@example.org");
    await page.getByTestId("newsletter-submit").click();
    await page.waitForTimeout(500);

    expect(external).toEqual([]);
    expect(posts).toEqual([]);

    const stored = await page.evaluate(() =>
      JSON.stringify({ ...window.localStorage, ...window.sessionStorage, c: document.cookie }),
    );
    expect(stored).not.toContain("erika@example.org");
  });

  test("hat kein Formular und löst kein Autofill aus", async ({ page }) => {
    await page.goto("/newsletter");

    await expect(page.locator("form")).toHaveCount(0);
    await expect(page.locator('input[type="email"]')).toHaveCount(0);
    await expect(page.locator("input[name]")).toHaveCount(0);
    await expect(page.locator("#feld-newsletter")).toHaveAttribute("autocomplete", "off");
  });
});
