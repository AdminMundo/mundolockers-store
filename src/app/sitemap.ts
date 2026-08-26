import type { MetadataRoute } from "next";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getCategoriesWithCounts } from "@/lib/catalog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lockersstore.cl";

// Rutas que jamás deben aparecer en el sitemap aunque algún día se agreguen
// por error a alguna de las listas de abajo (checkout, cuenta, búsqueda, etc.).
const EXCLUDED_PATH_PREFIXES = [
  "/checkout",
  "/carrito",
  "/mi-cuenta",
  "/login",
  "/registro",
  "/admin",
  "/api",
  "/buscar",
  "/gracias",
  "/pago-fallido",
];

function isExcludedUrl(url: string): boolean {
  const path = url.replace(SITE_URL, "");
  return EXCLUDED_PATH_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

// Se regenera cada hora en vez de quedar fijo hasta el próximo deploy: si no,
// un producto renombrado/desactivado desde el admin queda "congelado" en el
// sitemap (con su URL vieja, que ya no resuelve) hasta el siguiente `git push`.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Páginas estáticas
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/tienda`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/cotizar`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/guia-de-lockers`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/arma-tu-locker`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/garantia`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/despacho`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/medios-de-pago`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/nosotros`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contacto`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/politicas/privacidad`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/politicas/terminos`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/politicas/cambios-y-devoluciones`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  // Categorías (activas, con al menos un producto)
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categories = await getCategoriesWithCounts();
    categoryRoutes = categories
      .filter((c) => c.productCount > 0)
      .map((c) => ({
        url: `${SITE_URL}/tienda/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
  } catch {}

  // Productos activos desde Supabase
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = createSupabaseServer();
    const { data } = await supabase
      .from("products")
      .select("slug, updated_at")
      .eq("is_active", true)
      .order("updated_at", { ascending: false });

    productRoutes = (data ?? []).map((p) => ({
      url: `${SITE_URL}/producto/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));
  } catch {}

  const allRoutes = [...staticRoutes, ...categoryRoutes, ...productRoutes];
  return allRoutes.filter((route) => !isExcludedUrl(route.url));
}
