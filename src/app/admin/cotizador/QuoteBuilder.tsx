"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  searchProductsForQuoteAction,
  searchClientByRutAction,
  createCotizacionFormalAction,
  updateCotizacionFormalAction,
  type ProductSearchResult,
  type QuoteItemInput,
  type SaveCotizacionFormalInput,
} from "./actions";
import { QuoteDocument } from "./QuoteDocument";
import type { QuoteDocumentData } from "./types";

const DEFAULT_CONDICIONES = `• Plazo de entrega: 4 a 6 días hábiles desde confirmación.
• Garantía: 12 meses por fallas de fabricación.
• Vigencia: 15 días corridos.
• Despacho: coordinado según comuna, costo aparte salvo que se indique lo contrario.`;

const FORMAS_PAGO = [
  "Transferencia Bancaria",
  "Efectivo",
  "Orden de Compra",
  "Crédito 30 días",
  "Crédito 60 días",
];

type ItemRow = QuoteItemInput & { key: string };

let rowSeq = 0;
function emptyRow(): ItemRow {
  rowSeq += 1;
  return {
    key: `row-${Date.now()}-${rowSeq}`,
    productId: null,
    variantId: null,
    sku: "",
    name: "",
    variant: null,
    quantity: 1,
    unitPrice: 0,
  };
}

function toRow(item: QuoteItemInput): ItemRow {
  rowSeq += 1;
  return { ...item, key: `row-init-${rowSeq}` };
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatFechaLabel(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso || "—";
  return `${d}/${m}/${y}`;
}

function computeTotals(
  items: ItemRow[],
  descuentoTipo: "pct" | "monto",
  descuentoValor: number,
) {
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  const descuentoMonto =
    descuentoTipo === "pct" ? subtotal * (descuentoValor / 100) : descuentoValor;
  const neto = Math.max(0, subtotal - descuentoMonto);
  const iva = Math.round(neto * 0.19);
  const total = neto + iva;
  return { subtotal, descuentoMonto, neto, iva, total };
}

const inputClass =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25";
const smallInputClass =
  "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-black/25";
const labelClass = "text-xs font-medium text-black/50";

function ProductSearchField({
  value,
  onChange,
  onPick,
}: {
  value: string;
  onChange: (value: string) => void;
  onPick: (result: ProductSearchResult) => void;
}) {
  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(next: string) {
    onChange(next);
    if (timerRef.current) clearTimeout(timerRef.current);

    const q = next.trim();
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const found = await searchProductsForQuoteAction(q);
        setResults(found);
        setOpen(found.length > 0);
      } finally {
        setLoading(false);
      }
    }, 250);
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Buscar producto o escribir uno libre"
        className={smallInputClass}
      />
      {loading && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-black/30">…</span>
      )}
      {open && results.length > 0 && (
        <div className="absolute z-20 mt-1 max-h-64 w-full min-w-[300px] overflow-y-auto rounded-2xl border border-black/10 bg-white shadow-[0_16px_35px_rgba(0,0,0,0.14)]">
          {results.map((r, i) => (
            <button
              type="button"
              key={`${r.productId}-${r.variantId ?? "base"}-${i}`}
              onMouseDown={(e) => {
                e.preventDefault();
                onPick(r);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-3 border-b border-black/5 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-black/[0.03]"
            >
              <span className="min-w-0">
                <span className="block truncate font-medium text-black">
                  {r.name}
                  {r.variant ? <span className="font-normal text-black/50"> · {r.variant}</span> : null}
                </span>
                <span className="text-xs text-black/40">{r.sku}</span>
              </span>
              <span className="shrink-0 text-xs font-semibold text-[#0477BF]">
                ${r.unitPrice.toLocaleString("es-CL")}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export type QuoteBuilderInitial = {
  id: string;
  folio: number;
  clienteRut: string;
  clienteNombre: string;
  clienteDireccion: string;
  clienteTelefono: string;
  clienteEmail: string;
  referencia: string;
  fechaEmision: string;
  vendedor: string;
  formaPago: string;
  condiciones: string;
  vigenciaDias: number;
  descuentoTipo: "pct" | "monto";
  descuentoValor: number;
  items: QuoteItemInput[];
};

export function QuoteBuilder({
  vendedorInicial,
  initial,
}: {
  vendedorInicial: string;
  initial?: QuoteBuilderInitial;
}) {
  const router = useRouter();
  const docRef = useRef<HTMLDivElement>(null);

  const [clienteRut, setClienteRut] = useState(initial?.clienteRut ?? "");
  const [clienteNombre, setClienteNombre] = useState(initial?.clienteNombre ?? "");
  const [clienteDireccion, setClienteDireccion] = useState(initial?.clienteDireccion ?? "");
  const [clienteTelefono, setClienteTelefono] = useState(initial?.clienteTelefono ?? "");
  const [clienteEmail, setClienteEmail] = useState(initial?.clienteEmail ?? "");
  const [referencia, setReferencia] = useState(initial?.referencia ?? "");
  const [fechaEmision, setFechaEmision] = useState(initial?.fechaEmision ?? todayIso());
  const [vendedor, setVendedor] = useState(initial?.vendedor ?? vendedorInicial);
  const [formaPago, setFormaPago] = useState(initial?.formaPago ?? FORMAS_PAGO[0]);
  const [vigenciaDias, setVigenciaDias] = useState(initial?.vigenciaDias ?? 15);
  const [condiciones, setCondiciones] = useState(initial?.condiciones ?? DEFAULT_CONDICIONES);
  const [descuentoTipo, setDescuentoTipo] = useState<"pct" | "monto">(initial?.descuentoTipo ?? "pct");
  const [descuentoValor, setDescuentoValor] = useState(initial?.descuentoValor ?? 0);
  const [items, setItems] = useState<ItemRow[]>(
    initial?.items?.length ? initial.items.map(toRow) : [emptyRow()],
  );

  const [clientMsg, setClientMsg] = useState<{ text: string; tone: "info" | "warn" } | null>(null);
  const [clientLoading, setClientLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedFolio, setSavedFolio] = useState<number | null>(null);
  const [error, setError] = useState("");

  const totals = useMemo(
    () => computeTotals(items, descuentoTipo, descuentoValor),
    [items, descuentoTipo, descuentoValor],
  );

  function updateRow(key: string, patch: Partial<ItemRow>) {
    setItems((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setItems((prev) => [...prev, emptyRow()]);
  }

  function removeRow(key: string) {
    setItems((prev) => (prev.length > 1 ? prev.filter((r) => r.key !== key) : prev));
  }

  function handleVigenciaChange(value: number) {
    setVigenciaDias(value);
    setCondiciones((prev) =>
      /vigencia:/i.test(prev)
        ? prev.replace(/^.*vigencia:.*$/im, `• Vigencia: ${value} días corridos.`)
        : prev,
    );
  }

  async function handleSearchClient() {
    const rut = clienteRut.trim();
    if (!rut) return;
    setClientLoading(true);
    setClientMsg(null);
    try {
      const found = await searchClientByRutAction(rut);
      if (found) {
        setClienteNombre(found.nombre);
        setClienteDireccion(found.direccion ?? "");
        setClienteTelefono(found.telefono ?? "");
        setClienteEmail(found.email ?? "");
        setClientMsg({ text: "Cliente encontrado, datos autocompletados.", tone: "info" });
      } else {
        setClientMsg({ text: "RUT no encontrado. Completa los datos manualmente.", tone: "warn" });
      }
    } finally {
      setClientLoading(false);
    }
  }

  function buildSaveInput(): SaveCotizacionFormalInput {
    return {
      clienteRut: clienteRut.trim(),
      clienteNombre: clienteNombre.trim(),
      clienteDireccion: clienteDireccion.trim(),
      clienteTelefono: clienteTelefono.trim(),
      clienteEmail: clienteEmail.trim(),
      referencia: referencia.trim(),
      fechaEmision,
      vendedor: vendedor.trim(),
      formaPago,
      condiciones,
      vigenciaDias,
      descuentoTipo,
      descuentoValor,
      items: items
        .filter((i) => i.name.trim() && i.quantity > 0)
        .map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          sku: i.sku,
          name: i.name,
          variant: i.variant,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
    };
  }

  function validate(): boolean {
    setError("");
    if (!clienteRut.trim() || !clienteNombre.trim()) {
      setError("RUT y Razón Social del cliente son obligatorios.");
      return false;
    }
    if (!items.some((i) => i.name.trim() && i.quantity > 0)) {
      setError("Agrega al menos un producto.");
      return false;
    }
    return true;
  }

  async function persist(): Promise<number | null> {
    const payload = buildSaveInput();
    const result = initial
      ? await updateCotizacionFormalAction(initial.id, payload)
      : await createCotizacionFormalAction(payload);

    if (!result.success) {
      setError(result.error);
      return null;
    }
    setSavedFolio(result.folio);
    return result.folio;
  }

  async function handleSaveOnly() {
    if (!validate()) return;
    setSaving(true);
    try {
      const folio = await persist();
      if (folio) router.push(`/admin/cotizador/${folio}`);
    } finally {
      setSaving(false);
    }
  }

  function handlePreviewClick() {
    if (!validate()) return;
    setShowPreview(true);
  }

  async function handleSaveAndDownload() {
    if (!validate()) return;
    setSaving(true);
    try {
      const folio = await persist();
      if (!folio) return;

      // Esperar a que React confirme el re-render con el folio real antes de capturar el PDF.
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (docRef.current) {
        try {
          const html2pdfModule = await import("html2pdf.js");
          const html2pdf = html2pdfModule.default;
          const folioStr = String(folio).padStart(4, "0");
          await document.fonts?.ready;
          await new Promise((resolve) => setTimeout(resolve, 200));
          await html2pdf()
            .set({
              margin: 0,
              filename: `COT_${folioStr}_LockerStore_${clienteNombre.replace(/[^a-z0-9]/gi, "_").slice(0, 20) || "cliente"}.pdf`,
              html2canvas: { scale: 2, useCORS: true },
              jsPDF: { unit: "px", format: [816, 1056] as [number, number], orientation: "portrait" },
            })
            .from(docRef.current)
            .save();
        } catch (pdfErr) {
          console.error("[handleSaveAndDownload] error generando PDF:", pdfErr);
          // La cotización ya se guardó; avisamos y la navegación de abajo la lleva
          // al detalle, donde puede reintentar la descarga sin duplicar el registro.
          window.alert(
            "La cotización se guardó, pero no se pudo generar el PDF. Puedes reintentar la descarga desde el detalle de la cotización.",
          );
        }
      }

      router.push(`/admin/cotizador/${folio}`);
    } finally {
      setSaving(false);
    }
  }

  const folioLabel = savedFolio
    ? `N° ${String(savedFolio).padStart(4, "0")}`
    : initial
      ? `N° ${String(initial.folio).padStart(4, "0")}`
      : "N° ————";

  const documentData: QuoteDocumentData = {
    folioLabel,
    clienteNombre,
    clienteRut,
    clienteDireccion,
    clienteTelefono,
    fechaEmisionLabel: formatFechaLabel(fechaEmision),
    vendedor,
    formaPago,
    referencia,
    items: items
      .filter((i) => i.name.trim() && i.quantity > 0)
      .map((i) => ({ quantity: i.quantity, sku: i.sku, name: i.name, variant: i.variant, unitPrice: i.unitPrice })),
    subtotal: totals.subtotal,
    descuentoTipo,
    descuentoValor,
    descuentoMonto: totals.descuentoMonto,
    neto: totals.neto,
    iva: totals.iva,
    total: totals.total,
    condiciones,
    vigenciaDias,
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Cliente */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#0477BF]">Datos del cliente</h2>
            <div className="flex gap-2">
              <input
                value={clienteRut}
                onChange={(e) => setClienteRut(e.target.value)}
                placeholder="RUT empresa (76.123.456-7)"
                className={inputClass}
              />
              <button
                type="button"
                onClick={handleSearchClient}
                disabled={clientLoading}
                className="shrink-0 rounded-2xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-[#0477BF] disabled:opacity-50"
              >
                {clientLoading ? "…" : "Buscar"}
              </button>
            </div>
            {clientMsg && (
              <p className={clientMsg.tone === "info" ? "text-xs text-[#0477BF]" : "text-xs text-amber-600"}>
                {clientMsg.text}
              </p>
            )}
            <input
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              placeholder="Razón social"
              className={inputClass}
            />
            <input
              value={clienteDireccion}
              onChange={(e) => setClienteDireccion(e.target.value)}
              placeholder="Dirección comercial"
              className={inputClass}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                value={clienteTelefono}
                onChange={(e) => setClienteTelefono(e.target.value)}
                placeholder="Teléfono"
                className={inputClass}
              />
              <input
                value={clienteEmail}
                onChange={(e) => setClienteEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className={inputClass}
              />
            </div>
          </div>

          {/* Documento */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#0477BF]">Detalles del documento</h2>
            <input
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              placeholder="Referencia / Proyecto"
              className={inputClass}
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className={labelClass}>Fecha</label>
                <input
                  type="date"
                  value={fechaEmision}
                  onChange={(e) => setFechaEmision(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Vendedor</label>
                <input
                  value={vendedor}
                  onChange={(e) => setVendedor(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className={labelClass}>Forma de pago</label>
                <select
                  value={formaPago}
                  onChange={(e) => setFormaPago(e.target.value)}
                  className={inputClass}
                >
                  {FORMAS_PAGO.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Vigencia (días)</label>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={vigenciaDias}
                  onChange={(e) => handleVigenciaChange(parseInt(e.target.value, 10) || 15)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Productos */}
      <section className="rounded-[32px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#0477BF]">Productos</h2>

        <div className="overflow-visible rounded-2xl border border-black/10">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-black/10 bg-[#F8F8FA] text-xs uppercase tracking-wide text-black/45">
                <th className="w-16 p-3 text-center">Cant.</th>
                <th className="w-28 p-3 text-left">SKU</th>
                <th className="p-3 text-left">Descripción</th>
                <th className="w-36 p-3 text-right">Unitario</th>
                <th className="w-32 p-3 text-right">Subtotal</th>
                <th className="w-10 p-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.key} className="border-b border-black/5 last:border-b-0">
                  <td className="p-2">
                    <input
                      type="number"
                      min={1}
                      value={row.quantity}
                      onChange={(e) => updateRow(row.key, { quantity: parseInt(e.target.value, 10) || 1 })}
                      className={`${smallInputClass} text-center`}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={row.sku}
                      onChange={(e) => updateRow(row.key, { sku: e.target.value })}
                      placeholder="SKU"
                      className={`${smallInputClass} font-mono text-xs`}
                    />
                  </td>
                  <td className="p-2">
                    <ProductSearchField
                      value={row.name}
                      onChange={(value) => updateRow(row.key, { name: value, productId: null, variantId: null, variant: null })}
                      onPick={(result) =>
                        updateRow(row.key, {
                          productId: result.productId,
                          variantId: result.variantId,
                          sku: result.sku,
                          name: result.name,
                          variant: result.variant,
                          unitPrice: result.unitPrice,
                        })
                      }
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      min={0}
                      value={row.unitPrice}
                      onChange={(e) => updateRow(row.key, { unitPrice: parseFloat(e.target.value) || 0 })}
                      className={`${smallInputClass} text-right`}
                    />
                  </td>
                  <td className="p-2 text-right font-mono text-sm font-semibold text-black/70">
                    ${Math.round(row.quantity * row.unitPrice).toLocaleString("es-CL")}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeRow(row.key)}
                      className="text-black/25 transition hover:text-red-500"
                      aria-label="Quitar producto"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addRow}
          className="mt-3 text-sm font-semibold text-[#0477BF] hover:text-[#04527f]"
        >
          + Añadir producto
        </button>
      </section>

      {/* Condiciones + Totales */}
      <section className="rounded-[32px] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-black/45">
              Términos y observaciones
            </label>
            <textarea
              value={condiciones}
              onChange={(e) => setCondiciones(e.target.value)}
              rows={6}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex flex-col justify-end space-y-3">
            <div className="flex items-center justify-between border-b border-black/5 py-2">
              <span className="text-sm text-black/50">Subtotal</span>
              <span className="font-mono font-semibold text-black/80">
                ${Math.round(totals.subtotal).toLocaleString("es-CL")}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 border-b border-black/5 py-2">
              <span className="whitespace-nowrap text-sm text-black/50">Descuento</span>
              <div className="flex items-center gap-1.5">
                <select
                  value={descuentoTipo}
                  onChange={(e) => setDescuentoTipo(e.target.value as "pct" | "monto")}
                  className="rounded-lg border border-black/10 px-2 py-1 text-sm"
                >
                  <option value="pct">%</option>
                  <option value="monto">$</option>
                </select>
                <input
                  type="number"
                  min={0}
                  value={descuentoValor}
                  onChange={(e) => setDescuentoValor(parseFloat(e.target.value) || 0)}
                  className="w-24 rounded-lg border border-black/10 px-2 py-1 text-right text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-black/5 py-2">
              <span className="text-sm text-black/50">Neto</span>
              <span className="font-mono font-semibold text-black/80">
                ${Math.round(totals.neto).toLocaleString("es-CL")}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-black/5 py-2">
              <span className="text-sm text-black/50">I.V.A. (19%)</span>
              <span className="font-mono font-semibold text-black/80">
                ${Math.round(totals.iva).toLocaleString("es-CL")}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-xl font-extrabold text-black">TOTAL</span>
              <span className="font-mono text-2xl font-extrabold text-black">
                ${Math.round(totals.total).toLocaleString("es-CL")}
              </span>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={handlePreviewClick}
                className="flex-1 rounded-2xl border border-black/10 bg-white py-3.5 text-sm font-semibold text-black transition hover:border-black/25"
              >
                Vista previa
              </button>
              <button
                type="button"
                onClick={handleSaveOnly}
                disabled={saving}
                className="flex-1 rounded-2xl bg-black py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#0477BF] disabled:opacity-50"
              >
                {saving ? "Guardando…" : initial ? "Guardar cambios" : "Guardar cotización"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de vista previa */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
              <h3 className="font-bold text-black">Vista previa — Cotización</h3>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="rounded-xl bg-black/5 px-4 py-2 text-sm font-semibold text-black/70 transition hover:bg-black/10"
                >
                  ← Volver a editar
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndDownload}
                  disabled={saving}
                  className="rounded-xl bg-[#0477BF] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#04527f] disabled:opacity-50"
                >
                  {saving ? "Procesando…" : "Guardar y descargar PDF"}
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-[#F5F5F7] p-4">
              <QuoteDocument ref={docRef} data={documentData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
