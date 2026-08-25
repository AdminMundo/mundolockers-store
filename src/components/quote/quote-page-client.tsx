"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";

import { CartHero } from "@/components/cart/cart-hero";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { useCart } from "@/lib/cart/use-cart";
import type { CartState } from "@/lib/cart/types";
import {
  submitQuoteAction,
  type QuoteActionState,
} from "@/app/(store)/cotizar/actions";

type Props = {
  initialState: CartState;
};

const initialActionState: QuoteActionState = { success: false, error: null };

export function QuotePageClient({ initialState }: Props) {
  const { quoteItems, purchaseItems, summary, setQuantity, removeItem } =
    useCart(initialState);

  const [state, formAction, pending] = useActionState(
    submitQuoteAction,
    initialActionState,
  );

  const [formRenderedAt] = useState(() => Date.now());

  const productosJson = useMemo(
    () =>
      quoteItems.length > 0
        ? JSON.stringify(
            quoteItems.map((item) => ({
              name: item.product.name,
              sku: item.product.sku,
              quantity: item.quantity,
              unitPrice: item.pricing.unitPrice,
              variant: item.variant?.name ?? null,
            })),
          )
        : "",
    [quoteItems],
  );

  return (
    <main className="relative z-0 bg-[#EEEDEB]">
      <CartHero
        title="Cotizar"
        description="Solicita una propuesta para compras por volumen, proyectos institucionales, personalización o muebles especiales de LockerStore."
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
                      className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition duration-200 hover:bg-[#0477BF] hover:text-white hover:shadow-[0_0_0_3px_rgba(4,119,191,0.15)]"
                    >
                      Ver tienda
                    </Link>

                    <Link
                      href="/carrito"
                      className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition duration-200 hover:border-[#0477BF] hover:bg-white hover:shadow-[0_0_0_3px_rgba(4,119,191,0.15)]"
                    >
                      Ir al carrito
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {/* Formulario */}
            <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
              {state.success ? (
                <div className="flex flex-col items-start gap-4 py-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
                      Solicitud enviada
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-neutral-600">
                      Recibimos tu solicitud de cotización. Nuestro equipo te
                      contactará a la brevedad al correo indicado.
                    </p>
                  </div>
                  <Link
                    href="/tienda"
                    className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-black/10 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition duration-200 hover:border-[#0477BF] hover:shadow-[0_0_0_3px_rgba(4,119,191,0.15)]"
                  >
                    Seguir viendo productos
                  </Link>
                </div>
              ) : (
                <>
                  <div className="max-w-2xl">
                    <p className="text-sm font-medium text-neutral-500">
                      Solicitud comercial
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                      Cuéntanos tu proyecto
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-neutral-600 sm:text-base">
                      Completa los datos de tu requerimiento y nuestro equipo te
                      ayudará con una propuesta según cantidad, medidas, despacho,
                      personalización y tipo de uso.
                    </p>
                  </div>

                  <form action={formAction} className="mt-8 grid gap-4 sm:grid-cols-2">
                    {productosJson && (
                      <input type="hidden" name="productos" value={productosJson} />
                    )}
                    <input type="hidden" name="ts" value={formRenderedAt} />

                    {/* Honeypot anti-spam: invisible para personas, los bots suelen completarlo */}
                    <div
                      aria-hidden="true"
                      className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden"
                    >
                      <label htmlFor="company_site">No completar este campo</label>
                      <input
                        type="text"
                        id="company_site"
                        name="company_site"
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-neutral-800">
                        Nombre <span className="text-red-500">*</span>
                      </span>
                      <input
                        type="text"
                        name="nombre"
                        required
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
                        name="empresa"
                        placeholder="Nombre de empresa"
                        className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-neutral-800">
                        RUT empresa
                      </span>
                      <input
                        type="text"
                        name="rut"
                        placeholder="76.123.456-7"
                        className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-neutral-800">
                        Correo <span className="text-red-500">*</span>
                      </span>
                      <input
                        type="email"
                        name="correo"
                        required
                        placeholder="tucorreo@empresa.cl"
                        className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-neutral-800">
                        Teléfono
                      </span>
                      <input
                        type="tel"
                        name="telefono"
                        placeholder="+56 9 3628 9818"
                        className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
                      />
                    </label>

                    <label className="block sm:col-span-2">
                      <span className="mb-2 block text-sm font-medium text-neutral-800">
                        Tipo de proyecto
                      </span>
                      <input
                        type="text"
                        name="tipo_proyecto"
                        placeholder="Ejemplo: colegio, minería, oficina, bodega, camarines"
                        className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
                      />
                    </label>

                    <label className="block sm:col-span-2">
                      <span className="mb-2 block text-sm font-medium text-neutral-800">
                        Mensaje
                      </span>
                      <textarea
                        name="mensaje"
                        rows={6}
                        placeholder="Cuéntanos cantidad, medidas, colores, comuna de entrega o cualquier detalle importante."
                        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
                      />
                    </label>

                    {state.error ? (
                      <div className="sm:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {state.error}
                      </div>
                    ) : null}

                    <div className="flex flex-col gap-3 pt-2 sm:col-span-2 sm:flex-row">
                      <button
                        type="submit"
                        disabled={pending}
                        className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-neutral-950 px-6 py-3 text-sm font-medium text-white transition duration-200 hover:bg-[#0477BF] hover:text-white hover:shadow-[0_0_0_3px_rgba(4,119,191,0.15)] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {pending ? "Enviando…" : "Enviar solicitud"}
                      </button>

                      <a
                        href="https://wa.me/56936289818"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition duration-200 hover:border-[#0477BF] hover:bg-white hover:shadow-[0_0_0_3px_rgba(4,119,191,0.15)]"
                      >
                        Cotizar por WhatsApp
                      </a>
                    </div>
                  </form>
                </>
              )}
            </section>
          </section>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {summary.mixedFlow ? (
              <section className="rounded-[28px] bg-[#0477BF]/10 px-5 py-4 text-sm leading-7 text-[#04395c]">
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
                    className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition duration-200 hover:bg-[#0477BF] hover:text-white hover:shadow-[0_0_0_3px_rgba(4,119,191,0.15)]"
                  >
                    Finalizar compra
                  </Link>
                ) : null}

                <Link
                  href="/tienda"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition duration-200 hover:border-[#0477BF] hover:bg-white hover:shadow-[0_0_0_3px_rgba(4,119,191,0.15)]"
                >
                  Ver tienda
                </Link>

                <Link
                  href="/carrito"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition duration-200 hover:border-[#0477BF] hover:bg-white hover:shadow-[0_0_0_3px_rgba(4,119,191,0.15)]"
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
