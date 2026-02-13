"use client";

import { useMemo, useState } from "react";
import type { ProductVariant } from "@/lib/product";

type Selected = {
  colorKey: string | null;
  qty: number;
};

function formatCLP(v: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(v);
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
  if (key.includes("blanco")) return "bg-white border border-zinc-200";
  return "bg-zinc-300";
}

export default function VariantSelector({
  variants,
  priceFrom,
}: {
  variants: ProductVariant[];
  priceFrom: number;
}) {
  const colors = useMemo(() => {
    const raw = variants
      .map((v) => v.door_color ?? v.color)
      .filter((x): x is string => typeof x === "string" && x.trim().length > 0);

    return Array.from(new Set(raw));
  }, [variants]);

  const [state, setState] = useState<Selected>({
    colorKey: colors[0] ?? null,
    qty: 1,
  });

  const pickedVariant = useMemo(() => {
    if (!state.colorKey) return null;
    return (
      variants.find((v) => v.door_color === state.colorKey) ??
      variants.find((v) => v.color === state.colorKey) ??
      null
    );
  }, [state.colorKey, variants]);

  const displayPrice = pickedVariant?.price_clp ?? null;

  return (
    <div className="space-y-5">
      {/* Color */}
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-2">
          <div className="text-sm font-medium text-zinc-900">Color</div>
          <div className="flex flex-wrap items-center gap-3">
            {colors.map((c) => {
              const active = c === state.colorKey;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, colorKey: c }))}
                  className={[
                    "h-9 w-9 rounded-full grid place-items-center",
                    active ? "ring-2 ring-zinc-900 ring-offset-2" : "ring-1 ring-zinc-200",
                  ].join(" ")}
                  aria-label={`Color ${c}`}
                  title={c}
                >
                  <span className={["h-6 w-6 rounded-full", swatchClass(c)].join(" ")} />
                </button>
              );
            })}
          </div>
          <div className="text-xs text-zinc-500">
            Seleccionado: <span className="text-zinc-900">{state.colorKey ?? "—"}</span>
          </div>
        </div>

        {/* Price */}
        <div className="text-right">
          <div className="text-sm text-zinc-500">Precio</div>
          <div className="text-lg font-semibold text-zinc-900">
            {displayPrice
              ? formatCLP(displayPrice)
              : priceFrom > 0
                ? formatCLP(priceFrom)
                : "Consultar"}
          </div>
          {pickedVariant?.stock_status ? (
            <div className="mt-1 text-xs text-zinc-500">{pickedVariant.stock_status}</div>
          ) : null}
        </div>
      </div>

      {/* Quantity */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-900">Cantidad</div>
        <div className="inline-flex items-center rounded-xl border border-zinc-200 bg-white">
          <button
            type="button"
            onClick={() => setState((s) => ({ ...s, qty: Math.max(1, s.qty - 1) }))}
            className="h-10 w-10 grid place-items-center text-zinc-700 hover:bg-zinc-50 rounded-l-xl"
            aria-label="Disminuir"
          >
            −
          </button>
          <div className="h-10 w-12 grid place-items-center text-sm text-zinc-900">
            {state.qty}
          </div>
          <button
            type="button"
            onClick={() => setState((s) => ({ ...s, qty: Math.min(999, s.qty + 1) }))}
            className="h-10 w-10 grid place-items-center text-zinc-700 hover:bg-zinc-50 rounded-r-xl"
            aria-label="Aumentar"
          >
            +
          </button>
        </div>
      </div>

      {/* CTA big */}
      <button
        type="button"
        className="h-12 w-full rounded-2xl bg-zinc-900 text-white font-medium hover:bg-zinc-800"
        onClick={() => {
          console.log("Comprar", { variantId: pickedVariant?.id ?? null, qty: state.qty });
        }}
      >
        Comprar ahora
      </button>

      <p className="text-xs text-zinc-500 leading-5">
        Tiempo estimado de despacho: 3–6 días hábiles (según región y stock).
      </p>

      {/* trust row */}
      <div className="grid grid-cols-3 gap-3 text-xs text-zinc-600">
        <div className="rounded-xl border border-zinc-200 p-3 text-center">Garantía</div>
        <div className="rounded-xl border border-zinc-200 p-3 text-center">Despacho</div>
        <div className="rounded-xl border border-zinc-200 p-3 text-center">Soporte</div>
      </div>
    </div>
  );
}
