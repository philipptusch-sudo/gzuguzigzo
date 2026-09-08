import { CheckIcon } from "@/components/icons";

/**
 * Three-step indicator.
 *
 * Only the first step exists. Steps two and three are labels: there is no
 * route behind them, and the button on step one leads to the reveal page.
 */
export function CheckoutSteps({
  steps,
  current = 0,
}: {
  steps: readonly string[];
  current?: number;
}) {
  return (
    <nav aria-label="Bestellschritte" className="border-cream-300 border-b pb-6">
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
        {steps.map((step, index) => {
          const isCurrent = index === current;
          const isDone = index < current;

          return (
            <li key={step} className="flex items-center gap-3">
              <span
                className={`flex items-center gap-2.5 ${
                  isCurrent ? "text-ink-900" : "text-ink-400"
                }`}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span
                  aria-hidden
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs tabular-nums ${
                    isCurrent ? "bg-ink-900 text-cream-50" : "border-cream-400 text-ink-400 border"
                  }`}
                >
                  {isDone ? <CheckIcon className="h-3.5 w-3.5" /> : index + 1}
                </span>
                <span className={isCurrent ? "font-medium" : ""}>{step}</span>
                <span className="sr-only">
                  {isCurrent ? " (aktueller Schritt)" : " (noch nicht erreicht)"}
                </span>
              </span>
              {index < steps.length - 1 ? (
                <span aria-hidden className="bg-cream-400 hidden h-px w-8 sm:block" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
