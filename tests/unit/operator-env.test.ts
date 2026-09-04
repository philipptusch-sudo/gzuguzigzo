import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  REQUIRED_OPERATOR_ENV_VARS,
  findMissingOperatorEnvVars,
  missingOperatorEnvMessage,
} from "@/config/operator";

const GATE = "scripts/check-operator-env.mjs";

const COMPLETE_ENV = {
  REAL_OPERATOR_NAME: "Test Betreiber",
  REAL_OPERATOR_LEGAL_FORM: "Einzelunternehmen",
  REAL_OPERATOR_ADDRESS: "Teststrasse 1, 12345 Teststadt",
  REAL_OPERATOR_EMAIL: "test@example.org",
  REAL_PROJECT_DESCRIPTION: "Testbeschreibung",
};

function runGate(env: Record<string, string>): { status: number; stderr: string } {
  try {
    execFileSync("node", [GATE], {
      // NODE_ENV is required by the Next.js ProcessEnv typing.
      env: { PATH: process.env.PATH ?? "", NODE_ENV: "test" as const, ...env },
      encoding: "utf8",
      stdio: "pipe",
    });
    return { status: 0, stderr: "" };
  } catch (error) {
    const err = error as { status?: number; stderr?: string };
    return { status: err.status ?? 1, stderr: err.stderr ?? "" };
  }
}

describe("Betreiberangaben", () => {
  it("erkennt fehlende und leere Variablen", () => {
    expect(findMissingOperatorEnvVars({})).toEqual([...REQUIRED_OPERATOR_ENV_VARS]);
    expect(findMissingOperatorEnvVars({ ...COMPLETE_ENV })).toEqual([]);
    expect(findMissingOperatorEnvVars({ ...COMPLETE_ENV, REAL_OPERATOR_EMAIL: "   " })).toEqual([
      "REAL_OPERATOR_EMAIL",
    ]);
  });

  it("benennt die fehlenden Variablen in der Fehlermeldung", () => {
    const message = missingOperatorEnvMessage(["REAL_OPERATOR_NAME"]);
    expect(message).toContain("REAL_OPERATOR_NAME");
    expect(message).toContain("/experiment");
  });
});

describe("Produktionsbuild ohne Betreiberangaben", () => {
  it("bricht ab, wenn die realen Betreiberangaben fehlen", () => {
    const result = runGate({});

    expect(result.status).toBe(1);
    for (const key of REQUIRED_OPERATOR_ENV_VARS) {
      expect(result.stderr).toContain(key);
    }
  });

  it("bricht auch ab, wenn nur eine Variable fehlt", () => {
    const { REAL_OPERATOR_ADDRESS: _omitted, ...incomplete } = COMPLETE_ENV;
    const result = runGate(incomplete);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("REAL_OPERATOR_ADDRESS");
  });

  it("läuft durch, wenn alle Angaben vorhanden sind", () => {
    expect(runGate(COMPLETE_ENV).status).toBe(0);
  });

  it("ist im Build-Skript verdrahtet", () => {
    const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
      scripts: Record<string, string>;
    };
    expect(pkg.scripts.build).toContain(GATE);
    expect(pkg.scripts.build).toContain("next build");
  });

  it("prüft im Skript dieselben Variablen wie die Anwendung", () => {
    const source = readFileSync(GATE, "utf8");
    const block = source.match(/const REQUIRED_OPERATOR_ENV_VARS = \[([\s\S]*?)\];/)?.[1] ?? "";
    const inScript = [...block.matchAll(/"([A-Z_]+)"/g)].map((match) => match[1]);

    expect(inScript).toEqual([...REQUIRED_OPERATOR_ENV_VARS]);
  });
});
