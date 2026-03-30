import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cotizaciones | Admin | Mundo Lockers",
  description: "Gestión de cotizaciones del panel admin.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminCotizacionesPage() {
  return (
    <div className="space-y-6">
      <section
        className="rounded-3xl border border-black/10 shadow-sm"
        style={{
          backgroundColor: "#111827",
          minHeight: "220px",
        }}
      >
        <div className="flex min-h-[220px] flex-col justify-end p-8 text-white">
          <p
            className="text-xs font-medium uppercase"
            style={{ letterSpacing: "0.18em", color: "rgba(255,255,255,0.7)" }}
          >
            Panel de administración
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Cotizaciones
          </h1>
          <p className="mt-3 text-base text-white/85">
            Aquí revisaremos solicitudes, estados y seguimiento comercial.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <p className="text-sm text-black/60">
          Módulo base listo. Luego conectamos la bandeja real de cotizaciones.
        </p>
      </section>
    </div>
  );
}