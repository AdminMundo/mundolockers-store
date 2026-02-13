import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/product";
import ProductGallery from "./_components/ProductGallery";
import ProductPanel from "./_components/ProductPanel";
import TechSheetSection from "./_components/TechSheetSection";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type DetailDot = { src: string; alt: string };

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  const detailDots = getDetailDots(product.category_slug, product.name);

  return (
    <main className="bg-[#F6F6F7]">
      <div className="mx-auto max-w-6xl px-4 pt-28 pb-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-start">
          {/* LEFT column */}
          <div className="space-y-8">
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-100">
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

            {/* ✅ Esto llena el espacio blanco (cuando el panel derecho es más alto) */}
            <TechSheetSection slug={product.slug} />
          </div>

          {/* RIGHT column */}
          <div className="rounded-3xl bg-white p-7 shadow-sm border border-zinc-100 lg:sticky lg:top-36">
            <ProductPanel product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}

function getDetailDots(categorySlug: string | null, productName: string): DetailDot[] {
  if (categorySlug === "lockers-metalicos") {
    return [
      { src: "/images/details/lockers-metalicos/1.svg", alt: `${productName} - detalle 1` },
      { src: "/images/details/lockers-metalicos/2.svg", alt: `${productName} - detalle 2` },
      { src: "/images/details/lockers-metalicos/3.svg", alt: `${productName} - detalle 3` },
    ];
  }
  return [];
}
