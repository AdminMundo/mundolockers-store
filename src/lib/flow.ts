import { createHmac } from "crypto";

const FLOW_BASE_URL =
  process.env.FLOW_SANDBOX === "true"
    ? "https://sandbox.flow.cl/api"
    : "https://www.flow.cl/api";

/** Firma los parámetros con HMAC-SHA256 según spec de Flow */
function sign(params: Record<string, string>, secretKey: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}${params[k]}`)
    .join("");
  return createHmac("sha256", secretKey).update(toSign).digest("hex");
}

export type FlowPaymentResult = {
  url: string;
  token: string;
  flowOrder: number;
};

export type FlowStatusResult = {
  status: 1 | 2 | 3 | 4; // 1=pendiente 2=pagado 3=rechazado 4=anulado
  commerceOrder: string;
  amount: number;
  flowOrder: number;
};

/**
 * Crea una orden de pago en Flow.
 * Retorna la URL a la que hay que redirigir al cliente.
 */
export async function createFlowPayment(params: {
  commerceOrder: string;
  subject: string;
  amount: number;
  email: string;
  urlConfirmation: string;
  urlReturn: string;
}): Promise<FlowPaymentResult> {
  const apiKey = process.env.FLOW_API_KEY;
  const secretKey = process.env.FLOW_SECRET_KEY;

  if (!apiKey || !secretKey) {
    throw new Error("FLOW_API_KEY o FLOW_SECRET_KEY no configurados");
  }

  const p: Record<string, string> = {
    apiKey,
    commerceOrder: params.commerceOrder,
    subject: params.subject,
    currency: "CLP",
    amount: String(Math.round(params.amount)),
    email: params.email,
    urlConfirmation: params.urlConfirmation,
    urlReturn: params.urlReturn,
  };

  p.s = sign(p, secretKey);

  const res = await fetch(`${FLOW_BASE_URL}/payment/create`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(p).toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Flow /payment/create error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return { url: data.url, token: data.token, flowOrder: data.flowOrder };
}

/**
 * Consulta el estado de un pago dado su token.
 */
export async function getFlowPaymentStatus(token: string): Promise<FlowStatusResult> {
  const apiKey = process.env.FLOW_API_KEY;
  const secretKey = process.env.FLOW_SECRET_KEY;

  if (!apiKey || !secretKey) {
    throw new Error("FLOW_API_KEY o FLOW_SECRET_KEY no configurados");
  }

  const p: Record<string, string> = { apiKey, token };
  p.s = sign(p, secretKey);

  const res = await fetch(
    `${FLOW_BASE_URL}/payment/getStatus?${new URLSearchParams(p)}`,
    { method: "GET" },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Flow /payment/getStatus error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return {
    status: data.status,
    commerceOrder: data.commerceOrder,
    amount: data.amount,
    flowOrder: data.flowOrder,
  };
}
