import Link from "next/link";

export function CartEmptyState() {
  return (
    <section className="rounded-[32px] border border-black/10 bg-white px-6 py-12 shadow-sm sm:px-10 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-2xl">
          🛒
        </div>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
          Tu carrito está vacío
        </h1>

        <p className="mt-4 text-base leading-7 text-neutral-600">
          Agrega productos desde la tienda o solicita cotización para proyectos
          institucionales, compras por volumen o muebles personalizados.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/tienda"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition duration-200 hover:bg-[#F5B301] hover:text-neutral-950 hover:shadow-[0_0_0_3px_rgba(245,179,1,0.15)]"
          >
            Ir a la tienda
          </Link>

          <Link
            href="/cotizar"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition duration-200 hover:border-[#F5B301] hover:bg-white hover:shadow-[0_0_0_3px_rgba(245,179,1,0.15)]"
          >
            Solicitar cotización
          </Link>
        </div>
      </div>
    </section>
  );
}