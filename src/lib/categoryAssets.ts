export type CategoryAsset = {
  src: string;
  alt: string;
};

const CATEGORY_ASSETS: Record<string, CategoryAsset> = {
  // usa el slug real de tu category_slug en Supabase
  estanterias: {
    src: "public/images/categoria/Estanterias/Estanteriaespecificacion.svg",
    alt: "Estructura de acero – Estanterías MundoLockers",
  },
  // ejemplo:
  // lockers-metalicos: { src: "...", alt: "..." },
};

export function getCategoryAsset(categorySlug: string | null): CategoryAsset | null {
  if (!categorySlug) return null;
  return CATEGORY_ASSETS[categorySlug] ?? null;
}
