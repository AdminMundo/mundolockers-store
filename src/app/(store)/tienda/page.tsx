import type { Metadata } from "next";
import HeroBanner from "@/components/site/hero-banner";
import CatalogClient from "./CatalogClient";
import { getCatalog, getCategoriesWithCounts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;

const DESCRIPTION =
  "Catálogo completo de lockers metálicos, plásticos, casilleros escolares, estantes mecano y kardex. Precios directos, despacho a todo Chile.";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SP>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const isSearch = typeof sp.q === "string" && sp.q.trim().length > 0;

  return {
    title: "Tienda",
    description: DESCRIPTION,
    alternates: { canonical: "/tienda" },
    openGraph: {
      title: "Tienda | LockerStore",
      description: DESCRIPTION,
      url: "/tienda",
      type: "website",
    },
    robots: { index: !isSearch, follow: true },
  };
}

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;

  const q = typeof sp.q === "string" ? sp.q : "";
  const cat = typeof sp.cat === "string" ? sp.cat : "all";
  const sort = (typeof sp.sort === "string" ? sp.sort : "featured") as
    | "featured"
    | "price_asc"
    | "price_desc";
  const page = typeof sp.page === "string" ? Number(sp.page) : 1;

  const [result, categories] = await Promise.all([
    getCatalog({ q, cat, sort, page }),
    getCategoriesWithCounts(),
  ]);

  return (
    <main className="min-h-screen bg-[#EEEDEB] text-zinc-900">
      <HeroBanner
        eyebrow="LockerStore"
        title="Tienda"
        description="Explora nuestros lockers y soluciones de almacenamiento. Filtra por categoría y cotiza rápido."
      />

      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-[28px] bg-white px-4 pb-6 pt-6 shadow-sm ring-1 ring-zinc-200 md:px-6 md:pb-8 md:pt-8">
            <CatalogClient
              initialParams={{ q, cat, sort, page }}
              data={result}
              categories={categories.filter((c) => c.productCount > 0)}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
