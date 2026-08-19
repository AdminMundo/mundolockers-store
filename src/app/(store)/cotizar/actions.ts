"use server";

import { Resend } from "resend";
import { createSupabaseServer } from "@/lib/supabase/server";
import { createSupabaseServerAuthClient } from "@/lib/supabase/auth-server";
import { escapeHtml, sanitizeHeaderText, parseEmailList } from "@/lib/utils";

export type QuoteActionState = {
  success: boolean;
  error: string | null;
};

type QuoteProduct = {
  name: string;
  sku: string | null;
  quantity: number;
  unitPrice: number | null;
  variant: string | null;
};

/**
 * El JSON de productos viene del cliente (FormData de un server action
 * público) — se valida en runtime en vez de solo castear el tipo, para que
 * un payload manipulado no pueda meter HTML/objetos raros en el correo.
 */
function parseQuoteProducts(raw: string): QuoteProduct[] | null {
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!Array.isArray(parsed)) return null;

  const products: QuoteProduct[] = [];
  for (const entry of parsed) {
    if (typeof entry !== "object" || entry === null) continue;
    const e = entry as Record<string, unknown>;

    if (typeof e.name !== "string" || !e.name.trim()) continue;
    if (typeof e.quantity !== "number" || !Number.isFinite(e.quantity)) continue;
    if (!(e.sku == null || typeof e.sku === "string")) continue;
    if (!(e.variant == null || typeof e.variant === "string")) continue;
    if (!(e.unitPrice == null || (typeof e.unitPrice === "number" && Number.isFinite(e.unitPrice)))) continue;

    products.push({
      name: e.name.slice(0, 200),
      sku: typeof e.sku === "string" ? e.sku.slice(0, 100) : null,
      quantity: Math.min(999, Math.max(1, Math.floor(e.quantity))),
      unitPrice: typeof e.unitPrice === "number" ? e.unitPrice : null,
      variant: typeof e.variant === "string" ? e.variant.slice(0, 100) : null,
    });
  }

  return products.length > 0 ? products : null;
}

function buildNotificationHtml(data: {
  nombre: string;
  empresa: string | null;
  correo: string;
  telefono: string | null;
  tipo_proyecto: string | null;
  mensaje: string | null;
  productos: QuoteProduct[] | null;
}): string {
  const productosHtml =
    data.productos && data.productos.length > 0
      ? `
        <h3 style="margin:24px 0 8px;font-size:14px;color:#111;">Productos cotizados</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:13px;">
          <thead>
            <tr style="background:#f5f5f7;">
              <th style="padding:8px 12px;text-align:left;border:1px solid #e5e7eb;">Producto</th>
              <th style="padding:8px 12px;text-align:left;border:1px solid #e5e7eb;">SKU</th>
              <th style="padding:8px 12px;text-align:left;border:1px solid #e5e7eb;">Variante</th>
              <th style="padding:8px 12px;text-align:right;border:1px solid #e5e7eb;">Cantidad</th>
              <th style="padding:8px 12px;text-align:right;border:1px solid #e5e7eb;">Precio unit.</th>
            </tr>
          </thead>
          <tbody>
            ${data.productos
              .map(
                (p) => `
              <tr>
                <td style="padding:8px 12px;border:1px solid #e5e7eb;">${escapeHtml(p.name)}</td>
                <td style="padding:8px 12px;border:1px solid #e5e7eb;color:#6b7280;">${p.sku ? escapeHtml(p.sku) : "—"}</td>
                <td style="padding:8px 12px;border:1px solid #e5e7eb;">${p.variant ? escapeHtml(p.variant) : "—"}</td>
                <td style="padding:8px 12px;border:1px solid #e5e7eb;text-align:right;">${p.quantity}</td>
                <td style="padding:8px 12px;border:1px solid #e5e7eb;text-align:right;">
                  ${p.unitPrice != null ? `$${p.unitPrice.toLocaleString("es-CL")}` : "Consultar"}
                </td>
              </tr>`,
              )
              .join("")}
          </tbody> 
        </table>`
      : "";

  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;color:#111;">
      <div style="background:#111;padding:24px 32px;border-radius:16px 16px 0 0;">
        <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.15em;color:rgba(255,255,255,0.6);text-transform:uppercase;">LockerStore</p>
        <h1 style="margin:8px 0 0;font-size:22px;font-weight:600;color:#fff;">Nueva solicitud de cotización</h1>
      </div>

      <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 16px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
          <tr>
            <td style="padding:6px 0;color:#6b7280;width:130px;">Nombre</td>
            <td style="padding:6px 0;font-weight:500;">${escapeHtml(data.nombre)}</td>
          </tr>
          ${data.empresa ? `
          <tr>
            <td style="padding:6px 0;color:#6b7280;">Empresa</td>
            <td style="padding:6px 0;">${escapeHtml(data.empresa)}</td>
          </tr>` : ""}
          <tr>
            <td style="padding:6px 0;color:#6b7280;">Correo</td>
            <td style="padding:6px 0;"><a href="mailto:${escapeHtml(data.correo)}" style="color:#111;">${escapeHtml(data.correo)}</a></td>
          </tr>
          ${data.telefono ? `
          <tr>
            <td style="padding:6px 0;color:#6b7280;">Teléfono</td>
            <td style="padding:6px 0;"><a href="tel:${escapeHtml(data.telefono)}" style="color:#111;">${escapeHtml(data.telefono)}</a></td>
          </tr>` : ""}
          ${data.tipo_proyecto ? `
          <tr>
            <td style="padding:6px 0;color:#6b7280;">Proyecto</td>
            <td style="padding:6px 0;">${escapeHtml(data.tipo_proyecto)}</td>
          </tr>` : ""}
        </table>

        ${data.mensaje ? `
        <div style="margin-top:20px;padding:16px;background:#f9fafb;border-radius:12px;font-size:14px;line-height:1.6;color:#374151;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;">Mensaje</p>
          <p style="margin:0;">${escapeHtml(data.mensaje).replace(/\n/g, "<br/>")}</p>
        </div>` : ""}

        ${productosHtml}

        <div style="margin-top:28px;padding-top:20px;border-top:1px solid #f3f4f6;font-size:12px;color:#9ca3af;">
          Este aviso fue generado automáticamente por el formulario de cotización de LockerStore.
        </div>
      </div>
    </div>
  `;
}

const MIN_FILL_TIME_MS = 1500;

export async function submitQuoteAction(
  _prev: QuoteActionState,
  formData: FormData,
): Promise<QuoteActionState> {
  // Honeypot: campo invisible para humanos. Si viene lleno, es un bot.
  const honeypot = String(formData.get("company_site") ?? "").trim();

  // Trampa de tiempo: un bot típico completa y envía el formulario casi
  // instantáneamente; una persona tarda al menos un par de segundos.
  const renderedAt = Number(formData.get("ts") ?? 0);
  const filledInMs = Date.now() - renderedAt;
  const submittedTooFast =
    !renderedAt || !Number.isFinite(filledInMs) || filledInMs < MIN_FILL_TIME_MS;

  if (honeypot || submittedTooFast) {
    // Respondemos éxito "falso" para no darle señal útil a un bot que
    // esté probando el formulario, sin guardar nada ni enviar correo.
    return { success: true, error: null };
  }

  const nombre = String(formData.get("nombre") ?? "").trim();
  const empresa = String(formData.get("empresa") ?? "").trim();
  const rut = String(formData.get("rut") ?? "").trim();
  const correo = String(formData.get("correo") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();
  const tipo_proyecto = String(formData.get("tipo_proyecto") ?? "").trim();
  const mensaje = String(formData.get("mensaje") ?? "").trim();
  const productosRaw = String(formData.get("productos") ?? "").trim();

  if (!nombre || !correo) {
    return { success: false, error: "Nombre y correo son obligatorios." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return { success: false, error: "El correo ingresado no es válido." };
  }

  const productos = parseQuoteProducts(productosRaw);

  const supabase = createSupabaseServer();

  const authClient = await createSupabaseServerAuthClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  const { error: dbError } = await supabase.from("cotizaciones").insert({
    user_id: user?.id ?? null,
    source: "lockersstore",
    nombre,
    empresa: empresa || null,
    rut: rut || null,
    correo,
    telefono: telefono || null,
    tipo_proyecto: tipo_proyecto || null,
    mensaje: mensaje || null,
    productos,
    estado: "pendiente",
  });

  if (dbError) {
    console.error("[submitQuoteAction] DB error:", dbError.message);
    return {
      success: false,
      error:
        "No se pudo guardar la solicitud. Intenta por WhatsApp o vuelve a intentarlo.",
    };
  }

  // Notificación por email (no bloquea si falla)
  const resendKey = process.env.RESEND_API_KEY;
  const notifyTo = parseEmailList(process.env.QUOTE_NOTIFICATION_EMAIL);

  if (resendKey && notifyTo.length > 0) {
    try {
      const resend = new Resend(resendKey);
      const nombreSubject = sanitizeHeaderText(nombre);
      const empresaSubject = empresa ? sanitizeHeaderText(empresa) : "";

      const { error: sendError } = await resend.emails.send({
        from: "LockerStore <cotizaciones@lockersstore.cl>",
        to: notifyTo,
        replyTo: correo,
        subject: `Nueva cotización de ${nombreSubject}${empresaSubject ? ` – ${empresaSubject}` : ""}`,
        html: buildNotificationHtml({
          nombre,
          empresa: empresa || null,
          correo,
          telefono: telefono || null,
          tipo_proyecto: tipo_proyecto || null,
          mensaje: mensaje || null,
          productos,
        }),
      });

      if (sendError) {
        // El email falló pero la cotización ya se guardó — no devolvemos error al usuario
        console.error("[submitQuoteAction] Resend error:", sendError);
      }
    } catch (emailErr) {
      console.error("[submitQuoteAction] Email error:", emailErr);
    }
  }

  return { success: true, error: null };
}
