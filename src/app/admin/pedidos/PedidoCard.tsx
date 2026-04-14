"use client";

import { useTransition } from "react";
import {
  updateEstadoPedidoAction,
  updateEstadoPagoAction,
  deletePedidoAction,
  type EstadoPedido,
  type EstadoPago,
} from "@/app/admin/pedidos/actions";
import { Trash2 } from "lucide-react";

type OrderProduct = {
  name?: string;
  sku?: string | null;
  quantity: number;
  variant?: string | null;
  unitPrice?: number | null;
};

export type Pedido = {
  id: string;
  numero: number | null;
  nombre: string;
  correo: string | null;
  telefono: string | null;
  rut: string | null;
  empresa: string | null;
  tipo_entrega: string | null;
  direccion: string | null;
  ciudad: string | null;
  region: string | null;
  productos: unknown;
  subtotal: number | null;
  descuento: number | null;
  costo_despacho: number | null;
  total: number | null;
  tipo_pago: string | null;
  estado_pago: string;
  estado: string;
  notas: string | null;
  created_at: string;
};

const ESTADOS: { value: EstadoPedido; label: string }[] = [
  { value: "recibido", label: "Recibido" },
  { value: "gestionando", label: "Gestionando" },
  { value: "preparado", label: "Preparado" },
  { value: "enviado", label: "Enviado" },
  { value: "listo_retiro", label: "Listo retiro" },
  { value: "entregado", label: "Entregado" },
  { value: "cancelado", label: "Cancelado" },
];

const ESTADOS_PAGO: { value: EstadoPago; label: string }[] = [
  { value: "pendiente", label: "Pago pendiente" },
  { value: "pagado", label: "Pagado" },
  { value: "rechazado", label: "Rechazado" },
];

const ESTADO_STYLES: Record<string, string> = {
  recibido: "bg-[#E18147]/20 text-[#7c3d12] border-[#E18147]/30",
  gestionando: "bg-blue-100 text-blue-800 border-blue-200",
  preparado: "bg-violet-100 text-violet-800 border-violet-200",
  enviado: "bg-indigo-100 text-indigo-800 border-indigo-200",
  listo_retiro: "bg-teal-100 text-teal-800 border-teal-200",
  entregado: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelado: "bg-red-100 text-red-700 border-red-200",
};

const ESTADO_ACTIVE: Record<string, string> = {
  recibido: "bg-[#E18147] text-white border-[#E18147]",
  gestionando: "bg-blue-600 text-white border-blue-600",
  preparado: "bg-violet-600 text-white border-violet-600",
  enviado: "bg-indigo-600 text-white border-indigo-600",
  listo_retiro: "bg-teal-600 text-white border-teal-600",
  entregado: "bg-emerald-600 text-white border-emerald-600",
  cancelado: "bg-red-600 text-white border-red-600",
};

const PAGO_STYLES: Record<string, string> = {
  pendiente: "bg-[#E18147]/10 text-[#9a4d1e] border-[#E18147]/30",
  pagado: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rechazado: "bg-red-50 text-red-700 border-red-200",
};

function formatPrice(value: number | null) {
  if (value == null) return "—";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PedidoCard({ p }: { p: Pedido }) {
  const [isPending, startTransition] = useTransition();

  function handleEstado(estado: EstadoPedido) {
    if (estado === p.estado) return;
    startTransition(async () => {
      await updateEstadoPedidoAction(p.id, estado);
    });
  }

  function handleEstadoPago(estado_pago: EstadoPago) {
    if (estado_pago === p.estado_pago) return;
    startTransition(async () => {
      await updateEstadoPagoAction(p.id, estado_pago);
    });
  }

  function handleDelete() {
    if (!window.confirm(`¿Eliminar el pedido ${numeroLabel}? Esta acción no se puede deshacer.`)) return;
    startTransition(async () => {
      await deletePedidoAction(p.id);
    });
  }

  const productos = Array.isArray(p.productos)
    ? (p.productos as OrderProduct[])
    : [];

  const numeroLabel = p.numero ? `#${String(p.numero).padStart(4, "0")}` : `#${p.id.slice(0, 6).toUpperCase()}`;

  return (
    <article className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-semibold text-black/40">
              {numeroLabel}
            </span>
            <span className="text-base font-semibold text-black">{p.nombre}</span>
            {p.empresa && (
              <span className="text-sm text-black/50">· {p.empresa}</span>
            )}
            <span
              className={[
                "rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
                ESTADO_STYLES[p.estado] ?? "bg-zinc-100 text-zinc-600 border-zinc-200",
              ].join(" ")}
            >
              {ESTADOS.find((e) => e.value === p.estado)?.label ?? p.estado}
            </span>
            <span
              className={[
                "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                PAGO_STYLES[p.estado_pago] ?? "bg-zinc-50 text-zinc-500 border-zinc-200",
              ].join(" ")}
            >
              {ESTADOS_PAGO.find((e) => e.value === p.estado_pago)?.label ?? p.estado_pago}
            </span>
          </div>
          <p className="mt-1 text-xs text-black/40">{formatDate(p.created_at)}</p>
        </div>

        {/* Total + eliminar */}
        <div className="flex items-start gap-3">
          {p.total != null && (
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-black/35">Total</p>
              <p className="text-lg font-semibold text-black">{formatPrice(p.total)}</p>
            </div>
          )}
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            title="Eliminar pedido"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-400 transition hover:bg-red-100 hover:text-red-600 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Contacto */}
      <div className="mt-3 flex flex-wrap gap-2">
        {p.correo && (
          <a
            href={`mailto:${p.correo}`}
            className="inline-flex items-center rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-black transition hover:bg-black/4"
          >
            {p.correo}
          </a>
        )}
        {p.telefono && (
          <a
            href={`tel:${p.telefono}`}
            className="inline-flex items-center rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-black transition hover:bg-black/4"
          >
            {p.telefono}
          </a>
        )}
        {p.rut && (
          <span className="inline-flex items-center rounded-xl border border-black/10 bg-[#F8F8FA] px-3 py-1.5 text-xs font-medium text-black/60">
            RUT: {p.rut}
          </span>
        )}
      </div>

      {/* Estado del pedido */}
      <div className="mt-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-black/35">
          Estado del pedido
        </p>
        <div className="flex flex-wrap gap-2">
          {ESTADOS.map((e) => {
            const isActive = p.estado === e.value;
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
                  isPending ? "cursor-not-allowed opacity-50" : "",
                ].join(" ")}
              >
                {e.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Estado del pago */}
      <div className="mt-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-black/35">
          Estado del pago
        </p>
        <div className="flex flex-wrap gap-2">
          {ESTADOS_PAGO.map((e) => {
            const isActive = p.estado_pago === e.value;
            return (
              <button
                key={e.value}
                type="button"
                disabled={isPending}
                onClick={() => handleEstadoPago(e.value)}
                className={[
                  "rounded-xl border px-3 py-1.5 text-xs font-medium transition",
                  isActive
                    ? e.value === "pagado"
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : e.value === "rechazado"
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-[#E18147] text-white border-[#E18147]"
                    : "border-black/10 bg-white text-black/60 hover:border-black/20 hover:text-black",
                  isPending ? "cursor-not-allowed opacity-50" : "",
                ].join(" ")}
              >
                {e.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Datos entrega y pago */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {p.tipo_entrega && (
          <div className="rounded-2xl bg-[#F8F8FA] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-black/35">
              Tipo de entrega
            </p>
            <p className="mt-1 text-sm font-medium capitalize text-black/80">
              {p.tipo_entrega === "despacho" ? "Despacho a domicilio" : p.tipo_entrega === "retiro" ? "Retiro en tienda" : p.tipo_entrega}
            </p>
          </div>
        )}
        {p.tipo_pago && (
          <div className="rounded-2xl bg-[#F8F8FA] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-black/35">
              Medio de pago
            </p>
            <p className="mt-1 text-sm font-medium capitalize text-black/80">{p.tipo_pago}</p>
          </div>
        )}
        {(p.ciudad || p.region) && (
          <div className="rounded-2xl bg-[#F8F8FA] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-black/35">
              Destino
            </p>
            <p className="mt-1 text-sm text-black/80">
              {[p.ciudad, p.region].filter(Boolean).join(", ")}
            </p>
          </div>
        )}
        {p.direccion && (
          <div className="rounded-2xl bg-[#F8F8FA] px-4 py-3 sm:col-span-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-black/35">
              Dirección
            </p>
            <p className="mt-1 text-sm text-black/80">{p.direccion}</p>
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
            {productos.map((item, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-2 py-2 text-sm text-black/70"
              >
                <span className="font-medium text-black">
                  {item.name ?? "Producto"}
                  {item.variant ? (
                    <span className="ml-1 font-normal text-black/50">· {item.variant}</span>
                  ) : null}
                </span>
                <div className="flex shrink-0 items-center gap-3 text-xs text-black/40">
                  {item.sku && <span>SKU: {item.sku}</span>}
                  <span>×{item.quantity}</span>
                  {item.unitPrice != null && (
                    <span className="font-medium text-black/60">
                      {formatPrice(item.unitPrice)}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* Resumen de precios */}
          {(p.subtotal != null || p.costo_despacho != null || p.descuento != null) && (
            <div className="mt-3 border-t border-black/8 pt-3 space-y-1">
              {p.subtotal != null && (
                <div className="flex justify-between text-xs text-black/50">
                  <span>Subtotal</span>
                  <span>{formatPrice(p.subtotal)}</span>
                </div>
              )}
              {p.descuento != null && p.descuento > 0 && (
                <div className="flex justify-between text-xs text-emerald-600">
                  <span>Descuento</span>
                  <span>−{formatPrice(p.descuento)}</span>
                </div>
              )}
              {p.costo_despacho != null && (
                <div className="flex justify-between text-xs text-black/50">
                  <span>Despacho</span>
                  <span>{p.costo_despacho === 0 ? "Gratis" : formatPrice(p.costo_despacho)}</span>
                </div>
              )}
              {p.total != null && (
                <div className="flex justify-between text-sm font-semibold text-black pt-1 border-t border-black/8">
                  <span>Total</span>
                  <span>{formatPrice(p.total)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Notas */}
      {p.notas && (
        <div className="mt-3 rounded-2xl bg-[#E18147]/10 border border-[#E18147]/20 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#E18147]/70">
            Notas internas
          </p>
          <p className="mt-1 text-sm leading-6 text-black/70">{p.notas}</p>
        </div>
      )}
    </article>
  );
}
