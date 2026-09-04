import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = {
  title: "Warenkorb",
};

export default function CartPage() {
  return (
    <div className="container-page py-14 lg:py-20">
      <h1 className="text-ink-900 font-serif text-4xl sm:text-5xl">Warenkorb</h1>
      <CartView />
    </div>
  );
}
