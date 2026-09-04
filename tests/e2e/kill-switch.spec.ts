import { spawn, type ChildProcess } from "node:child_process";
import { expect, request as playwrightRequest, test } from "@playwright/test";

/**
 * The kill switch is verified against its own server process, started with
 * `SITE_ENABLED=false` and no rebuild, because that is exactly how it will be
 * flipped in the hosting environment during a live test.
 */

const PORT = Number(process.env.E2E_KILL_SWITCH_PORT ?? 3199);
const BASE_URL = `http://127.0.0.1:${PORT}`;

let server: ChildProcess | undefined;

async function waitForServer(url: string, timeoutMs = 90_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  const context = await playwrightRequest.newContext();

  try {
    while (Date.now() < deadline) {
      try {
        const response = await context.get(url, { timeout: 2_000, maxRedirects: 0 });
        if (response.status() > 0) return;
      } catch {
        // not up yet
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  } finally {
    await context.dispose();
  }

  throw new Error(`Server auf ${url} ist nicht gestartet.`);
}

test.beforeAll(async () => {
  server = spawn("pnpm", ["exec", "next", "start", "-p", String(PORT)], {
    env: {
      ...process.env,
      SITE_ENABLED: "false",
      REAL_OPERATOR_NAME: "E2E Test Operator",
      REAL_OPERATOR_LEGAL_FORM: "Einzelunternehmen",
      REAL_OPERATOR_ADDRESS: "Teststrasse 1, 12345 Teststadt",
      REAL_OPERATOR_EMAIL: "e2e@example.org",
      REAL_PROJECT_DESCRIPTION: "Automatisierter End-to-End-Test.",
    },
    stdio: "ignore",
  });

  await waitForServer(`${BASE_URL}/experiment`);
});

test.afterAll(() => {
  server?.kill("SIGTERM");
});

test.describe("Kill-Switch", () => {
  for (const route of ["/", "/kollektion", "/koffer/auenfels-kabine-38", "/faq", "/warenkorb"]) {
    test(`${route} wird bei SITE_ENABLED=false auf die Auflösung geleitet`, async () => {
      const context = await playwrightRequest.newContext({ baseURL: BASE_URL });
      try {
        const response = await context.get(route, { maxRedirects: 0 });

        expect(response.status()).toBe(307);
        expect(response.headers().location).toContain("/experiment");
      } finally {
        await context.dispose();
      }
    });
  }

  test("die Auflösungsseite bleibt bei abgeschaltetem Shop erreichbar", async () => {
    const context = await playwrightRequest.newContext({ baseURL: BASE_URL });
    try {
      const response = await context.get("/experiment", { maxRedirects: 0 });

      expect(response.status()).toBe(200);
      expect(await response.text()).toContain("Verbraucherschutzexperiments");
    } finally {
      await context.dispose();
    }
  });
});
