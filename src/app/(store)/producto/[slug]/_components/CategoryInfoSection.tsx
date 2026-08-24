import Link from "next/link";

export default function CategoryInfoSection({
  categoryName,
  categorySlug,
  description,
}: {
  categoryName: string;
  categorySlug: string;
  description: string;
}) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-100">
      <h2 className="text-lg font-semibold text-zinc-900">Sobre {categoryName}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
      <Link
        href={`/tienda/${categorySlug}`}
        className="mt-3 inline-block text-sm font-medium text-[#0477BF] hover:underline"
      >
        Ver más productos de {categoryName} →
      </Link>
    </section>
  );
}
