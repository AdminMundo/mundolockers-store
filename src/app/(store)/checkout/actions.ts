"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { createFlowPayment } from "@/lib/flow";

export type CreatePedidoResult =
  | { success: true; orderId: string }
  | { success: false; error: string };

export type CreateFlowPaymentResult =
  | { success: true; redirectUrl: string }
  | { success: false; error: string };

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lockersstore.cl";

export async function createFlowPaymentAction(
  orderId: string,
  orderNumber: number | null,
  amount: number,
  email: string,
): Promise<CreateFlowPaymentResult> {
  try {
    const label = orderNumber
      ? `#${String(orderNumber).padStart(4, "0")}`
      : orderId.slice(0, 8).toUpperCase();

    const { url, token } = await createFlowPayment({
      commerceOrder: orderId,
      subject: `Pedido LockerStore ${label}`,
      amount,
      email,
      urlConfirmation: `${SITE_URL}/api/flow/webhook`,
      urlReturn: `${SITE_URL}/api/flow/return`,
    });

    return { success: true, redirectUrl: `${url}?token=${token}` };
  } catch (err) {
    console.error("createFlowPaymentAction error:", err);
    return { success: false, error: "No se pudo iniciar el pago con Flow. Intenta nuevamente." };
  }
}

export type CreatePedidoInput = {
  nombre: string;
  correo: string;
  telefono: string;
  empresa: string;
  tipo_documento: string;
  rut_empresa: string;
  tipo_entrega: string;
  region: string;
  ciudad: string;
  direccion: string;
  tipo_pago: string;
  notas: string;
  productosJson: string;
  subtotal: number;
  total: number;
};

export async function createPedidoAction(
  input: CreatePedidoInput,
): Promise<CreatePedidoResult> {
  try {
    const supabase = createSupabaseServer();

    let productos: unknown[] = [];
    try {
      productos = JSON.parse(input.productosJson);
    } catch {}

    const notasCompleta = [
      input.tipo_documento === "factura" && input.rut_empresa
        ? `Factura — RUT: ${input.rut_empresa}`
        : "Boleta",
      input.notas,
    ]
      .filter(Boolean)
      .join("\n");

    const { data, error } = await supabase
      .from("pedidos")
      .insert({
        nombre: input.nombre,
        correo: input.correo,
        telefono: input.telefono,
        empresa: input.empresa || null,
        rut: input.rut_empresa || null,
        tipo_entrega: input.tipo_entrega,
        region: input.region || null,
        ciudad: input.ciudad || null,
        direccion: input.direccion || null,
        productos,
        subtotal: input.subtotal,
        costo_despacho: 0,
        total: input.total,
        tipo_pago: input.tipo_pago,
        estado: "recibido",
        estado_pago: "pendiente",
        notas: notasCompleta || null,
      })
      .select("id, numero")
      .single();

    if (error || !data) {
      console.error("createPedidoAction error:", error);
      return { success: false, error: error?.message ?? "Error desconocido" };
    }

    // Notificación por email (silenciosa)
    try {
      const resendKey = process.env.RESEND_API_KEY;
      const notifyEmail = process.env.QUOTE_NOTIFICATION_EMAIL;
      if (resendKey && notifyEmail) {
        const numeroLabel = data.numero
          ? `#${String(data.numero).padStart(4, "0")}`
          : data.id.slice(0, 8).toUpperCase();

        const sendEmail = (to: string, subject: string, html: string) =>
          fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "LockerStore <pedidos@lockersstore.cl>",
              to: [to],
              subject,
              html,
            }),
          });

        const entrega =
          input.tipo_entrega === "despacho"
            ? `Despacho — ${input.ciudad}, ${input.region}`
            : "Retiro en tienda";

        // Email al dueño
        await sendEmail(
          notifyEmail,
          `Nuevo pedido ${numeroLabel} — ${input.nombre}`,
          `
            <h2>Nuevo pedido por transferencia ${numeroLabel}</h2>
            <p><strong>Cliente:</strong> ${input.nombre}</p>
            <p><strong>Correo:</strong> ${input.correo}</p>
            <p><strong>Teléfono:</strong> ${input.telefono}</p>
            ${input.empresa ? `<p><strong>Empresa:</strong> ${input.empresa}</p>` : ""}
            <p><strong>Entrega:</strong> ${entrega}</p>
            <p><strong>Total:</strong> $${input.subtotal.toLocaleString("es-CL")}</p>
            ${input.notas ? `<p><strong>Notas:</strong> ${input.notas}</p>` : ""}
            <hr/>
            <p>Ver pedido en admin: <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin/pedidos">Panel de pedidos</a></p>
          `,
        );

        // Email al cliente
        await sendEmail(
          input.correo,
          `Tu pedido ${numeroLabel} fue recibido — LockerStore`,
          `
            <h2>Recibimos tu pedido ${numeroLabel}</h2>
            <p>Hola ${input.nombre},</p>
            <p>Tu pedido fue recibido correctamente. Nos contactaremos contigo para coordinar el pago por transferencia.</p>
            <p><strong>Total:</strong> $${input.subtotal.toLocaleString("es-CL")}</p>
            <p><strong>Entrega:</strong> ${entrega}</p>
            <hr/>
            <p>Si tienes dudas escríbenos a <a href="mailto:pedidos@lockersstore.cl">pedidos@lockersstore.cl</a></p>
          `,
        );
      }
    } catch {}

    return { success: true, orderId: data.id };
  } catch (err) {
    console.error("createPedidoAction exception:", err);
    return { success: false, error: "Error al crear el pedido. Intenta nuevamente." };
  }
}
