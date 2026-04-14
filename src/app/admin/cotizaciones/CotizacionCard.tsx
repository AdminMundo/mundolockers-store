"use client";

import { useTransition } from "react";
import {
  updateEstadoAction,
  deleteCotizacionAction,
  type EstadoCotizacion,
} from "@/app/admin/cotizaciones/actions";
import { Trash2 } from "lucide-react";

type QuoteProduct = {
  name?: string;
  sku?: string | null;
  quantity: number;
  variant?: string | null;
  unitPrice?: number | null;
};

type Cotizacion = {
  id: string;
  nombre: string;
  empresa: string | null;
  rut: string | null;
  correo: string;
  telefono: string | null;
  tipo_proyecto: string | null;
  mensaje: string | null;
  productos: unknown;
  estado: string;
  created_at: string;
};

const ESTADOS: { value: EstadoCotizacion; label: string }[] = [
  { value: "pendiente", label: "Pendiente" },
  { value: "en-proceso", label: "En proceso" },
  { value: "respondida", label: "Respondida" },
  { value: "cerrada", label: "Cerrada" },
];

const ESTADO_STYLES: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-800 border-amber-200",
  "en-proceso": "bg-blue-100 text-blue-800 border-blue-200",
  respondida: "bg-green-100 text-green-800 border-green-200",
  cerrada: "bg-zinc-100 text-zinc-500 border-zinc-200",
};

const ESTADO_ACTIVE: Record<string, string> = {
  pendiente: "bg-amber-500 text-white border-amber-500",
  "en-proceso": "bg-blue-600 text-white border-blue-600",
  respondida: "bg-green-600 text-white border-green-600",
  cerrada: "bg-zinc-500 text-white border-zinc-500",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CotizacionCard({ c }: { c: Cotizacion }) {
  const [isPending, startTransition] = useTransition();

  function handleEstado(estado: EstadoCotizacion) {
    if (estado === c.estado) return;
    startTransition(async () => {
      await updateEstadoAction(c.id, estado);
    });
  }

  function handleDelete() {
    if (!window.confirm(`¿Eliminar la cotización de ${c.nombre}? Esta acción no se puede deshacer.`)) return;
    startTransition(async () => {
      await deleteCotizacionAction(c.id);
    });
  }

  const productos = Array.isArray(c.productos)
    ? (c.productos as QuoteProduct[])
    : [];

  return (
    <article className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-semibold text-black">{c.nombre}</span>
            {c.empresa && (
              <span className="text-sm text-black/50">· {c.empresa}</span>
            )}
            <span
              className={[
                "rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
                ESTADO_STYLES[c.estado] ?? "bg-zinc-100 text-zinc-600 border-zinc-200",
              ].join(" ")}
            >
              {ESTADOS.find((e) => e.value === c.estado)?.label ?? c.estado}
            </span>
          </div>
          <p className="mt-1 text-xs text-black/40">{formatDate(c.created_at)}</p>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          title="Eliminar cotización"
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-400 transition hover:bg-red-100 hover:text-red-600 disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Contacto */}
      <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={`mailto:${c.correo}`}
            className="inline-flex items-center rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-black transition hover:bg-black/4"
          >
            {c.correo}
          </a>
          {c.telefono && (
            <a
              href={`tel:${c.telefono}`}
              className="inline-flex items-center rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-black transition hover:bg-black/4"
            >
              {c.telefono}
            </a>
          )}
          {c.rut && (
            <span className="inline-flex items-center rounded-xl border border-black/10 bg-[#F8F8FA] px-3 py-1.5 text-xs font-medium text-black/60">
              RUT: {c.rut}
            </span>
          )}
      </div>

      {/* Cambiar estado */}
      <div className="mt-4 flex flex-wrap gap-2">
        {ESTADOS.map((e) => {
          const isActive = c.estado === e.value;
          return (
            <button
              key={e.value}
              type="button"
              disabled={isPending}
              onClick={() => handleEstado(e.value)}
              className={[
                "rounded-xl border px-3 py-1.5 text-xs font-medium transition",
                isActive
                  ? ESTADO_ACTIVE[e.value]
                  : "border-black/10 bg-white text-black/60 hover:border-black/20 hover:text-black",
                isPending ? "opacity-50 cursor-not-allowed" : "",
              ].join(" ")}
            >
              {e.label}
            </button>
          );
        })}
      </div>

      {/* Datos */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {c.tipo_proyecto && (
          <div className="rounded-2xl bg-[#F8F8FA] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-black/35">
              Tipo de proyecto
            </p>
            <p className="mt-1 text-sm text-black/80">{c.tipo_proyecto}</p>
          </div>
        )}
        {c.mensaje && (
          <div
            className={[
              "rounded-2xl bg-[#F8F8FA] px-4 py-3",
              !c.tipo_proyecto ? "sm:col-span-2" : "",
            ].join(" ")}
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-black/35">
              Mensaje
            </p>
            <p className="mt-1 text-sm leading-6 text-black/80">{c.mensaje}</p>
          </div>
        )}
      </div>

      {/* Productos */}
      {productos.length > 0 && (
        <div className="mt-3 rounded-2xl border border-black/10 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-black/35">
            Productos ({productos.length})
          </p>
          <ul className="mt-2 divide-y divide-black/5">
            {productos.map((p, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-2 py-2 text-sm text-black/70"
              >
                <span className="font-medium text-black">
                  {p.name ?? "Producto"}
                  {p.variant ? (
                    <span className="ml-1 font-normal text-black/50">
                      · {p.variant}
                    </span>
                  ) : null}
                </span>
                <div className="flex shrink-0 items-center gap-3 text-xs text-black/40">
                  {p.sku && <span>SKU: {p.sku}</span>}
                  <span>×{p.quantity}</span>
                  {p.unitPrice != null && (
                    <span className="font-medium text-black/60">
                      ${p.unitPrice.toLocaleString("es-CL")}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
