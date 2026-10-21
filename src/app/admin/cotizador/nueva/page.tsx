import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/admin";
import { createSupabaseServer } from "@/lib/supabase/server";
import { QuoteBuilder, type QuoteBuilderPrefill } from "@/app/admin/cotizador/QuoteBuilder";
import type { QuoteItemInput } from "@/app/admin/cotizador/actions";
import { getEffectivePrice } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Nueva cotización | Admin",
  robots: { index: false, follow: false },
};

type QuoteProductRaw = {
  name?: string;
  sku?: string | null;
  quantity?: number;
  variant?: string | null;
  unitPrice?: number | null;
};

async function buildPrefillFromCotizacion(id: string): Promise<QuoteBuilderPrefill | undefined> {
  const supabase = createSupabaseServer();
  const { data: c } = await supabase
    .from("cotizaciones")
    .select("nombre,empresa,rut,correo,telefono,tipo_proyecto,mensaje,productos")
    .eq("id", id)
    .maybeSingle();

  if (!c) return undefined;

  const productosRaw = Array.isArray(c.productos) ? (c.productos as QuoteProductRaw[]) : [];
  const skus = productosRaw.map((p) => p.sku).filter((s): s is string => !!s);

  const productMap = new Map<
    string,
    { id: string; name: string; price_clp: number | null; sale_price_clp: number | null }
  >();
  if (skus.length > 0) {
    const { data: products } = await supabase
      .from("products")
      .select("id,name,sku,price_clp,sale_price_clp")
      .in("sku", skus);
    for (const p of products ?? []) {
      if (p.sku) productMap.set(p.sku, p);
    }
  }

  const items: QuoteItemInput[] = productosRaw.map((p) => {
    const match = p.sku ? productMap.get(p.sku) : undefined;
    const matchPrice = match ? getEffectivePrice(match.price_clp, match.sale_price_clp) : null;
    return {
      productId: match?.id ?? null,
      variantId: null,
      sku: p.sku ?? "",
      name: match?.name ?? p.name ?? "Producto",
      variant: p.variant ?? null,
      quantity: p.quantity ?? 1,
      unitPrice: matchPrice ?? p.unitPrice ?? 0,
    };
  });

  const referencia = [c.tipo_proyecto, c.empresa ? `Contacto: ${c.nombre}` : null]
    .filter(Boolean)
    .join(" · ");

  return {
    clienteRut: c.rut ?? "",
    clienteNombre: c.empresa?.trim() || c.nombre,
    clienteTelefono: c.telefono ?? "",
    clienteEmail: c.correo,
    referencia,
    notaCliente: c.mensaje ?? "",
    items,
  };
}

export default async function NuevaCotizacionPage({
  searchParams,
}: {
  searchParams: Promise<{ fromCotizacion?: string }>;
}) {
  const user = await requireAdmin();
  const { fromCotizacion } = await searchParams;
  const prefill = fromCotizacion ? await buildPrefillFromCotizacion(fromCotizacion) : undefined;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">Cotizador</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-black md:text-4xl">
          Nueva cotización
        </h1>
      </div>

      <QuoteBuilder vendedorInicial={user.email ?? ""} prefill={prefill} />
    </div>
  );
}
