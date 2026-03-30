import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Productos | Admin | Mundo Lockers",
  description: "Gestión de productos del panel admin.",
  robots: {
    index: false,
    follow: false,
  },
};

type CatalogProductRow = {
  product_id: string;
  sku: string | null;
  slug: string;
  name: string;
  category_slug: string | null;
  price_from_clp: number | null;
  has_in_stock: boolean | null;
  image_url: string | null;
  is_featured: boolean | null;
  is_active: boolean | null;
};

type AdminProductosPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    status?: string;
    stock?: string;
  }>;
};

function formatPrice(value: number | null) {
  if (value == null) return "—";

  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

function stockLabel(value: boolean | null) {
  if (value === true) return "Con stock";
  if (value === false) return "Sin stock";
  return "—";
}

function statusLabel(value: boolean | null) {
  if (value === true) return "Activo";
  if (value === false) return "Inactivo";
  return "—";
}

export default async function AdminProductosPage({
  searchParams,
}: AdminProductosPageProps) {
  const params = await searchParams;

  const q = (params.q ?? "").trim();
  const category = (params.category ?? "").trim();
  const status = (params.status ?? "").trim();
  const stock = (params.stock ?? "").trim();

  const supabase = createSupabaseServer();

  let query = supabase
    .from("catalog_products")
    .select(
      "product_id, sku, slug, name, category_slug, price_from_clp, has_in_stock, image_url, is_featured, is_active",
    )
    .order("name", { ascending: true });

  if (q) {
    query = query.ilike("name", `%${q}%`);
  }

  if (category) {
    query = query.eq("category_slug", category);
  }

  if (status === "active") {
    query = query.eq("is_active", true);
  }

  if (status === "inactive") {
    query = query.eq("is_active", false);
  }

  if (stock === "in_stock") {
    query = query.eq("has_in_stock", true);
  }

  if (stock === "out_of_stock") {
    query = query.eq("has_in_stock", false);
  }

  const { data, error } = await query;

  const { data: categoryRows } = await supabase
    .from("catalog_products")
    .select("category_slug")
    .order("category_slug", { ascending: true });

  const categories = Array.from(
    new Set(
      (categoryRows ?? [])
        .map((item) => item.category_slug)
        .filter((value): value is string => Boolean(value)),
    ),
  );

  const products = (data ?? []) as CatalogProductRow[];

  const total = products.length;
  const active = products.filter((item) => item.is_active).length;
  const featured = products.filter((item) => item.is_featured).length;
  const inStock = products.filter((item) => item.has_in_stock).length;

  return (
    <div className="space-y-6">
      <section
        className="overflow-hidden rounded-[36px] border border-black/10 text-white"
        style={{
          background:
            "linear-gradient(135deg, #0B1220 0%, #111827 45%, #1E293B 100%)",
          boxShadow: "0 18px 50px rgba(15,23,42,0.16)",
        }}
      >
        <div className="relative flex min-h-[240px] flex-col justify-between gap-8 p-6 md:min-h-[280px] md:flex-row md:items-end md:p-8">
          <div className="max-w-3xl">
            <p
              className="text-[11px] font-semibold uppercase"
              style={{
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.62)",
              }}
            >
              Panel de administración
            </p>

            <h1
              className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl"
              style={{ color: "#FFFFFF" }}
            >
              Productos
            </h1>

            <p
              className="mt-4 max-w-2xl text-sm leading-6 md:text-base"
              style={{ color: "rgba(255,255,255,0.78)" }}
            >
              Administra catálogo, precio base, estado y stock visible de tu
              tienda.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/tienda"
              className="inline-flex items-center rounded-2xl px-4 py-2.5 text-sm font-medium transition"
              style={{
                backgroundColor: "#FDC90D",
                color: "#111111",
              }}
            >
              Ver tienda
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-black/45">Total productos</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-black">
            {total}
          </p>
        </div>

        <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-black/45">Activos</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-black">
            {active}
          </p>
        </div>

        <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-black/45">Destacados</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-black">
            {featured}
          </p>
        </div>

        <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm text-black/45">Con stock</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-black">
            {inStock}
          </p>
        </div>
      </section>

      <section className="rounded-[32px] border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-black/45">Filtros</p>
          <h2 className="text-2xl font-semibold tracking-tight text-black">
            Buscar y segmentar
          </h2>
        </div>

        <form className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <label htmlFor="q" className="text-sm font-medium text-black/70">
              Buscar
            </label>
            <input
              id="q"
              name="q"
              defaultValue={q}
              placeholder="Nombre del producto"
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="category"
              className="text-sm font-medium text-black/70"
            >
              Categoría
            </label>
            <select
              id="category"
              name="category"
              defaultValue={category}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
            >
              <option value="">Todas</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="status"
              className="text-sm font-medium text-black/70"
            >
              Estado
            </label>
            <select
              id="status"
              name="status"
              defaultValue={status}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
            >
              <option value="">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="stock"
              className="text-sm font-medium text-black/70"
            >
              Stock
            </label>
            <select
              id="stock"
              name="stock"
              defaultValue={stock}
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
            >
              <option value="">Todos</option>
              <option value="in_stock">Con stock</option>
              <option value="out_of_stock">Sin stock</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-3 md:col-span-4">
            <button
              type="submit"
              className="inline-flex items-center rounded-2xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              Aplicar filtros
            </button>

            <Link
              href="/admin/productos"
              className="inline-flex items-center rounded-2xl border border-black/10 px-4 py-2.5 text-sm font-medium text-black/75 transition hover:border-black/20"
            >
              Limpiar
            </Link>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-sm">
        <div className="border-b border-black/10 px-6 py-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-black/45">Listado</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-black">
                Catálogo actual
              </h2>
            </div>
          </div>
        </div>

        {error ? (
          <div className="px-6 py-6">
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Error cargando productos: {error.message}
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="px-6 py-10 text-sm text-black/60">
            No se encontraron productos con los filtros actuales.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-black/10 bg-black/[0.02] text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
                    SKU
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
                    Producto
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
                    Categoría
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
                    Acción
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.product_id}
                    className="border-b border-black/6 transition hover:bg-black/[0.02]"
                  >
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-xl border border-black/10 bg-black/[0.03] px-2.5 py-1 font-mono text-xs text-black/75">
                        {product.sku ?? "—"}
                      </span>
                    </td>

                    <td className="px-6 py-4 align-top">
                      <div className="min-w-[240px]">
                        <p className="font-medium text-black">{product.name}</p>
                        {product.is_featured ? (
                          <span className="mt-2 inline-flex rounded-full bg-[#FDC90D]/20 px-2.5 py-1 text-xs font-medium text-black">
                            Destacado
                          </span>
                        ) : null}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-black/65">
                      {product.category_slug ?? "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-black/80">
                      {formatPrice(product.price_from_clp)}
                    </td>

                    <td className="px-6 py-4 text-sm text-black/65">
                      {stockLabel(product.has_in_stock)}
                    </td>

                    <td className="px-6 py-4 text-sm text-black/65">
                      {statusLabel(product.is_active)}
                    </td>

                    <td className="px-6 py-4 text-sm text-black/50">
                      {product.slug}
                    </td>

                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/productos/${product.slug}`}
                        className="inline-flex items-center rounded-2xl border border-black/10 px-3 py-2 text-sm font-medium text-black transition hover:border-black/20 hover:bg-black/[0.02]"
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
