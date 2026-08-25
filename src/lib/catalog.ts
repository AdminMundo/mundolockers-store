import "server-only";
import { createSupabasePublicServer } from "@/lib/supabase/supabasePublicServer";

export type CatalogQuery = {
  q?: string;
  cat?: string;
  page?: number;
  sort?: "price_asc" | "price_desc" | "featured";
};

const PAGE_SIZE = 12;

export async function getCatalog(params: CatalogQuery) {
  const supabase = createSupabasePublicServer();

  const q = params.q?.trim() || "";
  const cat = params.cat && params.cat !== "all" ? params.cat.trim() : null;

  const page = Math.max(1, Number(params.page ?? 1));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("catalog_products")
    .select(
      "product_id,slug,sku,name,category_slug,price_from_clp,has_in_stock,image_url,hover_image_url,is_featured",
      { count: "exact" },
    )
    .eq("is_active", true);

  if (cat) {
    query = query.eq("category_slug", cat);
  }

  if (q) {
    query = query.ilike("name", `%${q}%`);
  }

  const sort = params.sort ?? "featured";

  if (sort === "price_asc") {
    query = query.order("price_from_clp", { ascending: true });
  }

  if (sort === "price_desc") {
    query = query.order("price_from_clp", { ascending: false });
  }

  if (sort === "featured") {
    query = query
      .order("is_featured", { ascending: false })
      .order("price_from_clp", { ascending: true });
  }

  const { data, count, error } = await query.range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return {
    items: data ?? [],
    total,
    page,
    totalPages,
    pageSize: PAGE_SIZE,
  };
}

export type CategoryNav = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  productCount: number;
};

export async function getCategoriesWithCounts(): Promise<CategoryNav[]> {
  const supabase = createSupabasePublicServer();

  const [{ data: categories, error: catError }, { data: products, error: prodError }] =
    await Promise.all([
      supabase.from("categories").select("id,name,slug,description").order("name", { ascending: true }),
      supabase.from("catalog_products").select("category_slug").eq("is_active", true),
    ]);

  if (catError) throw new Error(catError.message);
  if (prodError) throw new Error(prodError.message);

  const counts = new Map<string, number>();
  for (const p of products ?? []) {
    if (!p.category_slug) continue;
    counts.set(p.category_slug, (counts.get(p.category_slug) ?? 0) + 1);
  }

  return (categories ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description ?? null,
    productCount: counts.get(c.slug) ?? 0,
  }));
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Omit<CategoryNav, "productCount"> | null> {
  const supabase = createSupabasePublicServer();

  const { data, error } = await supabase
    .from("categories")
    .select("id,name,slug,description")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ?? null;
}

export type FeaturedProduct = {
  productId: string;
  slug: string;
  sku: string;
  name: string;
  imageUrl: string | null;
  priceFromClp: number | null;
};

export async function getFeaturedProducts(limit = 8): Promise<FeaturedProduct[]> {
  const supabase = createSupabasePublicServer();

  const { data, error } = await supabase
    .from("catalog_products")
    .select("product_id,slug,sku,name,image_url,price_from_clp")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("price_from_clp", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((p) => ({
    productId: p.product_id,
    slug: p.slug,
    sku: p.sku,
    name: p.name,
    imageUrl: p.image_url,
    priceFromClp: p.price_from_clp,
  }));
}

export type RelatedProduct = {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  priceFromClp: number | null;
};

/**
 * Productos de la misma categoría, elegidos al azar (no siempre los mismos 4)
 * para que con las regeneraciones de ISR los productos que no entran en la
 * página 1 del listado también terminen recibiendo enlaces internos desde
 * las fichas de sus vecinos de categoría.
 */
export async function getRelatedProducts(
  categorySlug: string,
  excludeProductId: string,
  limit = 4,
): Promise<RelatedProduct[]> {
  const supabase = createSupabasePublicServer();

  const { data, error } = await supabase
    .from("catalog_products")
    .select("product_id,slug,name,image_url,price_from_clp")
    .eq("is_active", true)
    .eq("category_slug", categorySlug)
    .neq("product_id", excludeProductId);

  if (error) throw new Error(error.message);

  const all = data ?? [];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }

  return all.slice(0, limit).map((p) => ({
    productId: p.product_id,
    slug: p.slug,
    name: p.name,
    imageUrl: p.image_url,
    priceFromClp: p.price_from_clp,
  }));
}
