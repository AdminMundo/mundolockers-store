"use client";

import { forwardRef } from "react";
import type { QuoteDocumentData } from "./types";

const COMPANY = {
  name: "LockerStore",
  legalName: "Roco Import SpA",
  rut: "78.124.096-6",
  activity: "Fabricación y comercialización de lockers metálicos y plásticos",
  address: "Quinta Normal, Santiago",
  email: "lockerstore2@gmail.com",
  phone: "+56 9 9413 1814",
};

const BANK = {
  banco: "Banco Santander",
  tipoCuenta: "Cuenta Corriente",
  numero: "000097545618",
  titular: "Roco Import SpA",
  rut: "78.124.096-6",
  email: "lockerstore2@gmail.com",
};

function clp(value: number): string {
  return "$" + Math.round(value).toLocaleString("es-CL");
}

export const QuoteDocument = forwardRef<HTMLDivElement, { data: QuoteDocumentData }>(
  function QuoteDocument({ data }, ref) {
    return (
      <div
        ref={ref}
        style={{
          width: 816,
          background: "white",
          padding: "36px 44px",
          margin: "0 auto",
          boxSizing: "border-box",
          fontFamily: "Inter, Arial, sans-serif",
          color: "#0f172a",
        }}
      >
        {/* Encabezado */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element -- necesita ser un <img> plano para que html2canvas lo capture al generar el PDF */}
            <img src="/brand/logometalico2.webp" alt={COMPANY.name} style={{ height: 44, width: "auto", display: "block", marginBottom: 8 }} />
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 3, fontWeight: 600 }}>R.U.T.: {COMPANY.rut}</div>
            <div style={{ fontSize: 10, color: "#94a3b8", fontStyle: "italic", marginTop: 1 }}>{COMPANY.activity.toUpperCase()}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 8 }}>{COMPANY.address}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 1 }}>{COMPANY.email} &nbsp;|&nbsp; {COMPANY.phone}</div>
          </div>
          <div style={{ border: "2.5px solid #0477BF", borderRadius: 14, padding: "14px 22px", textAlign: "center", minWidth: 150 }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: "#94a3b8", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>
              Cotización
            </div>
            <div style={{ fontSize: 30, fontWeight: 900, color: "#0477BF", lineHeight: 1, marginTop: 2 }}>
              {data.folioLabel}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "3px solid #0f172a", marginBottom: 18 }} />

        {/* Cliente + Emisión */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 8, fontWeight: 800, color: "#0477BF", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 10, borderBottom: "1px solid #f1f5f9", paddingBottom: 6 }}>
              Información del Cliente
            </div>
            <table style={{ width: "100%", fontSize: 11.5, borderCollapse: "collapse" }}>
              <tbody>
                <tr><td style={{ color: "#94a3b8", padding: "3px 0", whiteSpace: "nowrap", width: 80 }}>Señor(es):</td><td style={{ fontWeight: 700 }}>{data.clienteNombre || "—"}</td></tr>
                <tr><td style={{ color: "#94a3b8", padding: "3px 0" }}>R.U.T.:</td><td>{data.clienteRut || "—"}</td></tr>
                <tr><td style={{ color: "#94a3b8", padding: "3px 0" }}>Dirección:</td><td>{data.clienteDireccion || "—"}</td></tr>
                <tr><td style={{ color: "#94a3b8", padding: "3px 0" }}>Teléfono:</td><td>{data.clienteTelefono || "—"}</td></tr>
              </tbody>
            </table>
          </div>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 8, fontWeight: 800, color: "#0477BF", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 10, borderBottom: "1px solid #f1f5f9", paddingBottom: 6 }}>
              Detalles de Emisión
            </div>
            <table style={{ width: "100%", fontSize: 11.5, borderCollapse: "collapse" }}>
              <tbody>
                <tr><td style={{ color: "#94a3b8", padding: "3px 0", whiteSpace: "nowrap", width: 90 }}>Fecha Emisión:</td><td>{data.fechaEmisionLabel || "—"}</td></tr>
                <tr><td style={{ color: "#94a3b8", padding: "3px 0" }}>Vendedor:</td><td>{data.vendedor || "—"}</td></tr>
                <tr><td style={{ color: "#94a3b8", padding: "3px 0" }}>Forma Pago:</td><td>{data.formaPago || "—"}</td></tr>
                <tr><td style={{ color: "#94a3b8", padding: "3px 0" }}>Ref/Proyecto:</td><td>{data.referencia || "S/R"}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Productos */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 18 }}>
          <thead>
            <tr style={{ background: "#0f172a", color: "white" }}>
              <td style={{ padding: "9px 12px", textAlign: "center", width: 52, fontWeight: 700, fontSize: 9, textTransform: "uppercase", letterSpacing: 1 }}>Cant.</td>
              <td style={{ padding: "9px 12px", width: 80, fontWeight: 700, fontSize: 9, textTransform: "uppercase", letterSpacing: 1 }}>Código</td>
              <td style={{ padding: "9px 12px", fontWeight: 700, fontSize: 9, textTransform: "uppercase", letterSpacing: 1 }}>Descripción del Producto o Servicio</td>
              <td style={{ padding: "9px 12px", textAlign: "right", width: 110, fontWeight: 700, fontSize: 9, textTransform: "uppercase", letterSpacing: 1 }}>Precio Unit.</td>
              <td style={{ padding: "9px 12px", textAlign: "right", width: 110, fontWeight: 700, fontSize: 9, textTransform: "uppercase", letterSpacing: 1 }}>Subtotal</td>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, idx) => (
              <tr key={idx} style={{ background: idx % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                <td style={{ padding: "8px 12px", textAlign: "center", borderBottom: "1px solid #f1f5f9", fontSize: 12 }}>{item.quantity}</td>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #f1f5f9", fontSize: 10, fontFamily: "monospace", color: "#64748b" }}>{item.sku}</td>
                <td style={{ padding: "8px 12px", borderBottom: "1px solid #f1f5f9", fontSize: 12 }}>
                  {item.name}
                  {item.variant ? <span style={{ color: "#64748b" }}> · {item.variant}</span> : null}
                </td>
                <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", borderBottom: "1px solid #f1f5f9", fontSize: 12 }}>{clp(item.unitPrice)}</td>
                <td style={{ padding: "8px 12px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, borderBottom: "1px solid #f1f5f9", fontSize: 12 }}>{clp(item.quantity * item.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totales */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 16px", minWidth: 220 }}>
            <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "3px 0", color: "#64748b" }}>Subtotal:</td>
                  <td style={{ padding: "3px 0", textAlign: "right", fontFamily: "monospace" }}>{clp(data.subtotal)}</td>
                </tr>
                {data.descuentoValor > 0 && (
                  <tr>
                    <td style={{ padding: "3px 0", color: "#dc2626" }}>
                      {data.descuentoTipo === "pct" ? `Descuento (${data.descuentoValor}%):` : "Descuento ($):"}
                    </td>
                    <td style={{ padding: "3px 0", textAlign: "right", fontFamily: "monospace", color: "#dc2626" }}>
                      -{clp(data.descuentoMonto)}
                    </td>
                  </tr>
                )}
                <tr>
                  <td style={{ padding: "3px 0", color: "#64748b" }}>Neto:</td>
                  <td style={{ padding: "3px 0", textAlign: "right", fontFamily: "monospace" }}>{clp(data.neto)}</td>
                </tr>
                <tr>
                  <td style={{ padding: "3px 0", color: "#64748b" }}>I.V.A. (19%):</td>
                  <td style={{ padding: "3px 0", textAlign: "right", fontFamily: "monospace" }}>{clp(data.iva)}</td>
                </tr>
                <tr style={{ borderTop: "2px solid #0f172a" }}>
                  <td style={{ padding: "7px 0 0", fontSize: 14, fontWeight: 900, color: "#0f172a" }}>TOTAL:</td>
                  <td style={{ padding: "7px 0 0", textAlign: "right", fontSize: 14, fontWeight: 900, fontFamily: "monospace", color: "#0f172a" }}>{clp(data.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Términos + Datos bancarios */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 7.5, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>
              Términos y Observaciones
            </div>
            <div style={{ fontSize: 10.5, color: "#475569", whiteSpace: "pre-line", lineHeight: 1.5 }}>{data.condiciones}</div>
            <div style={{ fontSize: 10, color: "#64748b", marginTop: 6, fontWeight: 600 }}>
              Documento válido por {data.vigenciaDias} días corridos
            </div>
          </div>
          <div style={{ background: "#0f172a", color: "white", borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 7.5, fontWeight: 800, color: "#60a5fa", textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>
              Datos Bancarios
            </div>
            <div style={{ fontSize: 10.5, lineHeight: 1.7 }}>
              {BANK.titular} &nbsp;|&nbsp; RUT: {BANK.rut}<br />
              {BANK.banco} &nbsp;|&nbsp; {BANK.tipoCuenta}: {BANK.numero}<br />
              <span style={{ color: "#94a3b8", fontSize: 9.5 }}>Comprobante: {BANK.email}</span>
            </div>
          </div>
        </div>

        {/* Pie */}
        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 3, color: "#475569", textTransform: "uppercase" }}>{COMPANY.name}</div>
            <div style={{ fontSize: 8.5, color: "#94a3b8", marginTop: 1 }}>Despacho en: {COMPANY.address}</div>
          </div>
        </div>
      </div>
    );
  },
);
