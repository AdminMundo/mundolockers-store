import Image from "next/image";
import CatalogClient from "./CatalogClient";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;

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

  const result = await getCatalog({ q, cat, sort, page });

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* HERO full */}
      <section className="relative h-[420px] w-full overflow-hidden bg-zinc-300 md:h-[520px]">
        <Image
          src="/images/Tienda/shopencabezado.svg"
          alt="Tienda Mundo Lockers"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute bottom-10 left-0 right-0">
          <div className="mx-auto max-w-6xl px-4">
            <p className="text-xs uppercase tracking-widest text-white/80">
              MundoLockersStore
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Tienda
            </h1>
            <p className="mt-3 max-w-xl text-sm text-white/80">
              Explora nuestros lockers y soluciones de almacenamiento. Filtra por categoría y cotiza rápido.
            </p>
          </div>
        </div>
      </section>

      {/* PANEL BLANCO montado encima */}
      <section className="-mt-12 md:-mt-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-[28px] bg-white px-4 pb-6 pt-6 shadow-sm ring-1 ring-zinc-200 md:px-6 md:pb-8 md:pt-8">
            <CatalogClient initialParams={{ q, cat, sort, page }} data={result} />
          </div>
        </div>
      </section>
    </main>
  );
}
