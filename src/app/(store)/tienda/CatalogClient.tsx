"use client";

import {  useMemo,  useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/lib/cart/use-cart";
import type { AddCartLineInput, CartFlow } from "@/lib/cart/types";
import { Label } from "@radix-ui/react-dropdown-menu";  



const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Lockers Metálicos", value: "lockers-metalicos" },
  { label: "Lockers Kids", value: "lockers-kids" },
  { label: "Lockers Mineros", value: "lockers-mineros" },
  { label: "Roperillos & Storage", value: "storages-roperillos" },
  { label: "Bancas", value: "bancas" },
  { label: "Kardex y cajoneras", value: "kardex-y-cajoneras" },
  { label: "Estantes mecano", value: "estantes-mecano" },
  { label: "Lockers Phone", value: "lockers-phone" },
];

function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

type CatalogItem = {
  sku: string;
  product_id: string;
  slug: string;
  name: string;
  category_slug: string;
  price_from_clp: number;
  has_in_stock: boolean;
  image_url: string | null;
};

type CatalogData = {
  items: CatalogItem[];
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
};

function isPurchasable(item: CatalogItem): boolean {
  return item.has_in_stock && item.price_from_clp > 0;
}

function buildCatalogCartInput(
  item: CatalogItem,
  flow: CartFlow,
): AddCartLineInput {
  const canPurchase = isPurchasable(item);

  return {
    productId: item.product_id,
    slug: item.slug,
    sku: item.sku,
    name: item.name,
    imageUrl: item.image_url,
    unitPrice: canPurchase ? item.price_from_clp : null,
    compareAtPrice: null,
    quantity: 1,
    flow,
    canPurchase,
    canQuote: true,
    leadTimeLabel: item.has_in_stock ? "En stock" : "A pedido",
  };
}

export default function CatalogClient({
  initialParams,
  data,
}: {
  initialParams: { q: string; cat: string; sort: string; page: number };
  data: CatalogData;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { addItem } = useCart();

  const current = useMemo(() => {
    return {
      q: sp.get("q") ?? initialParams.q ?? "",
      cat: sp.get("cat") ?? initialParams.cat ?? "all",
      sort: sp.get("sort") ?? initialParams.sort ?? "featured",
      page: Number(sp.get("page") ?? initialParams.page ?? 1),
    };
  }, [sp, initialParams]);


  function setParams(next: Partial<typeof current>) {
    const params = new URLSearchParams(sp.toString());

    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "" || v === "all") {
        params.delete(k);
      } else {
        params.set(k, String(v));
      }
    });

    if ("cat" in next || "sort" in next || "q" in next) {
      params.set("page", "1");
    }

    startTransition(() => {
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  }

  function handleAddToCart(item: CatalogItem): void {
    if (!isPurchasable(item)) {
      return;
    }

    addItem(buildCatalogCartInput(item, "purchase"));
    router.push("/carrito");
  }

  function handleBuyNow(item: CatalogItem): void {
    if (!isPurchasable(item)) {
      return;
    }

    addItem(buildCatalogCartInput(item, "purchase"));
    router.push("/checkout");
  }

  function handleQuote(item: CatalogItem): void {
    addItem(buildCatalogCartInput(item, "quote"));
    router.push("/cotizar");
  }

  const items = Array.isArray(data?.items) ? data.items : [];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white/80 p-3 backdrop-blur md:p-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setParams({ cat: c.value })}
              className={cn(
                "whitespace-nowrap rounded-full border px-4 py-2 text-xs transition",
                current.cat === c.value
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-[#F5B301] hover:shadow-[0_0_0_3px_rgba(245,179,1,0.18)] hover:text-zinc-900",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-[420px]">
            <input
                key={current.q}
                defaultValue={current.q}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setParams({ q: e.currentTarget.value.trim() });
                  }
                }}
                placeholder="Buscar…"
                className="w-full rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-[#F5B301] focus:shadow-[0_0_0_3px_rgba(245,179,1,0.18)]"
              />

          </div>

          <div className="w-full sm:w-auto">
            <select
              value={current.sort}
              onChange={(e) => setParams({ sort: e.target.value })}
              className="w-full rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm sm:w-[240px]"
            >
              <option value="featured">Destacados</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-zinc-600">
        <span>
          {data.total} productos {isPending ? "• cargando…" : ""}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => {
          const canPurchase = isPurchasable(p);

          return (
            <article
              key={p.product_id}
              className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-300"
            >
              <Link href={`/producto/${p.slug}`} className="group block">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-100">
                  <Image
                    src={p.image_url ?? `/images/products/${p.slug}.webp`}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain transition group-hover:scale-[1.02]"
                  />

                  <Image
                    src={`/images/products/${p.slug}-hover.webp`}
                    alt={`${p.name} (vista alterna)`}
                    aria-hidden="true"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover opacity-0 transition duration-200 ease-out group-hover:opacity-100 group-hover:scale-[1.02]"
                  />
                </div>

                <div className="mt-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="line-clamp-2 text-sm font-medium text-zinc-900">
                      {p.name}
                    </div>
                    <div className="mt-1 text-xs text-zinc-500">
                      {p.category_slug}
                    </div>
                    <div className="mt-1 text-sm text-zinc-700">
                      {canPurchase
                        ? `Precio $${Number(p.price_from_clp).toLocaleString("es-CL")}`
                        : "Consultar precio"}
                    </div>
                  </div>

                  <div className="shrink-0 text-xs text-zinc-500">
                    {p.has_in_stock ? "En stock" : "A pedido"}
                  </div>
                </div>
              </Link>

              <div className="mt-4 grid gap-2">
                {canPurchase ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(p)}
                      className="rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:border-[#F5B301] hover:shadow-[0_0_0_3px_rgba(245,179,1,0.15)]"
                    >
                      Añadir al carrito
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBuyNow(p)}
                      className="rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
                    >
                      Comprar ahora
                    </button>
                  </>
                ) : null}

                <button
                  type="button"
                  onClick={() => handleQuote(p)}
                  className="rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition hover:border-[#F5B301] hover:shadow-[0_0_0_3px_rgba(245,179,1,0.15)]"
                >
                  Cotizar
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2 pt-2">
        <button
          type="button"
          disabled={current.page <= 1}
          onClick={() => setParams({ page: current.page - 1 })}
          className="rounded-full border border-zinc-200 px-4 py-2 text-sm disabled:opacity-50"
        >
          ←
        </button>

        <span className="text-sm text-zinc-600">
          {data.page} / {data.totalPages}
        </span>

        <button
          type="button"
          disabled={current.page >= data.totalPages}
          onClick={() => setParams({ page: current.page + 1 })}
          className="rounded-full border border-zinc-200 px-4 py-2 text-sm disabled:opacity-50"
        >
          →
        </button>
      </div>
    </div>
  );
}
