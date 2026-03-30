"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import PopOutImage from "./PopOutImage";

type VariantImages = { variantId: string; urls: string[] };
type DetailThumb = { src: string; alt: string };

function uniq(arr: string[]): string[] {
  return Array.from(new Set(arr.filter(Boolean)));
}

export default function ProductGallery({
  productName,
  coverImage,
  variantImages,
  detailDots,
}: {
  productName: string;
  coverImage: string | null;
  variantImages: VariantImages[];
  detailDots?: DetailThumb[];
}) {
  const productImages = useMemo(() => {
    const fromVariants = variantImages.flatMap((v) => v.urls);
    const base = coverImage ? [coverImage] : [];
    return uniq([...base, ...fromVariants]);
  }, [coverImage, variantImages]);

  const thumbs = useMemo(() => {
    const detail = (detailDots ?? []).map((x) => x.src);
    return uniq([...detail, ...productImages]).slice(0, 3);
  }, [detailDots, productImages]);

  const initialMain = productImages[0] ?? thumbs[0] ?? null;
  const [mainSrc, setMainSrc] = useState<string | null>(initialMain);
  const main = mainSrc ?? initialMain;

  return (
    <section aria-label="Galería del producto" className="grid grid-cols-[1fr_128px] gap-5">
      {/* Imagen grande */}
      <PopOutImage>
        {main ? (
          <Image
            src={main}
            alt={productName}
            fill
            priority
            sizes="(min-width: 1024px) 520px, 90vw"
            className="object-contain p-6"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            Sin imagen
          </div>
        )}
      </PopOutImage>

      {/* 3 miniaturas (derecha) */}
      <div className="flex flex-col gap-4">
        {thumbs.map((src, idx) => {
          const isActive = src === main;
          return (
            <button
              key={`${idx}-${src}`}
              type="button"
              onClick={() => setMainSrc(src)}
              className={[
                "relative aspect-square w-full overflow-hidden rounded-2xl border bg-white shadow-sm",
                "transition duration-200 ease-out",
                isActive ? "border-zinc-900" : "border-zinc-200 hover:border-zinc-400",
              ].join(" ")}
              aria-label={`Ver miniatura ${idx + 1}`}
              aria-current={isActive ? "true" : undefined}
            >
              <Image
                src={src}
                alt={`${productName} - miniatura ${idx + 1}`}
                fill
                sizes="128px"
                className="object-contain p-3"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
