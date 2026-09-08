"use client";

import { useState } from "react";
import { InfoIcon } from "@/components/icons";

/**
 * A signup field that does not sign anyone up.
 *
 * The button flips a boolean and nothing else. This component never reads the
 * input: the field is uncontrolled, has no `name`, sits outside any `<form>`
 * and is never referenced by a ref. There is no request, no storage and no
 * subscription -- the address a visitor might type stays in the DOM until the
 * page is left, and is then gone.
 *
 * `autoComplete="off"` and `type="text"` (rather than `type="email"`) keep the
 * browser from autofilling a real address nobody chose to enter.
 */
export function NewsletterField() {
  const [rejected, setRejected] = useState(false);

  return (
    <div className="mt-8 max-w-lg">
      <label
        htmlFor="feld-newsletter"
        className="text-ink-700 block text-xs font-semibold tracking-[0.1em] uppercase"
      >
        E-Mail-Adresse
      </label>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id="feld-newsletter"
          type="text"
          inputMode="email"
          autoComplete="off"
          placeholder="name@beispiel.de"
          aria-describedby={rejected ? "newsletter-hinweis" : undefined}
          className="border-cream-400 bg-cream-50 text-ink-900 placeholder:text-ink-300 focus:border-ink-700 w-full rounded-sm border px-3.5 py-3 text-base focus:outline-none"
        />
        <button
          type="button"
          data-testid="newsletter-submit"
          onClick={() => setRejected(true)}
          className="bg-ink-900 text-cream-50 hover:bg-ink-800 shrink-0 rounded-sm px-7 py-3 text-sm font-medium transition-colors"
        >
          Anmelden
        </button>
      </div>

      <p aria-live="polite" className="min-h-[3.5rem]">
        {rejected ? (
          <span
            id="newsletter-hinweis"
            data-testid="newsletter-error"
            className="border-burgund-700 text-ink-800 mt-4 flex items-start gap-2 border-l-2 py-1 pl-3 text-sm"
          >
            <InfoIcon className="text-burgund-700 mt-0.5 h-4 w-4 shrink-0" />
            Die Anmeldung ist derzeit nicht möglich. Bitte versuche es später noch einmal.
          </span>
        ) : null}
      </p>
    </div>
  );
}
