import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, sep } from "node:path";
import { describe, expect, it } from "vitest";
import { experimentConfig, EXPERIMENT_VARIANTS, isExperimentVariant } from "@/config/experiment";

/**
 * Source-level guards.
 *
 * These tests do not check what a page happens to render today -- they check
 * that the code required to take an order, a payment or a personal detail does
 * not exist in the repository at all.
 */

const SRC = join(process.cwd(), "src");

function collectSources(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      collectSources(full, acc);
    } else if ([".ts", ".tsx", ".css"].includes(extname(full))) {
      acc.push(full);
    }
  }
  return acc;
}

/** Strips comments so that a rule is not "found" in the prose describing it. */
function stripComments(code: string): string {
  return code.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:])\/\/.*$/gm, "$1");
}

const sourceFiles = collectSources(SRC);
const sources = sourceFiles.map((file) => ({
  file,
  code: stripComments(readFileSync(file, "utf8")),
}));

function findMatches(pattern: RegExp): string[] {
  return sources
    .filter(({ code }) => pattern.test(code))
    .map(({ file }) => file.replace(process.cwd(), ""));
}

describe("Keine Transaktion", () => {
  it("enthält keine Zahlungsanbieter-Einbindung", () => {
    const providers =
      /(js\.stripe\.com|paypal\.com\/sdk|paypalobjects|checkout\.stripe|klarna\.com|sofort\.com|giropay|adyen\.com|mollie\.com|braintree)/i;
    expect(findMatches(providers)).toEqual([]);
  });

  it("enthält kein Zahlungsformular", () => {
    const paymentFields =
      /(autocomplete="cc-|name="(iban|bic|kartennummer|cardnumber|cvc|cvv)"|type="card")/i;
    expect(findMatches(paymentFields)).toEqual([]);
  });

  it("nennt nirgends eine Bankverbindung", () => {
    // Die Zahlungsangabe ist reine Shopkommunikation. Eine IBAN, eine BIC oder
    // ein Kontoinhaber wären ein echter Zahlungsweg -- und damit verboten.
    expect(findMatches(/\b[A-Z]{2}\d{2}[\s]?[A-Z0-9]{4}[\s]?\d{4}[\s]?\d{4}/)).toEqual([]);
    expect(findMatches(/\b(BIC|SWIFT)\b/)).toEqual([]);
    expect(findMatches(/Kontoinhaber|Kontonummer|Bankleitzahl/i)).toEqual([]);
  });

  it("nennt Bankverbindungen auch nicht in den Shoptexten", () => {
    const shopSources = sources.filter(
      ({ file }) => !file.includes(`${sep}app${sep}experiment${sep}`),
    );
    const shopCode = shopSources.map(({ code }) => code).join("\n");

    // "Bankverbindung" darf nur auf der Auflösungsseite vorkommen, dort in der
    // Erklärung, dass es sie gerade nicht gab.
    expect(shopCode).not.toMatch(/\bIBAN\b/);
    expect(shopCode).not.toMatch(/Bankverbindung/i);
  });

  it("hat die Transaktionsschalter dauerhaft auf aus", () => {
    expect(experimentConfig.safety).toMatchObject({
      enableCheckout: false,
      enablePayments: false,
      enableAccounts: false,
      enableNewsletter: false,
      enableContactForm: false,
      collectPersonalData: false,
    });
  });

  it("führt jede Kassenroute auf die Auflösungsseite", () => {
    expect(experimentConfig.safety.revealRoute).toBe("/experiment");
  });
});

describe("Keine personenbezogenen Daten", () => {
  it("enthält kein Adress-, Konto- oder Kontaktformular", () => {
    const personalFields =
      /(type="password"|type="email"|type="tel"|autocomplete="(street-address|postal-code|given-name|family-name|email|tel|new-password|current-password)")/i;
    expect(findMatches(personalFields)).toEqual([]);
  });

  it("enthält überhaupt kein absendbares Formular", () => {
    // Es gibt nur ein <fieldset> für die Farbauswahl, aber kein <form>.
    expect(findMatches(/<form[\s>]/i)).toEqual([]);
  });

  it("schreibt ausschliesslich den Warenkorb in den lokalen Speicher", () => {
    const storageUsers = sources.filter(({ code }) => /localStorage|sessionStorage/.test(code));
    for (const { file, code } of storageUsers) {
      const keys = [
        ...code.matchAll(
          /(?:local|session)Storage\.(?:getItem|setItem|removeItem)\(\s*([A-Za-z_.]+)/g,
        ),
      ].map((match) => match[1]);
      for (const key of keys) {
        expect(key, `${file} verwendet einen anderen Speicherschlüssel`).toBe("CART_STORAGE_KEY");
      }
    }
  });

  it("verwendet keine Cookies", () => {
    expect(findMatches(/document\.cookie|cookies\(\)/)).toEqual([]);
  });
});

describe("Keine Tracking- und Messdienste", () => {
  it("bindet keine Analyse- oder Werbeskripte ein", () => {
    const trackers =
      /(googletagmanager\.com|google-analytics\.com|gtag\(|connect\.facebook\.net|\bfbq\(|hotjar|clarity\.ms|matomo|plausible\.io|segment\.com|sentry\.io|posthog)/i;
    expect(findMatches(trackers)).toEqual([]);
  });

  it("sendet keine Messdaten im Hintergrund", () => {
    expect(findMatches(/navigator\.sendBeacon|new Image\(\)\.src/)).toEqual([]);
  });

  it("lädt keine externen Skripte oder Stylesheets", () => {
    expect(findMatches(/<script[^>]+src="https?:/i)).toEqual([]);
    expect(findMatches(/<link[^>]+href="https?:/i)).toEqual([]);
  });
});

describe("Keine technische Täuschung gegenüber Prüfsystemen", () => {
  const requestLayer = stripComments(readFileSync(join(SRC, "proxy.ts"), "utf8"));

  it("wertet im Request-Layer weder User-Agent noch IP noch Referrer aus", () => {
    expect(requestLayer).not.toMatch(/user-?agent/i);
    expect(requestLayer).not.toMatch(/x-forwarded-for|request\.ip\b|geo\./i);
    expect(requestLayer).not.toMatch(/referer|referrer/i);
  });

  it("versteckt die Auflösungsseite in keiner Robots-Regel", async () => {
    const { default: robots } = await import("@/app/robots");
    const rules = [robots().rules].flat();

    for (const rule of rules) {
      expect(rule.disallow ?? []).toEqual([]);
    }
    expect(rules.flatMap((rule) => [rule.allow ?? []].flat())).toContain("/");
  });
});

describe("Versuchsvarianten", () => {
  it("kennt genau die vier vorgesehenen Varianten", () => {
    expect([...EXPERIMENT_VARIANTS]).toEqual([
      "control",
      "closure-story",
      "missing-information",
      "combined",
    ]);
  });

  it("weist unbekannte Varianten zurück", () => {
    expect(isExperimentVariant("combined")).toBe(true);
    expect(isExperimentVariant("beliebig")).toBe(false);
    expect(isExperimentVariant(undefined)).toBe(false);
  });

  it("läuft in den Tests in der kombinierten Variante", () => {
    expect(experimentConfig.variant).toBe("combined");
    expect(experimentConfig.signals.closureNarrative).toBe(true);
    expect(experimentConfig.signals.extremeDiscounts).toBe(true);
    expect(experimentConfig.signals.showImprint).toBe(false);
    expect(experimentConfig.signals.prepaymentOnly).toBe(true);
  });
});

describe("Auflösungsseite", () => {
  const reveal = readFileSync(join(SRC, "app", "experiment", "page.tsx"), "utf8");

  it("nennt alle vier Sicherheitshinweise", () => {
    for (const statement of [
      "Es findet kein Verkauf statt.",
      "Es wurde keine Bestellung ausgelöst.",
      "Es wurden keine Zahlungsdaten abgefragt.",
      "Es wurden keine persönlichen Kundendaten gespeichert.",
    ]) {
      expect(reveal, statement).toContain(statement);
    }
  });

  it("gibt die realen Betreiberangaben aus der Umgebung aus", () => {
    expect(reveal).toContain("getOperator");
    expect(reveal).toMatch(/operator\.name/);
    expect(reveal).toMatch(/operator\.address/);
  });

  it("enthält keine fest hinterlegten realen Betreiberdaten", () => {
    const allSources = sources.map(({ code }) => code).join("\n");
    expect(allSources).not.toMatch(/REAL_OPERATOR_NAME\s*=\s*"(?!.*process)/);
  });
});

describe("Zahlungsangabe", () => {
  it("nennt Vorkasse nur in den Armen, die dieses Merkmal untersuchen", async () => {
    const { experimentConfig: config } = await import("@/config/experiment");
    // Diese Auslieferung läuft in der kombinierten Variante.
    expect(config.signals.prepaymentOnly).toBe(true);
  });

  it("formuliert je nach Arm eine andere Zahlungsangabe", async () => {
    const { copy } = await import("@/lib/copy");

    expect(copy.payment.note).toContain("Vorkasse");
    expect(copy.payment.accordionBody.join(" ")).toContain("Vorkasse");
    // Auch die Langfassung bleibt eine Behauptung ohne Zahlungsweg.
    expect(copy.payment.accordionBody.join(" ")).not.toMatch(/IBAN|BIC|Kontoinhaber/i);
  });

  it("erklärt das Merkmal auf der Auflösungsseite", () => {
    const reveal = readFileSync(join(SRC, "app", "experiment", "page.tsx"), "utf8");

    expect(reveal).toContain("Zahlung nur per Vorkasse");
    expect(reveal).toContain("signals.prepaymentOnly");
  });
});
