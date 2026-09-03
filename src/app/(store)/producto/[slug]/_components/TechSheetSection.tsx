import Image from "next/image";
import { Download } from "lucide-react";
import { resolveTechSheet } from "@/lib/techSheets";

export default function TechSheetSection({
  slug,
  categorySlug,
  productName,
  techSheetImageUrl,
  techSheetPdfUrl,
}: {
  slug: string;
  categorySlug: string | null;
  productName: string;
  techSheetImageUrl?: string | null;
  techSheetPdfUrl?: string | null;
}) {
  const sheet = resolveTechSheet({ slug, categorySlug, productName, techSheetImageUrl });
  const pdfUrl = techSheetPdfUrl?.trim() || null;

  if (!sheet && !pdfUrl) return null;

  return (
    <section id="especificaciones" className="rounded-3xl bg-white p-6 shadow-sm border border-zinc-100">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-zinc-900">Ficha técnica</h2>
        {sheet ? <span className="text-xs text-zinc-500"> Imagen referencial</span> : null}
      </div>

      {sheet ? (
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
      ) : null}

      {pdfUrl ? (
        <div className="mt-4 space-y-3">
          <div className="overflow-hidden rounded-3xl border border-zinc-100 bg-zinc-50">
            <iframe
              src={pdfUrl}
              title={`Vista previa: ficha técnica en PDF de ${productName}`}
              className="h-[500px] w-full"
            />
          </div>

          <a
            href={`${pdfUrl}?download`}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#0477BF]"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Descargar ficha técnica (PDF)
          </a>
        </div>
      ) : null}
    </section>
  );
}
