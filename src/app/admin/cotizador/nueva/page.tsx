import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/admin";
import { QuoteBuilder } from "@/app/admin/cotizador/QuoteBuilder";

export const metadata: Metadata = {
  title: "Nueva cotización | Admin",
  robots: { index: false, follow: false },
};

export default async function NuevaCotizacionPage() {
  const user = await requireAdmin();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">Cotizador</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-black md:text-4xl">
          Nueva cotización
        </h1>
      </div>

      <QuoteBuilder vendedorInicial={user.email ?? ""} />
    </div>
  );
}
