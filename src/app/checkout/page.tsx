import type { Metadata } from "next";

import { CheckoutPageClient } from "@/components/checkout/checkout-page-client";
import { getCartServerState } from "@/lib/cart/server";

export const metadata: Metadata = {
  title: "Checkout | Mundo Lockers",
  description:
    "Completa tus datos para continuar con la compra directa en Mundo Lockers.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CheckoutPage() {
  const initialState = await getCartServerState();

  return <CheckoutPageClient initialState={initialState} />;
}