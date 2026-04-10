import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getFlowPaymentStatus } from "@/lib/flow";
import { createSupabaseServer } from "@/lib/supabase/server";

/**
 * Verifica la firma HMAC-SHA256 que Flow incluye en cada webhook.
 * Flow firma todos los parámetros (ordenados alfabéticamente, sin 's')
 * concatenados como "key1value1key2value2..." usando el secretKey.
 */
function verifyFlowSignature(
  params: Record<string, string>,
  secretKey: string,
): boolean {
  const receivedSig = params["s"];
  if (!receivedSig) return false;

  // Construimos la cadena a firmar: todos los params excepto 's', ordenados
  const toSign = Object.keys(params)
    .filter((k) => k !== "s")
    .sort()
    .map((k) => `${k}${params[k]}`)
    .join("");

  const expected = createHmac("sha256", secretKey)
    .update(toSign)
    .digest("hex");

  // timingSafeEqual previene timing attacks al comparar strings
  try {
    return timingSafeEqual(Buffer.from(receivedSig), Buffer.from(expected));
  } catch {
    // Buffers de distinto largo lanzan — significa firma inválida
    return false;
  }
}

/**
 * Webhook que Flow llama (POST) cuando un pago cambia de estado.
 * Flow envía los parámetros en form-urlencoded, incluyendo 'token' y 's' (firma).
 */
export async function POST(req: NextRequest) {
  const secretKey = process.env.FLOW_SECRET_KEY;
  if (!secretKey) {
    console.error("[flow/webhook] FLOW_SECRET_KEY no configurado");
    return NextResponse.json({ error: "configuración incompleta" }, { status: 500 });
  }

  // Parsear body (Flow usa application/x-www-form-urlencoded)
  let params: Record<string, string> = {};
  try {
    const text = await req.text();
    for (const [k, v] of new URLSearchParams(text)) {
      params[k] = v;
    }
  } catch {
    console.error("[flow/webhook] no se pudo leer el body");
    return NextResponse.json({ error: "body inválido" }, { status: 400 });
  }

  // Verificar firma antes de hacer cualquier otra cosa
  if (!verifyFlowSignature(params, secretKey)) {
    console.error("[flow/webhook] firma HMAC inválida — posible request fraudulento", {
      ip: req.headers.get("x-forwarded-for") ?? "desconocida",
    });
    return NextResponse.json({ error: "firma inválida" }, { status: 401 });
  }

  const token = params["token"] ?? null;
  if (!token) {
    console.error("[flow/webhook] token faltante tras verificación de firma");
    return NextResponse.json({ error: "token requerido" }, { status: 400 });
  }

  try {
    const payment = await getFlowPaymentStatus(token);
    const supabase = createSupabaseServer();

    if (payment.status === 2) {
      // Pagado
      const { error } = await supabase
        .from("pedidos")
        .update({ estado_pago: "pagado" })
        .eq("id", payment.commerceOrder);

      if (error) console.error("[flow/webhook] error actualizando pedido:", error);
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
