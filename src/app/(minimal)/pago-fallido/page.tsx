import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Error en el pedido | LockerStore",
  robots: { index: false, follow: false },
};

type PagoFallidoPageProps = {
  searchParams: Promise<{ motivo?: string }>;
};

const MOTIVOS: Record<string, { title: string; description: string }> = {
  sin_stock: {
    title: "Producto sin stock",
    description: "Uno o más productos de tu pedido ya no tienen stock disponible. Revisa el carrito e intenta nuevamente.",
  },
  datos_invalidos: {
    title: "Datos incompletos",
    description: "Hubo un problema con los datos ingresados. Vuelve al checkout y verifica la información.",
  },
};

export default async function PagoFallidoPage({ searchParams }: PagoFallidoPageProps) {
  const { motivo } = await searchParams;
  const info = motivo ? (MOTIVOS[motivo] ?? null) : null;

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-lg px-4 pb-24 pt-12 sm:px-6">

        {/* X header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-neutral-950">
            {info?.title ?? "Algo salió mal"}
          </h1>

          <p className="mt-3 text-sm leading-7 text-neutral-600">
            {info?.description ??
              "No pudimos procesar tu pedido. Puede ser un problema temporal. Intenta nuevamente o contáctanos."}
          </p>
        </div>

        {/* Acciones */}
        <div className="mt-10 flex flex-col gap-3">
          <Link
            href="/checkout"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#E18147] hover:text-white"
          >
            Volver al checkout
          </Link>

          <Link
            href="/carrito"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-[#E18147]/40 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition-colors duration-200 hover:border-[#E18147] hover:shadow-[0_0_0_3px_rgba(225,129,71,0.15)]"
          >
            Ver mi carrito
          </Link>

          <Link
            href="/cotizar"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-[#E18147]/40 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition-colors duration-200 hover:border-[#E18147] hover:shadow-[0_0_0_3px_rgba(225,129,71,0.15)]"
          >
            Solicitar cotización
          </Link>
        </div>

        {/* Contacto directo */}
        <div className="mt-8 rounded-[24px] border border-black/10 bg-white p-5">
          <p className="text-sm font-medium text-neutral-900">¿Necesitas ayuda?</p>
          <p className="mt-1 text-sm text-neutral-500">
            Escríbenos directamente y te ayudamos a completar tu pedido.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={`mailto:${process.env.QUOTE_NOTIFICATION_EMAIL ?? "contacto@lockersstore.cl"}`}
              className="inline-flex items-center rounded-xl border border-black/10 bg-neutral-50 px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100"
            >
              Enviar email
            </a>
            <Link
              href="/tienda"
              className="inline-flex items-center rounded-xl border border-black/10 bg-neutral-50 px-4 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100"
            >
              Ver catálogo
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
