import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { resetCartStore } from "@/lib/cart-store";

afterEach(() => {
  cleanup();
  resetCartStore();
  window.localStorage.clear();
});
