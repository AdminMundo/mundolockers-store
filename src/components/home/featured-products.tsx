import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import WhatsAppButton from "@/components/whatsapp-button";

type FeaturedProduct = {
  title: string;
  slug: string;
  href: string;
  image: string;
  price?: string;
  tag?: string;
};

const FEATURED: FeaturedProduct[] = [
  {
    title: "Locker Metálico 10 puertas - 5 cuerpos dobles ",
    slug: "locker-metalico-5p",
    href: "/tienda?cat=lockers-metalicos",
    image: "/images/topProductos/5cuerposdobles.svg",

    tag: "Top ventas",
  },
  {
    title: "Locker Escolar - 1 Puerta",
    slug: "locker-kids-colores",
    href: "/tienda?cat=lockers-kids",
    image: "/images/topProductos/Lockerescolar1puerta.svg",
    tag: "Nuevo",
  },
  {
    title: "Roperillo - 1 Puerta",
    slug: "storage-roperillo",
    href: "/tienda?cat=storages-roperillos",
    image: "/images/topProductos/Roperillo1puerta.svg",
  },
  {
    title: "Locker Minero reforzado",
    slug: "locker-minero",
    href: "/tienda?cat=lockers-mineros",
    image: "/images/topProductos/Lockermineroamarillo.svg",
  },
  {
    title: "Locker Metálico 12 Puertas 4 Cuerpos Triples",
    slug: "locker-mecano",
    href: "/tienda?cat=lockers-metalicos",
    image: "/images/topProductos/12puertas.svg",
  },

  {
    title: "Locker Metálico 5 cuerpos, 16 puertas",
    slug: "kardex",
    href: "/tienda?cat=lockers-metalicos",
    image: "/images/topProductos/Locker5cuerposcuadruple.svg",
  },
  {
    title: "Banca Metálica",
    slug: "banca-metalica",
    href: "/tienda?cat=bancas-metalicas",
    image: "/images/topProductos/banca.svg",
  },
  {
    title: "Lockers Jr. – 20 puertas - 5 cuerpos cuadruples",
    slug: "locker-home",
    href: "/tienda?cat=lockers-metalicos",
    image: "/images/topProductos/Lockersjr20puertas.svg",
  },
];

function waLink(productName: string) {
  const msg = encodeURIComponent(
    `Hola! Quiero cotizar ${productName}. ¿Me ayudas con disponibilidad y despacho?`,
  );

  return `https://wa.me/56933882434?text=${msg}`;
}

function ProductCard({ p }: { p: FeaturedProduct }) {
  return (
    <Link href={p.href} className="group block h-full">
      <article
        className={[
          "relative overflow-hidden rounded-3xl",
          "min-h-[520px] pb-[150px] h-full",
          "border border-black/10",
          "bg-zinc-200/70 backdrop-blur-xl",
          "shadow-[0_18px_45px_rgba(0,0,0,0.16)]",
          "transition-all duration-300",
          "hover:-translate-y-0.5 hover:shadow-[0_30px_75px_rgba(0,0,0,0.20)]",
        ].join(" ")}
      >
        <div className="p-5">
          {p.tag && (
            <Badge className="bg-black/10 text-zinc-700 hover:bg-black/10">
              {p.tag}
            </Badge>
          )}

          {/* Producto flotante */}
          <div className="mt-4 relative h-[200px] w-full">
            <div className="pointer-events-none absolute inset-x-6 top-16 h-44 rounded-full blur-2xl bg-black/10" />
            <Image
              src={p.image}
              alt={p.title}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 740px) 50vw, 85vw"
              className="object-contain object-center drop-shadow-[0_28px_34px_rgba(0,0,0,0.28)] transition-transform duration-500 ease-out group-hover:scale-[1.06] translate-y-10"
            />
          </div>
        </div>

        {/* Barra inferior “catálogo” (misma altura siempre) */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="pointer-events-none h-16 bg-gradient-to-b from-transparent to-white/80" />
          <div className="relative z-10 flex items-end justify-between gap-4 px-5 pb-5 pt-4 bg-white/60 backdrop-blur-2xl border-t border-black/10 h-[170px]">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-zinc-900 leading-tight min-h-[48px] line-clamp-2">
                {p.title}
              </h3>

              <p className="mt-1 text-sm text-zinc-600 min-h-[20px]">
                {p.price ? (
                  <>
                    Desde{" "}
                    <span className="font-semibold text-zinc-900">
                      {p.price}
                    </span>
                  </>
                ) : (
                  <span className="opacity-0">Desde $0</span>
                )}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <Button
                  variant="outline"
                  className="h-9 rounded-xl border-black/10 bg-white/40 text-zinc-900
                  transition-colors duration-200 hover:bg-[#FDC90D] hover:text-black hover:border-black/20"
                >
                  Ver ficha
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <WhatsAppButton
                  href={waLink(p.title)}
                  className="h-9 rounded-xl border-black/10 bg-white/40 text-zinc-900 transition-colors duration-200 hover:bg-[#FDC90D] hover:text-black hover:border-black/20"
                >
                  WhatsApp
                </WhatsAppButton>
              </div>
            </div>

            {p.price && (
              <div className="hidden sm:block text-right">
                <div className="text-sm text-zinc-500">Desde</div>
                <div className="text-xl font-semibold text-zinc-900">
                  {p.price}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function FeaturedProductsSection() {
  return (
    <section className="relative bg-transparent text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Top productos
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Lo más buscado para industria, colegios, minería y hogar.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Button
              asChild
              className="h-10 rounded-xl bg-black text-white hover:bg-black/90"
            >
              <Link href="/tienda">Ver tienda</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-xl border-black/10 bg-white/60 text-zinc-900 hover:shadow-[0_10px_25px_rgba(253,201,13,0.25)] transition-all duration-300 hover:bg-[#FDC90D] hover:text-white hover:border-black"
            >
              <a
                href="https://wa.me/56933882434"
                target="_blank"
                rel="noreferrer"
              >
                Cotizar WhatsApp
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {FEATURED.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-2 sm:hidden">
          <Button
            asChild
            className="hidden h-10 rounded-xl border-black/10 bg-white/60 text-zinc-900 transition-colors hover:bg-[#FDC90D] hover:text-black hover:border-black/20 md:inline-flex"
          >
            <Link href="/tienda">Ver tienda</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-11 rounded-xl border-black/10 bg-white/60 hover:bg-white"
          >
            <a
              href={waLink("un locker")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cotizar WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
