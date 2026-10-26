// Preguntas que el CRM de ventas usa para calcular el puntaje A/B/C del lead.
// Los valores son los que entiende el CRM; las etiquetas, lo que ve el cliente.

export const TIPOS_CLIENTE = [
  ["empresa", "Empresa, industria o minería"],
  ["institucion", "Colegio, universidad o institución pública"],
  ["gimnasio_club_clinica", "Gimnasio, club o clínica"],
  ["particular", "Particular"],
] as const;

// El CRM toma el número más bajo del rango.
export const CANTIDADES_LOCKERS = [
  ["1", "1 a 4"],
  ["5", "5 a 19"],
  ["20", "20 a 49"],
  ["50", "50 o más"],
] as const;

export const PLAZOS = [
  ["este_mes", "Este mes"],
  ["1_3_meses", "En 1 a 3 meses"],
  ["cotizando", "Solo estoy cotizando"],
] as const;

export function etiqueta(opciones: readonly (readonly [string, string])[], valor: string): string {
  return opciones.find(([v]) => v === valor)?.[1] ?? "";
}
