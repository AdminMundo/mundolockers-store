import Link from "next/link";

export function CheckoutEmptyState() {
  return (
    <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-xl">
          📦
        </div>

        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
          No hay productos para comprar
        </h2>

        <p className="mt-3 text-sm leading-6 text-neutral-600 sm:text-base">
          Tu checkout solo procesa productos de compra directa. Si necesitas una
          propuesta comercial o tienes productos especiales, usa el flujo de
          cotización.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/carrito"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#0477BF] hover:text-white"
          >
            Volver al carrito
          </Link>

          <Link
            href="/cotizar"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[#0477BF]/40 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition-colors duration-200 hover:border-[#0477BF] hover:shadow-[0_0_0_3px_rgba(4,119,191,0.15)]"
          >
            Ir a cotización
          </Link>
        </div>
      </div>
    </section>
  );
}