import { NextRequest, NextResponse } from "next/server";
import { getFlowPaymentStatus } from "@/lib/flow";
import { createSupabaseServer } from "@/lib/supabase/server";
import { escapeHtml, sanitizeHeaderText } from "@/lib/utils";
import { sendTransactionalEmail } from "@/lib/resend";

type PedidoResumen = {
  id: string;
  numero: number | null;
  nombre: string;
  correo: string;
  total: number;
  tipo_entrega: string;
  ciudad: string | null;
  region: string | null;
};

async function sendPaymentConfirmationEmails(pedido: PedidoResumen) {
  const notifyEmail = process.env.QUOTE_NOTIFICATION_EMAIL;

  const label = pedido.numero
    ? `#${String(pedido.numero).padStart(4, "0")}`
    : pedido.id.slice(0, 8).toUpperCase();

  const entrega =
    pedido.tipo_entrega === "despacho"
      ? `Despacho a ${escapeHtml(pedido.ciudad ?? "")}, ${escapeHtml(pedido.region ?? "")}`
      : "Retiro en tienda";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lockersstore.cl";
  const nombreSubject = sanitizeHeaderText(pedido.nombre);

  const emails = [
    sendTransactionalEmail({
      to: pedido.correo,
      from: "LockerStore <pedidos@lockersstore.cl>",
      subject: `Tu pedido ${label} fue confirmado — LockerStore`,
      html: `
        <h2>¡Pago recibido! Tu pedido ${label} está confirmado</h2>
        <p>Hola ${escapeHtml(pedido.nombre)},</p>
        <p>Recibimos tu pago correctamente. Pronto nos pondremos en contacto contigo.</p>
        <p><strong>Total pagado:</strong> $${Number(pedido.total).toLocaleString("es-CL")}</p>
        <p><strong>Entrega:</strong> ${entrega}</p>
        <hr/>
        <p>Si tienes dudas escríbenos a <a href="mailto:pedidos@lockersstore.cl">pedidos@lockersstore.cl</a></p>
      `,
    }),
  ];

  if (notifyEmail) {
    emails.push(
      sendTransactionalEmail({
        to: notifyEmail,
        from: "LockerStore <pedidos@lockersstore.cl>",
        subject: `Pago confirmado pedido ${label} — ${nombreSubject}`,
        html: `
          <h2>Pago confirmado — pedido ${label}</h2>
          <p><strong>Cliente:</strong> ${escapeHtml(pedido.nombre)}</p>
          <p><strong>Correo:</strong> ${escapeHtml(pedido.correo)}</p>
          <p><strong>Total:</strong> $${Number(pedido.total).toLocaleString("es-CL")}</p>
          <p><strong>Entrega:</strong> ${entrega}</p>
          <hr/>
          <p><a href="${siteUrl}/admin/pedidos">Ver pedido en admin →</a></p>
        `,
      }),
    );
  }

  // En paralelo y de forma independiente: si uno falla, no bloquea al otro.
  await Promise.allSettled(emails);
}

/**
 * Webhook que Flow llama (POST) cuando un pago cambia de estado.
 * Flow envía los parámetros en form-urlencoded, incluyendo 'token' y 's' (firma).
 */
export async function POST(req: NextRequest) {
  // Parsear body (Flow usa application/x-www-form-urlencoded)
  const params: Record<string, string> = {};
  try {
    const text = await req.text();
    for (const [k, v] of new URLSearchParams(text)) {
      params[k] = v;
    }
  } catch {
    console.error("[flow/webhook] no se pudo leer el body");
    return NextResponse.json({ error: "body inválido" }, { status: 400 });
  }

  console.log("[flow/webhook] recibido, keys:", Object.keys(params));

  const token = params["token"] ?? null;
  if (!token) {
    console.error("[flow/webhook] token faltante tras verificación de firma");
    return NextResponse.json({ error: "token requerido" }, { status: 400 });
  }

  try {
    const payment = await getFlowPaymentStatus(token);
    const supabase = createSupabaseServer();

    if (payment.status === 2) {
      // Pagado — actualizar y obtener datos del pedido para el email
      const { data: pedido, error } = await supabase
        .from("pedidos")
        .update({ estado_pago: "pagado" })
        .eq("id", payment.commerceOrder)
        .select("id, numero, nombre, correo, total, tipo_entrega, ciudad, region")
        .single();

      if (error) {
        console.error("[flow/webhook] error actualizando pedido:", error);
      } else if (pedido) {
        await sendPaymentConfirmationEmails(pedido).catch((err) =>
          console.error("[flow/webhook] error enviando emails:", err),
        );
      }
    } else if (payment.status === 3 || payment.status === 4) {
      // Rechazado o anulado
      await supabase
        .from("pedidos")
        .update({ estado_pago: "rechazado" })
        .eq("id", payment.commerceOrder);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[flow/webhook] error procesando pago:", err);
    // Respondemos 200 para que Flow no reintente en bucle
    return NextResponse.json({ ok: false, error: String(err) });
  }
}
