import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

type Crumb = { label: string; href: string };

export default function HeroBanner({
  eyebrow,
  title,
  description,
  breadcrumb,
  actions,
  imageSrc = "/images/home/encabezado.png",
  imageAlt = "LockerStore",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  breadcrumb?: Crumb[];
  actions?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[#EEEDEB] pt-24 md:pt-28">
      {/* Imagen de fondo: object-contain (no recorta el logo/locker) alineada a la derecha
          para dejar espacio al texto a la izquierda; en mobile queda debajo del texto.
          top-24/28 en vez de inset-0 para que respete el mismo espacio del navbar que pt-24/28. */}
      <div className="relative h-64 w-full sm:h-80 md:absolute md:inset-x-0 md:top-24 md:h-105 lg:top-28">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="250vw"
          className="object-contain md:object-right"
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-8 md:flex md:min-h-105 md:flex-col md:justify-center md:py-16">
        <div className="md:max-w-sm">
          {breadcrumb ? (
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                {breadcrumb.map((c, i) => (
                  <li key={`${c.href}-${i}`} className="flex items-center gap-2">
                    <Link href={c.href} className="hover:text-zinc-900">
                      {c.label}
                    </Link>
                    {i < breadcrumb.length - 1 ? (
                      <span className="text-zinc-400">/</span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          {eyebrow ? (
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
              {eyebrow}
            </p>
          ) : null}

          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-600 md:text-base">
              {description}
            </p>
          ) : null}

          {actions ? <div className="mt-7 flex flex-wrap gap-4">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}
