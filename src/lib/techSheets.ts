// src/lib/techSheets.ts
export type TechSheetImage = { src: string; alt: string };

// ✅ Mapping SOLO para productos que tengan ficha
const TECH_SHEETS_BY_SLUG: Record<string, TechSheetImage> = {
  "locker-mineria-especial-9-puertas-banca-incluida": {
    src: "/images/tech-sheets/mineros/locker-mineria-especial-9-puertas-banca-incluida.webp",
    alt: "Ficha técnica y medidas del Locker Minería Especial 09 puertas con banca",
  },
    "locker-mineria-especial-12-puertas": {
    src: "/images/tech-sheets/mineros/locker-mineria-12-puertas-banca-incluida.webp",
    alt: "Ficha técnica y medidas - Locker Minería Especial 12 puertas",
  },
};

export function getTechSheetBySlug(slug: string): TechSheetImage | null {
  return TECH_SHEETS_BY_SLUG[slug] ?? null;
}
