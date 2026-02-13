"use client";

import { useMemo, useState } from "react";
import type { ProductDetail, ProductVariant } from "@/lib/product";

function moneyCLP(n: number) {
  return `$${Number(n ?? 0).toLocaleString("es-CL")}`;
}

export default function ProductClient({ product }: { product: ProductDetail }) {
  const variants = product.variants ?? [];

  // Variante seleccionada (si existe)
  const firstActive = variants.find((v) => v.is_active) ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(firstActive?.id ?? null);

  const selected = useMemo<ProductVariant | null>(() => {
    if (!selectedId) return null;
    return variants.find((v) => v.id === selectedId) ?? null;
  }, [selectedId, variants]);

  const displayPrice = selected?.price_clp ?? product.price_from_clp;

  // WhatsApp (ajusta número y mensaje)
  const whatsappHref = useMemo(() => {
    const base = "https://wa.me/569XXXXXXXX"; // <-- pon tu número
    const msg = `Hola! Quiero cotizar: ${product.name} (${product.slug}).`;
    return `${base}?text=${encodeURIComponent(msg)}`;
  }, [product]);

  return (
    <div className="space-y-6 pt-2">
      {/* Variantes */}
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
                  {v.door_color ? v.door_color : v.name ? v.name : "Variante"}
                </button>
              ))}
          </div>
          <div className="text-sm text-zinc-700">Precio: {moneyCLP(displayPrice)}</div>
        </div>
      ) : null}

      {/* CTAs */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          className="rounded-full bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
          onClick={() => {
            // En el siguiente paso conectamos carrito/checkout
            alert("Siguiente paso: conectar Carrito + Checkout ");
          }}
        >
          Comprar
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

      {/* Specs */}
      {product.specs ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4">
          <div className="text-sm font-medium text-zinc-900">Especificaciones</div>
          <pre className="mt-2 overflow-auto text-xs text-zinc-700">
            {JSON.stringify(product.specs, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}
