import type { Metadata } from "next";
import Script from "next/script";
import { notFound, permanentRedirect } from "next/navigation";
import HeroBanner from "@/components/site/hero-banner";
import CatalogClient from "../CatalogClient";
import { getCatalog, getCategoryBySlug, getCategoriesWithCounts } from "@/lib/catalog";
import { truncateAtWord } from "@/lib/utils";

// ISR: la data (Supabase anon, sin cookies) es cacheable; admin/productos
// invalida esta ruta al instante vía revalidatePath en cada cambio, así que
// este revalidate solo actúa como red de seguridad.
export const revalidate = 300;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lockersstore.cl";

type Params = { categoria: string };
type SP = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SP>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const category = await getCategoryBySlug(categoria);

  if (!category) {
    return { title: "Categoría no encontrada", robots: { index: false, follow: false } };
  }

  const sp = await searchParams;
  const isSearch = typeof sp.q === "string" && sp.q.trim().length > 0;

  const canonicalUrl = `/tienda/${category.slug}`;
  const description = category.description
    ? truncateAtWord(category.description, 155)
    : `Compra ${category.name} en LockerStore. Despacho a todo Chile.`;

  return {
    // El layout raíz ya aplica el template "%s | LockerStore" — devolver
    // solo el nombre evita "Bancas | LockerStore | LockerStore".
    title: category.name,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${category.name} | LockerStore`,
      description,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | LockerStore`,
      description,
    },
    robots: { index: !isSearch, follow: true },
  };
}

export default async function TiendaCategoriaPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SP>;
}) {
  const { categoria } = await params;

  if (categoria === "all") {
    permanentRedirect("/tienda");
  }

  const category = await getCategoryBySlug(categoria);
  if (!category) notFound();

  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const sort = (typeof sp.sort === "string" ? sp.sort : "featured") as
    | "featured"
    | "price_asc"
    | "price_desc";
  const page = typeof sp.page === "string" ? Number(sp.page) : 1;

  const [result, categories] = await Promise.all([
    getCatalog({ q, cat: category.slug, sort, page }),
    getCategoriesWithCounts(),
  ]);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Tienda", item: `${SITE_URL}/tienda` },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `${SITE_URL}/tienda/${category.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#EEEDEB] text-zinc-900">
      <Script
        id="jsonld-category-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <HeroBanner
        eyebrow="LockerStore"
        title={category.name}
        description={category.description}
      />

      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-[28px] bg-white px-4 pb-6 pt-6 shadow-sm ring-1 ring-zinc-200 md:px-6 md:pb-8 md:pt-8">
            <CatalogClient
              initialParams={{ q, cat: category.slug, sort, page }}
              data={result}
              categories={categories.filter((c) => c.productCount > 0)}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
