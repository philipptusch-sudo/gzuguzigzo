import "server-only";

/**
 * Real-world identity of the people running this experiment.
 *
 * These values are the only non-fictional facts on the site. They are read
 * from the hosting environment and are deliberately NOT stored in the
 * repository, so that a clone of this code cannot be deployed under someone
 * else's name. The reveal page at `/experiment` is the only place they appear.
 */

export type Operator = {
  readonly name: string;
  readonly legalForm: string;
  readonly address: string;
  readonly email: string;
  readonly projectDescription: string;
  readonly pressEmail: string;
  /** Link to the published report, once it exists. */
  readonly reportUrl: string | null;
};

/** Environment variables without which a production build must not succeed. */
export const REQUIRED_OPERATOR_ENV_VARS = [
  "REAL_OPERATOR_NAME",
  "REAL_OPERATOR_LEGAL_FORM",
  "REAL_OPERATOR_ADDRESS",
  "REAL_OPERATOR_EMAIL",
  "REAL_PROJECT_DESCRIPTION",
] as const;

export type RequiredOperatorEnvVar = (typeof REQUIRED_OPERATOR_ENV_VARS)[number];

/** Returns the names of every required variable that is missing or blank. */
export function findMissingOperatorEnvVars(
  env: Record<string, string | undefined>,
): RequiredOperatorEnvVar[] {
  return REQUIRED_OPERATOR_ENV_VARS.filter((key) => {
    const value = env[key];
    return typeof value !== "string" || value.trim() === "";
  });
}

export function missingOperatorEnvMessage(missing: readonly string[]): string {
  return [
    "Die Auflösungsseite /experiment kann ohne die realen Betreiberangaben nicht ausgeliefert werden.",
    `Fehlende Umgebungsvariablen: ${missing.join(", ")}.`,
    "Siehe .env.example und README.md. Ein Produktionsbuild ohne diese Angaben ist nicht zulässig,",
    "weil der Shop sonst ohne Auflösung erreichbar wäre.",
  ].join(" ");
}

/**
 * Reads the operator identity. Throws when anything required is missing --
 * an incomplete reveal page is a safety failure, not a cosmetic one.
 */
export function getOperator(): Operator {
  const env = process.env;
  const missing = findMissingOperatorEnvVars(env);

  if (missing.length > 0) {
    throw new Error(missingOperatorEnvMessage(missing));
  }

  const email = (env.REAL_OPERATOR_EMAIL as string).trim();
  const reportUrl = env.REAL_REPORT_URL?.trim();

  return {
    name: (env.REAL_OPERATOR_NAME as string).trim(),
    legalForm: (env.REAL_OPERATOR_LEGAL_FORM as string).trim(),
    address: (env.REAL_OPERATOR_ADDRESS as string).trim(),
    email,
    projectDescription: (env.REAL_PROJECT_DESCRIPTION as string).trim(),
    pressEmail: env.REAL_PRESS_EMAIL?.trim() || email,
    reportUrl: reportUrl && reportUrl.length > 0 ? reportUrl : null,
  };
}

/** Public reference used on the reveal page. */
export const FAKESHOP_FINDER_URL = "https://www.verbraucherzentrale.de/fakeshopfinder-71560";
