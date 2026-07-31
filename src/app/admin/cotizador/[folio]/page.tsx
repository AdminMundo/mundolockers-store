import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { QuoteViewClient } from "./QuoteViewClient";
import type { QuoteItemInput } from "@/app/admin/cotizador/actions";

export const metadata: Metadata = {
  title: "Cotización | Admin | LockerStore",
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
  subtotal: number;
  neto: number;
  iva: number;
  total: number;
  items: QuoteItemInput[];
  estado: string;
  trasladado_kame: boolean;
  trasladado_kame_por: string | null;
  trasladado_kame_en: string | null;
  trasladado_kame_numero_pedido: string | null;
  created_at: string;
};

type PageProps = {
  params: Promise<{ folio: string }>;
};

export default async function VerCotizacionPage({ params }: PageProps) {
  const { folio: folioParam } = await params;
  const folio = Number(folioParam);
  if (!Number.isFinite(folio)) return notFound();

  const supabase = createSupabaseServer();
  const { data, error } = await supabase
    .from("cotizaciones_formales")
    .select("*")
    .eq("folio", folio)
    .maybeSingle<CotizacionFormalRow>();

  if (error || !data) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">Cotizador</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-black md:text-4xl">
            Cotización N° {String(data.folio).padStart(4, "0")}
          </h1>
        </div>
        <Link
          href="/admin/cotizador"
          className="rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black/70 transition hover:border-black/25"
        >
          ← Historial
        </Link>
      </div>

      <QuoteViewClient cotizacion={data} />
    </div>
  );
}
