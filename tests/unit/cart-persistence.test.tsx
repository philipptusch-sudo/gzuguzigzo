import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { CartProvider, useCart } from "@/context/CartContext";
import { CART_STORAGE_KEY } from "@/lib/cart";
import { resetCartStore } from "@/lib/cart-store";

function CartProbe() {
  const { add, update, remove, clear, count, totals, hydrated } = useCart();

  if (!hydrated) return <p>lädt</p>;

  return (
    <div>
      <p data-testid="count">{count}</p>
      <p data-testid="subtotal">{totals.subtotalCents}</p>
      <p data-testid="savings">{totals.savingsCents}</p>
      <button onClick={() => add("auenfels-kabine-38", "nachtblau")}>hinzufügen</button>
      <button onClick={() => update("auenfels-kabine-38", "nachtblau", 3)}>auf drei setzen</button>
      <button onClick={() => remove("auenfels-kabine-38", "nachtblau")}>entfernen</button>
      <button onClick={clear}>leeren</button>
    </div>
  );
}

function renderCart() {
  return render(
    <CartProvider>
      <CartProbe />
    </CartProvider>,
  );
}

describe("CartProvider", () => {
  beforeEach(() => {
    resetCartStore();
    window.localStorage.clear();
  });

  it("legt ein Produkt in den Warenkorb und zeigt die Menge an", async () => {
    const user = userEvent.setup();
    renderCart();

    await user.click(screen.getByRole("button", { name: "hinzufügen" }));

    expect(screen.getByTestId("count")).toHaveTextContent("1");
    expect(screen.getByTestId("subtotal")).toHaveTextContent("6900");
  });

  it("schreibt den Warenkorb in den lokalen Speicher", async () => {
    const user = userEvent.setup();
    renderCart();

    await user.click(screen.getByRole("button", { name: "hinzufügen" }));

    const stored = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) ?? "[]");
    expect(stored).toEqual([{ slug: "auenfels-kabine-38", color: "nachtblau", quantity: 1 }]);
  });

  it("stellt den Warenkorb nach einem Neuladen wieder her", async () => {
    const user = userEvent.setup();
    const first = renderCart();

    await user.click(screen.getByRole("button", { name: "hinzufügen" }));
    await user.click(screen.getByRole("button", { name: "auf drei setzen" }));
    expect(screen.getByTestId("count")).toHaveTextContent("3");

    // Neuladen der Seite: Baum und Speicherabbild werden verworfen, der
    // localStorage-Eintrag bleibt. Der Warenkorb muss von dort zurückkommen.
    first.unmount();
    resetCartStore();
    renderCart();

    expect(await screen.findByTestId("count")).toHaveTextContent("3");
    expect(screen.getByTestId("subtotal")).toHaveTextContent(String(3 * 6900));
  });

  it("verändert und entfernt Positionen", async () => {
    const user = userEvent.setup();
    renderCart();

    await user.click(screen.getByRole("button", { name: "hinzufügen" }));
    await user.click(screen.getByRole("button", { name: "auf drei setzen" }));
    expect(screen.getByTestId("count")).toHaveTextContent("3");

    await user.click(screen.getByRole("button", { name: "entfernen" }));
    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });

  it("leert den Warenkorb und den lokalen Speicher", async () => {
    const user = userEvent.setup();
    renderCart();

    await user.click(screen.getByRole("button", { name: "hinzufügen" }));
    await user.click(screen.getByRole("button", { name: "leeren" }));

    expect(screen.getByTestId("count")).toHaveTextContent("0");
    expect(window.localStorage.getItem(CART_STORAGE_KEY)).toBe("[]");
  });

  it("weist die Ersparnis aus", async () => {
    const user = userEvent.setup();
    renderCart();

    await user.click(screen.getByRole("button", { name: "hinzufügen" }));

    expect(screen.getByTestId("savings")).toHaveTextContent(String(21900 - 6900));
  });

  it("startet leer, wenn im Speicher unbrauchbare Daten liegen", async () => {
    window.localStorage.setItem(CART_STORAGE_KEY, "{kaputt");
    resetCartStore();

    await act(async () => {
      renderCart();
    });

    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });
});
