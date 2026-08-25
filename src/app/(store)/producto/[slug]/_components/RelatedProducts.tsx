import Image from "next/image";
import Link from "next/link";
import type { RelatedProduct } from "@/lib/catalog";

function formatCLP(value: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function RelatedProducts({
  products,
  categoryName,
}: {
  products: RelatedProduct[];
  categoryName: string;
}) {
  if (products.length === 0) return null;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-100">
      <h2 className="text-lg font-semibold text-zinc-900">
        Otros productos de {categoryName}
      </h2>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {products.map((p) => (
          <Link
            key={p.productId}
            href={`/producto/${p.slug}`}
            className="group block overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 transition hover:border-[#0477BF]"
          >
            <div className="relative aspect-square w-full bg-white">
              {p.imageUrl ? (
                <Image
                  src={p.imageUrl}
                  alt={p.name}
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                  className="object-contain p-2 transition duration-200 group-hover:scale-105"
                />
              ) : null}
            </div>
            <div className="p-3">
              <p className="line-clamp-2 text-xs font-medium text-zinc-800">{p.name}</p>
              {p.priceFromClp && p.priceFromClp > 0 ? (
                <p className="mt-1 text-xs text-zinc-500">{formatCLP(p.priceFromClp)}</p>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
