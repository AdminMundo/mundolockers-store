"use client";

import Link from "next/link";

import { CartEmptyState } from "@/components/cart/cart-empty-state";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CartSummaryCard } from "@/components/cart/cart-summary-card";
import { formatClp } from "@/lib/cart/format";
import { useCart } from "@/lib/cart/use-cart";
import type { CartState, CartSummary } from "@/lib/cart/types";
import { CartHero } from "@/components/cart/cart-hero";

type Props = {
  initialState: CartState;
};

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-neutral-950 sm:text-2xl">
        {title}
      </h2>
      <p className="mt-1 text-sm leading-6 text-neutral-600">{description}</p>
    </div>
  );
}

function MobileStickyBar({ summary }: { summary: CartSummary }) {
  const hasPurchaseItems = summary.purchaseLineCount > 0;
  const hasQuoteItems = summary.quoteLineCount > 0;

  if (!hasPurchaseItems && !hasQuoteItems) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 px-4 pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
      <div className="mx-auto max-w-7xl">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-neutral-500">
              Total estimado
            </div>
            <div className="text-xl font-semibold tracking-tight text-neutral-950">
              {formatClp(summary.purchaseSubtotal)}
            </div>
          </div>

          <div className="text-right text-xs text-neutral-500">
            <div>{summary.totalQuantity} producto(s)</div>
            <div>{summary.quoteQuantity} para cotizar</div>
          </div>
        </div>

        <div className="grid gap-2">
          {hasPurchaseItems ? (
            <Link
              href="/checkout"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 "
            >
              Finalizar compra
            </Link>
          ) : null}

          {hasQuoteItems ? (
            <Link
              href="/cotizar"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
            >
              Solicitar cotización
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function CartPageClient({ initialState }: Props) {
  const {
    items,
    purchaseItems,
    quoteItems,
    summary,
    setQuantity,
    removeItem,
    clear,
  } = useCart(initialState);

  if (items.length === 0) {
    return (
      <main className="relative z-0 bg-neutral-50">
        <CartHero
          title="Carrito"
          description="Revisa tus productos, organiza tu compra y continúa con compra directa o cotización según el tipo de proyecto."
        />

        <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          <CartEmptyState />
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="relative z-0 bg-neutral-50">
        <CartHero
          title="Carrito"
          description="Revisa tus productos, ajusta cantidades y continúa con compra directa o solicitud de cotización."
        />

        <div className="mx-auto max-w-7xl px-4 pb-28 pt-8 sm:px-6 lg:px-8 lg:pb-10 lg:pt-10">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_390px]">
            <section className="space-y-6">
              {purchaseItems.length > 0 ? (
                <div className="space-y-4">
                  <SectionHeader
                    title="Compra directa"
                    description="Productos estándar con precio definido y continuación a checkout."
                  />

                  <div className="space-y-4">
                    {purchaseItems.map((item) => (
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
                </div>
              ) : null}

              {quoteItems.length > 0 ? (
                <div className="space-y-4">
                  <SectionHeader
                    title="Productos para cotizar"
                    description="Ítems para volumen, personalización o ventas institucionales."
                  />

                  <div className="space-y-4">
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
                </div>
              ) : null}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <Link
                  href="/tienda"
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
                >
                  Seguir comprando
                </Link>

                <button
                  type="button"
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                  onClick={clear}
                >
                  Vaciar carrito
                </button>
              </div>
            </section>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <CartSummaryCard summary={summary} />
            </div>
          </div>
        </div>
      </main>

      <MobileStickyBar summary={summary} />
    </>
  );
}