import type { Metadata } from "next";

import { CartPageClient } from "@/components/cart/cart-page-client";
import { getCartServerState } from "@/lib/cart/server";

export const metadata: Metadata = {
  title: "Carrito | Mundo Lockers",
  description:
    "Revisa tus productos, ajusta cantidades y continúa con compra directa o solicitud de cotización en Mundo Lockers.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CarritoPage() {
  const initialState = await getCartServerState();

  return <CartPageClient initialState={initialState} />;
}