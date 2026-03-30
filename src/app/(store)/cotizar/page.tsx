import type { Metadata } from "next";

import { QuotePageClient } from "@/components/quote/quote-page-client";
import { getCartServerState } from "@/lib/cart/server";

export const metadata: Metadata = {
  title: "Cotizar | Mundo Lockers",
  description:
    "Solicita una cotización para proyectos institucionales, compras por volumen y soluciones personalizadas de Mundo Lockers.",
};

export default async function CotizarPage() {
  const initialState = await getCartServerState();

  return <QuotePageClient initialState={initialState} />;
}