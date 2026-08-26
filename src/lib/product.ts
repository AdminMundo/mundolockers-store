import "server-only";
import { createSupabasePublicServer } from "@/lib/supabase/supabasePublicServer";
import { truncateAtWord } from "@/lib/utils";

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
  tech_sheet_image_url: string | null;

  variants: ProductVariant[];
};

type ProductDetailRow = {
  id: string;
  slug: string;
  name: string;
  sku: string | null;
  description: string | null;
  specs: Json | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  price_clp: number | null;
  category_slug: string | null;
  category_name: string | null;
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

  const { data: p, error } = await supabase
    .from("product_detail")
    .select("id,slug,name,sku,description,specs,is_active,is_featured,price_clp,category_slug,category_name")
    .eq("slug", slug)
    .maybeSingle<ProductDetailRow>();

  if (error) throw new Error(error.message);
  if (!p) return null;

  // Variantes + imagen de la tabla products — en paralelo
  const [variantsRes, productRes] = await Promise.all([
    supabase
      .from("product_variants")
      .select("id,product_id,name,color,door_color,doors,bodies,price_clp,stock_status,image_urls,sort_order,is_active,variant_sku")
      .eq("product_id", p.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .returns<ProductVariantRow[]>(),
    supabase
      .from("products")
      .select("image_url,price_clp,tech_sheet_image_url")
      .eq("id", p.id)
      .maybeSingle<{ image_url: string | null; price_clp: number | null; tech_sheet_image_url: string | null }>(),
  ]);

  if (variantsRes.error) throw new Error(variantsRes.error.message);
  const variants = variantsRes.data;
  const image_url = productRes.data?.image_url ?? null;
  const tech_sheet_image_url = productRes.data?.tech_sheet_image_url ?? null;

  // Precio: preferimos el de la tabla products directamente (evita null en vistas)
  const resolvedPriceClp = productRes.data?.price_clp ?? p.price_clp ?? null;

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

    price_from_clp: safeNumber(resolvedPriceClp),
    image_url: image_url ?? resolveProductImageUrl(p.slug),
    tech_sheet_image_url,

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

/**
 * Extrae el atributo que distingue a esta variante dentro de su familia de
 * producto (mismo nombre base, distinto tamaño o capacidad) — ej. "9 puertas,
 * 3 cuerpos triples" o "150x45x45 cm". Se lee del nombre/slug (nunca se
 * inventa): capacidad primero (puertas/compartimientos/cajones/bandejas +
 * cuerpos), medida en cm como respaldo. Devuelve null si el producto no
 * tiene ninguno de estos patrones (típicamente porque es un producto único,
 * sin variantes de tamaño/capacidad con las que pueda confundirse).
 */
function extractProductDifferentiator(name: string, slug: string): string | null {
  const capacidad = name.match(/(\d+)\s*(puertas?|compartimientos?|cajones?|bandejas?)/i);
  if (capacidad) {
    const cantidad = parseInt(capacidad[1], 10);
    let text = `${cantidad} ${capacidad[2].toLowerCase()}`;

    const cuerpos = name.match(/(\d+)\s*cuerpos?\s*([a-záéíóúñ]+)?/i);
    if (cuerpos) {
      const cuerposCantidad = parseInt(cuerpos[1], 10);
      text += `, ${cuerposCantidad} cuerpos${cuerpos[2] ? ` ${cuerpos[2].toLowerCase()}` : ""}`;
    }
    return text;
  }

  const medida = slug.match(/(\d+)x(\d+)x(\d+)/i);
  if (medida) return `${medida[1]}x${medida[2]}x${medida[3]} cm`;

  // Algunos productos solo difieren en un largo (cm) al final del nombre,
  // ej. "Bancas Dobles Madera con Perchero - 120" vs "... - 200".
  const largo = name.match(/-\s*(\d{2,4})\s*$/);
  if (largo) return `${largo[1]} cm`;

  return null;
}

/**
 * Meta description de la ficha de producto. Antepone el atributo que
 * diferencia a esta variante (medida/capacidad) para que no se trunque antes
 * de llegar a él — esa era la causa de que varios tamaños/capacidades de un
 * mismo producto generaran la misma metadescription.
 */
export function buildProductMetaDescription(product: {
  name: string;
  slug: string;
  description: string | null;
}): string {
  const base = product.description?.trim()
    ? product.description.trim()
    : `Compra y cotiza ${product.name} en LockerStore. Despacho a todo Chile.`;

  const differentiator = extractProductDifferentiator(product.name, product.slug);
  const combined = differentiator
    ? `${differentiator.charAt(0).toUpperCase()}${differentiator.slice(1)}. ${base}`
    : base;

  return truncateAtWord(combined, 155);
}

function safeNumber(n: number | null | undefined): number {
  if (typeof n !== "number" || !Number.isFinite(n)) return 0;
  return n;
}

/** Fallback cuando el producto no tiene image_url en la BD. */
function resolveProductImageUrl(slug: string): string {
  return `/images/products/${slug}.webp`;
}
