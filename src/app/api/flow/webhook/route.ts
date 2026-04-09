import { NextRequest, NextResponse } from "next/server";
import { getFlowPaymentStatus } from "@/lib/flow";
import { createSupabaseServer } from "@/lib/supabase/server";

/**
 * Webhook que Flow llama (POST) cuando un pago cambia de estado.
 * Flow envía el parámetro `token` en el body (form-urlencoded).
 * Debemos responder 200 OK para que Flow no reintente.
 */
export async function POST(req: NextRequest) {
  let token: string | null = null;

  try {
    const body = await req.formData();
    token = body.get("token") as string | null;
  } catch {
    // Flow a veces manda application/x-www-form-urlencoded
    try {
      const text = await req.text();
      token = new URLSearchParams(text).get("token");
    } catch {}
  }

  if (!token) {
    console.error("[flow/webhook] token faltante");
    return NextResponse.json({ error: "token requerido" }, { status: 400 });
  }

  try {
    const payment = await getFlowPaymentStatus(token);

    const supabase = createSupabaseServer();

    if (payment.status === 2) {
      // Pagado — actualizamos el pedido
      const { error } = await supabase
        .from("pedidos")
        .update({ estado_pago: "pagado" })
        .eq("id", payment.commerceOrder);

      if (error) {
        console.error("[flow/webhook] error actualizando pedido:", error);
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
    console.error("[flow/webhook] error:", err);
    // Devolvemos 200 igual para que Flow no reintente en bucle
    return NextResponse.json({ ok: false, error: String(err) });
  }
}
