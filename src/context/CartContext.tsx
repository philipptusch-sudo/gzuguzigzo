"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import type { ColorKey } from "@/data/products";
import { computeTotals, totalQuantity, type CartState, type CartTotals } from "@/lib/cart";
import {
  addItem,
  clearItems,
  getServerSnapshot,
  getSnapshot,
  removeItem,
  subscribe,
  updateItem,
} from "@/lib/cart-store";

type CartContextValue = {
  readonly items: CartState;
  readonly totals: CartTotals;
  readonly count: number;
  /** False during server rendering and the first hydration pass. */
  readonly hydrated: boolean;
  add: (slug: string, color: ColorKey, quantity?: number) => void;
  update: (slug: string, color: ColorKey, quantity: number) => void;
  remove: (slug: string, color: ColorKey) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Makes the cart available to the shop.
 *
 * localStorage is used for the cart and for nothing else. Only product slugs,
 * colours and quantities are written -- all of them chosen by the visitor. No
 * identifier, no visit history and no personal data is stored, and nothing
 * ever leaves the browser.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const { items, hydrated } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totals: computeTotals(items),
      count: totalQuantity(items),
      hydrated,
      add: addItem,
      update: updateItem,
      remove: removeItem,
      clear: clearItems,
    }),
    [items, hydrated],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart muss innerhalb von <CartProvider> verwendet werden.");
  }
  return context;
}
