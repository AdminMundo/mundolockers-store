import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Clientes | Admin",
  description: "Clientes guardados desde el cotizador.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  rut: string;
  nombre: string;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
  updated_at: string;
};

const PAGE_SIZE = 20;

type SP = {
  q?: string;
  page?: string;
};

type PageProps = {
  searchParams: Promise<SP>;
};

function formatFecha(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function ClientesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = createSupabaseServer();

  let query = supabase
    .from("clientes_cotizacion")
    .select("id, rut, nombre, direccion, telefono, email, updated_at", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (q) {
    query = query.or(`nombre.ilike.%${q}%,rut.ilike.%${q}%`);
  }

  const { data, error, count } = await query.returns<Row[]>();
  const items = data ?? [];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageUrl(p: number) {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return `/admin/clientes${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">Cotizador</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-black md:text-4xl">
          Clientes
        </h1>
        <p className="mt-2 text-sm text-black/50">
          Se guardan automáticamente cada vez que se crea o edita una cotización formal.
        </p>
      </div>

      {/* Búsqueda */}
      <section className="rounded-[32px] border border-black/10 bg-white p-6 shadow-sm">
        <form className="flex flex-wrap gap-3">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Buscar por nombre o RUT"
            className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-black/25"
          />
          <button
            type="submit"
            className="rounded-xl bg-[#0477BF] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#04527f]"
          >
            Buscar
          </button>
          {q && (
            <Link
              href="/admin/clientes"
              className="flex items-center rounded-xl bg-black/5 px-5 py-2.5 text-sm font-semibold text-black/60 transition hover:bg-black/10"
            >
              Limpiar
            </Link>
          )}
        </form>
      </section>

      {!error && (
        <p className="text-sm text-black/50">
          <strong className="text-black/70">{total.toLocaleString("es-CL")}</strong> cliente{total !== 1 ? "s" : ""}
          {totalPages > 1 ? ` — Pág. ${page} / ${totalPages}` : ""}
        </p>
      )}

      {/* Tabla */}
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Error cargando clientes: {error.message}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-[32px] border border-black/10 bg-white px-6 py-16 text-center">
          <p className="text-sm text-black/45">
            {q ? "No se encontraron clientes con esa búsqueda." : "Aún no hay clientes guardados."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="bg-black text-left text-white">
                  <th className="px-4 py-3 font-semibold">Nombre / Razón social</th>
                  <th className="px-4 py-3 font-semibold">RUT</th>
                  <th className="px-4 py-3 font-semibold">Dirección</th>
                  <th className="px-4 py-3 font-semibold">Teléfono</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Actualizado</th>
                  <th className="px-4 py-3 text-center font-semibold">Cotizaciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id} className="border-t border-black/5">
                    <td className="px-4 py-3 font-medium text-black">{c.nombre}</td>
                    <td className="px-4 py-3 text-black/70">{c.rut}</td>
                    <td className="px-4 py-3 text-black/60">{c.direccion || "—"}</td>
                    <td className="px-4 py-3 text-black/60">{c.telefono || "—"}</td>
                    <td className="px-4 py-3 text-black/60">{c.email || "—"}</td>
                    <td className="px-4 py-3 text-black/60">{formatFecha(c.updated_at)}</td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        href={`/admin/cotizador?rut=${encodeURIComponent(c.rut)}`}
                        className="inline-flex items-center rounded-lg border border-black/10 px-3 py-1.5 text-xs font-semibold text-black/70 transition hover:border-[#0477BF] hover:text-[#0477BF]"
                      >
                        Ver historial
                      </Link>
                    </td>
                  </tr>
                ))}
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
