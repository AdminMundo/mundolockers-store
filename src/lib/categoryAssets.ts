export type CategoryAsset = {
  src: string;
  alt: string;
};

const CATEGORY_ASSETS: Record<string, CategoryAsset> = {
  // usa el slug real de tu category_slug en Supabase
  estanterias: {
    src: "/images/categoria/Estanterias/Estanteriaespecificacion.svg",
    alt: "Estructura de acero – Estanterías LockerStore",
  },
 
};

export function getCategoryAsset(categorySlug: string | null): CategoryAsset | null {
  if (!categorySlug) return null;
  return CATEGORY_ASSETS[categorySlug] ?? null;
}
