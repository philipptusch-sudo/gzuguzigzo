import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { experimentConfig, REVEAL_ROUTE } from "@/config/experiment";
import { copy } from "@/lib/copy";
import { CheckoutSteps } from "@/components/CheckoutSteps";
import { CheckoutAddressFields } from "@/components/CheckoutAddressFields";
import { CheckoutSummary } from "@/components/CheckoutSummary";
import { ChevronRightIcon, InfoIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Kasse" };

/**
 * Step one of a checkout that has no step two.
 *
 * The address fields are inert (see `CheckoutAddressFields`) and "Weiter" is a
 * plain link to the reveal page -- not a submit button. No order is created,
 * no payment step exists, and nothing typed here is read by any code.
 */
export default function CheckoutPage() {
  if (!experimentConfig.display.checkoutForm) notFound();

  const { checkoutSteps } = experimentConfig.display;

  return (
    <div className="container-page py-10 lg:py-14">
      <h1 className="text-ink-900 font-serif text-3xl sm:text-4xl">Kasse</h1>

      <div className="mt-8">
        <CheckoutSteps steps={checkoutSteps} current={0} />
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <CheckoutAddressFields />

          <p className="text-ink-600 mt-6 flex items-start gap-2 text-sm">
            <InfoIcon className="text-ink-400 mt-0.5 h-4 w-4 shrink-0" />
            {copy.payment.note}
          </p>

          <div className="border-cream-300 mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 border-t pt-8">
            {/*
              Kein Absenden-Button, sondern ein Link. Es gibt kein <form>, kein
              Ziel und keinen zweiten Schritt: Von hier geht es zur Auflösung.
            */}
            <Link
              href={REVEAL_ROUTE}
              data-testid="checkout-continue"
              className="bg-ink-900 text-cream-50 hover:bg-ink-800 inline-flex items-center gap-2 rounded-sm px-8 py-4 text-sm font-medium tracking-wide transition-colors"
            >
              Weiter
              <ChevronRightIcon className="h-4 w-4" />
            </Link>

            <Link
              href="/warenkorb"
              className="text-ink-600 hover:text-ink-900 text-sm underline underline-offset-4"
            >
              Zurück zum Warenkorb
            </Link>
          </div>
        </div>

        <aside aria-label="Bestellübersicht" className="lg:sticky lg:top-28 lg:self-start">
          <CheckoutSummary />
        </aside>
      </div>
    </div>
  );
}
