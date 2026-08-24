"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  updateEstadoFormalAction,
  setTrasladadoKameAction,
  type EstadoCotizacionFormal,
  type QuoteItemInput,
} from "@/app/admin/cotizador/actions";
import { QuoteDocument } from "@/app/admin/cotizador/QuoteDocument";
import { useFormattedDateTime } from "@/app/admin/cotizador/useFormattedDateTime";
import type { QuoteDocumentData } from "@/app/admin/cotizador/types";

type CotizacionFormalRow = {
  id: string;
  folio: number;
  cliente_rut: string;
  cliente_nombre: string;
  cliente_direccion: string | null;
  cliente_telefono: string | null;
  cliente_email: string | null;
  referencia: string | null;
  fecha_emision: string;
  vendedor: string;
  forma_pago: string;
  condiciones: string | null;
  vigencia_dias: number;
  descuento_tipo: "pct" | "monto";
  descuento_valor: number;
  subtotal: number;
  neto: number;
  iva: number;
  total: number;
  items: QuoteItemInput[];
  estado: string;
  trasladado_kame: boolean;
  trasladado_kame_por: string | null;
  trasladado_kame_en: string | null;
  trasladado_kame_numero_pedido: string | null;
  created_at: string;
};

const ESTADOS: { value: EstadoCotizacionFormal; label: string; className: string }[] = [
  { value: "pendiente", label: "Pendiente", className: "bg-black/5 text-black/60 border-black/10" },
  { value: "enviada", label: "Enviada", className: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "aceptada", label: "Aceptada", className: "bg-green-50 text-green-700 border-green-200" },
  { value: "rechazada", label: "Rechazada", className: "bg-red-50 text-red-700 border-red-200" },
  { value: "vencida", label: "Vencida", className: "bg-orange-50 text-orange-700 border-orange-200" },
];

function formatFechaLabel(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso || "—";
  return `${d}/${m}/${y}`;
}

export function QuoteViewClient({ cotizacion: c }: { cotizacion: CotizacionFormalRow }) {
  const docRef = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState(c.estado);
  const [isPending, startTransition] = useTransition();
  const [downloading, setDownloading] = useState(false);

  const [kame, setKame] = useState({
    trasladado: c.trasladado_kame,
    por: c.trasladado_kame_por,
    en: c.trasladado_kame_en,
    numeroPedido: c.trasladado_kame_numero_pedido,
  });
  const [numeroPedidoInput, setNumeroPedidoInput] = useState(c.trasladado_kame_numero_pedido ?? "");
  const [kamePending, startKameTransition] = useTransition();
  const kameMarcadoEn = useFormattedDateTime(kame.en);

  function handleEstadoChange(next: EstadoCotizacionFormal) {
    setEstado(next);
    startTransition(async () => {
      await updateEstadoFormalAction(c.id, next);
    });
  }

  function handleToggleKame() {
    const next = !kame.trasladado;
    setKame((prev) => ({ ...prev, trasladado: next }));
    startKameTransition(async () => {
      const result = await setTrasladadoKameAction(c.id, next, next ? numeroPedidoInput : undefined);
      if (result.success) {
        setKame({
          trasladado: next,
          por: result.trasladadoPor,
          en: result.trasladadoEn,
          numeroPedido: result.numeroPedido,
        });
      }
    });
  }

  function handleSaveNumeroPedido() {
    startKameTransition(async () => {
      const result = await setTrasladadoKameAction(c.id, true, numeroPedidoInput);
      if (result.success) {
        setKame({
          trasladado: true,
          por: result.trasladadoPor,
          en: result.trasladadoEn,
          numeroPedido: result.numeroPedido,
        });
      }
    });
  }

  async function handleDownload() {
    if (!docRef.current) return;
    setDownloading(true);
    try {
      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = html2pdfModule.default;
      const folioStr = String(c.folio).padStart(4, "0");
      await document.fonts?.ready;
      await new Promise((resolve) => setTimeout(resolve, 200));
      await html2pdf()
        .set({
          margin: 0,
          filename: `COT_${folioStr}_LockerStore_${c.cliente_nombre.replace(/[^a-z0-9]/gi, "_").slice(0, 20)}.pdf`,
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "px", format: [816, 1056] as [number, number], orientation: "portrait" },
        })
        .from(docRef.current)
        .save();
    } catch (pdfErr) {
      console.error("[handleDownload] error generando PDF:", pdfErr);
      window.alert("No se pudo generar el PDF. Intenta de nuevo o avisa si el problema sigue.");
    } finally {
      setDownloading(false);
    }
  }

  const documentData: QuoteDocumentData = {
    folioLabel: `N° ${String(c.folio).padStart(4, "0")}`,
    clienteNombre: c.cliente_nombre,
    clienteRut: c.cliente_rut,
    clienteDireccion: c.cliente_direccion ?? "",
    clienteTelefono: c.cliente_telefono ?? "",
    fechaEmisionLabel: formatFechaLabel(c.fecha_emision),
    vendedor: c.vendedor,
    formaPago: c.forma_pago,
    referencia: c.referencia ?? "",
    items: (c.items ?? []).map((i) => ({
      quantity: i.quantity,
      sku: i.sku,
      name: i.name,
      variant: i.variant,
      unitPrice: i.unitPrice,
    })),
    subtotal: c.subtotal,
    descuentoTipo: c.descuento_tipo,
    descuentoValor: c.descuento_valor,
    descuentoMonto:
      c.descuento_tipo === "pct" ? c.subtotal * (c.descuento_valor / 100) : c.descuento_valor,
    neto: c.neto,
    iva: c.iva,
    total: c.total,
    condiciones: c.condiciones ?? "",
    vigenciaDias: c.vigencia_dias,
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-sm text-black/50">Estado:</span>
          <select
            value={estado}
            onChange={(e) => handleEstadoChange(e.target.value as EstadoCotizacionFormal)}
            disabled={isPending}
            className="rounded-xl border border-black/10 px-3 py-2 text-sm font-semibold"
          >
            {ESTADOS.map((e) => (
              <option key={e.value} value={e.value}>{e.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/cotizador/${c.folio}/editar`}
            className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black/70 transition hover:border-black/25"
          >
            ✏ Editar
          </Link>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="rounded-xl bg-[#0477BF] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#04527f] disabled:opacity-50"
          >
            {downloading ? "Generando…" : "⬇ Descargar PDF"}
          </button>
        </div>
      </section>

      <section
        className={[
          "rounded-[28px] border p-6",
          kame.trasladado ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50",
        ].join(" ")}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className={`text-sm font-semibold ${kame.trasladado ? "text-green-800" : "text-amber-800"}`}>
              {kame.trasladado
                ? `✓ Trasladado a Kame${kame.numeroPedido ? ` — Pedido #${kame.numeroPedido}` : ""}`
                : "⚠ Aún no se ha subido a Kame"}
            </p>
            <p className={`mt-1 text-xs ${kame.trasladado ? "text-green-700/70" : "text-amber-700/70"}`}>
              {kame.trasladado
                ? `Marcado por ${kame.por ?? "—"}${kameMarcadoEn ? ` el ${kameMarcadoEn}` : ""}. Revisa esto antes de volver a ingresarla en el ERP.`
                : "Marca esto apenas la subas al ERP para que nadie más la duplique."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleToggleKame}
            disabled={kamePending}
            className={[
              "shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50",
              kame.trasladado ? "bg-green-600 hover:bg-green-500" : "bg-amber-600 hover:bg-amber-500",
            ].join(" ")}
          >
            {kame.trasladado ? "Desmarcar" : "Marcar como trasladado a Kame"}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={numeroPedidoInput}
            onChange={(e) => setNumeroPedidoInput(e.target.value)}
            placeholder="N° de pedido en Kame (opcional)"
            className="w-full max-w-xs rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-black/25"
          />
          {kame.trasladado && (
            <button
              type="button"
              onClick={handleSaveNumeroPedido}
              disabled={kamePending}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-black/70 transition hover:border-black/25 disabled:opacity-50"
            >
              Guardar N°
            </button>
          )}
        </div>
      </section>

      <div className="overflow-x-auto rounded-[28px] bg-[#F5F5F7] p-4">
        <QuoteDocument ref={docRef} data={documentData} />
      </div>
    </div>
  );
}
