#!/usr/bin/env node
/**
 * Build gate for the reveal page.
 *
 * `/experiment` is the only thing that makes this simulation ethically
 * defensible: it tells every visitor that the shop is fictional and who is
 * really running it. Those facts come from the environment, so a production
 * build without them would publish a fake shop with no way out. This script
 * runs before `next build` and fails the build in that case.
 *
 * Keep this list in sync with REQUIRED_OPERATOR_ENV_VARS in
 * `src/config/operator.ts` -- `tests/unit/operator-env.test.ts` enforces that.
 */

const REQUIRED_OPERATOR_ENV_VARS = [
  "REAL_OPERATOR_NAME",
  "REAL_OPERATOR_LEGAL_FORM",
  "REAL_OPERATOR_ADDRESS",
  "REAL_OPERATOR_EMAIL",
  "REAL_PROJECT_DESCRIPTION",
];

const missing = REQUIRED_OPERATOR_ENV_VARS.filter((key) => {
  const value = process.env[key];
  return typeof value !== "string" || value.trim() === "";
});

if (missing.length > 0) {
  console.error("\n  Produktionsbuild abgebrochen.\n");
  console.error(
    "  Die Auflösungsseite /experiment benötigt die realen Betreiberangaben.\n" +
      "  Ohne sie wäre der Shop ohne Auflösung erreichbar.\n",
  );
  console.error(`  Fehlende Umgebungsvariablen:\n${missing.map((k) => `    - ${k}`).join("\n")}\n`);
  console.error("  Siehe .env.example und README.md.\n");
  process.exit(1);
}

console.log(`Betreiberangaben vollständig (${REQUIRED_OPERATOR_ENV_VARS.length} Variablen).`);
