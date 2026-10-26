// Envía los leads de la web al CRM de ventas (POST /api/leads del CRM).
// Solo en el servidor: usa la clave secreta del sitio (CRM_LEADS_KEY).

export type LeadCrm = {
  nombre?: string;
  empresa?: string;
  correo?: string;
  telefono?: string;
  tipo_cliente?: string;
  cantidad_lockers?: string;
  plazo?: string;
  mensaje?: string;
  productos?: string;
  monto_cotizado?: number;
  /** "cotizacion_directa", "organico", "google_ads"… Si falta, el CRM lo deduce. */
  canal?: string;
  [campo: string]: string | number | undefined;
};

/**
 * Nunca lanza error: si el CRM no responde, la cotización ya quedó guardada en el sitio
 * y el aviso por correo sigue llegando. El fallo queda en los logs de Vercel.
 */
export async function enviarLeadAlCrm(lead: LeadCrm): Promise<void> {
  const url = process.env.CRM_LEADS_URL;
  const clave = process.env.CRM_LEADS_KEY;
  if (!url || !clave) return;

  const datos = Object.fromEntries(Object.entries(lead).filter(([, v]) => v !== undefined && v !== ""));

  try {
    const respuesta = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": clave },
      body: JSON.stringify(datos),
      signal: AbortSignal.timeout(8000),
    });
    if (!respuesta.ok) {
      console.error("[crm] El CRM rechazó el lead", respuesta.status, await respuesta.text());
    }
  } catch (error) {
    console.error("[crm] No se pudo enviar el lead", error);
  }
}
