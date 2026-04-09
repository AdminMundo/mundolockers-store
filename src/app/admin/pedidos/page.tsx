import type { Metadata } from "next";
import Image from "next/image";
import { createSupabaseServer } from "@/lib/supabase/server";
import { PedidoCard, type Pedido } from "@/app/admin/pedidos/PedidoCard";

export const metadata: Metadata = {
  title: "Pedidos | Admin | LockerStore",
  description: "Gestión de pedidos del panel admin.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type AdminPedidosPageProps = {
  searchParams: Promise<{
    estado?: string;
    pago?: string;
    q?: string;
  }>;
};

const ESTADO_LABELS: Record<string, string> = {
  recibido: "Recibido",
  gestionando: "Gestionando",
  preparado: "Preparado",
  enviado: "Enviado",
  listo_retiro: "Listo retiro",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export default async function AdminPedidosPage({
  searchParams,
}: AdminPedidosPageProps) {
  const params = await searchParams;
  const estado = (params.estado ?? "").trim();
  const pago = (params.pago ?? "").trim();
  const q = (params.q ?? "").trim();

  const supabase = createSupabaseServer();

  let query = supabase
    .from("pedidos")
    .select(
      "id, numero, nombre, correo, telefono, rut, empresa, tipo_entrega, direccion, ciudad, region, productos, subtotal, descuento, costo_despacho, total, tipo_pago, estado_pago, estado, notas, created_at",
    )
    .order("created_at", { ascending: false });

  if (estado) query = query.eq("estado", estado);
  if (pago) query = query.eq("estado_pago", pago);
  if (q) query = query.ilike("nombre", `%${q}%`);

  const { data, error } = await query;
  const pedidos = (data ?? []) as Pedido[];

  // KPIs
  const { data: allData } = await supabase
    .from("pedidos")
    .select("estado, estado_pago, total");

  const all = allData ?? [];
  const totalPedidos = all.length;
  const recibidos = all.filter((p) => p.estado === "recibido").length;
  const enCurso = all.filter((p) =>
    ["gestionando", "preparado", "enviado", "listo_retiro"].includes(p.estado),
  ).length;
  const entregados = all.filter((p) => p.estado === "entregado").length;
  const sinPagar = all.filter((p) => p.estado_pago === "pendiente").length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <section className="relative overflow-hidden rounded-[36px] border border-black/10 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
        <div className="absolute inset-0">
          <Image
            src="/images/home/Encabezadoprincipal.webp"
            alt="Banner pedidos"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,20,0.82)_0%,rgba(7,15,30,0.68)_42%,rgba(10,20,35,0.42)_100%)]" />

        <div className="relative flex min-h-60 flex-col justify-between gap-8 p-6 md:flex-row md:items-end md:p-8">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Panel de administración
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Pedidos
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80 md:text-base">
              Gestiona el estado y pago de todos los pedidos de tu tienda.
            </p>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid gap-4 md:grid-cols-5">
        <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-black/45">Total pedidos</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-black">
            {totalPedidos}
          </p>
        </div>
        <div className="rounded-[28px] border border-amber-100 bg-amber-50 p-6 shadow-sm">
          <p className="text-sm text-amber-700/70">Recibidos</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-amber-700">
            {recibidos}
          </p>
        </div>
        <div className="rounded-[28px] border border-blue-100 bg-blue-50 p-6 shadow-sm">
          <p className="text-sm text-blue-700/70">En curso</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-blue-700">
            {enCurso}
          </p>
        </div>
        <div className="rounded-[28px] border border-emerald-100 bg-emerald-50 p-6 shadow-sm">
          <p className="text-sm text-emerald-700/70">Entregados</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-emerald-700">
            {entregados}
          </p>
        </div>
        <div className="rounded-[28px] border border-red-100 bg-red-50 p-6 shadow-sm">
          <p className="text-sm text-red-700/70">Sin pagar</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-red-700">
            {sinPagar}
          </p>
        </div>
      </section>

      {/* Filtros */}
      <section className="rounded-[32px] border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-black/45">Filtros</p>
          <h2 className="text-2xl font-semibold tracking-tight text-black">
            Buscar pedidos
          </h2>
        </div>

        <form className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <label htmlFor="q" className="text-sm font-medium text-black/70">
              Cliente
            </label>
            <input
              id="q"
              name="q"
              defaultValue={q}
              placeholder="Nombre del cliente"
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="estado" className="text-sm font-medium text-black/70">
              Estado pedido
            </label>
            <select
              id="estado"
              name="estado"
              defaultValue={estado}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
            >
              <option value="">Todos</option>
              {Object.entries(ESTADO_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="pago" className="text-sm font-medium text-black/70">
              Estado pago
            </label>
            <select
              id="pago"
              name="pago"
              defaultValue={pago}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
              <option value="rechazado">Rechazado</option>
            </select>
          </div>

          <div className="flex items-end gap-3">
            <button
              type="submit"
              className="inline-flex items-center rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Filtrar
            </button>
            <a
              href="/admin/pedidos"
              className="inline-flex items-center rounded-2xl border border-black/10 px-4 py-3 text-sm font-medium text-black/75 transition hover:border-black/20"
            >
              Limpiar
            </a>
          </div>
        </form>
      </section>

      {/* Listado */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-black/45">
            {pedidos.length === 0
              ? "Sin pedidos"
              : `${pedidos.length} pedido${pedidos.length !== 1 ? "s" : ""}`}
            {estado ? ` · ${ESTADO_LABELS[estado] ?? estado}` : ""}
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Error cargando pedidos: {error.message}
          </div>
        ) : pedidos.length === 0 ? (
          <div className="rounded-[32px] border border-black/10 bg-white px-6 py-16 text-center">
            <p className="text-sm text-black/45">
              {estado || pago || q
                ? "No se encontraron pedidos con esos filtros."
                : "Aún no hay pedidos registrados."}
            </p>
            <p className="mt-2 text-xs text-black/30">
              Los pedidos aparecerán aquí cuando los clientes completen una compra.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <PedidoCard key={pedido.id} p={pedido} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
