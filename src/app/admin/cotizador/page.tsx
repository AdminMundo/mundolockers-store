import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { CotizacionFormalRow } from "./CotizacionFormalRow";

export const metadata: Metadata = {
  title: "Cotizador | Admin",
  description: "Cotizaciones formales creadas por el equipo de ventas.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  folio: number;
  cliente_nombre: string;
  cliente_rut: string;
  vendedor: string;
  fecha_emision: string;
  total: number;
  estado: string;
  trasladado_kame: boolean;
  trasladado_kame_por: string | null;
  trasladado_kame_en: string | null;
  trasladado_kame_numero_pedido: string | null;
};

const PAGE_SIZE = 20;

const ESTADOS = [
  { value: "pendiente", label: "Pendiente" },
  { value: "enviada", label: "Enviada" },
  { value: "aceptada", label: "Aceptada" },
  { value: "rechazada", label: "Rechazada" },
  { value: "vencida", label: "Vencida" },
];

type SP = {
  folio?: string;
  rut?: string;
  cliente?: string;
  vendedor?: string;
  referencia?: string;
  desde?: string;
  hasta?: string;
  estado?: string;
  kame?: string;
  page?: string;
};

type PageProps = {
  searchParams: Promise<SP>;
};

export default async function CotizadorPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const folio = (params.folio ?? "").trim();
  const rut = (params.rut ?? "").trim();
  const cliente = (params.cliente ?? "").trim();
  const vendedor = (params.vendedor ?? "").trim();
  const referencia = (params.referencia ?? "").trim();
  const desde = (params.desde ?? "").trim();
  const hasta = (params.hasta ?? "").trim();
  const estado = (params.estado ?? "").trim();
  const kame = (params.kame ?? "").trim();
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = createSupabaseServer();

  let query = supabase
    .from("cotizaciones_formales")
    .select(
      "id, folio, cliente_nombre, cliente_rut, vendedor, fecha_emision, total, estado, trasladado_kame, trasladado_kame_por, trasladado_kame_en, trasladado_kame_numero_pedido",
      { count: "exact" },
    )
    .order("folio", { ascending: false })
    .range(from, to);

  if (folio) query = query.eq("folio", Number(folio));
  if (rut) query = query.ilike("cliente_rut", `%${rut}%`);
  if (cliente) query = query.ilike("cliente_nombre", `%${cliente}%`);
  if (vendedor) query = query.ilike("vendedor", `%${vendedor}%`);
  if (referencia) query = query.ilike("referencia", `%${referencia}%`);
  if (desde) query = query.gte("fecha_emision", desde);
  if (hasta) query = query.lte("fecha_emision", hasta);
  if (estado) query = query.eq("estado", estado);
  if (kame === "si") query = query.eq("trasladado_kame", true);
  if (kame === "no") query = query.eq("trasladado_kame", false);

  const { data, error, count } = await query.returns<Row[]>();
  const items = data ?? [];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const activeFilters: SP = { folio, rut, cliente, vendedor, referencia, desde, hasta, estado, kame };
  const hasFilters = Object.values(activeFilters).some(Boolean);

  function buildQuery(extra: Partial<SP>): string {
    const sp = new URLSearchParams();
    const merged = { ...activeFilters, ...extra };
    for (const [key, value] of Object.entries(merged)) {
      if (value) sp.set(key, String(value));
    }
    return sp.toString();
  }

  function pageUrl(p: number) {
    const qs = buildQuery({ page: p > 1 ? String(p) : undefined });
    return `/admin/cotizador${qs ? `?${qs}` : ""}`;
  }

  const exportQs = buildQuery({ page: undefined });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">Cotizador</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-black md:text-4xl">
            Cotizaciones formales
          </h1>
        </div>
        <Link
          href="/admin/cotizador/nueva"
          className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0477BF]"
        >
          + Nueva cotización
        </Link>
      </div>

      {/* Filtros */}
      <section className="rounded-[32px] border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-black/45">Filtros</h2>
        <form className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
          <input
            type="number" name="folio" defaultValue={folio} placeholder="Folio #"
            className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-black/25"
          />
          <input
            type="text" name="rut" defaultValue={rut} placeholder="RUT"
            className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-black/25"
          />
          <input
            type="text" name="cliente" defaultValue={cliente} placeholder="Cliente"
            className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-black/25"
          />
          <input
            type="text" name="vendedor" defaultValue={vendedor} placeholder="Vendedor"
            className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-black/25"
          />
          <input
            type="text" name="referencia" defaultValue={referencia} placeholder="Ref/Proyecto"
            className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-black/25"
          />
          <input
            type="date" name="desde" defaultValue={desde}
            className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-black/25"
          />
          <input
            type="date" name="hasta" defaultValue={hasta}
            className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-black/25"
          />
          <select
            name="estado" defaultValue={estado}
            className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-black/25"
          >
            <option value="">Todos los estados</option>
            {ESTADOS.map((e) => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
          <select
            name="kame" defaultValue={kame}
            className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-black/25"
          >
            <option value="">Kame: todas</option>
            <option value="no">Sin trasladar a Kame</option>
            <option value="si">Ya trasladadas a Kame</option>
          </select>

          <button
            type="submit"
            className="col-span-2 rounded-xl bg-[#0477BF] py-2.5 text-sm font-semibold text-white transition hover:bg-[#04527f] md:col-span-3 lg:col-span-4"
          >
            Buscar
          </button>
          <Link
            href="/admin/cotizador"
            className="col-span-2 flex items-center justify-center rounded-xl bg-black/5 py-2.5 text-sm font-semibold text-black/60 transition hover:bg-black/10 md:col-span-1 lg:col-span-4"
          >
            Limpiar
          </Link>
        </form>
      </section>

      {/* Resumen + exportar */}
      {!error && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-black/50">
            <strong className="text-black/70">{total.toLocaleString("es-CL")}</strong> cotización{total !== 1 ? "es" : ""}
            {totalPages > 1 ? ` — Pág. ${page} / ${totalPages}` : ""}
          </p>
          <a
            href={`/admin/cotizador/export${exportQs ? `?${exportQs}` : ""}`}
            className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-500"
          >
            ⬇ Exportar Excel
          </a>
        </div>
      )}

      {/* Tabla */}
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Error cargando cotizaciones: {error.message}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-[32px] border border-black/10 bg-white px-6 py-16 text-center">
          <p className="text-sm text-black/45">
            {hasFilters ? "No se encontraron cotizaciones con esos filtros." : "Aún no hay cotizaciones formales."}
          </p>
          <Link
            href="/admin/cotizador/nueva"
            className="mt-4 inline-flex items-center rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0477BF]"
          >
            + Crear la primera
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-sm">
              <thead>
                <tr className="bg-black text-left text-white">
                  <th className="px-4 py-3 font-semibold">Folio</th>
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                  <th className="px-4 py-3 font-semibold">Cliente</th>
                  <th className="px-4 py-3 font-semibold">Vendedor</th>
                  <th className="px-4 py-3 text-right font-semibold">Total</th>
                  <th className="px-4 py-3 text-center font-semibold">Estado</th>
                  <th className="px-4 py-3 text-center font-semibold">Kame</th>
                  <th className="px-4 py-3 text-center font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => <CotizacionFormalRow key={c.id} c={c} />)}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {page > 1 && (
            <a href={pageUrl(page - 1)} className="inline-flex h-9 items-center rounded-xl border border-black/10 px-4 text-sm font-medium text-black/70 hover:bg-black/4">
              ← Anterior
            </a>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a key={p} href={pageUrl(p)}
              className={["inline-flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-medium transition",
                p === page ? "border-black bg-black text-white" : "border-black/10 text-black/70 hover:bg-black/4"].join(" ")}
            >{p}</a>
          ))}
          {page < totalPages && (
            <a href={pageUrl(page + 1)} className="inline-flex h-9 items-center rounded-xl border border-black/10 px-4 text-sm font-medium text-black/70 hover:bg-black/4">
              Siguiente →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
