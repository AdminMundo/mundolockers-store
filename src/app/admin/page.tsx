import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { logoutAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth/admin";
import { createSupabaseServer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin | LockerStore",
  description: "Panel administrativo de LockerStore.",
  robots: { index: false, follow: false },
};

const ESTADO_DOT: Record<string, string> = {
  pendiente: "bg-[#E18147]",
  "en-proceso": "bg-blue-500",
  respondida: "bg-green-500",
  cerrada: "bg-zinc-400",
};

const ESTADO_LABEL: Record<string, string> = {
  pendiente: "Pendiente",
  "en-proceso": "En proceso",
  respondida: "Respondida",
  cerrada: "Cerrada",
};

const PAGO_DOT: Record<string, string> = {
  pendiente: "bg-[#E18147]",
  pagado: "bg-green-500",
  rechazado: "bg-red-400",
};

const PAGO_LABEL: Record<string, string> = {
  pendiente: "Pendiente",
  pagado: "Pagado",
  rechazado: "Rechazado",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminPage() {
  const user = await requireAdmin();
  const supabase = createSupabaseServer();

  const [productsRes, cotizacionesRes, pedidosRes] = await Promise.all([
    supabase
      .from("catalog_products")
      .select("product_id,is_active,is_featured,has_in_stock,price_from_clp,image_url"),
    supabase
      .from("cotizaciones")
      .select("id,nombre,empresa,correo,estado,created_at")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("pedidos")
      .select("id,numero,nombre,correo,total,tipo_pago,estado_pago,created_at")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const products = productsRes.data ?? [];
  const cotizaciones = cotizacionesRes.data ?? [];
  const pedidos = pedidosRes.data ?? [];

  // Stats de productos
  const totalProductos = products.length;
  const activosCount = products.filter((p) => p.is_active).length;
  const sinPrecio = products.filter(
    (p) => !p.price_from_clp || p.price_from_clp === 0,
  ).length;
  const sinImagen = products.filter((p) => !p.image_url).length;

  // Stats de cotizaciones
  const pendientes = cotizaciones.filter((c) => c.estado === "pendiente").length;
  const enProceso = cotizaciones.filter((c) => c.estado === "en-proceso").length;
  const respondidas = cotizaciones.filter((c) => c.estado === "respondida").length;
  const cerradas = cotizaciones.filter((c) => c.estado === "cerrada").length;
  const recientes = cotizaciones.slice(0, 4);

  // Stats de pedidos
  const pedidosPendientes = pedidos.filter((p) => p.estado_pago === "pendiente").length;
  const pedidosPagados = pedidos.filter((p) => p.estado_pago === "pagado").length;
  const pedidosRechazados = pedidos.filter((p) => p.estado_pago === "rechazado").length;
  const ventaTotal = pedidos
    .filter((p) => p.estado_pago === "pagado")
    .reduce((sum, p) => sum + (p.total ?? 0), 0);
  const pedidosRecientes = pedidos.slice(0, 5);

  const kpis = [
    {
      label: "Productos activos",
      value: activosCount,
      sub: `de ${totalProductos} totales`,
      color: "text-white",
      bg: "bg-zinc-900",
      accent: "#E18147",
    },
    {
      label: "Cotizaciones pendientes",
      value: pendientes,
      sub: `${enProceso} en proceso`,
      color: "text-[#E18147]",
      bg: "bg-white",
      accent: null,
    },
    {
      label: "Pedidos pendientes de pago",
      value: pedidosPendientes,
      sub: `${pedidosPagados} pagado${pedidosPagados !== 1 ? "s" : ""}`,
      color: pedidosPendientes > 0 ? "text-[#E18147]" : "text-green-600",
      bg: "bg-white",
      accent: null,
    },
    {
      label: "Sin precio",
      value: sinPrecio,
      sub: sinPrecio > 0 ? "requieren atención" : "todo en orden",
      color: sinPrecio > 0 ? "text-red-500" : "text-green-600",
      bg: "bg-white",
      accent: null,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Banner */}
      <section className="relative overflow-hidden rounded-[36px] border border-black/10 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
        <div className="absolute inset-0">
          <Image
            src="/images/home/Encabezadoprincipal.webp"
            alt="Banner panel admin LockerStore"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,20,0.88)_0%,rgba(7,15,30,0.72)_50%,rgba(10,20,35,0.45)_100%)]" />

        <div className="relative flex min-h-55 flex-col justify-between gap-6 p-6 md:flex-row md:items-end md:p-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
              Panel de administración
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-white/70">
              {new Date().toLocaleDateString("es-CL", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 md:items-end">
            <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-2.5 text-sm text-white/80 backdrop-blur-sm">
              {user?.email ?? "admin"}
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className={[
              "rounded-[28px] border border-black/8 p-6 shadow-sm",
              k.bg,
            ].join(" ")}
          >
            <p className={["text-[11px] font-semibold uppercase tracking-widest", k.bg === "bg-zinc-900" ? "text-white/50" : "text-black/40"].join(" ")}>
              {k.label}
            </p>
            <p className={["mt-3 text-4xl font-semibold tabular-nums tracking-tight", k.color].join(" ")}>
              {k.value}
            </p>
            <p className={["mt-1.5 text-xs", k.bg === "bg-zinc-900" ? "text-white/40" : "text-black/40"].join(" ")}>
              {k.sub}
            </p>
            {k.accent && (
              <div
                className="mt-4 h-0.5 w-10 rounded-full"
                style={{ backgroundColor: k.accent }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Cotizaciones recientes + Alertas */}
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* Cotizaciones recientes */}
        <div className="rounded-[32px] border border-black/8 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-black/40">
                Últimas solicitudes
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-black">
                Cotizaciones recientes
              </h2>
            </div>
            <Link
              href="/admin/cotizaciones"
              className="rounded-xl border border-black/10 px-3 py-1.5 text-xs font-medium text-black/60 transition hover:border-black/20 hover:text-black"
            >
              Ver todas →
            </Link>
          </div>

          {recientes.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-black/10 p-6 text-center text-sm text-black/35">
              Aún no hay cotizaciones recibidas.
            </div>
          ) : (
            <ul className="mt-5 divide-y divide-black/5">
              {recientes.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-4 py-3.5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={[
                          "h-2 w-2 shrink-0 rounded-full",
                          ESTADO_DOT[c.estado] ?? "bg-zinc-300",
                        ].join(" ")}
                      />
                      <span className="truncate text-sm font-medium text-black">
                        {c.nombre}
                      </span>
                      {c.empresa && (
                        <span className="hidden truncate text-xs text-black/40 sm:block">
                          · {c.empresa}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 pl-4 text-xs text-black/40">
                      {c.correo} · {formatDate(c.created_at)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-black/8 px-2.5 py-0.5 text-[11px] font-medium text-black/60">
                    {ESTADO_LABEL[c.estado] ?? c.estado}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Panel derecho */}
        <div className="space-y-5">
          {/* Resumen cotizaciones */}
          <div className="rounded-[32px] border border-black/8 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-black/40">
              Estado general
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-black">
              Cotizaciones
            </h2>
            <div className="mt-4 space-y-2.5">
              {[
                { label: "Pendientes", value: pendientes, dot: "bg-[#E18147]" },
                { label: "En proceso", value: enProceso, dot: "bg-blue-500" },
                { label: "Respondidas", value: respondidas, dot: "bg-green-500" },
                { label: "Cerradas", value: cerradas, dot: "bg-zinc-300" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={["h-2 w-2 rounded-full", row.dot].join(" ")} />
                    <span className="text-sm text-black/60">{row.label}</span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-black">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Alertas de catálogo */}
          <div className="rounded-[32px] border border-black/8 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-black/40">
              Calidad del catálogo
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-black">
              Alertas
            </h2>
            <div className="mt-4 space-y-2">
              <AlertRow
                label="Sin precio definido"
                value={sinPrecio}
                total={totalProductos}
                warn={sinPrecio > 0}
              />
              <AlertRow
                label="Sin imagen"
                value={sinImagen}
                total={totalProductos}
                warn={sinImagen > 0}
              />
              <AlertRow
                label="Inactivos"
                value={totalProductos - activosCount}
                total={totalProductos}
                warn={false}
              />
            </div>
            <Link
              href="/admin/productos"
              className="mt-4 block rounded-2xl border border-black/10 bg-[#F8F8FA] px-4 py-2.5 text-center text-xs font-medium text-black/60 transition hover:border-black/20 hover:text-black"
            >
              Ir al catálogo →
            </Link>
          </div>
        </div>
      </div>

      {/* Pedidos recientes + resumen */}
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* Pedidos recientes */}
        <div className="rounded-[32px] border border-black/8 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-black/40">
                Últimos pedidos
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-black">
                Pedidos recientes
              </h2>
            </div>
            <Link
              href="/admin/pedidos"
              className="rounded-xl border border-black/10 px-3 py-1.5 text-xs font-medium text-black/60 transition hover:border-black/20 hover:text-black"
            >
              Ver todos →
            </Link>
          </div>

          {pedidosRecientes.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-black/10 p-6 text-center text-sm text-black/35">
              Aún no hay pedidos recibidos.
            </div>
          ) : (
            <ul className="mt-5 divide-y divide-black/5">
              {pedidosRecientes.map((p) => {
                const label = p.numero
                  ? `#${String(p.numero).padStart(4, "0")}`
                  : p.id.slice(0, 8).toUpperCase();
                return (
                  <li key={p.id} className="flex items-center justify-between gap-4 py-3.5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={["h-2 w-2 shrink-0 rounded-full", PAGO_DOT[p.estado_pago] ?? "bg-zinc-300"].join(" ")} />
                        <span className="text-sm font-medium text-black">{label}</span>
                        <span className="hidden truncate text-xs text-black/40 sm:block">· {p.nombre}</span>
                      </div>
                      <p className="mt-0.5 pl-4 text-xs text-black/40">
                        {p.correo} · {formatDate(p.created_at)} · {p.tipo_pago}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-sm font-semibold tabular-nums text-black">
                        ${Number(p.total ?? 0).toLocaleString("es-CL")}
                      </span>
                      <span className="rounded-full border border-black/8 px-2.5 py-0.5 text-[11px] font-medium text-black/60">
                        {PAGO_LABEL[p.estado_pago] ?? p.estado_pago}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Resumen pedidos */}
        <div className="space-y-5">
          <div className="rounded-[32px] border border-black/8 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-black/40">
              Estado general
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-black">
              Pedidos
            </h2>
            <div className="mt-4 space-y-2.5">
              {[
                { label: "Pendientes de pago", value: pedidosPendientes, dot: "bg-[#E18147]" },
                { label: "Pagados", value: pedidosPagados, dot: "bg-green-500" },
                { label: "Rechazados", value: pedidosRechazados, dot: "bg-red-400" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={["h-2 w-2 rounded-full", row.dot].join(" ")} />
                    <span className="text-sm text-black/60">{row.label}</span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums text-black">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-black/8 pt-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-black/40">Ventas confirmadas</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-green-600">
                ${ventaTotal.toLocaleString("es-CL")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            href: "/admin/productos/nuevo",
            title: "Nuevo producto",
            desc: "Agrega un producto al catálogo.",
            cta: "Crear →",
          },
          {
            href: "/admin/cotizaciones",
            title: "Bandeja de cotizaciones",
            desc: `${pendientes} solicitud${pendientes !== 1 ? "es" : ""} pendiente${pendientes !== 1 ? "s" : ""} de responder.`,
            cta: "Revisar →",
          },
          {
            href: "/tienda",
            title: "Ver tienda",
            desc: "Revisa cómo se ve el catálogo en la tienda.",
            cta: "Abrir →",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-[28px] border border-black/8 bg-white p-5 shadow-sm transition hover:border-black/15 hover:shadow-md"
          >
            <p className="text-base font-semibold text-black">{item.title}</p>
            <p className="mt-1.5 text-sm text-black/50">{item.desc}</p>
            <p className="mt-4 text-xs font-medium text-black/30 transition group-hover:text-black/60">
              {item.cta}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function AlertRow({
  label,
  value,
  total,
  warn,
}: {
  label: string;
  value: number;
  total: number;
  warn: boolean;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-black/60">{label}</span>
        <span className={["font-semibold tabular-nums", warn && value > 0 ? "text-red-500" : "text-black/60"].join(" ")}>
          {value}
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-black/5">
        <div
          className={["h-1.5 rounded-full transition-all", warn && value > 0 ? "bg-red-400" : "bg-zinc-300"].join(" ")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
