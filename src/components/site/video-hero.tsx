import type { ReactNode } from "react";
import Image from "next/image";

export default function VideoHero({
  eyebrow,
  kicker,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  kicker?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="relative flex h-[88vh] min-h-[600px] max-h-[860px] w-full items-end overflow-hidden bg-zinc-950 pb-16 pt-24 md:items-center md:pb-0">
      {/* Poster: primer paint instantáneo (LCP) y respaldo para prefers-reduced-motion */}
      <Image
        src="/images/home/hero-poster.jpg"
        alt="Fabricación de lockers metálicos en nuestra planta en Chile"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Video: reemplaza el poster una vez que puede reproducirse */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/images/home/hero-poster.jpg"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center motion-reduce:hidden"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay para legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />

      <div className="relative mx-auto w-full max-w-6xl px-4">
        <div className="max-w-xl">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
              {eyebrow}
            </p>
          ) : null}

          {kicker ? (
            <p className="mt-2 text-lg font-medium tracking-tight text-white/90 md:text-xl">
              {kicker}
            </p>
          ) : null}

          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/80 md:text-base">
              {description}
            </p>
          ) : null}

          {actions ? <div className="mt-7 flex flex-wrap gap-4">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}
