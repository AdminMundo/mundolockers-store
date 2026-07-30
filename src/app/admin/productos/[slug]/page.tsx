import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { updateProductAction } from "@/app/admin/productos/[slug]/actions";
import ProductImageUpload from "@/components/admin/product-image-upload";

export const metadata: Metadata = {
  title: "Editar producto | Admin |  LockerStore ",
  description: "Edición base de producto en el panel admin.",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminProductoDetallePageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    saved?: string;
    created?: string;
    error?: string;
  }>;
};



type CategoryRow = {
  id: string;
  name: string;
  slug: string | null;
};

function formatPrice(value: number | null) {
  if (value == null) return "—";

  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function AdminProductoDetallePage({
  params,
  searchParams,
}: AdminProductoDetallePageProps) {
  const { slug } = await params;
  const query = await searchParams;

  const supabase = createSupabaseServer();

  const SELECT = "id, sku, slug, name, description, specs, category_id, price_clp, has_in_stock, is_active, is_featured, image_url, hover_image_url, gallery_urls";

  // Buscar por SKU primero (más estable), luego por slug como fallback
  let { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .eq("sku", slug)
    .maybeSingle();

  if (!data && !error) {
    ({ data, error } = await supabase
      .from("products")
      .select(SELECT)
      .eq("slug", slug)
      .maybeSingle());
  }

  if (error || !data) {
    notFound();
  }

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });

  const categories = (categoriesData ?? []) as CategoryRow[];

  const galleryUrls = Array.isArray(data.gallery_urls) ? data.gallery_urls : [];

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
              Editar producto
            </h1>

            <p
              className="mt-4 max-w-2xl text-sm leading-6 md:text-base"
              style={{ color: "rgba(255,255,255,0.78)" }}
            >
              Edita la información base del producto seleccionado sin entrar a
              Supabase.
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
      {query.saved === "1" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Producto actualizado correctamente.
        </div>
      ) : null}

      {query.created === "1" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Producto creado correctamente.
        </div>
      ) : null}

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

      {query.error === "save_failed" ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          No se pudo guardar el producto. Revisa columnas, permisos o tipos en
          la tabla <strong>products</strong>.
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[32px] border border-black/10 bg-white p-6 shadow-sm">
          <div className="border-b border-black/10 pb-5">
            <p className="text-sm text-black/45">Formulario</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-black">
              Datos base
            </h2>
          </div>

          <form action={updateProductAction} className="mt-6 space-y-5">
            <input type="hidden" name="product_id" value={data.id} />
            <input type="hidden" name="original_slug" value={data.slug} />
            <input type="hidden" name="original_sku" value={data.sku ?? ""} />

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
                  defaultValue={data.name}
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
                  defaultValue={data.sku ?? ""}
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
                  defaultValue={data.slug}
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
                  defaultValue={data.description ?? ""}
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
                  defaultValue={data.specs != null ? JSON.stringify(data.specs, null, 2) : ""}
                  placeholder={'{\n  "Medidas": { "Alto": "180 cm", "Ancho": "90 cm" },\n  "Notas": ["Detalle 1", "Detalle 2"]\n}'}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 font-mono text-sm outline-none transition focus:border-black/20"
                />
                <p className="text-xs text-black/45">
                  Formato JSON. Las secciones (Medidas, Notas, etc.) se muestran en la página del producto.
                </p>
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
                  defaultValue={data.price_clp ?? ""}
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
                  defaultValue={data.category_id ?? ""}
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
                <ProductImageUpload
                  name="image_url"
                  defaultValue={data.image_url ?? ""}
                  label="Imagen principal"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <ProductImageUpload
                  name="hover_image_url"
                  defaultValue={data.hover_image_url ?? ""}
                  label="Imagen hover"
                />
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
                  defaultValue={galleryUrls.join("\n")}
                  placeholder={`https://...\nhttps://...\nhttps://...`}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/20"
                />
                <p className="text-xs text-black/45">
                  Agrega una URL por línea.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[#F8F8FA] px-4 py-3">
                <input
                  type="checkbox"
                  name="has_in_stock"
                  defaultChecked={Boolean(data.has_in_stock)}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium text-black/75">
                  Con stock
                </span>
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[#F8F8FA] px-4 py-3">
                <input
                  type="checkbox"
                  name="is_active"
                  defaultChecked={Boolean(data.is_active)}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium text-black/75">
                  Producto activo
                </span>
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[#F8F8FA] px-4 py-3">
                <input
                  type="checkbox"
                  name="is_featured"
                  defaultChecked={Boolean(data.is_featured)}
                  className="h-4 w-4"
                />
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
                Guardar cambios
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

        <div className="space-y-6">
          <section className="rounded-[32px] border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-sm text-black/45">Resumen</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-black">
              Información actual
            </h2>

            <div className="mt-6 grid gap-4">
              <div className="rounded-[24px] border border-black/10 bg-[#F8F8FA] p-4">
                <p className="text-sm text-black/45">Precio base</p>
                <p className="mt-2 text-sm font-medium text-black">
                  {formatPrice(data.price_clp)}
                </p>
              </div>

              <div className="rounded-[24px] border border-black/10 bg-[#F8F8FA] p-4">
                <p className="text-sm text-black/45">Slug</p>
                <p className="mt-2 text-sm font-medium text-black">
                  {data.slug}
                </p>
              </div>

              <div className="rounded-[24px] border border-black/10 bg-[#F8F8FA] p-4">
                <p className="text-sm text-black/45">SKU</p>
                <p className="mt-2 text-sm font-medium text-black">
                  {data.sku ?? "—"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-sm text-black/45">Imagen principal</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-black">
              Vista previa
            </h2>

            <div className="mt-6 overflow-hidden rounded-[24px] border border-black/10 bg-[#F8F8FA]">
              {data.image_url ? (
                <Image
                  src={data.image_url}
                  alt={data.name}
                  width={600}
                  height={260}
                  className="h-[260px] w-full object-contain p-4"
                />
              ) : (
                <div className="flex h-[260px] items-center justify-center text-sm text-black/45">
                  Este producto no tiene imagen principal.
                </div>
              )}
            </div>

            <div className="mt-6 overflow-hidden rounded-[24px] border border-black/10 bg-[#F8F8FA]">
              {data.hover_image_url ? (
                <Image
                  src={data.hover_image_url}
                  alt={`${data.name} hover`}
                  width={600}
                  height={220}
                  className="h-[220px] w-full object-contain p-4"
                />
              ) : (
                <div className="flex h-[220px] items-center justify-center text-sm text-black/45">
                  Este producto no tiene imagen hover.
                </div>
              )}
            </div>

            {galleryUrls.length > 0 ? (
              <div className="mt-6">
                <p className="text-sm text-black/45">Imágenes extra</p>

                <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {galleryUrls.map((url: string, index: number) => (
                    <div
                      key={`${url}-${index}`}
                      className="overflow-hidden rounded-2xl border border-black/10 bg-[#F8F8FA]"
                    >
                      <Image
                        src={url}
                        alt={`Imagen extra ${index + 1}`}
                        width={300}
                        height={140}
                        className="h-[140px] w-full object-contain p-3"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
