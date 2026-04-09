import { NextRequest, NextResponse } from "next/server";
import { getFlowPaymentStatus } from "@/lib/flow";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lockersstore.cl";

/**
 * Flow redirige al cliente aquí después del pago (GET con ?token=...).
 * Consultamos el estado y redirigimos a /gracias o /pago-fallido.
 */
export async function GET(req: NextRequest) {
  const token =
    req.nextUrl.searchParams.get("token") ??
    // Flow a veces lo manda en POST para urlReturn
    null;

  if (!token) {
    return NextResponse.redirect(`${SITE_URL}/pago-fallido`);
  }

  try {
    const payment = await getFlowPaymentStatus(token);

    if (payment.status === 2) {
      return NextResponse.redirect(
        `${SITE_URL}/gracias?pedido=${payment.commerceOrder}`,
      );
    }

    return NextResponse.redirect(
      `${SITE_URL}/pago-fallido?pedido=${payment.commerceOrder}`,
    );
  } catch (err) {
    console.error("[flow/return] error:", err);
    return NextResponse.redirect(`${SITE_URL}/pago-fallido`);
  }
}

/** Flow también puede llamar urlReturn con POST en algunos flujos */
export async function POST(req: NextRequest) {
  let token: string | null = null;

  try {
    const text = await req.text();
    token = new URLSearchParams(text).get("token");
  } catch {}

  if (!token) {
    return NextResponse.redirect(`${SITE_URL}/pago-fallido`);
  }

  try {
    const payment = await getFlowPaymentStatus(token);

    if (payment.status === 2) {
      return NextResponse.redirect(
        `${SITE_URL}/gracias?pedido=${payment.commerceOrder}`,
      );
    }

    return NextResponse.redirect(
      `${SITE_URL}/pago-fallido?pedido=${payment.commerceOrder}`,
    );
  } catch {
    return NextResponse.redirect(`${SITE_URL}/pago-fallido`);
  }
}
