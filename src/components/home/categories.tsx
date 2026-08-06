"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import Autoplay from "embla-carousel-autoplay";
import type { CarouselApi } from "@/components/ui/carousel";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Category = {
  title: string;
  slug: string;
  href: string;
  image: string;
  priceFrom?: string;
  tag?: string;
};

const CATEGORIES: Category[] = [
  {
    title: "Lockers Metálicos",
    slug: "lockers-metalicos",
    href: "/tienda/lockers-metalicos",
    image: "/images/categoria/LockerMetalico.webp",
    priceFrom: "$89.900",
    tag: "Popular",
  },
  {
  title: "Lockers para Celulares",
  slug: "lockers-phone",
  href: "/tienda/lockers-phone",
  image: "/images/categoria/phonetrans2.webp",
  priceFrom: "$190.900",
  tag: "Popular",
},
  {
    title: "Lockers Kids",
    slug: "lockers-kids",
    href: "/tienda/lockers-kids",
    image: "/images/categoria/CatLockerKids.webp",
    priceFrom: "$129.900",
    tag: "Popular",
  },
  {
    title: "Lockers Mineros",
    slug: "lockers-mineros",
    href: "/tienda/lockers-mineros",
    image: "/images/categoria/LockerMinero.webp",
    priceFrom: "$159.900",
    tag: "Popular",
  },
  {
    title: "Estanterias Mecano",
    slug: "estantes-mecano",
    href: "/tienda/estantes-mecano",
    image: "/images/categoria/Estante.webp",
    priceFrom: "$69.990",
  },
  {
    title: "Storages & Roperillos",
    slug: "storages-roperillos",
    href: "/tienda/storages-roperillos",
    image: "/images/categoria/Roperillos.webp",
    priceFrom: "$183.990",
  },
  {
    title: "Kardex & Cajoneras",
    slug: "kardex-y-cajoneras",
    href: "/tienda/kardex-y-cajoneras",
    image: "/images/categoria/Kardex.webp",
    priceFrom: "$161.538",
  },
  {
    title: "Bancas Metálicas",
    slug: "bancas",
    href: "/tienda/bancas",
    image: "/images/products/banca-metalica-simple-120x45x45.webp",
    priceFrom: "$79.990",
  },


];

function CategoryCard({ c }: { c: Category }) {
  return (
    <Link
      href={c.href}
      className="group block h-full"
      aria-label={`Ver categoría: ${c.title}`}
    >
      <article
        className={[
          "relative overflow-hidden rounded-3xl",
          "min-h-[420px] pb-[135px] h-full", // un poco menos espacio reservado
          "border border-zinc-200 bg-white",
          "shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
          "transition-all duration-300",
          "hover:-translate-y-0.5 hover:border-[#0477BF]/30 hover:shadow-[0_24px_60px_rgba(4,119,191,0.14)]",
        ].join(" ")}
      >
        {/* Filo superior tipo "circuito" */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent transition-colors duration-300 group-hover:via-[#0477BF]/70" />

        {/* top content */}
        <div className="p-5">
          {c.tag && (
            <Badge className="gap-1.5 border-zinc-200 bg-white text-zinc-600 hover:bg-white">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0477BF]" />
              {c.tag}
            </Badge>
          )}

          {/* Imagen */}
          <div className="mt-4 relative h-[170px] w-full">
            {/* Backdrop tipo "blueprint": grid fino + esquineros */}
            <div className="absolute inset-3 overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-50 to-white">
              <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(to_right,rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.035)_1px,transparent_1px)] [background-size:20px_20px]" />
            </div>
            {[
              "left-0 top-0 border-l-2 border-t-2",
              "right-0 top-0 border-r-2 border-t-2",
              "left-0 bottom-0 border-l-2 border-b-2",
              "right-0 bottom-0 border-r-2 border-b-2",
            ].map((pos) => (
              <span
                key={pos}
                className={`pointer-events-none absolute h-3 w-3 rounded-[2px] border-zinc-300 transition-colors duration-300 group-hover:border-[#0477BF] ${pos}`}
              />
            ))}

            <Image
              src={c.image}
              alt={c.title}
              fill
              sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 25vw"
              className="object-contain object-center scale-[1.82] translate-y-10 drop-shadow-[0_20px_24px_rgba(0,0,0,0.14)] transition-transform duration-500 ease-out group-hover:scale-[1.18] group-hover:-translate-y-1"
            />
          </div>
        </div>

        {/* INFO BAR (más baja) */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="pointer-events-none h-14 bg-gradient-to-b from-transparent to-white" />

          <div className="relative z-10 flex items-end justify-between gap-4 px-5 pb-4 pt-3 bg-white border-t border-zinc-100 h-[150px]">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-zinc-900 leading-tight line-clamp-2 min-h-[48px]">
                {c.title}
              </h3>



              <Button className="mt-2 h-9 rounded-xl bg-zinc-900 text-white transition-colors duration-200 hover:bg-[#0477BF]">
                Ver más <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="hidden sm:block text-right shrink-0">
              {c.priceFrom ? (
                <>
                  <div className="text-xs text-zinc-500">Desde</div>
                  <div className="text-lg font-semibold text-zinc-900">
                    {c.priceFrom}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xs text-zinc-500">Precio</div>
                  <div className="text-sm font-semibold text-zinc-900">
                    Consultar
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function CategoriesSection() {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Autoplay suave: 4s + pausa hover
  const autoplay = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  const opts = useMemo(
    () => ({
      align: "start" as const,
      loop: true,
      dragFree: false,
      skipSnaps: false,
    }),
    [],
  );

  useEffect(() => {
    if (!api) return;

    const update = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());
    };

    update();
    api.on("select", update);
    api.on("reInit", update);

    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  return (
    <section className="relative bg-[#EEEDEB] text-zinc-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#EEEDEB] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#EEEDEB] to-transparent" />

      <div className="relative mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Nuestras Categorías
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Explora por tipo de uso: industria, colegios, minería y hogar.
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            className="mt-3 h-9 rounded-xl border border-[#0477BF]/40 bg-white text-zinc-900 transition-colors duration-200 hover:border-[#0477BF] hover:shadow-[0_0_0_3px_rgba(4,119,191,0.15)]"
          >
            <Link href="/tienda">Ver todo</Link>
          </Button>
        </div>

        <div className="mt-8">
          <div
            onMouseEnter={() => autoplay.current.stop()}
            onMouseLeave={() => autoplay.current.reset()}
          >
            <Carousel
              opts={opts}
              plugins={[autoplay.current]}
              setApi={setApi}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {CATEGORIES.map((c) => (
                  <CarouselItem
                    key={c.slug}
                    className="pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <CategoryCard c={c} />
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious
                className="hidden md:flex left-3 top-1/2 -translate-y-1/2
               border-black/10 bg-white/70 hover:bg-white shadow-md"
              />

              <CarouselNext
                className="hidden md:flex right-3 top-1/2 -translate-y-1/2
               border-black/10 bg-white/70 hover:bg-white shadow-md"
              />
            </Carousel>
          </div>

          {/* dots */}
          {count > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Ir al slide ${i + 1}`}
                  onClick={() => api?.scrollTo(i)}
                  className={[
                    "h-1.5 w-6 rounded-full transition-all",
                    i === current
                      ? "bg-zinc-900/70"
                      : "bg-zinc-900/20 hover:bg-zinc-900/30",
                  ].join(" ")}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
