"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import {
  deleteCotizacionFormalAction,
  updateEstadoFormalAction,
  type EstadoCotizacionFormal,
} from "./actions";
import { useFormattedDateTime } from "./useFormattedDateTime";

type Row = {
  id: string;
  folio: number;
  cliente_nombre: string;
  cliente_rut: string;
  vendedor: string;
  fecha_emision: string;
  total: number;
  estado: string;
  trasladado_kame: boolean;
  trasladado_kame_por: string | null;
  trasladado_kame_en: string | null;
  trasladado_kame_numero_pedido: string | null;
};

const ESTADOS: { value: EstadoCotizacionFormal; label: string; className: string }[] = [
  { value: "pendiente", label: "Pendiente", className: "bg-black/5 text-black/60" },
  { value: "enviada", label: "Enviada", className: "bg-blue-50 text-blue-700" },
  { value: "aceptada", label: "Aceptada", className: "bg-green-50 text-green-700" },
  { value: "rechazada", label: "Rechazada", className: "bg-red-50 text-red-700" },
  { value: "vencida", label: "Vencida", className: "bg-orange-50 text-orange-700" },
];

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function CotizacionFormalRow({ c }: { c: Row }) {
  const [estado, setEstado] = useState(c.estado);
  const [isPending, startTransition] = useTransition();
  const [deleting, setDeleting] = useState(false);

  const kameEn = useFormattedDateTime(c.trasladado_kame_en);

  function handleEstadoChange(next: EstadoCotizacionFormal) {
    setEstado(next);
    startTransition(async () => {
      await updateEstadoFormalAction(c.id, next);
    });
  }

  function handleDelete() {
    if (!window.confirm(`¿Eliminar la cotización N° ${String(c.folio).padStart(4, "0")}? Esta acción no se puede deshacer.`)) return;
    setDeleting(true);
    startTransition(async () => {
      await deleteCotizacionFormalAction(c.id);
    });
  }

  const estadoUI = ESTADOS.find((e) => e.value === estado) ?? ESTADOS[0];

  const kameTooltip = c.trasladado_kame
    ? `Trasladado por ${c.trasladado_kame_por ?? "—"}${kameEn ? ` el ${kameEn}` : ""}${c.trasladado_kame_numero_pedido ? ` — Pedido #${c.trasladado_kame_numero_pedido}` : ""}. Abre la cotización para editarlo.`
    : "Aún no se ha subido a Kame. Abre la cotización para marcarlo.";

  return (
    <tr className="border-b border-black/5 transition hover:bg-black/[0.02] last:border-b-0">
      <td className="px-4 py-3">
        <span className="rounded-lg bg-[#0477BF]/10 px-2 py-1 font-mono text-xs font-bold text-[#0477BF]">
          #{String(c.folio).padStart(4, "0")}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-black/50">{formatDate(c.fecha_emision)}</td>
      <td className="px-4 py-3">
        <div className="max-w-[200px] truncate font-medium text-black">{c.cliente_nombre}</div>
        <div className="font-mono text-xs text-black/40">{c.cliente_rut}</div>
      </td>
      <td className="px-4 py-3 text-xs text-black/60">{c.vendedor || "—"}</td>
      <td className="px-4 py-3 text-right font-mono font-semibold text-black">
        ${Math.round(c.total).toLocaleString("es-CL")}
      </td>
      <td className="px-4 py-3 text-center">
        <select
          value={estado}
          onChange={(e) => handleEstadoChange(e.target.value as EstadoCotizacionFormal)}
          disabled={isPending}
          className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold ${estadoUI.className}`}
        >
          {ESTADOS.map((e) => (
            <option key={e.value} value={e.value}>{e.label}</option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3 text-center">
        <Link
          href={`/admin/cotizador/${c.folio}`}
          title={kameTooltip}
          className={[
            "inline-block rounded-full border px-2.5 py-1 text-xs font-semibold transition",
            c.trasladado_kame
              ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
              : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
          ].join(" ")}
        >
          {c.trasladado_kame ? "✓ Kame" : "Marcar Kame"}
        </Link>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-1.5">
          <Link
            href={`/admin/cotizador/${c.folio}`}
            className="rounded-lg bg-black px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0477BF]"
          >
            Ver / PDF
          </Link>
          <Link
            href={`/admin/cotizador/${c.folio}/editar`}
            className="rounded-lg bg-amber-100 px-2.5 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-500 hover:text-white"
          >
            ✏
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            title="Eliminar cotización"
            className="rounded-lg bg-red-50 px-2.5 py-1.5 text-red-500 transition hover:bg-red-100 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
