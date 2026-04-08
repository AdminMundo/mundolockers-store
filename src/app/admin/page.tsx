import type { Metadata } from "next";
import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { createSupabaseServerAuthClient } from "@/lib/supabase/auth-server";
import Image from "next/image";


export const metadata: Metadata = {
  title: "Admin | Lockers Store",
  description: "Panel administrativo de Lockers Store.",
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
      <section className="relative overflow-hidden rounded-[36px] border border-black/10 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
        <div className="absolute inset-0">
          <Image
            src="/images/home/Encabezadoprincipal.webp"
            alt="Banner panel admin Mundo Lockers"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,20,0.82)_0%,rgba(7,15,30,0.68)_42%,rgba(10,20,35,0.42)_100%)]" />

        <div className="relative flex min-h-[260px] flex-col justify-between gap-8 p-6 md:min-h-[300px] md:flex-row md:items-end md:p-8">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Panel de administración
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/85 md:text-base">
              Controla productos, cotizaciones y operación comercial desde un
              panel limpio, rápido y preparado para crecer con Mundo Lockers.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/admin/productos"
                className="inline-flex items-center rounded-2xl bg-[#FDC90D] px-4 py-2.5 text-sm font-medium text-black transition hover:brightness-95"
              >
                Ir a productos
              </Link>

              <Link
                href="/admin/cotizaciones"
                className="inline-flex items-center rounded-2xl border border-white/15 bg-white/8 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/12"
              >
                Ver cotizaciones
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 md:items-end">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/90 backdrop-blur-sm">
              {user?.email ?? "admin"}
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:opacity-95"
              >
                Cerrar sesión
              </button>
            </form>
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
