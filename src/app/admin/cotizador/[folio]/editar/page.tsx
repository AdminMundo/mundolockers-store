import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { createSupabaseServer } from "@/lib/supabase/server";
import { QuoteBuilder, type QuoteBuilderInitial } from "@/app/admin/cotizador/QuoteBuilder";
import type { QuoteItemInput } from "@/app/admin/cotizador/actions";

export const metadata: Metadata = {
  title: "Editar cotización | Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type CotizacionFormalRow = {
  id: string;
  folio: number;
  cliente_rut: string;
  cliente_nombre: string;
  cliente_direccion: string | null;
  cliente_telefono: string | null;
  cliente_email: string | null;
  referencia: string | null;
  fecha_emision: string;
  vendedor: string;
  forma_pago: string;
  condiciones: string | null;
  vigencia_dias: number;
  descuento_tipo: "pct" | "monto";
  descuento_valor: number;
  items: QuoteItemInput[];
};

type PageProps = {
  params: Promise<{ folio: string }>;
};

export default async function EditarCotizacionPage({ params }: PageProps) {
  await requireAdmin();
  const { folio: folioParam } = await params;
  const folio = Number(folioParam);
  if (!Number.isFinite(folio)) return notFound();

  const supabase = createSupabaseServer();
  const { data, error } = await supabase
    .from("cotizaciones_formales")
    .select(
      "id, folio, cliente_rut, cliente_nombre, cliente_direccion, cliente_telefono, cliente_email, referencia, fecha_emision, vendedor, forma_pago, condiciones, vigencia_dias, descuento_tipo, descuento_valor, items",
    )
    .eq("folio", folio)
    .maybeSingle<CotizacionFormalRow>();

  if (error || !data) return notFound();

  const initial: QuoteBuilderInitial = {
    id: data.id,
    folio: data.folio,
    clienteRut: data.cliente_rut,
    clienteNombre: data.cliente_nombre,
    clienteDireccion: data.cliente_direccion ?? "",
    clienteTelefono: data.cliente_telefono ?? "",
    clienteEmail: data.cliente_email ?? "",
    referencia: data.referencia ?? "",
    fechaEmision: data.fecha_emision,
    vendedor: data.vendedor,
    formaPago: data.forma_pago,
    condiciones: data.condiciones ?? "",
    vigenciaDias: data.vigencia_dias,
    descuentoTipo: data.descuento_tipo,
    descuentoValor: data.descuento_valor,
    items: data.items ?? [],
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">Cotizador</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-black md:text-4xl">
          Editar cotización N° {String(data.folio).padStart(4, "0")}
        </h1>
      </div>

      <QuoteBuilder vendedorInicial={data.vendedor} initial={initial} />
    </div>
  );
}
