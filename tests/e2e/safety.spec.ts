import { expect, test } from "@playwright/test";

const CHECKOUT_ROUTES = [
  "/checkout",
  "/kasse",
  "/payment",
  "/bestellung",
  "/zahlung",
  "/warenkorb/kasse",
  "/checkout/adresse",
];

const SHOP_ROUTES = ["/", "/kollektion", "/koffer/auenfels-kabine-38", "/faq", "/warenkorb"];

const SAFETY_STATEMENTS = [
  "Es findet kein Verkauf statt.",
  "Es wurde keine Bestellung ausgelöst.",
  "Es wurden keine Zahlungsdaten abgefragt.",
  "Es wurden keine persönlichen Kundendaten gespeichert.",
];

test.describe("Kassenrouten", () => {
  for (const route of CHECKOUT_ROUTES) {
    test(`${route} leitet serverseitig auf /experiment`, async ({ request }) => {
      const response = await request.get(route, { maxRedirects: 0 });

      expect(response.status()).toBe(307);
      expect(response.headers().location).toContain("/experiment");
    });
  }

  test("die Auflösung erscheint nach der Weiterleitung im Browser", async ({ page }) => {
    await page.goto("/checkout");

    await expect(page).toHaveURL(/\/experiment$/);
    await expect(page.getByTestId("safety-notice")).toBeVisible();
  });
});

test.describe("Keine Formulare für Zahlung, Adresse oder Konto", () => {
  for (const route of [...SHOP_ROUTES, "/experiment"]) {
    test(`${route} enthält kein absendbares Formular`, async ({ page }) => {
      await page.goto(route);

      await expect(page.locator("form")).toHaveCount(0);
      await expect(
        page.locator(
          'input[type="password"], input[type="email"], input[type="tel"], input[name*="iban" i], input[autocomplete^="cc-"], input[autocomplete*="street" i], input[autocomplete*="postal" i]',
        ),
      ).toHaveCount(0);
    });
  }

  test("bietet weder Konto noch Newsletter an", async ({ page }) => {
    await page.goto("/");
    const text = (await page.locator("body").innerText()).toLowerCase();

    for (const forbidden of [
      "anmelden",
      "registrieren",
      "kundenkonto",
      "newsletter",
      "einloggen",
    ]) {
      expect(text, `Startseite darf ${forbidden} nicht anbieten`).not.toContain(forbidden);
    }
  });

  test("hat im Warenkorb ausser der Mengenwahl kein Eingabefeld", async ({ page }) => {
    await page.goto("/koffer/auenfels-kabine-38");
    await page.getByTestId("add-to-cart").click();
    await page.goto("/warenkorb");

    await expect(page.locator("input")).toHaveCount(0);
  });
});

test.describe("Keine externen Anfragen", () => {
  for (const route of [...SHOP_ROUTES, "/experiment"]) {
    test(`${route} lädt ausschliesslich eigene Ressourcen`, async ({ page, baseURL }) => {
      const external: string[] = [];

      page.on("request", (request) => {
        const url = request.url();
        if (url.startsWith("data:") || url.startsWith("blob:")) return;
        if (baseURL && url.startsWith(baseURL)) return;
        external.push(url);
      });

      await page.goto(route, { waitUntil: "networkidle" });

      expect(external, `externe Anfragen auf ${route}`).toEqual([]);
    });
  }
});

test.describe("Sicherheitskopfzeilen", () => {
  test("liefert Content-Security-Policy und Schutzkopfzeilen aus", async ({ request }) => {
    const headers = (await request.get("/")).headers();

    expect(headers["content-security-policy"]).toContain("default-src 'self'");
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["content-security-policy"]).toMatch(/script-src [^;]*'nonce-/);
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("no-referrer");
    expect(headers["x-powered-by"]).toBeUndefined();
  });
});

test.describe("Indexierung", () => {
  for (const route of SHOP_ROUTES) {
    test(`${route} ist auf noindex gesetzt`, async ({ page }) => {
      const response = await page.goto(route);

      expect(response?.headers()["x-robots-tag"]).toBe("noindex, follow");
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        "noindex, follow",
      );
    });
  }

  test("die Auflösungsseite bleibt für Crawler erreichbar", async ({ page }) => {
    const response = await page.goto("/experiment");

    expect(response?.headers()["x-robots-tag"]).toBe("index, follow");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
  });

  test("robots.txt sperrt die Auflösungsseite nicht aus", async ({ request }) => {
    const body = await (await request.get("/robots.txt")).text();

    expect(body).toContain("Allow: /");
    expect(body.toLowerCase()).not.toContain("disallow");
    expect(body).not.toContain("/experiment");
  });
});

test.describe("Auflösungsseite", () => {
  test("nennt alle vier Sicherheitshinweise", async ({ page }) => {
    await page.goto("/experiment");
    const notice = page.getByTestId("safety-notice");

    for (const statement of SAFETY_STATEMENTS) {
      await expect(notice.getByText(statement, { exact: true })).toBeVisible();
    }
  });

  test("erklärt die eingebauten Warnzeichen", async ({ page }) => {
    await page.goto("/experiment");
    const text = await page.locator("main").innerText();

    for (const signal of [
      "Ungewöhnlich hohe Rabatte",
      "Erfundene Markenhistorie",
      "Erfundene Geschäftsaufgabe",
      "Fehlende Anbieterkennzeichnung",
      "Fehlende Kontaktadresse",
      "Fehlende Widerrufsinformationen",
      "Fehlende Versandinformationen",
      "Neue Shop-Domain",
    ]) {
      expect(text, `Warnzeichen fehlt: ${signal}`).toContain(signal);
    }
  });

  test("nennt die realen Projektverantwortlichen aus der Umgebung", async ({ page }) => {
    await page.goto("/experiment");
    const operator = page.getByTestId("operator");

    await expect(operator).toContainText("E2E Test Operator");
    await expect(operator).toContainText("Teststrasse 1, 12345 Teststadt");
    await expect(operator).toContainText("e2e@example.org");
  });

  test("verweist auf den Fakeshop-Finder der Verbraucherzentrale", async ({ page }) => {
    await page.goto("/experiment");

    await expect(page.getByRole("link", { name: /Fakeshop-Finder/ }).first()).toHaveAttribute(
      "href",
      /verbraucherzentrale\.de/,
    );
  });
});

test.describe("Bewusst fehlende Seiten in der kombinierten Variante", () => {
  for (const route of [
    "/impressum",
    "/kontakt",
    "/ueber-uns",
    "/versand",
    "/versandkosten",
    "/agb",
    "/widerruf",
    "/datenschutz",
    "/retoure",
  ]) {
    test(`${route} existiert nicht`, async ({ request }) => {
      expect((await request.get(route)).status()).toBe(404);
    });
  }
});
