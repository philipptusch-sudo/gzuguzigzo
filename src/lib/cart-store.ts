import {
  CART_STORAGE_KEY,
  EMPTY_CART,
  addLine,
  clearCart,
  parseStoredCart,
  removeLine,
  serialiseCart,
  setQuantity,
  type CartState,
} from "@/lib/cart";
import type { ColorKey } from "@/data/products";

/**
 * The cart as an external store, read through `useSyncExternalStore`.
 *
 * Modelling localStorage as an external store rather than as component state
 * avoids a hydration effect entirely, and it keeps two open tabs in sync for
 * free. The store lives only in the browser; on the server it always reports
 * an empty cart, which is what the server-rendered HTML shows.
 */

export type CartSnapshot = {
  readonly items: CartState;
  /** False until localStorage has been read, i.e. during server rendering. */
  readonly hydrated: boolean;
};

const SERVER_SNAPSHOT: CartSnapshot = { items: EMPTY_CART, hydrated: false };

let snapshot: CartSnapshot = SERVER_SNAPSHOT;
let hasReadStorage = false;
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

function readStorage(): CartState {
  try {
    return parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY));
  } catch {
    // Private mode or blocked storage: start empty.
    return EMPTY_CART;
  }
}

function writeStorage(items: CartState): void {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, serialiseCart(items));
  } catch {
    // Storage unavailable or full: the in-memory cart keeps working.
  }
}

function commit(items: CartState, { persist = true } = {}): void {
  hasReadStorage = true;
  snapshot = { items, hydrated: true };
  if (persist) writeStorage(items);
  notify();
}

function onStorageEvent(event: StorageEvent): void {
  if (event.key !== null && event.key !== CART_STORAGE_KEY) return;
  // Another tab changed the cart; adopt its state without writing it back.
  commit(parseStoredCart(window.localStorage.getItem(CART_STORAGE_KEY)), { persist: false });
}

export function subscribe(listener: () => void): () => void {
  if (listeners.size === 0 && typeof window !== "undefined") {
    window.addEventListener("storage", onStorageEvent);
  }
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("storage", onStorageEvent);
    }
  };
}

export function getSnapshot(): CartSnapshot {
  if (!hasReadStorage && typeof window !== "undefined") {
    hasReadStorage = true;
    snapshot = { items: readStorage(), hydrated: true };
  }
  return snapshot;
}

export function getServerSnapshot(): CartSnapshot {
  return SERVER_SNAPSHOT;
}

/* --------------------------------------------------------------- mutations */

export function addItem(slug: string, color: ColorKey, quantity = 1): void {
  commit(addLine(getSnapshot().items, slug, color, quantity));
}

export function updateItem(slug: string, color: ColorKey, quantity: number): void {
  commit(setQuantity(getSnapshot().items, slug, color, quantity));
}

export function removeItem(slug: string, color: ColorKey): void {
  commit(removeLine(getSnapshot().items, slug, color));
}

export function clearItems(): void {
  commit(clearCart());
}

/**
 * Drops the in-memory state so the next read comes from storage again.
 * Used by tests to simulate a page reload; not called by the application.
 */
export function resetCartStore(): void {
  snapshot = SERVER_SNAPSHOT;
  hasReadStorage = false;
  listeners.clear();
  if (typeof window !== "undefined") {
    window.removeEventListener("storage", onStorageEvent);
  }
}
