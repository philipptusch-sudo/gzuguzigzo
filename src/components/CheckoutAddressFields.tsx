/**
 * The address step.
 *
 * Every safety property of this component comes from what it does NOT have:
 *
 *  - It is a Server Component. No client JavaScript is shipped for it, so no
 *    code on the page can read what a visitor types.
 *  - The inputs are uncontrolled and carry no `name`. Their values live only
 *    in the DOM and are discarded when the page unmounts.
 *  - There is no `<form>` element, so there is no submit target and pressing
 *    Enter does nothing.
 *  - `autoComplete="off"` and deliberately non-standard field ids keep the
 *    browser from autofilling a real address that the visitor never chose to
 *    enter.
 *  - No `type="email"` or `type="tel"`: those types trigger autofill
 *    heuristics even where `autocomplete` is off.
 *
 * Nothing entered here is read, stored or transmitted. `tests/e2e/checkout.spec.ts`
 * types into every field and then checks that this holds.
 */

type FieldProps = {
  id: string;
  label: string;
  inputMode?: "text" | "numeric" | "email";
  className?: string;
  placeholder?: string;
};

function Field({ id, label, inputMode = "text", className = "", placeholder }: FieldProps) {
  return (
    <p className={className}>
      <label
        htmlFor={id}
        className="text-ink-700 block text-xs font-semibold tracking-[0.1em] uppercase"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode={inputMode}
        autoComplete="off"
        placeholder={placeholder}
        className="border-cream-400 bg-cream-50 text-ink-900 placeholder:text-ink-300 focus:border-ink-700 mt-2 w-full rounded-sm border px-3.5 py-3 text-base focus:outline-none"
      />
    </p>
  );
}

export function CheckoutAddressFields() {
  return (
    <fieldset className="mt-8">
      <legend className="text-ink-900 font-serif text-xl">Lieferadresse</legend>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id="feld-vorname" label="Vorname" />
        <Field id="feld-nachname" label="Nachname" />
        <Field id="feld-strasse" label="Straße und Hausnummer" className="sm:col-span-2" />
        <Field id="feld-plz" label="Postleitzahl" inputMode="numeric" />
        <Field id="feld-ort" label="Ort" />
        <Field id="feld-land" label="Land" className="sm:col-span-2" placeholder="Deutschland" />
        <Field
          id="feld-kontakt"
          label="E-Mail für die Versandbestätigung"
          inputMode="email"
          className="sm:col-span-2"
        />
      </div>
    </fieldset>
  );
}
