import Link from "next/link";
import Image from "next/image";

type Crumb = { label: string; href: string };
type TopImage = { src: string; alt: string };

export default function ProductHeroHeader({
  title,
  subtitle,
  description,
  breadcrumb,
  backgroundImage,
  topImage,
}: {
  title: string;
  subtitle: string;
  description: string;
  breadcrumb: Crumb[];
  backgroundImage: string;
  topImage?: TopImage;
}) {
  return (
    <header className="relative">
      {/* Fondo (hero) */}
      <div className="relative h-[520px] w-full overflow-hidden">
        {/* Imagen fondo */}
        <div
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            backgroundAttachment: "fixed",
          }}
        />

        {/* Overlay para contraste */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Glow suave (premium) */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[900px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

        {/* Fade inferior para transición a la página */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-[#F6F6F7]" />
      </div>



      {/* Texto (con animación suave al cargar) */}
      <div className="absolute inset-x-0 top-[190px] z-30">
        <div className="mx-auto max-w-6xl px-4">
          <div className="animate-heroIn">
            <p className="text-white/80 text-xs tracking-widest uppercase">
              {subtitle}
            </p>

            {/* Imagen arriba del título */}
            {topImage ? (
              <div className="mt-4 inline-flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-3 py-2 backdrop-blur">
                <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-white/10 border border-white/10">
                  <Image
                    src={topImage.src}
                    alt={topImage.alt}
                    fill
                    sizes="44px"
                    className="object-contain p-1"
                    priority
                  />
                </div>
                <span className="text-white/85 text-sm">Ficha del producto</span>
              </div>
            ) : null}

            <h1 className="mt-4 text-white text-4xl md:text-5xl font-semibold leading-tight">
              {title}
            </h1>

            <p className="mt-3 max-w-2xl text-white/80 text-sm">
              {description}
            </p>

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mt-5">
              <ol className="flex flex-wrap items-center gap-2 text-xs text-white/80">
                {breadcrumb.map((c, i) => (
                  <li key={`${c.href}-${i}`} className="flex items-center gap-2">
                    <Link href={c.href} className="hover:text-white">
                      {c.label}
                    </Link>
                    {i < breadcrumb.length - 1 ? (
                      <span className="text-white/50">/</span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </div>

      {/* CSS inline para animación (sin tocar config) */}
      <style>{`
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-heroIn {
          animation: heroIn 500ms ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-heroIn {
            animation: none !important;
          }
        }
      `}</style>
    </header>
  );
}
