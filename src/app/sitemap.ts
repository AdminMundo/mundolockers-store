import type { MetadataRoute } from "next";
import { createSupabaseServer } from "@/lib/supabase/server";
import { getCategoriesWithCounts } from "@/lib/catalog";
import { BLOG_CATEGORIES, getAllPosts, getPostsByCategory, type BlogCategorySlug } from "@/lib/blog";

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

// Fecha real del último cambio de cada página estática (último commit que
// tocó su archivo o sus componentes). Actualizar al cambiar la página.
const STATIC_LASTMOD: Record<string, { path: string; lastModified: string; changeFrequency: "daily" | "weekly" | "monthly" | "yearly"; priority: number }> = {
  home: { path: "", lastModified: "2026-09-17", changeFrequency: "weekly", priority: 1.0 },
  tienda: { path: "/tienda", lastModified: "2026-08-07", changeFrequency: "daily", priority: 0.9 },
  cotizar: { path: "/cotizar", lastModified: "2026-09-15", changeFrequency: "monthly", priority: 0.7 },
  guia: { path: "/guia-de-lockers", lastModified: "2026-08-25", changeFrequency: "monthly", priority: 0.7 },
  arma: { path: "/arma-tu-locker", lastModified: "2026-08-26", changeFrequency: "monthly", priority: 0.7 },
  garantia: { path: "/garantia", lastModified: "2026-08-31", changeFrequency: "monthly", priority: 0.5 },
  despacho: { path: "/despacho", lastModified: "2026-08-25", changeFrequency: "monthly", priority: 0.5 },
  mediosPago: { path: "/medios-de-pago", lastModified: "2026-08-31", changeFrequency: "monthly", priority: 0.5 },
  nosotros: { path: "/nosotros", lastModified: "2026-08-06", changeFrequency: "monthly", priority: 0.6 },
  contacto: { path: "/contacto", lastModified: "2026-09-15", changeFrequency: "monthly", priority: 0.6 },
  privacidad: { path: "/politicas/privacidad", lastModified: "2026-08-31", changeFrequency: "yearly", priority: 0.3 },
  terminos: { path: "/politicas/terminos", lastModified: "2026-08-31", changeFrequency: "yearly", priority: 0.3 },
  devoluciones: { path: "/politicas/cambios-y-devoluciones", lastModified: "2026-08-31", changeFrequency: "yearly", priority: 0.4 },
};

// Se regenera cada hora en vez de quedar fijo hasta el próximo deploy: si no,
// un producto renombrado/desactivado desde el admin queda "congelado" en el
// sitemap (con su URL vieja, que ya no resuelve) hasta el siguiente `git push`.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = Object.values(STATIC_LASTMOD).map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified: new Date(page.lastModified),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const posts = getAllPosts();
  const blogIndexRoute: MetadataRoute.Sitemap = posts[0]
    ? [{ url: `${SITE_URL}/blog`, lastModified: new Date(posts[0].updated), changeFrequency: "weekly", priority: 0.8 }]
    : [];
  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogCategoryRoutes: MetadataRoute.Sitemap = (Object.keys(BLOG_CATEGORIES) as BlogCategorySlug[])
    .filter((slug) => getPostsByCategory(slug).length > 0)
    .map((slug) => {
      const latest = getPostsByCategory(slug)[0];
      return {
        url: `${SITE_URL}/blog/categoria/${slug}`,
        lastModified: new Date(latest.updated),
        changeFrequency: "weekly" as const,
        priority: 0.5,
      };
    });

  // Categorías (activas, con al menos un producto). Fecha real: updated_at de la base.
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categories = await getCategoriesWithCounts();
    const supabase = createSupabaseServer();
    const { data: dates } = await supabase.from("categories").select("slug, updated_at");
    const updatedBySlug = new Map((dates ?? []).map((d) => [d.slug, d.updated_at]));

    categoryRoutes = categories
      .filter((c) => c.productCount > 0)
      .map((c) => ({
        url: `${SITE_URL}/tienda/${c.slug}`,
        lastModified: updatedBySlug.get(c.slug) ? new Date(updatedBySlug.get(c.slug)!) : new Date(STATIC_LASTMOD.tienda.lastModified),
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

  const allRoutes = [
    ...staticRoutes,
    ...blogIndexRoute,
    ...blogRoutes,
    ...blogCategoryRoutes,
    ...categoryRoutes,
    ...productRoutes,
  ];
  return allRoutes.filter((route) => !isExcludedUrl(route.url));
}
