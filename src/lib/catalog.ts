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
