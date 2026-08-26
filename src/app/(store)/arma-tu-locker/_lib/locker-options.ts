export type BaseStyle = "patas" | "zocalo";
export type DoorStyle = "celosia" | "malla";
export type LockType = "codigo" | "candado" | "llave" | "electronica" | "moneda";

export type LockerColor = {
  id: string;
  label: string;
  hex: string;
  ral: string | null;
};

// Gris estándar de fábrica (sin costo de personalización) + los 8 colores RAL
// que ofrece el fabricante. El código RAL del naranjo está por confirmar —
// hex aproximado mientras tanto.
export const LOCKER_COLORS: LockerColor[] = [
  { id: "gris", label: "Gris estándar", hex: "#9BA1A6", ral: null },
  { id: "claret-violet", label: "Claret Violet", hex: "#6D1439", ral: "RAL 4004" },
  { id: "window-grey", label: "Window Grey", hex: "#9EA0A1", ral: "RAL 7040" },
  { id: "ultramarine-blue", label: "Ultramarine Blue", hex: "#1F2A5A", ral: "RAL 5002" },
  { id: "yellow-green", label: "Yellow Green", hex: "#57A639", ral: "RAL 6018" },
  { id: "traffic-red", label: "Traffic Red", hex: "#CC0605", ral: "RAL 3020" },
  { id: "signal-yellow", label: "Signal Yellow", hex: "#E5BE01", ral: "RAL 1003" },
  { id: "jet-black", label: "Jet Black", hex: "#0A0A0A", ral: "RAL 9005" },
  { id: "orange", label: "Naranjo", hex: "#E25303", ral: null },
];

export const BASE_STYLES: { id: BaseStyle; label: string; caption: string }[] = [
  { id: "patas", label: "Patas", caption: "4 patas plásticas, locker elevado del suelo." },
  { id: "zocalo", label: "Zócalo", caption: "Base sólida tipo faldón, sin espacio inferior." },
];

export const DOOR_STYLES: { id: DoorStyle; label: string; caption: string }[] = [
  { id: "celosia", label: "Celosía normal", caption: "Puerta sólida con rejillas de ventilación." },
  { id: "malla", label: "Con rejilla/malla", caption: "Malla de metal expandido, más ventilación." },
];

export const LOCK_TYPES: {
  id: LockType;
  label: string;
  caption: string;
  isDefault?: boolean;
}[] = [
  {
    id: "candado",
    label: "Portacandado con tirador",
    caption: "Sin cerradura propia, para tu candado.",
    isDefault: true,
  },
  { id: "codigo", label: "Chapa código", caption: "Dial mecánico de combinación." },
  { id: "llave", label: "Chapa llave", caption: "Cerradura de cilindro con 2 llaves." },
  { id: "electronica", label: "Chapa electrónica", caption: "Teclado digital numérico." },
  { id: "moneda", label: "Cerradura de moneda", caption: "Con llave y ranura para moneda." },
];

export const ROW_TERM_LABELS = ["simple", "doble", "triple", "cuádruple"] as const;

// Medidas reales tomadas de la ficha técnica del proveedor (Roco Import,
// serie LK-100 a LK-500): alto total y profundidad son fijos en todo el
// catálogo; el ancho crece por cuerpo (columna) y el alto de puerta baja
// según cuántas puertas hay por cuerpo (fila). Se usan tal cual como
// unidades del viewBox del SVG para que la proporción del dibujo sea fiel
// al producto real, no una grilla arbitraria.
export const PRODUCT_HEIGHT_CM = 170;
export const PRODUCT_DEPTH_CM = 45;
export const DOOR_WIDTH_CM = 24.75;

// Ancho total del mueble según cantidad de cuerpos (columnas), 1 a 5.
export const COLUMN_WIDTH_CM: Record<number, number> = {
  1: 29,
  2: 57,
  3: 83,
  4: 110,
  5: 137,
};

// Alto de cada puerta según cuántas puertas hay por cuerpo (filas), 1 a 4
// (simple/doble/triple/cuádruple).
export const DOOR_HEIGHT_CM: Record<number, number> = {
  1: 141.5,
  2: 70,
  3: 47,
  4: 35,
};
