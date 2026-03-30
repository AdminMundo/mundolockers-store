import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { updateProductAction } from "@/app/admin/productos/[slug]/actions";

export const metadata: Metadata = {
  title: "Editar producto | Admin | Mundo Lockers",
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
    error?: string;
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

export default async function AdminProductoDetallePage({
  params,
  searchParams,
}: AdminProductoDetallePageProps) {
  const { slug } = await params;
  const query = await searchParams;

  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from("catalog_products")
    .select(
      "product_id, sku, slug, name, category_slug, price_from_clp, has_in_stock, is_active, is_featured, image_url"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

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
              style={{ letterSpacing: "0.2em", color: "rgba(255,255,255,0.62)" }}
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
              Edita la información base del producto seleccionado.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/productos"
              className="inline-flex items-center rounded-2xl px-4 py-2.5 text-sm font-medium transition"
              style={{
                backgroundColor: "#FDC90D",
                color: "#111111",
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

      {query.error === "missing_fields" ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Debes completar nombre y slug.
        </div>
      ) : null}

      {query.error === "save_failed" ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          No se pudo guardar el producto. Revisa la estructura de la tabla
          <strong> products</strong>.
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
            <input type="hidden" name="product_id" value={data.product_id} />
            <input type="hidden" name="original_slug" value={data.slug} />

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
            </div>

            <div className="grid gap-4 md:grid-cols-2">
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
                <p className="text-sm text-black/45">Categoría</p>
                <p className="mt-2 text-sm font-medium text-black">
                  {data.category_slug ?? "—"}
                </p>
              </div>

              <div className="rounded-[24px] border border-black/10 bg-[#F8F8FA] p-4">
                <p className="text-sm text-black/45">Precio base visible</p>
                <p className="mt-2 text-sm font-medium text-black">
                  {formatPrice(data.price_from_clp)}
                </p>
              </div>

              <div className="rounded-[24px] border border-black/10 bg-[#F8F8FA] p-4">
                <p className="text-sm text-black/45">Stock visible</p>
                <p className="mt-2 text-sm font-medium text-black">
                  {data.has_in_stock ? "Con stock" : "Sin stock"}
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
                <img
                  src={data.image_url}
                  alt={data.name}
                  className="h-[260px] w-full object-contain p-4"
                />
              ) : (
                <div className="flex h-[260px] items-center justify-center text-sm text-black/45">
                  Este producto no tiene imagen principal visible.
                </div>
              )}
            </div>

            <p className="mt-4 text-sm leading-6 text-black/55">
              En el siguiente paso podemos hacer editable esta parte para cambiar
              la imagen principal o la galería, según cómo estés guardando las imágenes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}