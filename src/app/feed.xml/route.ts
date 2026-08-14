import "server-only";
import { createSupabasePublicServer } from "@/lib/supabase/supabasePublicServer";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lockersstore.cl";

type CatalogRow = {
  product_id: string;
  slug: string;
  sku: string | null;
  name: string;
  price_from_clp: number | null;
  has_in_stock: boolean | null;
  image_url: string | null;
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function resolveImageUrl(imageUrl: string | null, slug: string): string {
  const url = imageUrl || `/images/products/${slug}.webp`;
  return url.startsWith("http") ? url : `${SITE_URL}${url}`;
}

export async function GET() {
  const supabase = createSupabasePublicServer();

  const [{ data: catalogRows, error: catalogError }, { data: descriptionRows, error: descError }] =
    await Promise.all([
      supabase
        .from("catalog_products")
        .select("product_id,slug,sku,name,price_from_clp,has_in_stock,image_url")
        .eq("is_active", true)
        .returns<CatalogRow[]>(),
      supabase.from("products").select("id,description"),
    ]);

  if (catalogError) throw new Error(catalogError.message);
  if (descError) throw new Error(descError.message);

  const descriptionById = new Map(
    (descriptionRows ?? []).map((p) => [p.id as string, p.description as string | null]),
  );

  const items = (catalogRows ?? [])
    .filter((p) => (p.price_from_clp ?? 0) > 0)
    .map((p) => {
      const rawDescription = descriptionById.get(p.product_id)?.trim();
      const description = rawDescription
        ? rawDescription.replace(/\s+/g, " ")
        : `Compra ${p.name} en LockerStore. Despacho a todo Chile.`;

      return `    <item>
      <g:id>${escapeXml(p.product_id)}</g:id>
      <title>${escapeXml(p.name)}</title>
      <description>${escapeXml(description)}</description>
      <link>${SITE_URL}/producto/${escapeXml(p.slug)}</link>
      <g:image_link>${escapeXml(resolveImageUrl(p.image_url, p.slug))}</g:image_link>
      <g:availability>${p.has_in_stock ? "in stock" : "out of stock"}</g:availability>
      <g:price>${p.price_from_clp} CLP</g:price>
      <g:brand>LockerStore</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>false</g:identifier_exists>
${p.sku ? `      <g:mpn>${escapeXml(p.sku)}</g:mpn>\n` : ""}    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>LockerStore</title>
    <link>${SITE_URL}</link>
    <description>Catálogo de productos de LockerStore.</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
