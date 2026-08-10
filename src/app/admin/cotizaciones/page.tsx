import type { Metadata } from "next";
import Image from "next/image";
import { createSupabaseServer } from "@/lib/supabase/server";
import { CotizacionCard } from "@/app/admin/cotizaciones/CotizacionCard";

export const metadata: Metadata = {
  title: "Cotizaciones | Admin",
  description: "Gestión de cotizaciones del panel admin.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Cotizacion = {
  id: string;
  nombre: string;
  empresa: string | null;
  rut: string | null;
  correo: string;
  telefono: string | null;
  tipo_proyecto: string | null;
  mensaje: string | null;
  productos: unknown;
  estado: string;
  created_at: string;
};

const PAGE_SIZE = 10;

type PageProps = {
  searchParams: Promise<{ q?: string; estado?: string; page?: string }>;
};

export default async function AdminCotizacionesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const estado = (params.estado ?? "").trim();
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = createSupabaseServer();

  let query = supabase
    .from("cotizaciones")
    .select("id,nombre,empresa,rut,correo,telefono,tipo_proyecto,mensaje,productos,estado,created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (q) query = query.ilike("nombre", `%${q}%`);
  if (estado) query = query.eq("estado", estado);

  const { data, error, count } = await query;
  const items = (data ?? []) as Cotizacion[];
  const total = count ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  function pageUrl(p: number) {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (estado) sp.set("estado", estado);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return `/admin/cotizaciones${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      <section className="relative overflow-hidden rounded-[36px] border border-black/10 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
        <div className="absolute inset-0">
          <Image src="/images/home/Encabezadoprincipal.webp" alt="Banner cotizaciones" fill priority className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,20,0.82)_0%,rgba(7,15,30,0.68)_42%,rgba(10,20,35,0.42)_100%)]" />
        <div className="relative flex min-h-60 flex-col justify-end gap-2 p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">Panel de administración</p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Cotizaciones</h1>
          <p className="mt-1 max-w-xl text-sm leading-6 text-white/80">
            {total > 0 ? `${total} solicitud${total !== 1 ? "es" : ""} en total` : "Aún no hay solicitudes."}
          </p>
        </div>
      </section>

      {/* Filtros */}
      <section className="rounded-[32px] border border-black/10 bg-white p-6 shadow-sm">
        <form className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <label htmlFor="q" className="text-sm font-medium text-black/70">Cliente</label>
            <input
              id="q" name="q" defaultValue={q}
              placeholder="Nombre del cliente"
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="estado" className="text-sm font-medium text-black/70">Estado</label>
            <select id="estado" name="estado" defaultValue={estado}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20">
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="en-proceso">En proceso</option>
              <option value="respondida">Respondida</option>
              <option value="cerrada">Cerrada</option>
            </select>
          </div>
          <div className="flex items-end gap-3 md:col-span-2">
            <button type="submit" className="inline-flex items-center rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90">
              Filtrar
            </button>
            <a href="/admin/cotizaciones" className="inline-flex items-center rounded-2xl border border-black/10 px-4 py-3 text-sm font-medium text-black/75 transition hover:border-black/20">
              Limpiar
            </a>
          </div>
        </form>
      </section>

      {/* Listado */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-black/45">
            {total === 0 ? "Sin resultados" : `${from + 1}–${Math.min(to + 1, total)} de ${total}`}
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Error cargando cotizaciones: {error.message}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-[32px] border border-black/10 bg-white px-6 py-16 text-center">
            <p className="text-sm text-black/45">
              {q || estado ? "No se encontraron cotizaciones con esos filtros." : "Aún no hay cotizaciones."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((c) => <CotizacionCard key={c.id} c={c} />)}
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
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
      </section>
    </div>
  );
}
