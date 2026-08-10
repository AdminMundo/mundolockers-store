import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { createProductAction } from "@/app/admin/productos/[slug]/actions";
import ProductImageUpload from "@/components/admin/product-image-upload";

export const metadata: Metadata = {
  title: "Nuevo producto | Admin",
  description: "Crear producto en el panel admin.",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminNuevoProductoPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string | null;
};

export default async function AdminNuevoProductoPage({
  searchParams,
}: AdminNuevoProductoPageProps) {
  const query = await searchParams;
  const supabase = createSupabaseServer();

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });

  const categories = (categoriesData ?? []) as CategoryRow[];

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
        <div className="relative flex min-h-[220px] flex-col justify-between gap-8 p-6 md:min-h-[260px] md:flex-row md:items-end md:p-8">
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
              Nuevo producto
            </h1>

            <p
              className="mt-4 max-w-2xl text-sm leading-6 md:text-base"
              style={{ color: "rgba(255,255,255,0.78)" }}
            >
              Crea productos nuevos y guárdalos directamente en Supabase.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/productos"
              className="inline-flex items-center rounded-2xl px-4 py-2.5 text-sm font-medium transition"
              style={{
                backgroundColor: "#0477BF",
                color: "#ffffff",
              }}
            >
              Volver a productos
            </Link>
          </div>
        </div>
      </section>

      {query.error === "missing_fields" ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Debes completar nombre y slug.
        </div>
      ) : null}

      {query.error === "invalid_price" ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          El precio ingresado no es válido.
        </div>
      ) : null}

      {query.error === "slug_exists" ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Ya existe un producto con ese slug.
        </div>
      ) : null}

      {query.error === "sku_exists" ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Ya existe un producto con ese SKU.
        </div>
      ) : null}

      {query.error === "invalid_specs" ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Las especificaciones no son JSON válido. Revisa la sintaxis.
        </div>
      ) : null}

      {query.error === "create_failed" ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          No se pudo crear el producto. Revisa la tabla{" "}
          <strong>products</strong>, permisos o políticas.
        </div>
      ) : null}

      <section className="rounded-[32px] border border-black/10 bg-white p-6 shadow-sm">
        <div className="border-b border-black/10 pb-5">
          <p className="text-sm text-black/45">Formulario</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-black">
            Datos base
          </h2>
        </div>

        <form action={createProductAction} className="mt-6 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-black/70"
              >
                Nombre
              </label>
              <input
                id="name"
                name="name"
                required
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="sku"
                className="text-sm font-medium text-black/70"
              >
                SKU
              </label>
              <input
                id="sku"
                name="sku"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 font-mono text-sm outline-none transition focus:border-black/20"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="slug"
                className="text-sm font-medium text-black/70"
              >
                Slug
              </label>
              <input
                id="slug"
                name="slug"
                required
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-black/70"
              >
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="specs"
                className="text-sm font-medium text-black/70"
              >
                Especificaciones
              </label>
              <textarea
                id="specs"
                name="specs"
                rows={10}
                placeholder={'{\n  "Medidas": { "Alto": "180 cm", "Ancho": "90 cm" },\n  "Notas": ["Detalle 1", "Detalle 2"]\n}'}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 font-mono text-sm outline-none transition focus:border-black/20"
              />
              <p className="text-xs text-black/45">Formato JSON. Las secciones se muestran en la página del producto.</p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="price_clp"
                className="text-sm font-medium text-black/70"
              >
                Precio base
              </label>
              <input
                id="price_clp"
                name="price_clp"
                type="number"
                min="0"
                step="1"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="category_id"
                className="text-sm font-medium text-black/70"
              >
                Categoría
              </label>
              <select
                id="category_id"
                name="category_id"
                defaultValue=""
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
              >
                <option value="">Sin categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <ProductImageUpload name="image_url" label="Imagen principal" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <ProductImageUpload name="hover_image_url" label="Imagen hover" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="gallery_urls"
                className="text-sm font-medium text-black/70"
              >
                Imágenes extra
              </label>
              <textarea
                id="gallery_urls"
                name="gallery_urls"
                rows={6}
                placeholder={`https://...\nhttps://...\nhttps://...`}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
              />
              <p className="text-xs text-black/45">Agrega una URL por línea.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[#F8F8FA] px-4 py-3">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked
                className="h-4 w-4"
              />
              <span className="text-sm font-medium text-black/75">
                Producto activo
              </span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[#F8F8FA] px-4 py-3">
              <input
                type="checkbox"
                name="has_in_stock"
                defaultChecked={false}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium text-black/75">
                Con stock
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[#F8F8FA] px-4 py-3">
              <input type="checkbox" name="is_featured" className="h-4 w-4" />
              <span className="text-sm font-medium text-black/75">
                Producto destacado
              </span>
            </label>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center rounded-2xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              Crear producto
            </button>

            <Link
              href="/admin/productos"
              className="inline-flex items-center rounded-2xl border border-black/10 px-4 py-2.5 text-sm font-medium text-black/75 transition hover:border-black/20"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
