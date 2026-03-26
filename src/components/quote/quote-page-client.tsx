"use client";

import Link from "next/link";

import { CartHero } from "@/components/cart/cart-hero";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { useCart } from "@/lib/cart/use-cart";
import type { CartState } from "@/lib/cart/types";

type Props = {
  initialState: CartState;
};

export function QuotePageClient({ initialState }: Props) {
  const {
    quoteItems,
    purchaseItems,
    summary,
    setQuantity,
    removeItem,
  } = useCart(initialState);

  return (
    <main className="relative z-0 bg-neutral-50">
      <CartHero
        title="Cotizar"
        description="Solicita una propuesta para compras por volumen, proyectos institucionales, personalización o muebles especiales de Mundo Lockers."
      />

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="space-y-6">
            {quoteItems.length > 0 ? (
              <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
                <div className="max-w-2xl">
                  <p className="text-sm font-medium text-neutral-500">
                    Productos seleccionados
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
                    Productos para cotizar
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-neutral-600 sm:text-base">
                    Estos productos vienen desde tu carrito de cotización. Puedes
                    ajustar cantidades o eliminar los que no necesites antes de
                    enviar la solicitud.
                  </p>
                </div>

                <div className="mt-8 space-y-4">
                  {quoteItems.map((item) => (
                    <CartLineItem
                      key={item.id}
                      item={item}
                      onQuantityChange={(nextQuantity) =>
                        setQuantity(item.id, nextQuantity)
                      }
                      onRemove={() => removeItem(item.id)}
                    />
                  ))}
                </div>
              </section>
            ) : (
              <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
                <div className="max-w-2xl">
                  <p className="text-sm font-medium text-neutral-500">
                    Sin productos en cotización
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
                    Aún no has agregado productos para cotizar
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-neutral-600 sm:text-base">
                    Agrega productos desde la tienda usando el botón de cotizar o
                    desde el carrito híbrido.
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/tienda"
                      className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition duration-200 hover:bg-[#F5B301] hover:text-neutral-950 hover:shadow-[0_0_0_3px_rgba(245,179,1,0.15)]"
                    >
                      Ver tienda
                    </Link>

                    <Link
                      href="/carrito"
                      className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition duration-200 hover:border-[#F5B301] hover:bg-white hover:shadow-[0_0_0_3px_rgba(245,179,1,0.15)]"
                    >
                      Ir al carrito
                    </Link>
                  </div>
                </div>
              </section>
            )}

            <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
              <div className="max-w-2xl">
                <p className="text-sm font-medium text-neutral-500">
                  Solicitud comercial
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                  Cuéntanos tu proyecto
                </h1>
                <p className="mt-4 text-sm leading-7 text-neutral-600 sm:text-base">
                  Completa los datos de tu requerimiento y nuestro equipo te
                  ayudará con una propuesta según cantidad, medidas, despacho,
                  personalización y tipo de uso.
                </p>
              </div>

              <form className="mt-8 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-neutral-800">
                    Nombre
                  </span>
                  <input
                    type="text"
                    placeholder="Nombre y apellido"
                    className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-neutral-800">
                    Empresa
                  </span>
                  <input
                    type="text"
                    placeholder="Nombre de empresa"
                    className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-neutral-800">
                    Correo
                  </span>
                  <input
                    type="email"
                    placeholder="ventas@mundolockers.cl"
                    className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-neutral-800">
                    Teléfono
                  </span>
                  <input
                    type="tel"
                    placeholder="+56 9 3388 2434"
                    className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-neutral-800">
                    Tipo de proyecto
                  </span>
                  <input
                    type="text"
                    placeholder="Ejemplo: colegio, minería, oficina, bodega, camarines"
                    className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-medium text-neutral-800">
                    Mensaje
                  </span>
                  <textarea
                    rows={6}
                    placeholder="Cuéntanos cantidad, medidas, colores, comuna de entrega o cualquier detalle importante."
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
                  />
                </label>

                <div className="flex flex-col gap-3 pt-2 sm:col-span-2 sm:flex-row">
                  <button
                    type="submit"
                    className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition duration-200 hover:bg-[#F5B301] hover:text-neutral-950 hover:shadow-[0_0_0_3px_rgba(245,179,1,0.15)]"
                  >
                    Enviar solicitud
                  </button>

                  <a
                    href="https://wa.me/56933882434"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition duration-200 hover:border-[#F5B301] hover:bg-white hover:shadow-[0_0_0_3px_rgba(245,179,1,0.15)]"
                  >
                    Cotizar por WhatsApp
                  </a>
                </div>
              </form>
            </section>
          </section>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {summary.mixedFlow ? (
              <section className="rounded-[28px] bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-800">
                Tu carrito tiene productos de compra directa y productos para
                cotizar. Cada flujo continúa por separado.
              </section>
            ) : null}

            <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
                ¿Qué puedes cotizar?
              </h2>

              <div className="mt-5 space-y-3 text-sm leading-7 text-neutral-600">
                <p>Lockers metálicos y plásticos.</p>
                <p>Proyectos para colegios, minería, industria y oficinas.</p>
                <p>Volumen, medidas especiales y configuración personalizada.</p>
                <p>Despacho, instalación y requerimientos institucionales.</p>
              </div>
            </section>

            <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
                Accesos rápidos
              </h2>

              <div className="mt-5 grid gap-3">
                {purchaseItems.length > 0 ? (
                  <Link
                    href="/checkout"
                    className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition duration-200 hover:bg-[#F5B301] hover:text-neutral-950 hover:shadow-[0_0_0_3px_rgba(245,179,1,0.15)]"
                  >
                    Finalizar compra
                  </Link>
                ) : null}

                <Link
                  href="/tienda"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition duration-200 hover:border-[#F5B301] hover:bg-white hover:shadow-[0_0_0_3px_rgba(245,179,1,0.15)]"
                >
                  Ver tienda
                </Link>

                <Link
                  href="/carrito"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition duration-200 hover:border-[#F5B301] hover:bg-white hover:shadow-[0_0_0_3px_rgba(245,179,1,0.15)]"
                >
                  Ir al carrito
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}