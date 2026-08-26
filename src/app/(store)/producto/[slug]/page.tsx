import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/product";
import { getCategoryBySlug } from "@/lib/catalog";
import { createSupabasePublicServer } from "@/lib/supabase/supabasePublicServer";
import ProductGallery from "./_components/ProductGallery";
import ProductPanel from "./_components/ProductPanel";
import TechSheetSection from "./_components/TechSheetSection";
import CategoryInfoSection from "./_components/CategoryInfoSection";
import RelatedProducts from "./_components/RelatedProducts";
import { getRelatedProducts } from "@/lib/catalog";

// ISR: la data (Supabase anon, sin cookies) es cacheable; admin/productos
// invalida esta ruta al instante vía revalidatePath en cada cambio, así que
// este revalidate solo actúa como red de seguridad.
export const revalidate = 300;

// Sin generateStaticParams, Next trata una ruta con segmento dinámico como
// 100% dinámica (ignora revalidate). Prerenderizamos todos los slugs para
// que sí quede como ISR real.
export async function generateStaticParams() {
  const supabase = createSupabasePublicServer();
  const { data } = await supabase
    .from("products")
    .select("slug")
    .eq("is_active", true);

  return (data ?? []).map((p) => ({ slug: p.slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

type DetailDot = { src: string; alt: string };

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  const detailDots = getDetailDots(product.category_slug, product.name);
  const category = product.category_slug
    ? await getCategoryBySlug(product.category_slug)
    : null;
  const relatedProducts = product.category_slug
    ? await getRelatedProducts(product.category_slug, product.id, 4)
    : [];

  return (
    <main className="bg-[#EEEDEB]">
      <div className="mx-auto max-w-6xl px-4 pt-8 pb-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-start">
          {/* Gallery: top-left on desktop, first on mobile */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-100 lg:col-start-1 lg:row-start-1">
            <ProductGallery
              productName={product.name}
              coverImage={product.image_url}
              variantImages={product.variants.map((v) => ({
                variantId: v.id,
                urls: v.image_urls ?? [],
              }))}
              detailDots={detailDots}
            />
          </div>

          {/* Purchase panel: right column on desktop, right after the gallery on mobile
              (price/CTA must be reachable before the tech sheet, not after it) */}
          <div className="rounded-3xl bg-white p-7 shadow-sm border border-zinc-100 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-36">
            <ProductPanel product={product} />
          </div>

          {/* Tech sheet + info de categoría: bottom-left on desktop, last on mobile */}
          <div className="space-y-8 lg:col-start-1 lg:row-start-2">
            <TechSheetSection
              slug={product.slug}
              categorySlug={product.category_slug}
              productName={product.name}
              techSheetImageUrl={product.tech_sheet_image_url}
            />
            {category?.description ? (
              <CategoryInfoSection
                categoryName={category.name}
                categorySlug={category.slug}
                description={category.description}
              />
            ) : null}
          </div>
        </div>

        {category && relatedProducts.length > 0 ? (
          <div className="mt-8">
            <RelatedProducts products={relatedProducts} categoryName={category.name} />
          </div>
        ) : null}
      </div>
    </main>
  );
}

function getDetailDots(_categorySlug: string | null, _productName: string): DetailDot[] {
  return [];
}
