import Image from "next/image";
import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  actions?: ReactNode;
};

export function AdminPageHeader({
  eyebrow = "Panel de administración",
  title,
  description,
  imageUrl,
  imageAlt = "Cabecera del panel",
  actions,
}: AdminPageHeaderProps) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-sm">
      <div className="relative h-[220px] w-full md:h-[260px]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#111827_0%,#374151_45%,#9CA3AF_100%)]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 text-white md:flex-row md:items-end md:justify-between md:p-8">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/70">
              {eyebrow}
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              {title}
            </h1>

            {description ? (
              <p className="mt-3 max-w-2xl text-sm text-white/80 md:text-base">
                {description}
              </p>
            ) : null}
          </div>

          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}