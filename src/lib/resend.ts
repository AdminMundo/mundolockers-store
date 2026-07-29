import "server-only";

type SendEmailInput = {
  to: string;
  from: string;
  subject: string;
  html: string;
};

/**
 * Envía un correo transaccional vía la API REST de Resend.
 * No lanza: retorna false y deja un log si falla, para que el llamador
 * pueda seguir intentando enviar otros correos independientes.
 */
export async function sendTransactionalEmail(input: SendEmailInput): Promise<boolean> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: input.from,
        to: [input.to],
        subject: input.subject,
        html: input.html,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[resend] error enviando correo:", res.status, text);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[resend] excepción enviando correo:", err);
    return false;
  }
}
