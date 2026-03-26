// src/lib/techSheets.ts
export type TechSheetImage = { src: string; alt: string };

// ✅ Mapping SOLO para productos que tengan ficha
const TECH_SHEETS_BY_SLUG: Record<string, TechSheetImage> = {
  //LOCKERS metalicos FICHAS TECNICAS
  // LOCKERS METÁLICOS – FICHAS TÉCNICAS
"locker-metalico-1-puerta-1-cuerpo-simple": {
  src: "/images/tech-sheets/lockers-metalicos/locker-metalico-1-puerta-1-cuerpo-simple.webp",
  alt: "Ficha técnica y medidas del Locker Metálico 1 puerta, 1 cuerpo simple",
},

"lockers-metalicos-5-puertas-5-cuerpos-simples": {
  src: "/images/tech-sheets/lockers-metalicos/lockers-metalicos-5-puertas-5-cuerpos-simples.webp",
  alt: "Ficha técnica y medidas del Locker Metálico 5 puertas, 5 cuerpos simples",
},

"locker-metalico-4-puertas-4-cuerpos-simples": {
  src: "/images/tech-sheets/lockers-metalicos/locker-metalico-4-puertas-4-cuerpos-simples.webp",
  alt: "Ficha técnica y medidas del Locker Metálico 4 puertas, 4 cuerpos simples",
},

"locker-metalico-8-puertas-2-cuerpos-cuadruples": {
  src: "/images/tech-sheets/lockers-metalicos/locker-metalico-8-puertas-2-cuerpos-cuadruples.webp",
  alt: "Ficha técnica y medidas del Locker Metálico 8 puertas, 2 cuerpos cuádruples",
},

"locker-metalico-8-puertas-4-cuerpos-dobles": {
  src: "/images/tech-sheets/lockers-metalicos/locker-metalico-8-puertas-4-cuerpos-dobles.webp",
  alt: "Ficha técnica y medidas del Locker Metálico 8 puertas, 4 cuerpos dobles",
},

"locker-metalico-4-puertas-1-cuerpo-cuadruple": {
  src: "/images/tech-sheets/lockers-metalicos/locker-metalico-4-puertas-1-cuerpo-cuadruple.webp",
  alt: "Ficha técnica y medidas del Locker Metálico 4 puertas, 1 cuerpo cuádruple",
},

"locker-metalico-3-puertas-3-cuerpos-simples": {
  src: "/images/tech-sheets/lockers-metalicos/locker-metalico-3-puertas-3-cuerpos-simples.webp",
  alt: "Ficha técnica y medidas del Locker Metálico 3 puertas, 3 cuerpos simples",
},

"locker-metalico-2-puertas-2-cuerpos-simples": {
  src: "/images/tech-sheets/lockers-metalicos/locker-metalico-2-puertas-2-cuerpos-simples.webp",
  alt: "Ficha técnica y medidas del Locker Metálico 2 puertas, 2 cuerpos simples",
},

"locker-metalico-20-puertas-5-cuerpos-cuadruples": {
  src: "/images/tech-sheets/lockers-metalicos/locker-metalico-20-puertas-5-cuerpos-cuadruples.webp",
  alt: "Ficha técnica y medidas del Locker Metálico 20 puertas, 5 cuerpos cuádruples",
},

"locker-metalico-10-puertas-5-cuerpos-dobles": {
  src: "/images/tech-sheets/lockers-metalicos/locker-metalico-10-puertas-5-cuerpos-dobles.webp",
  alt: "Ficha técnica y medidas del Locker Metálico 10 puertas, 5 cuerpos dobles",
},

"locker-metalico-6-puertas-3-cuerpos-dobles": {
  src: "/images/tech-sheets/lockers-metalicos/locker-metalico-6-puertas-3-cuerpos-dobles.webp",
  alt: "Ficha técnica y medidas del Locker Metálico 6 puertas, 3 cuerpos dobles",
},

"locker-metalico-4-puertas-2-cuerpos-dobles": {
  src: "/images/tech-sheets/lockers-metalicos/locker-metalico-4-puertas-2-cuerpos-dobles.webp",
  alt: "Ficha técnica y medidas del Locker Metálico 4 puertas, 2 cuerpos dobles",
},

"locker-metalico-2-puertas-1-cuerpo-doble": {
  src: "/images/tech-sheets/lockers-metalicos/locker-metalico-2-puertas-1-cuerpo-doble.webp",
  alt: "Ficha técnica y medidas del Locker Metálico 2 puertas, 1 cuerpo doble",
},

"locker-metalico-15-puertas-5-cuerpos-triples": {
  src: "/images/tech-sheets/lockers-metalicos/locker-metalico-15-puertas-5-cuerpos-triples.webp",
  alt: "Ficha técnica y medidas del Locker Metálico 15 puertas, 5 cuerpos triples",
},

"locker-metalico-12-puertas-4-cuerpos-triples": {
  src: "/images/tech-sheets/lockers-metalicos/locker-metalico-12-puertas-4-cuerpos-triples.webp",
  alt: "Ficha técnica y medidas del Locker Metálico 12 puertas, 4 cuerpos triples",
},

"locker-metalico-9-puertas-3-cuerpos-triples": {
  src: "/images/tech-sheets/lockers-metalicos/locker-metalico-9-puertas-3-cuerpos-triples.webp",
  alt: "Ficha técnica y medidas del Locker Metálico 9 puertas, 3 cuerpos triples",
},

"locker-metalico-6-puertas-2-cuerpos-triples": {
  src: "/images/tech-sheets/lockers-metalicos/locker-metalico-6-puertas-2-cuerpos-triples.webp",
  alt: "Ficha técnica y medidas del Locker Metálico 6 puertas, 2 cuerpos triples",
},

"locker-metalico-3-puertas-1-cuerpo-triple": {
  src: "/images/tech-sheets/lockers-metalicos/locker-metalico-3-puertas-1-cuerpo-triple.webp",
  alt: "Ficha técnica y medidas del Locker Metálico 3 puertas, 1 cuerpo triple",
},

"locker-metalico-12-puertas-3-cuerpos-cuadruples": {
  src: "/images/tech-sheets/lockers-metalicos/locker-metalico-12-puertas-3-cuerpos-cuadruples.webp",
  alt: "Ficha técnica y medidas del Locker Metálico 12 puertas, 3 cuerpos cuádruples",
},

"locker-metalico-casillero-16-puertas-4-cuerpos-cuadruples": {
  src: "/images/tech-sheets/lockers-metalicos/locker-metalico-casillero-16-puertas-4-cuerpos-cuadruples.webp",
  alt: "Ficha técnica y medidas del Locker Metálico casillero 16 puertas, 4 cuerpos cuádruples",
},

"locker-metalico-3-puertas-2-cuerpos": {
  src: "/images/tech-sheets/lockers-metalicos/locker-metalico-3-puertas-2-cuerpos.webp",
  alt: "Ficha técnica y medidas del Locker Metálico 3 puertas, 2 cuerpos",
},

  //LOCKERS MINEROS FICHAS TECNICAS
  "locker-mineria-especial-9-puertas-banca-incluida": {
    src: "/images/tech-sheets/mineros/locker-mineria-especial-9-puertas-banca-incluida.webp",
    alt: "Ficha técnica y medidas del Locker Minería Especial 09 puertas con banca",
  },
  "locker-mineria-12-puertas-banca-incluida": {
    src: "/images/tech-sheets/mineros/locker-mineria-12-puertas-banca-incluida.webp",
    alt: "Ficha técnica y medidas del Locker Minería 12 puertas con banca incluida",
  },
  "locker-mineria-9-puertas-banca-incluida": {
    src: "/images/tech-sheets/mineros/locker-mineria-9-puertas-banca-incluida.webp",
    alt: "Ficha técnica y medidas del Locker Minería 9 puertas con banca",
  },
  "locker-mineria-6-puertas-banca-incluida": {
    src: "/images/tech-sheets/mineros/locker-mineria-6-puertas-banca-incluida.webp",
    alt: "Ficha técnica y medidas del Locker Minería 6 puertas con banca incluida",
  },

  //STORAGE METALICO FICHAS TECNICAS
  "storage-metalico-vitrina-mixta": {
  src: "/images/tech-sheets/roperillos/storage-metalico-vitrina-mixta.webp",
  alt: "Ficha técnica y medidas del Storage Metálico Vitrina Mixta",
},

"storage-metalico-2-puertas-4-bandejas": {
  src: "/images/tech-sheets/roperillos/storage-metalico-2-puertas-4-bandejas.webp",
  alt: "Ficha técnica y medidas del Storage Metálico 2 Puertas – 4 Bandejas",
},

"storage-metalico-vitrina-4-bandejas": {
  src: "/images/tech-sheets/roperillos/storage-metalico-vitrina-4-bandejas.webp",
  alt: "Ficha técnica y medidas del Storage Metálico Vitrina – 4 Bandejas",
},

"roperillo-metalico": {
  src: "/images/tech-sheets/roperillos/roperillo-metalico.webp",
  alt: "Ficha técnica y medidas del Roperillo Metálico",
},

"roperillo-locker-institucional-2-puertas": {
  src: "/images/tech-sheets/roperillos/roperillo-locker-institucional-2-puertas.webp",
  alt: "Ficha técnica y medidas del Roperillo / Locker Institucional 2 Puertas",
},


// Kardex metalico Fichas tecnicas
"kardex-metalico-3-cajones": {
  src: "/images/tech-sheets/kardex/kardex-metalico-3-cajones.webp",
  alt: "Ficha técnica y medidas del Kardex Metálico 3 cajones",
},
"kardex-metalico-4-cajones": {
  src: "/images/tech-sheets/kardex/kardex-metalico-4-cajones.webp",
  alt: "Ficha técnica y medidas del Kardex Metálico 4 cajones",
},
"kardex-metalico-5-cajones": {
  src: "/images/tech-sheets/kardex/kardex-metalico-5-cajones.webp",
  alt: "Ficha técnica y medidas del Kardex Metálico 5 cajones",
},


// BANCAS SIMPLES FICHAS TECNICAS
"banca-simple-con-perchero-120x170x45": {
  src: "/images/tech-sheets/bancas/banca-simple-con-perchero-120x170x45.webp",
  alt: "Ficha técnica y medidas de la Banca simple con perchero 120 × 170 × 45 cm",
},

"banca-simple-con-perchero-150x170x45": {
  src: "/images/tech-sheets/bancas/banca-simple-con-perchero-150x170x45.webp",
  alt: "Ficha técnica y medidas de la Banca simple con perchero 150 × 170 × 45 cm",
},

"banca-simple-con-perchero-200x170x45": {
  src: "/images/tech-sheets/bancas/banca-simple-con-perchero-200x170x45.webp",
  alt: "Ficha técnica y medidas de la Banca simple con perchero 200 × 170 × 45 cm",
},

"banca-madera-simple-120x45x45": {
  src: "/images/tech-sheets/bancas/banca-madera-simple-120x45x45.webp",
  alt: "Ficha técnica y medidas de la Banca de madera simple 120 × 45 × 45 cm",
},

"banca-madera-simple-150x45x45": {
  src: "/images/tech-sheets/bancas/banca-madera-simple-150x45x45.webp",
  alt: "Ficha técnica y medidas de la Banca de madera simple 150 × 45 × 45 cm",
},

"banca-madera-simple-200x45x45": {
  src: "/images/tech-sheets/bancas/banca-madera-simple-200x45x45.webp",
  alt: "Ficha técnica y medidas de la Banca de madera simple 200 × 45 × 45 cm",
},

"banca-metalica-simple-120x45x45": {
  src: "/images/tech-sheets/bancas/banca-metalica-simple-120x45x45.webp",
  alt: "Ficha técnica y medidas de la Banca metálica simple 120 × 45 × 45 cm",
},

"banca-metalica-simple-150x45x45": {
  src: "/images/tech-sheets/bancas/banca-metalica-simple-150x45x45.webp",
  alt: "Ficha técnica y medidas de la Banca metálica simple 150 × 45 × 45 cm",
},

"banca-metalica-simple-200x45x45": {
  src: "/images/tech-sheets/bancas/banca-metalica-simple-200x45x45.webp",
  alt: "Ficha técnica y medidas de la Banca metálica simple 200 × 45 × 45 cm",
},

"banca-doble-madera-con-perchero-120": {
  src: "/images/tech-sheets/bancas/banca-doble-madera-con-perchero-120.webp",
  alt: "Ficha técnica y medidas de la Banca doble de madera con perchero 120 cm",
},

"banca-doble-madera-con-perchero-200": {
  src: "/images/tech-sheets/bancas/banca-doble-madera-con-perchero-200.webp",
  alt: "Ficha técnica y medidas de la Banca doble de madera con perchero 200 cm",
},

"banca-doble-madera-con-colgador-150": {
  src: "/images/tech-sheets/bancas/banca-doble-madera-con-colgador-150.webp",
  alt: "Ficha técnica y medidas de la Banca doble de madera con colgador 150 cm",
},


//ESTANTERIAS FICHAS TECNICAS 
"estanteria-mecano-metalica-30x90x200-5b": {
  src: "/images/tech-sheets/estanterias/estanteria-mecano-metalica-30x90x200-5b.webp",
  alt: "Ficha técnica y medidas de la Estantería Mecano Metálica 30 × 90 × 200 cm (5 bandejas)",
},

"estanteria-mecano-metalica-40x90x200-5b": {
  src: "/images/tech-sheets/estanterias/estanteria-mecano-metalica-40x90x200-5b.webp",
  alt: "Ficha técnica y medidas de la Estantería Mecano Metálica 40 × 90 × 200 cm (5 bandejas)",
},

"estanteria-mecano-metalica-45x90x200-5b": {
  src: "/images/tech-sheets/estanterias/estanteria-mecano-metalica-45x90x200-5b.webp",
  alt: "Ficha técnica y medidas de la Estantería Mecano Metálica 45 × 90 × 200 cm (5 bandejas)",
},

"estanteria-mecano-metalica-50x90x200-5b": {
  src: "/images/tech-sheets/estanterias/estanteria-mecano-metalica-50x90x200-5b.webp",
  alt: "Ficha técnica y medidas de la Estantería Mecano Metálica 50 × 90 × 200 cm (5 bandejas)",
},

"estanteria-mecano-metalica-60x90x200-5b": {
  src: "/images/tech-sheets/estanterias/estanteria-mecano-metalica-60x90x200-5b.webp",
  alt: "Ficha técnica y medidas de la Estantería Mecano Metálica 60 × 90 × 200 cm (5 bandejas)",
},






};
// ✅ fichas “default” por CATEGORÍA (category_slug)
const TECH_SHEETS_BY_CATEGORY: Record<string, { src: string; alt: string }> = {
  
  "lockers-kids": {
    src: "/images/tech-sheets/kids/lockers-kids.webp",
    alt: "Ficha técnica y medidas de Lockers Kids",
  },
};
export function getTechSheetForProduct(args: {
  slug: string;
  categorySlug: string | null;
  productName: string;
}): TechSheetImage | null {
  const bySlug = TECH_SHEETS_BY_SLUG[args.slug];
  if (bySlug) return bySlug;

  if (args.categorySlug) {
    const byCat = TECH_SHEETS_BY_CATEGORY[args.categorySlug];
    if (byCat) {
      return {
        src: byCat.src,
        alt: `${byCat.alt} — ${args.productName}`,
      };
    }
  }

  return null;
}

export function getTechSheetBySlug(slug: string): TechSheetImage | null {
  return TECH_SHEETS_BY_SLUG[slug] ?? null;
}
