/**
 * Central configuration of the consumer-protection experiment.
 *
 * Everything that differs between the four experiment arms is derived from a
 * single environment variable so that no variant logic is scattered across the
 * component tree. Content must never change while a test run is live -- the
 * variant is fixed at build/deploy time, never at request time and never per
 * visitor.
 */

export type ExperimentVariant = "control" | "closure-story" | "missing-information" | "combined";

export const EXPERIMENT_VARIANTS: readonly ExperimentVariant[] = [
  "control",
  "closure-story",
  "missing-information",
  "combined",
] as const;

export function isExperimentVariant(value: unknown): value is ExperimentVariant {
  return typeof value === "string" && (EXPERIMENT_VARIANTS as readonly string[]).includes(value);
}

const rawVariant = process.env.NEXT_PUBLIC_EXPERIMENT_VARIANT;

if (rawVariant !== undefined && rawVariant !== "" && !isExperimentVariant(rawVariant)) {
  throw new Error(
    `NEXT_PUBLIC_EXPERIMENT_VARIANT ist auf "${rawVariant}" gesetzt. ` +
      `Erlaubt sind: ${EXPERIMENT_VARIANTS.join(", ")}.`,
  );
}

const variant: ExperimentVariant = isExperimentVariant(rawVariant) ? rawVariant : "combined";

/** Which shop signals ("Warnzeichen") each arm exposes. */
export type ExperimentSignals = {
  /** Fabricated founding year + workshop-closure narrative. */
  readonly closureNarrative: boolean;
  /** Discounts of roughly 65-73 % instead of a plausible 10 %. */
  readonly extremeDiscounts: boolean;
  /** Static "only a few left" / "while stocks last" notices. */
  readonly scarcityMessages: boolean;
  /**
   * Advance bank transfer named as the only accepted payment method.
   * A payment claim in the copy only -- no bank details are ever published,
   * and no payment can be made. See SECURITY.md, section 1.
   */
  readonly prepaymentOnly: boolean;
  readonly showImprint: boolean;
  readonly showCompanyAddress: boolean;
  readonly showContactPage: boolean;
  readonly showTermsPage: boolean;
  readonly showWithdrawalPage: boolean;
  readonly showShippingPage: boolean;
  readonly showPrivacyPage: boolean;
};

const FULL_CONSUMER_INFORMATION = {
  showImprint: true,
  showCompanyAddress: true,
  showContactPage: true,
  showTermsPage: true,
  showWithdrawalPage: true,
  showShippingPage: true,
  showPrivacyPage: true,
} as const;

const NO_CONSUMER_INFORMATION = {
  showImprint: false,
  showCompanyAddress: false,
  showContactPage: false,
  showTermsPage: false,
  showWithdrawalPage: false,
  showShippingPage: false,
  showPrivacyPage: false,
} as const;

const SIGNALS_BY_VARIANT: Readonly<Record<ExperimentVariant, ExperimentSignals>> = {
  // Neutral shop, honest provider information, plausible discounts.
  control: {
    closureNarrative: false,
    extremeDiscounts: false,
    scarcityMessages: false,
    prepaymentOnly: false,
    ...FULL_CONSUMER_INFORMATION,
  },
  // Fabricated history and going-out-of-business sale, but the real operator
  // stays visible and all consumer information pages exist.
  "closure-story": {
    closureNarrative: true,
    extremeDiscounts: true,
    scarcityMessages: true,
    // Bleibt aus, damit dieser Arm allein die erfundene Historie misst.
    prepaymentOnly: false,
    ...FULL_CONSUMER_INFORMATION,
  },
  // Neutral communication and moderate prices, but no provider information.
  "missing-information": {
    closureNarrative: false,
    extremeDiscounts: false,
    scarcityMessages: false,
    // Gehört zur selben Familie wie die fehlenden Verbraucherinformationen:
    // Die Verbraucherzentrale nennt problematische Zahlungsangaben als
    // eigenständiges Warnzeichen.
    prepaymentOnly: true,
    ...NO_CONSUMER_INFORMATION,
  },
  // Every signal at once.
  combined: {
    closureNarrative: true,
    extremeDiscounts: true,
    scarcityMessages: true,
    prepaymentOnly: true,
    ...NO_CONSUMER_INFORMATION,
  },
};

/**
 * Discount applied to the reference price when `extremeDiscounts` is off.
 * `control` stays at the briefing's ceiling of 10 %, `missing-information`
 * uses a still-unremarkable 15 % so the two arms are distinguishable.
 */
const MODERATE_DISCOUNT_BY_VARIANT: Readonly<Record<ExperimentVariant, number>> = {
  control: 0.1,
  "closure-story": 0.1,
  "missing-information": 0.15,
  combined: 0.1,
};

export const experimentConfig = {
  variant,

  brand: {
    name: "Kofferwerk Auenfels",
    shortName: "Kofferwerk",
    claim: "Reisegepäck seit 1999",
    campaignLine: "Nach 27 Jahren endet unsere Reise.",
    foundedYearClaim: 1999,
    closureDateLabel: "30. September 2026",
    closureMonthLabel: "September",
    closureReason: "Steigende Kosten und fehlende Nachfolge",
    /** Years of trading claimed on the site. Fabricated, like the brand itself. */
    claimedYears: 27,
    maxDiscountLabel: "72 %",
  },

  signals: SIGNALS_BY_VARIANT[variant],

  pricing: {
    useDeepDiscounts: SIGNALS_BY_VARIANT[variant].extremeDiscounts,
    moderateDiscountRate: MODERATE_DISCOUNT_BY_VARIANT[variant],
  },

  /**
   * Hard safety boundaries. These are constants, not variant-dependent: no
   * arm of this experiment may ever complete an order, take a payment or read
   * a personal detail.
   *
   * The shop shows a checkout view and a newsletter field, but both are inert:
   * their input elements are uncontrolled, are never read by any code, sit
   * outside any `<form>` and have no submit target. See `display` below and
   * SECURITY.md, section 2.
   */
  safety: {
    /** No order can be completed. Step 1 of the checkout ends at the reveal. */
    enableCheckout: false,
    enablePayments: false,
    enableAccounts: false,
    /** No subscription is ever created; the field does nothing. */
    enableNewsletter: false,
    enableContactForm: false,
    /** Nothing typed anywhere is read, stored or transmitted. */
    collectPersonalData: false,
    revealRoute: "/experiment",
  },

  /**
   * Purely visual elements that make the shop look like a real one. They
   * display an interaction without performing it -- a shop with neither a
   * checkout nor a newsletter would be unusual enough to skew the very
   * assessment this experiment measures.
   */
  display: {
    /** Address step at /kasse, with a three-step indicator. */
    checkoutForm: true,
    /** Signup field at /newsletter that never submits. */
    newsletterForm: true,
    /** Steps shown in the indicator. Only the first one is ever reachable. */
    checkoutSteps: ["Lieferadresse", "Versand und Zahlung", "Prüfen und bestellen"],
  },
} as const;

/**
 * Routes that must always resolve to the reveal page.
 *
 * `/kasse` is deliberately NOT on this list any more: it hosts the address
 * step, whose only button leads to the reveal. Everything that would imply a
 * placed order or a payment stays unreachable.
 */
export const CHECKOUT_ROUTES = [
  "/checkout",
  "/payment",
  "/bestellung",
  "/zahlung",
  "/kasse/zahlung",
  "/kasse/bestaetigung",
  "/warenkorb/kasse",
] as const;

export const REVEAL_ROUTE = experimentConfig.safety.revealRoute;
