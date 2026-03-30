import type { Metadata } from "next";
import Link from "next/link";
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
        className="overflow-hidden rounded-[36px] border border-black/10 text-white"
        style={{
          background:
            "linear-gradient(135deg, #0B1220 0%, #111827 45%, #1E293B 100%)",
          boxShadow: "0 18px 50px rgba(15,23,42,0.16)",
        }}
      >
        <div className="relative">
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: "-64px",
                top: "-64px",
                width: "224px",
                height: "224px",
                borderRadius: "9999px",
                background: "rgba(255,255,255,0.08)",
                filter: "blur(48px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                width: "176px",
                height: "176px",
                borderRadius: "9999px",
                background: "rgba(253,201,13,0.16)",
                filter: "blur(48px)",
              }}
            />
          </div>

          <div className="relative flex min-h-[260px] flex-col justify-between gap-8 p-6 md:min-h-[300px] md:flex-row md:items-end md:p-8">
            <div className="max-w-3xl">
              <p
                className="text-[11px] font-semibold uppercase"
                style={{
                  letterSpacing: "0.2em",
                  color: "rgba(255,255,255,0.62)",
                }}
              >
                Panel de administración
              </p>

              <h1
                className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl"
                style={{ color: "#FFFFFF" }}
              >
                Dashboard
              </h1>

              <p
                className="mt-4 max-w-2xl text-sm leading-6 md:text-base"
                style={{ color: "rgba(255,255,255,0.78)" }}
              >
                Controla productos, cotizaciones y operación comercial desde un
                panel limpio, rápido y preparado para crecer con Mundo Lockers.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/admin/productos"
                  className="inline-flex items-center rounded-2xl px-4 py-2.5 text-sm font-medium transition"
                  style={{
                    backgroundColor: "#FDC90D",
                    color: "#111111",
                  }}
                >
                  Ir a productos
                </Link>

                <Link
                  href="/admin/cotizaciones"
                  className="inline-flex items-center rounded-2xl px-4 py-2.5 text-sm font-medium transition"
                  style={{
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.06)",
                    color: "#FFFFFF",
                  }}
                >
                  Ver cotizaciones
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 md:items-end">
              <div
                className="rounded-2xl px-4 py-3 text-sm"
                style={{
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.82)",
                }}
              >
                {user?.email ?? "admin"}
              </div>

              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-2xl px-4 py-2.5 text-sm font-medium transition"
                  style={{
                    backgroundColor: "#FFFFFF",
                    color: "#111111",
                  }}
                >
                  Cerrar sesión
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-black/45">Productos</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-black">
            —
          </p>
          <p className="mt-2 text-sm text-black/55">
            Catálogo, variantes, precios y estado.
          </p>
        </div>

        <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-black/45">Cotizaciones</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-black">
            —
          </p>
          <p className="mt-2 text-sm text-black/55">
            Solicitudes recibidas y seguimiento comercial.
          </p>
        </div>

        <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-black/45">Sesión</p>
          <p className="mt-3 text-lg font-medium text-black">
            {user?.email ?? "admin"}
          </p>
          <p className="mt-2 text-sm text-black/55">
            Cuenta autorizada con acceso al panel.
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-black/45">Accesos rápidos</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black">
                Gestión central
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href="/admin/productos"
              className="rounded-[24px] border border-black/10 bg-[#F8F8FA] p-5 transition hover:border-black/20 hover:bg-white"
            >
              <p className="text-base font-medium text-black">Productos</p>
              <p className="mt-2 text-sm text-black/55">
                Edita catálogo, stock y precios.
              </p>
            </Link>

            <Link
              href="/admin/cotizaciones"
              className="rounded-[24px] border border-black/10 bg-[#F8F8FA] p-5 transition hover:border-black/20 hover:bg-white"
            >
              <p className="text-base font-medium text-black">Cotizaciones</p>
              <p className="mt-2 text-sm text-black/55">
                Revisa solicitudes y próximos pasos.
              </p>
            </Link>
          </div>
        </div>

        <div className="rounded-[32px] border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-black/45">Estado del panel</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black">
            Base lista
          </h2>
          <p className="mt-3 text-sm leading-6 text-black/60">
            La arquitectura ya quedó separada del storefront. El siguiente paso
            recomendado es conectar el módulo de productos a Supabase.
          </p>

          <div className="mt-6 rounded-[24px] border border-dashed border-black/10 bg-[#F8F8FA] p-4">
            <p className="text-sm text-black/60">
              Próximo módulo sugerido:
              <span className="ml-1 font-medium text-black">Productos</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
