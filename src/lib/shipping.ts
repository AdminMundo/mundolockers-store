// Datos de despacho por región/comuna. Compartido entre el checkout (cliente,
// para mostrar el costo al elegir comuna) y las acciones de servidor (para
// calcular el total real del pedido — nunca se confía en un monto que venga
// del navegador).

export const REGION_METROPOLITANA = "Región Metropolitana";

export const REGIONES_CHILE = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  REGION_METROPOLITANA,
  "O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "La Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén",
  "Magallanes",
] as const;

const COMUNAS_GRATIS = [
  "Cerrillos",
  "Cerro Navia",
  "Conchalí",
  "Estación Central",
  "Independencia",
  "La Cisterna",
  "La Granja",
  "Lo Espejo",
  "Lo Prado",
  "Macul",
  "Ñuñoa",
  "Pedro Aguirre Cerda",
  "Providencia",
  "Quinta Normal",
  "Recoleta",
  "Renca",
  "San Joaquín",
  "San Miguel",
  "San Ramón",
  "Santiago",
];

const COMUNAS_25000 = [
  "Huechuraba",
  "Quilicura",
  "Pudahuel",
  "Maipú",
  "La Florida",
  "Peñalolén",
  "La Reina",
  "Las Condes",
  "Vitacura",
];

const COMUNAS_30000 = [
  "Pirque",
  "Puente Alto",
  "San José de Maipo",
  "Colina",
  "Lampa",
  "Tiltil",
  "Buin",
  "Calera de Tango",
  "Paine",
  "San Bernardo",
  "Alhué",
  "Curacaví",
  "María Pinto",
  "Melipilla",
  "San Pedro",
  "El Monte",
  "Isla de Maipo",
  "Padre Hurtado",
  "Peñaflor",
  "Talagante",
];

// Comunas de la Región Metropolitana sin tarifa confirmada todavía (El Bosque,
// La Pintana y Lo Barnechea no vinieron en ninguna de las 3 listas que nos
// pasaron). Igual aparecen en el selector para que el cliente elija su comuna
// real, pero el costo queda "por coordinar" hasta tener el valor correcto.
const COMUNAS_SIN_TARIFA = ["El Bosque", "La Pintana", "Lo Barnechea"];

type ComunaRM = { nombre: string; costoDespacho: number | null };

export const COMUNAS_RM: ComunaRM[] = [
  ...COMUNAS_GRATIS.map((nombre) => ({ nombre, costoDespacho: 0 })),
  ...COMUNAS_25000.map((nombre) => ({ nombre, costoDespacho: 25000 })),
  ...COMUNAS_30000.map((nombre) => ({ nombre, costoDespacho: 30000 })),
  ...COMUNAS_SIN_TARIFA.map((nombre) => ({ nombre, costoDespacho: null })),
].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

export function esRegionMetropolitana(region: string): boolean {
  return region.trim() === REGION_METROPOLITANA;
}

export type ShippingQuote =
  | { status: "sin_region" }
  | { status: "gratis"; cost: 0 }
  | { status: "pagado"; cost: number }
  | { status: "coordinar" };

/** Cotización de despacho para mostrar al cliente mientras completa el formulario. */
export function getShippingQuote(region: string, comuna: string): ShippingQuote {
  if (!region.trim()) return { status: "sin_region" };
  if (!esRegionMetropolitana(region)) return { status: "coordinar" };

  const match = COMUNAS_RM.find((c) => c.nombre === comuna);
  if (!match || match.costoDespacho === null) return { status: "coordinar" };

  return match.costoDespacho === 0
    ? { status: "gratis", cost: 0 }
    : { status: "pagado", cost: match.costoDespacho };
}

/**
 * Costo de despacho para cobrar en el pedido. "Por coordinar" cobra $0 ahora
 * (como siempre se ha hecho para despachos fuera de cobertura): el valor se
 * coordina aparte con el cliente, no se adivina.
 */
export function getShippingCost(region: string, comuna: string): number {
  const quote = getShippingQuote(region, comuna);
  return quote.status === "gratis" || quote.status === "pagado" ? quote.cost : 0;
}
