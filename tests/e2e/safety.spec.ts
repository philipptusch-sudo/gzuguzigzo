import { expect, test } from "@playwright/test";

const CHECKOUT_ROUTES = [
  "/checkout",
  "/payment",
  "/bestellung",
  "/zahlung",
  "/warenkorb/kasse",
  "/checkout/adresse",
  "/kasse/zahlung",
  "/kasse/bestaetigung",
];

const SHOP_ROUTES = [
  "/",
  "/kollektion",
  "/koffer/auenfels-kabine-38",
  "/faq",
  "/warenkorb",
  "/kasse",
  "/newsletter",
];

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
      await expect(page.locator('button[type="submit"], input[type="submit"]')).toHaveCount(0);
      await expect(page.locator("input[name]")).toHaveCount(0);
      await expect(
        page.locator(
          'input[type="password"], input[type="email"], input[type="tel"], input[name*="iban" i], input[autocomplete^="cc-"], input[autocomplete*="street" i], input[autocomplete*="postal" i]',
        ),
      ).toHaveCount(0);
    });
  }

  test("nennt auf keiner Shopseite eine Bankverbindung", async ({ page }) => {
    for (const route of SHOP_ROUTES) {
      await page.goto(route);
      const text = await page.locator("body").innerText();

      expect(text, `${route} nennt eine IBAN`).not.toMatch(
        /[A-Z]{2}\d{2}\s?[A-Z0-9]{4}\s?\d{4}\s?\d{4}/,
      );
      expect(text, `${route} nennt IBAN oder BIC`).not.toMatch(/\b(IBAN|BIC|Kontoinhaber)\b/i);
    }
  });

  test("bietet kein Kundenkonto an", async ({ page }) => {
    await page.goto("/");
    const text = (await page.locator("body").innerText()).toLowerCase();

    // Der Newsletter-Link darf vorkommen; das Feld dahinter ist eine Attrappe.
    for (const forbidden of ["registrieren", "kundenkonto", "einloggen", "mein konto"]) {
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

  test("die Auflösungsseite ist ebenfalls auf noindex gesetzt", async ({ page }) => {
    const response = await page.goto("/experiment");

    expect(response?.headers()["x-robots-tag"]).toBe("noindex, follow");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
  });

  test("robots.txt sperrt die Auflösungsseite für jeden Crawler", async ({ request }) => {
    const body = await (await request.get("/robots.txt")).text();

    expect(body).toContain("Allow: /");
    expect(body).toContain("Disallow: /experiment");
  });

  test("robots.txt lässt OpenAI und die Prüfsysteme den Shop crawlen", async ({ request }) => {
    const body = await (await request.get("/robots.txt")).text();

    // Für den ChatGPT-Anzeigentest muss OpenAI den Shop abrufen dürfen.
    for (const bot of ["GPTBot", "OAI-SearchBot", "ChatGPT-User"]) {
      expect(body, `OpenAI-Crawler fehlt: ${bot}`).toContain(bot);
    }
    // Such- und Werbesysteme werden gar nicht erst erwähnt, laufen also über "*".
    for (const allowed of ["Googlebot", "AdsBot-Google", "bingbot", "facebookexternalhit"]) {
      expect(body, `darf nicht gesperrt sein: ${allowed}`).not.toContain(allowed);
    }
  });

  test("robots.txt hält die übrigen KI-Crawler von der ganzen Seite fern", async ({ request }) => {
    const body = await (await request.get("/robots.txt")).text();

    for (const bot of ["ClaudeBot", "CCBot", "Google-Extended", "PerplexityBot"]) {
      expect(body, `KI-Crawler fehlt: ${bot}`).toContain(bot);
    }
  });
});

test.describe("Auflösungsseite", () => {
  test("wird jeder Kennung identisch ausgeliefert", async ({ playwright, baseURL }) => {
    // Die Crawler-Sperre ist eine Anweisung in robots.txt, keine
    // Zugangsbeschränkung: Wer /experiment abruft, bekommt dieselbe Seite --
    // Mensch, Suchmaschine, Prüfsystem oder ausgesperrter KI-Crawler.
    const agents = [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Mozilla/5.0 (compatible; GPTBot/1.0; +https://openai.com/gptbot)",
      "Mozilla/5.0 (compatible; ClaudeBot/1.0)",
      "AdsBot-Google (+http://www.google.com/adsbot.html)",
    ];

    const bodies: string[] = [];
    for (const userAgent of agents) {
      const context = await playwright.request.newContext({
        baseURL,
        extraHTTPHeaders: { "User-Agent": userAgent },
      });
      const response = await context.get("/experiment");
      expect(response.status(), userAgent).toBe(200);
      bodies.push(await response.text());
      await context.dispose();
    }

    for (const body of bodies) {
      expect(body).toBe(bodies[0]);
      expect(body).toContain("Es findet kein Verkauf statt.");
    }
  });

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
      "Zahlung nur per Vorkasse",
      "Fehlende Anbieterkennzeichnung",
      "Fehlende Kontaktadresse",
      "Fehlende Widerrufsinformationen",
      "Fehlende Versandinformationen",
      "Kasse und Newsletter ohne Funktion",
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
