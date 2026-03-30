import Image from "next/image";
import { getTechSheetForProduct } from "@/lib/techSheets";

export default function TechSheetSection({
  slug,
  categorySlug,
  productName,
}: {
  slug: string;
  categorySlug: string | null;
  productName: string;
}) {
  const sheet = getTechSheetForProduct({ slug, categorySlug, productName });
  if (!sheet) return null;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-100">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Ficha técnica</h2>
        <span className="text-xs text-zinc-500"> Imagen referencial</span>
      </div>

      <div className="mt-4 overflow-hidden rounded-3xl border border-zinc-100 bg-zinc-50">
        <div className="relative aspect-[3/4] w-full">
          <Image
            src={sheet.src}
            alt={sheet.alt}
            fill
            sizes="(min-width: 1024px) 720px, 100vw"
            className="object-contain p-4"
          />
        </div>
      </div>
    </section>
  );
}
