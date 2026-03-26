"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "@/lib/cart/use-cart";
import type { AddCartLineInput, CartFlow } from "@/lib/cart/types";
import type { ProductDetail, ProductVariant } from "@/lib/product";

function formatCLP(v: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(v);
}

function getVariantLabel(variant: ProductVariant): string {
  if (variant.door_color) return variant.door_color;
  if (variant.color) return variant.color;
  if (variant.name) return variant.name;
  return "Variante";
}

function swatchClass(label: string): string {
  const key = label.toLowerCase();

  if (key.includes("azul")) return "bg-blue-600";
  if (key.includes("rojo")) return "bg-red-600";
  if (key.includes("amar")) return "bg-yellow-400";
  if (key.includes("verde")) return "bg-green-600";
  if (key.includes("naran")) return "bg-orange-500";
  if (key.includes("morado") || key.includes("violeta")) return "bg-purple-600";
  if (key.includes("gris")) return "bg-zinc-400";
  if (key.includes("negro")) return "bg-zinc-900";
  if (key.includes("blanco")) return "border border-zinc-200 bg-white";
  return "bg-zinc-300";
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
    sku: selected?.variant_sku ?? product.sku ?? product.slug,
    name: product.name,
    imageUrl: product.image_url ?? null,
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
    leadTimeLabel: selected?.stock_status ?? "3 a 6 días hábiles",
  };
}

export default function ProductPurchaseBox({
  product,
}: {
  product: ProductDetail;
}) {
  const router = useRouter();
  const { addItem } = useCart();

  const activeVariants = useMemo(() => {
    const all = product.variants ?? [];
    const active = all.filter((variant) => variant.is_active);
    return active.length > 0 ? active : all;
  }, [product.variants]);

  const [selectedId, setSelectedId] = useState<string | null>(
    activeVariants[0]?.id ?? null,
  );
  const [quantity, setQuantity] = useState<number>(1);

  const selected = useMemo<ProductVariant | null>(() => {
    if (!selectedId) return null;
    return activeVariants.find((variant) => variant.id === selectedId) ?? null;
  }, [activeVariants, selectedId]);

  const displayPrice = getDisplayPrice(product, selected);
  const canPurchase =
    displayPrice !== null && (activeVariants.length === 0 || selected !== null);

  const whatsappHref = useMemo(() => {
    const base = "https://wa.me/56933882434";
    const variantLabel = selected ? getVariantLabel(selected) : null;
    const sku = selected?.variant_sku ?? product.sku ?? product.slug;
    const priceText =
      displayPrice !== null ? formatCLP(displayPrice) : "Consultar";

    const lines = [
      "Hola, quiero cotizar este producto de Mundo Lockers:",
      "",
      `Producto: ${product.name}`,
      `SKU: ${sku}`,
      `Cantidad: ${quantity}`,
      variantLabel ? `Variante/Color: ${variantLabel}` : null,
      `Precio: ${priceText}`,
      `Link: ${typeof window !== "undefined" ? window.location.href : `https://www.mundolockers.com/producto/${product.slug}`}`,
    ].filter(Boolean);

    return `${base}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [
    displayPrice,
    product.name,
    product.slug,
    product.sku,
    quantity,
    selected,
  ]);

  function handleDecreaseQuantity(): void {
    setQuantity((current) => Math.max(1, current - 1));
  }
  function handleAddToCart(): void {
    if (!canPurchase) return;

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
  function handleIncreaseQuantity(): void {
  setQuantity((current) => Math.min(999, current + 1));
}

  function handleBuyNow(): void {
    if (!canPurchase) return;

    addItem(
      buildProductCartInput({
        product,
        selected,
        quantity,
        flow: "purchase",
      }),
    );

    router.push("/checkout");
  }

  function handleAddQuote(): void {
    addItem(
      buildProductCartInput({
        product,
        selected,
        quantity,
        flow: "quote",
      }),
    );

    router.push("/cotizar");
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="text-sm font-medium text-zinc-900">Color</div>

          {activeVariants.length > 0 ? (
            <>
              <div className="flex flex-wrap items-center gap-3">
                {activeVariants.map((variant) => {
                  const label = getVariantLabel(variant);
                  const active = variant.id === selectedId;

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedId(variant.id)}
                      className={[
                        "grid h-9 w-9 place-items-center rounded-full",
                        active
                          ? "ring-2 ring-zinc-900 ring-offset-2"
                          : "ring-1 ring-zinc-200",
                      ].join(" ")}
                      aria-label={`Color ${label}`}
                      title={label}
                    >
                      <span
                        className={[
                          "h-6 w-6 rounded-full",
                          swatchClass(label),
                        ].join(" ")}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="text-xs text-zinc-500">
                Seleccionado:{" "}
                <span className="text-zinc-900">
                  {selected ? getVariantLabel(selected) : "—"}
                </span>
              </div>
            </>
          ) : (
            <div className="text-xs text-zinc-500">Seleccionado: —</div>
          )}
        </div>

        <div className="text-right">
          <div className="text-sm text-zinc-500">Precio</div>
          <div className="text-lg font-semibold text-zinc-900">
            {displayPrice !== null ? formatCLP(displayPrice) : "Consultar"}
          </div>
          {selected?.stock_status ? (
            <div className="mt-1 text-xs text-zinc-500">
              {selected.stock_status}
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-900">Cantidad</div>

        <div className="inline-flex items-center rounded-xl border border-zinc-200 bg-white">
          <button
            type="button"
            onClick={handleDecreaseQuantity}
            className="grid h-10 w-10 place-items-center rounded-l-xl text-zinc-700 hover:bg-zinc-50"
            aria-label="Disminuir cantidad"
          >
            −
          </button>

          <div className="grid h-10 w-12 place-items-center text-sm text-zinc-900">
            {quantity}
          </div>

          <button
            type="button"
            onClick={handleIncreaseQuantity}
            className="grid h-10 w-10 place-items-center rounded-r-xl text-zinc-700 hover:bg-zinc-50"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
      </div>

      {!canPurchase ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Este producto no tiene precio directo disponible. Continúa por
          cotización.
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!canPurchase}
          className="inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-sm font-medium text-zinc-900 transition duration-200 hover:border-[#F5B301] hover:bg-white hover:shadow-[0_0_0_3px_rgba(245,179,1,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Añadir al carrito
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!canPurchase}
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-zinc-900 text-sm font-medium text-white transition duration-200 hover:bg-[#F5B301] hover:text-zinc-950 hover:shadow-[0_0_0_3px_rgba(245,179,1,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Comprar ahora
        </button>
      </div>

      <p className="text-xs leading-5 text-zinc-500">
        Tiempo estimado de despacho: 3–6 días hábiles (según región y stock).
      </p>

      <div className="grid grid-cols-3 gap-3 text-xs text-zinc-600">
        <div className="rounded-xl border border-zinc-200 p-3 text-center">
          Garantía
        </div>
        <div className="rounded-xl border border-zinc-200 p-3 text-center">
          Despacho
        </div>
        <div className="rounded-xl border border-zinc-200 p-3 text-center">
          Soporte
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleAddQuote}
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-sm font-medium text-zinc-900 transition duration-200 hover:border-[#F5B301] hover:bg-white hover:shadow-[0_0_0_3px_rgba(245,179,1,0.15)]"
        >
          Agregar a cotizar
        </button>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-sm font-medium text-zinc-900 transition duration-200 hover:border-[#F5B301] hover:bg-white hover:shadow-[0_0_0_3px_rgba(245,179,1,0.15)]"
        >
          Cotizar por WhatsApp
        </a>

        <a
          href="#especificaciones"
          className="inline-flex h-11 items-center justify-center rounded-2xl bg-yellow-400 text-sm font-semibold text-zinc-900 transition duration-200 hover:bg-yellow-300 sm:col-span-2"
        >
          Ver especificaciones
        </a>
      </div>
    </div>
  );
}
