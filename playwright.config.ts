import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3100);
const baseURL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${PORT}`;

/**
 * The e2e suite runs against a production build so that `src/proxy.ts`
 * (checkout redirects, kill switch, CSP) is exercised the same way it will be
 * in the deployed experiment.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "line" : "list",
  timeout: 30_000,
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  /*
   * `PLAYWRIGHT_CHROMIUM_PATH` lets the suite run against a Chromium that is
   * already present on the machine (CI images, sandboxes) instead of the build
   * pinned by @playwright/test. Unset, Playwright uses its own download.
   */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(process.env.PLAYWRIGHT_CHROMIUM_PATH
          ? { launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH } }
          : {}),
      },
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `pnpm run build && pnpm exec next start -p ${PORT}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        env: {
          SITE_ENABLED: "true",
          NEXT_PUBLIC_EXPERIMENT_VARIANT: "combined",
          REAL_OPERATOR_NAME: "E2E Test Operator",
          REAL_OPERATOR_LEGAL_FORM: "Einzelunternehmen",
          REAL_OPERATOR_ADDRESS: "Teststrasse 1, 12345 Teststadt",
          REAL_OPERATOR_EMAIL: "e2e@example.org",
          REAL_PROJECT_DESCRIPTION:
            "Automatisierter End-to-End-Test des Verbraucherschutzexperiments.",
        },
      },
});
