"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/lib/cart/use-cart";
import type { AddCartLineInput, CartFlow } from "@/lib/cart/types";
import type { ProductDetail, ProductVariant } from "@/lib/product";

function moneyCLP(n: number) {
  return `$${Number(n ?? 0).toLocaleString("es-CL")}`;
}

function getVariantLabel(variant: ProductVariant): string {
  if (variant.door_color) {
    return variant.door_color;
  }

  if (variant.name) {
    return variant.name;
  }

  return "Variante";
}

function getDisplayPrice(
  product: ProductDetail,
  selected: ProductVariant | null,
): number | null {
  const raw = selected?.price_clp ?? product.price_from_clp ?? null;

  if (typeof raw !== "number" || raw <= 0) {
    return null;
  }

  return raw;
}

function buildProductCartInput(params: {
  product: ProductDetail;
  selected: ProductVariant | null;
  quantity: number;
  flow: CartFlow;
}): AddCartLineInput {
  const { product, selected, quantity, flow } = params;
  const displayPrice = getDisplayPrice(product, selected);
  const canPurchase = displayPrice !== null;

  return {
    productId: product.id,
    slug: product.slug,

    // ✅ 
    sku: selected?.variant_sku ?? product.sku ?? product.slug,

    name: product.name,
    quantity,
    flow,
    unitPrice: canPurchase ? displayPrice : null,
    compareAtPrice: null,
    variant: selected
      ? {
          id: selected.id,
          name: getVariantLabel(selected),
        }
      : null,
    canPurchase,
    canQuote: true,
    leadTimeLabel: "3 a 6 días hábiles",
  };
}

export default function ProductClient({ product }: { product: ProductDetail }) {
  const router = useRouter();
  const { addItem } = useCart();

  const variants = product.variants ?? [];
  const firstActive = variants.find((v) => v.is_active) ?? null;

  const [selectedId, setSelectedId] = useState<string | null>(
    firstActive?.id ?? null,
  );
  const [quantity, setQuantity] = useState<number>(1);

  const selected = useMemo<ProductVariant | null>(() => {
    if (!selectedId) {
      return null;
    }

    return variants.find((v) => v.id === selectedId) ?? null;
  }, [selectedId, variants]);

  const displayPrice = getDisplayPrice(product, selected);
  const canPurchase =
    displayPrice !== null && (variants.length === 0 || selected !== null);

  const whatsappHref = useMemo(() => {
    const base = "https://wa.me/56 9 3388 2434";
    const variantText = selected ? ` | Variante: ${getVariantLabel(selected)}` : "";
    const msg = `Hola! Quiero cotizar: ${product.name} (${product.slug}) | Cantidad: ${quantity}${variantText}.`;

    return `${base}?text=${encodeURIComponent(msg)}`;
  }, [product, quantity, selected]);

  function handleDecreaseQuantity(): void {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function handleIncreaseQuantity(): void {
    setQuantity((current) => current + 1);
  }

  function handleAddToCart(): void {
    if (!canPurchase) {
      return;
    }

    addItem(
      buildProductCartInput({
        product,
        selected,
        quantity,
        flow: "purchase",
      }),
    );

    router.push("/carrito");
  }

  function handleBuyNow(): void {
    if (!canPurchase) {
      return;
    }

    addItem(
      buildProductCartInput({
        product,
        selected,
        quantity,
        flow: "purchase",
      }),
    );

    router.push("/carrito");
  }

  return (
    <div className="space-y-6 pt-2">
      {variants.length > 0 ? (
        <div className="space-y-2">
          <div className="text-sm font-medium text-zinc-900">Opciones</div>

          <div className="flex flex-wrap gap-2">
            {variants
              .filter((v) => v.is_active)
              .map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedId(v.id)}
                  className={[
                    "rounded-full border px-3 py-2 text-xs transition",
                    selectedId === v.id
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-[#F5B301] hover:shadow-[0_0_0_3px_rgba(245,179,1,0.15)]",
                  ].join(" ")}
                >
                  {getVariantLabel(v)}
                </button>
              ))}
          </div>
        </div>
      ) : null}

      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-sm text-zinc-500">Precio</div>
          <div className="text-3xl font-semibold tracking-tight text-zinc-950">
            {displayPrice !== null ? moneyCLP(displayPrice) : "Consultar"}
          </div>
        </div>

        <div>
          <div className="mb-2 text-right text-sm text-zinc-500">Cantidad</div>
          <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white">
            <button
              type="button"
              onClick={handleDecreaseQuantity}
              className="inline-flex h-10 w-10 items-center justify-center text-zinc-700"
              aria-label="Disminuir cantidad"
            >
              −
            </button>

            <div className="inline-flex min-w-10 items-center justify-center px-2 text-sm font-medium text-zinc-950">
              {quantity}
            </div>

            <button
              type="button"
              onClick={handleIncreaseQuantity}
              className="inline-flex h-10 w-10 items-center justify-center text-zinc-700"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {!canPurchase ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Este producto no tiene precio directo disponible. Continúa por
          cotización.
        </div>
      ) : null}

      <div className="grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!canPurchase}
          className="rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-900 transition hover:border-[#F5B301] hover:shadow-[0_0_0_3px_rgba(245,179,1,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Añadir al carrito
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!canPurchase}
          className="rounded-full bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Comprar ahora
        </button>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-zinc-200 bg-white px-5 py-3 text-center text-sm font-medium text-zinc-900 transition hover:border-[#F5B301] hover:shadow-[0_0_0_3px_rgba(245,179,1,0.15)]"
        >
          Cotizar por WhatsApp
        </a>
      </div>

      {product.specs ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="text-sm font-medium text-zinc-900">
            Especificaciones
          </div>
          <pre className="mt-2 overflow-auto text-xs text-zinc-700">
            {JSON.stringify(product.specs, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
