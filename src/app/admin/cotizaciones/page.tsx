import type { Metadata } from "next";
import Image from "next/image";
import { createSupabaseServer } from "@/lib/supabase/server";
import { CotizacionCard } from "@/app/admin/cotizaciones/CotizacionCard";

export const metadata: Metadata = {
  title: "Cotizaciones | Admin | LockerStore",
  description: "Gestión de cotizaciones del panel admin.",
  robots: { index: false, follow: false },
};

type Cotizacion = {
  id: string;
  nombre: string;
  empresa: string | null;
  correo: string;
  telefono: string | null;
  tipo_proyecto: string | null;
  mensaje: string | null;
  productos: unknown;
  estado: string;
  created_at: string;
};

export default async function AdminCotizacionesPage() {
  const supabase = createSupabaseServer();

  const { data: cotizaciones, error } = await supabase
    .from("cotizaciones")
    .select("id,nombre,empresa,correo,telefono,tipo_proyecto,mensaje,productos,estado,created_at")
    .order("created_at", { ascending: false })
    .returns<Cotizacion[]>();

  const items = cotizaciones ?? [];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <section className="relative overflow-hidden rounded-[36px] border border-black/10 text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
        <div className="absolute inset-0">
          <Image
            src="/images/home/Encabezadoprincipal.webp"
            alt="Banner cotizaciones"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,20,0.82)_0%,rgba(7,15,30,0.68)_42%,rgba(10,20,35,0.42)_100%)]" />

        <div className="relative flex min-h-60 flex-col justify-end gap-2 p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
            Panel de administración
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Cotizaciones
          </h1>
          <p className="mt-1 max-w-xl text-sm leading-6 text-white/80">
            {items.length > 0
              ? `${items.length} solicitud${items.length !== 1 ? "es" : ""} recibida${items.length !== 1 ? "s" : ""} · ordenadas por más reciente`
              : "Aún no hay solicitudes de cotización."}
          </p>
        </div>
      </section>

      {error ? (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Error al cargar cotizaciones: {error.message}
        </section>
      ) : items.length === 0 ? (
        <section className="rounded-3xl border border-black/10 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-black/40">
            Cuando alguien envíe una solicitud aparecerá aquí.
          </p>
        </section>
      ) : (
        <section className="space-y-4">
          {items.map((c) => (
            <CotizacionCard key={c.id} c={c} />
          ))}
        </section>
      )}
    </div>
  );
}
