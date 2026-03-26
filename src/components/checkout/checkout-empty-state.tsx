import Link from "next/link";

export function CheckoutEmptyState() {
  return (
    <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-xl">
          📦
        </div>

        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
          No hay productos para comprar
        </h1>

        <p className="mt-3 text-sm leading-6 text-neutral-600 sm:text-base">
          Tu checkout solo procesa productos de compra directa. Si necesitas una
          propuesta comercial o tienes productos especiales, usa el flujo de
          cotización.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/carrito"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Volver al carrito
          </Link>

          <Link
            href="/cotizar"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-black/10 px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
          >
            Ir a cotización
          </Link>
        </div>
      </div>
    </section>
  );
}