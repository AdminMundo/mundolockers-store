import "server-only";
import { createSupabasePublicServer } from "@/lib/supabase/supabasePublicServer";

/** JSON seguro para specs */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type ProductVariant = {
  id: string;
  product_id: string;
  name: string | null;
  color: string | null;
  door_color: string | null;
  doors: number | null;
  bodies: number | null;
  price_clp: number | null;
  stock_status: string | null;
  image_urls: string[] | null;
  sort_order: number | null;
  is_active: boolean;
  variant_sku: string | null;
};

export type ProductDetail = {
  id: string;
  slug: string;
  name: string;
  sku: string | null;
  description: string | null;
  specs: Json | null;

  is_active: boolean;
  is_featured: boolean;

  category_slug: string | null;
  category_name: string | null;

  price_from_clp: number;
  image_url: string | null;

  variants: ProductVariant[];
};

/** Tipado real de la vista product_detail */
type ProductDetailRow = {
  id: string;
  slug: string;
  name: string;
  sku: string | null;
  description: string | null;
  specs: Json | null;
  is_active: boolean | null;
  is_featured: boolean | null;

  // ✅ vienen DIRECTO desde la view
  category_slug: string | null;
  category_name: string | null;
};

type ProductImportRow = {
  price_clp: number | null;
};

type ProductVariantRow = {
  id: string;
  product_id: string;
  name: string | null;
  color: string | null;
  door_color: string | null;
  doors: number | null;
  bodies: number | null;
  price_clp: number | null;
  stock_status: string | null;
  image_urls: string[] | null;
  sort_order: number | null;
  is_active: boolean | null;
  variant_sku: string | null;
};

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const supabase = createSupabasePublicServer();

  // 1) producto base desde view (SIN categories(...))
  const { data: p, error } = await supabase
    .from("product_detail")
    .select("id,slug,name,sku,description,specs,is_active,is_featured,category_slug,category_name")
    .eq("slug", slug)
    .maybeSingle<ProductDetailRow>();

  if (error) throw new Error(error.message);
  if (!p) return null;

  // 2) import por slug
  const { data: imp, error: iErr } = await supabase
    .from("products_import")
    .select("price_clp")
    .eq("slug", slug)
    .maybeSingle<ProductImportRow>();

  if (iErr) throw new Error(iErr.message);

  // 3) variantes por product_id
  const { data: variants, error: vErr } = await supabase
    .from("product_variants")
    .select("id,product_id,name,color,door_color,doors,bodies,price_clp,stock_status,image_urls,sort_order,is_active,variant_sku")
    .eq("product_id", p.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .returns<ProductVariantRow[]>();

  if (vErr) throw new Error(vErr.message);

  // 4) imagen principal desde /public
  const image_url = resolveProductImageUrl(p.slug);

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    sku: p.sku ?? null,
    description: p.description ?? null,
    specs: p.specs ?? null,

    is_active: Boolean(p.is_active),
    is_featured: Boolean(p.is_featured),

    category_slug: p.category_slug ?? null,
    category_name: p.category_name ?? null,

    price_from_clp: safeNumber(imp?.price_clp),
    image_url,

    variants: (variants ?? []).map((x) => ({
      id: x.id,
      product_id: x.product_id,
      name: x.name ?? null,
      color: x.color ?? null,
      door_color: x.door_color ?? null,
      doors: x.doors ?? null,
      bodies: x.bodies ?? null,
      price_clp: x.price_clp ?? null,
      stock_status: x.stock_status ?? null,
      image_urls: x.image_urls ?? null,
      sort_order: x.sort_order ?? null,
      is_active: Boolean(x.is_active),
      variant_sku: x.variant_sku ?? null,
    })),
  };
}

function safeNumber(n: number | null | undefined): number {
  if (typeof n !== "number" || !Number.isFinite(n)) return 0;
  return n;
}

function resolveProductImageUrl(slug: string): string {
  return `/images/products/${slug}.webp`;
}
