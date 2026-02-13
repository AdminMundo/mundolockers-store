import Image from "next/image";
import { getTechSheetBySlug } from "@/lib/techSheets";

export default function TechSheetSection({ slug }: { slug: string }) {
  const tech = getTechSheetBySlug(slug);
  if (!tech) return null;

  return (
    <section
      aria-label="Medidas y ficha técnica"
      className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-100"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-zinc-900">
          Medidas y ficha técnica
        </h2>
        <span className="text-xs text-zinc-500">Imagen referencial</span>
      </div>

      <div className="relative mt-4 w-full overflow-hidden rounded-2xl bg-zinc-50 aspect-[4/5]">
        <Image
          src={tech.src}
          alt={tech.alt}
          fill
          sizes="(min-width: 1024px) 680px, 92vw"
          className="object-contain p-4"
          
        />
      </div>
    </section>
  );
}
