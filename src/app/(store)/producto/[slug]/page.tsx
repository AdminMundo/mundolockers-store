import { notFound } from "next/navigation";
import Image from "next/image";
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
      {/* Banner tienda */}
      <div className="relative h-48 w-full overflow-hidden md:h-56">
        <Image
          src="/images/home/Encabezadoprincipal.webp"
          alt="LockerStore"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,10,20,0.75)_0%,rgba(7,15,30,0.55)_50%,rgba(10,20,35,0.30)_100%)]" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
            {product.category_name ?? "Producto"}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
            {product.name}
          </h1>
          <nav className="mt-3 flex items-center gap-1.5 text-xs text-white/60">
            <span>Tienda</span>
            <span>/</span>
            <span>{product.category_name ?? "Productos"}</span>
            <span>/</span>
            <span className="text-white/90">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-8 pb-10">
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
            <TechSheetSection slug={product.slug} categorySlug={product.category_slug} productName={product.name} />
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
