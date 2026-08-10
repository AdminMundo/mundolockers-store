import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/user";
import { createSupabaseServer } from "@/lib/supabase/server";
import { logoutAction } from "@/app/(auth)/actions";
import { ChangePasswordForm } from "./change-password-form";

export const metadata: Metadata = {
  title: "Mi cuenta",
  description: "Revisa tus pedidos y cotizaciones.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PedidoRow = {
  id: string;
  numero: number | null;
  estado: string;
  estado_pago: string;
  total: number | null;
  productos: unknown;
  created_at: string;
};

type CotizacionRow = {
  id: string;
  estado: string;
  tipo_proyecto: string | null;
  mensaje: string | null;
  created_at: string;
};

const ESTADO_PEDIDO_LABELS: Record<string, string> = {
  recibido: "Recibido",
  gestionando: "Gestionando",
  preparado: "Preparado",
  enviado: "Enviado",
  listo_retiro: "Listo para retiro",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

const ESTADO_PAGO_LABELS: Record<string, string> = {
  pendiente: "Pago pendiente",
  pagado: "Pagado",
  rechazado: "Rechazado",
};

const ESTADO_COTIZACION_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  "en-proceso": "En proceso",
  respondida: "Respondida",
  cerrada: "Cerrada",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function MiCuentaPage() {
  const user = await requireUser();
  const supabase = createSupabaseServer();

  const [{ data: pedidos }, { data: cotizaciones }] = await Promise.all([
    supabase
      .from("pedidos")
      .select("id, numero, estado, estado_pago, total, productos, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .returns<PedidoRow[]>(),
    supabase
      .from("cotizaciones")
      .select("id, estado, tipo_proyecto, mensaje, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .returns<CotizacionRow[]>(),
  ]);

  const displayName =
    (user.user_metadata?.full_name as string | undefined) || user.email || "Tu cuenta";

  return (
    <main className="min-h-screen bg-[#EEEDEB] px-4 pb-24 pt-28">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
          <div>
            <p className="text-sm text-black/50">LockerStore</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Hola, {displayName}
            </h1>
            {user.email && <p className="mt-1 text-sm text-black/50">{user.email}</p>}
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-2xl border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-black/70 transition hover:border-black/25"
            >
              Cerrar sesión
            </button>
          </form>
        </section>

        {/* Pedidos */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-black">Mis pedidos</h2>

          {!pedidos || pedidos.length === 0 ? (
            <div className="rounded-[28px] border border-black/10 bg-white px-6 py-12 text-center text-sm text-black/45">
              Aún no tienes pedidos.{" "}
              <Link href="/tienda" className="font-medium text-black hover:underline">
                Ir a la tienda
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {pedidos.map((p) => {
                const productos = Array.isArray(p.productos)
                  ? (p.productos as { name?: string; quantity: number }[])
                  : [];

                return (
                  <article
                    key={p.id}
                    className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="font-mono text-sm font-semibold text-black/50">
                          {p.numero ? `#${String(p.numero).padStart(4, "0")}` : p.id.slice(0, 8)}
                        </span>
                        <span className="ml-3 text-xs text-black/40">
                          {formatDate(p.created_at)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-black/10 bg-black/5 px-2.5 py-1 text-xs font-medium text-black/70">
                          {ESTADO_PEDIDO_LABELS[p.estado] ?? p.estado}
                        </span>
                        <span className="rounded-full border border-black/10 bg-black/5 px-2.5 py-1 text-xs font-medium text-black/70">
                          {ESTADO_PAGO_LABELS[p.estado_pago] ?? p.estado_pago}
                        </span>
                      </div>
                    </div>

                    {productos.length > 0 && (
                      <p className="mt-3 text-sm text-black/60">
                        {productos.map((it) => `${it.name ?? "Producto"} ×${it.quantity}`).join(", ")}
                      </p>
                    )}

                    {p.total != null && (
                      <p className="mt-2 text-lg font-semibold text-black">
                        ${Math.round(p.total).toLocaleString("es-CL")}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Cotizaciones */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-black">Mis cotizaciones</h2>

          {!cotizaciones || cotizaciones.length === 0 ? (
            <div className="rounded-[28px] border border-black/10 bg-white px-6 py-12 text-center text-sm text-black/45">
              Aún no tienes cotizaciones.{" "}
              <Link href="/cotizar" className="font-medium text-black hover:underline">
                Solicitar una cotización
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {cotizaciones.map((c) => (
                <article
                  key={c.id}
                  className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-black/40">{formatDate(c.created_at)}</span>
                    <span className="rounded-full border border-black/10 bg-black/5 px-2.5 py-1 text-xs font-medium text-black/70">
                      {ESTADO_COTIZACION_LABELS[c.estado] ?? c.estado}
                    </span>
                  </div>

                  {c.tipo_proyecto && (
                    <p className="mt-3 text-sm font-medium text-black/80">{c.tipo_proyecto}</p>
                  )}
                  {c.mensaje && (
                    <p className="mt-1 line-clamp-2 text-sm text-black/60">{c.mensaje}</p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Seguridad */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-black">Seguridad</h2>
          <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
            <p className="mb-4 text-sm text-black/55">Cambia la contraseña de tu cuenta.</p>
            <ChangePasswordForm />
          </div>
        </section>
      </div>
    </main>
  );
}
