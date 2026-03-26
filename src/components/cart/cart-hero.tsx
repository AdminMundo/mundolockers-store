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
    <section className="relative isolate w-full overflow-hidden bg-neutral-950">
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />
      </div>

      <div className="relative mx-auto flex min-h-[420px] max-w-7xl items-end px-4 pb-14 pt-32 sm:min-h-[500px] sm:px-6 sm:pb-16 sm:pt-36 lg:min-h-[560px] lg:px-8 lg:pb-20 lg:pt-40">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/85">
            {eyebrow}
          </p>

          <h1 className="mt-3 text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            {title}
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-white/90 sm:text-lg">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}