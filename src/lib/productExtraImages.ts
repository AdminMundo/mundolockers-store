export type ExtraImage = { src: string; alt: string };

const EXTRA_IMAGES_BY_SLUG: Record<string, ExtraImage[]> = {
  "lockers-jr-04-puertas-dobles": [
    { src: "/images/products-extra/lockers-jr-04-puertas-dobles/01.webp", alt: "Detalle cerradura" },
    { src: "/images/products-extra/lockers-jr-04-puertas-dobles/02.webp", alt: "Detalle ventilación" },
    { src: "/images/products-extra/lockers-jr-04-puertas-dobles/03.webp", alt: "Interior bandeja y colgador" },
  ],
};

export function getProductExtraImages(slug: string): ExtraImage[] {
  return EXTRA_IMAGES_BY_SLUG[slug] ?? [];
}
