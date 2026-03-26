import { CartQuantityControl } from "@/components/cart/cart-quantity-control";
import { formatClp } from "@/lib/cart/format";
import type { CartLine } from "@/lib/cart/types";

type Props = {
  item: CartLine;
  onQuantityChange: (nextQuantity: number) => void;
  onRemove: () => void;
};

export function CartLineItem({
  item,
  onQuantityChange,
  onRemove,
}: Props) {
  const isPurchase = item.flow === "purchase";
  const unitPrice = item.pricing.unitPrice ?? 0;
  const subtotal = unitPrice * item.quantity;

  return (
    <article className="rounded-[24px] border border-black/10 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 sm:h-28 sm:w-28">
          {item.product.imageUrl ? (
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
              Sin imagen
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap gap-2">
                <span
                  className={`inline-flex min-h-7 items-center rounded-full px-3 text-xs font-medium ${
                    isPurchase
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {isPurchase ? "Compra directa" : "Cotización"}
                </span>

                {item.metadata.leadTimeLabel ? (
                  <span className="inline-flex min-h-7 items-center rounded-full bg-neutral-100 px-3 text-xs font-medium text-neutral-700">
                    {item.metadata.leadTimeLabel}
                  </span>
                ) : null}
              </div>

              <h3 className="line-clamp-2 text-base font-semibold tracking-tight text-neutral-950 sm:text-lg">
                {item.product.name}
              </h3>

              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-neutral-600">
                <span>SKU: {item.product.sku}</span>
                {item.variant ? <span>Variante: {item.variant.name}</span> : null}
              </div>
            </div>

            <button
              type="button"
              className="inline-flex min-h-10 items-center rounded-2xl border border-black/10 bg-white px-4 text-sm font-medium text-neutral-700 transition duration-200 hover:border-[#F5B301] hover:bg-white hover:text-neutral-900 hover:shadow-[0_0_0_3px_rgba(245,179,1,0.15)]"
              onClick={onRemove}
            >
              Eliminar
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-4 border-t border-black/5 pt-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <CartQuantityControl
                quantity={item.quantity}
                onChange={onQuantityChange}
              />

              {isPurchase ? (
                <div className="text-sm text-neutral-600">
                  Unitario:{" "}
                  <span className="font-medium text-neutral-950">
                    {formatClp(unitPrice)}
                  </span>
                </div>
              ) : (
                <div className="text-sm text-neutral-600">
                  Precio definido vía cotización
                </div>
              )}
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs uppercase tracking-wide text-neutral-500">
                {isPurchase ? "Subtotal" : "Estado"}
              </div>
              <div className="mt-1 text-lg font-semibold tracking-tight text-neutral-950">
                {isPurchase ? formatClp(subtotal) : "Pendiente de cotización"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}