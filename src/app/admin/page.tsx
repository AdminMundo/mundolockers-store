import type { Metadata } from "next";
import { logoutAction } from "@/app/admin/actions";
import { createSupabaseServerAuthClient } from "@/lib/supabase/auth-server";

export const metadata: Metadata = {
  title: "Admin | Mundo Lockers",
  description: "Panel administrativo de Mundo Lockers.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const supabase = await createSupabaseServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      <section
        className="rounded-3xl border border-black/10 shadow-sm"
        style={{
          backgroundColor: "#111827",
          minHeight: "240px",
        }}
      >
        <div className="flex h-full min-h-[240px] flex-col justify-between gap-6 p-8 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p
              className="text-xs font-medium uppercase"
              style={{
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.18em",
              }}
            >
              Panel de administración
            </p>

            <h1
              className="mt-3 text-4xl font-semibold tracking-tight"
              style={{ color: "#ffffff" }}
            >
              Dashboard
            </h1>

            <p
              className="mt-3 text-base"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              Controla productos, cotizaciones, pedidos y clientes desde un solo lugar.
            </p>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-2xl px-4 py-2 text-sm font-medium transition"
              style={{
                backgroundColor: "#ffffff",
                color: "#111827",
              }}
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-black/45">Sesión</p>
          <p className="mt-3 text-lg font-medium text-black">
            {user?.email ?? "admin"}
          </p>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-black/45">Productos</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-black">
            Próximamente
          </p>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-black/45">Cotizaciones</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-black">
            Próximamente
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-dashed border-black/10 bg-white p-6 shadow-sm">
        <p className="text-sm text-black/60">
          Estructura base lista. El siguiente paso será crear la navegación real
          de módulos y empezar por productos o cotizaciones.
        </p>
      </section>
    </div>
  );
}