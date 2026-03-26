import Image from "next/image";

type Props = {
  title: string;
  description: string;
  eyebrow?: string;
  imageSrc?: string;
};

const DEFAULT_HERO_IMAGE = "/images/Tienda/shopencabezado.svg";

export function CartHero({
  title,
  description,
  eyebrow = "MUNDOLOCKERSSTORE",
  imageSrc = DEFAULT_HERO_IMAGE,
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-neutral-900 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/25" />
      </div>

      <div className="relative px-6 py-12 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
            {eyebrow}
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/85 sm:text-base">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}