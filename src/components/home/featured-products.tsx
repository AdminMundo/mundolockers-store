import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhatsAppButton from "@/components/whatsapp-button";
import { getFeaturedProducts } from "@/lib/catalog";

type CardProduct = {
  title: string;
  href: string;
  image: string;
  price: string | null;
};

function formatCLP(value: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

function waLink(productName: string) {
  const msg = encodeURIComponent(
    `Hola! Quiero cotizar ${productName}. ¿Me ayudas con disponibilidad y despacho?`,
  );

  return `https://wa.me/56936289818?text=${msg}`;
}

function ProductCard({ p }: { p: CardProduct }) {
  return (
    <Link href={p.href} className="group block h-full">
      <article
        className={[
          "relative overflow-hidden rounded-3xl",
          "min-h-[520px] pb-[150px] h-full",
          "border border-zinc-200 bg-white dark:border-white/10 dark:bg-[#1E293B]",
          "shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
          "transition-all duration-300",
          "hover:-translate-y-0.5 hover:border-[#0477BF]/30 hover:shadow-[0_24px_60px_rgba(4,119,191,0.14)]",
        ].join(" ")}
      >
        {/* Filo superior tipo "circuito" */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent transition-colors duration-300 group-hover:via-[#0477BF]/70" />

        <div className="p-5">
          {/* Panel del producto */}
          <div className="relative h-[200px] w-full">
            {/* Backdrop tipo "blueprint": grid fino + esquineros */}
            <div className="absolute inset-3 overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-50 to-white dark:from-white/[0.06] dark:to-white/[0.02]">
              <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(to_right,rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.035)_1px,transparent_1px)] [background-size:20px_20px] dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]" />
            </div>
            {[
              "left-0 top-0 border-l-2 border-t-2",
              "right-0 top-0 border-r-2 border-t-2",
              "left-0 bottom-0 border-l-2 border-b-2",
              "right-0 bottom-0 border-r-2 border-b-2",
            ].map((pos) => (
              <span
                key={pos}
                className={`pointer-events-none absolute h-3 w-3 rounded-[2px] border-zinc-300 transition-colors duration-300 group-hover:border-[#0477BF] dark:border-white/15 ${pos}`}
              />
            ))}

            <Image
              src={p.image}
              alt={p.title}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 740px) 50vw, 85vw"
              className="object-contain object-center drop-shadow-[0_20px_24px_rgba(0,0,0,0.14)] transition-transform duration-500 ease-out group-hover:scale-[1.06] translate-y-10"
            />
          </div>
        </div>

        {/* Barra inferior “catálogo” (misma altura siempre) */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="pointer-events-none h-16 bg-gradient-to-b from-transparent to-white dark:to-[#1E293B]" />
          <div className="relative z-10 flex items-end justify-between gap-4 px-5 pb-5 pt-4 bg-white border-t border-zinc-100 h-[170px] dark:bg-[#1E293B] dark:border-white/10">
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-zinc-900 leading-tight min-h-[48px] line-clamp-2 dark:text-zinc-50">
                {p.title}
              </h3>

              <p className="mt-1 text-sm text-zinc-600 min-h-[20px] dark:text-zinc-400">
                {p.price ? (
                  <>
                    Desde{" "}
                    <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {p.price}
                    </span>
                  </>
                ) : (
                  <span className="text-zinc-500 dark:text-zinc-400">Consultar precio</span>
                )}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <Button className="h-9 rounded-xl bg-zinc-900 text-white transition-colors duration-200 hover:bg-[#0477BF]">
                  Ver ficha
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <WhatsAppButton
                  href={waLink(p.title)}
                  className="h-9 rounded-xl border border-zinc-200 bg-white text-zinc-900 transition-colors duration-200 hover:border-[#0477BF] hover:shadow-[0_0_0_3px_rgba(4,119,191,0.15)] dark:border-white/10 dark:bg-[#1E293B] dark:text-zinc-50"
                >
                  WhatsApp
                </WhatsAppButton>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default async function FeaturedProductsSection() {
  const featured = await getFeaturedProducts(8);
  const items: CardProduct[] = featured
    .filter((p) => p.imageUrl)
    .map((p) => ({
      title: p.name,
      href: `/producto/${p.slug}`,
      image: p.imageUrl as string,
      price: p.priceFromClp ? formatCLP(p.priceFromClp) : null,
    }));

  if (items.length === 0) return null;

  return (
    <section className="relative bg-transparent text-zinc-900 dark:text-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Top productos
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Lo más buscado para industria, colegios, minería y hogar.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-xl border border-[#0477BF]/40 bg-white text-zinc-900 transition-colors duration-200 hover:border-[#0477BF] hover:shadow-[0_0_0_3px_rgba(4,119,191,0.15)] dark:bg-[#1E293B] dark:text-zinc-50"
            >
              <Link href="/tienda">Ver tienda</Link>
            </Button>
            <Button
              asChild
              className="h-10 rounded-xl bg-black text-white transition-colors duration-200 hover:bg-[#0477BF] hover:text-white"
            >
              <a
                href="https://wa.me/56936289818"
                target="_blank"
                rel="noreferrer"
              >
                Cotizar WhatsApp
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.href} p={p} />
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-2 sm:hidden">
          <Button
            asChild
            variant="outline"
            className="h-10 w-full rounded-xl border border-[#0477BF]/40 bg-white text-zinc-900 transition-colors duration-200 hover:border-[#0477BF] hover:shadow-[0_0_0_3px_rgba(4,119,191,0.15)] dark:bg-[#1E293B] dark:text-zinc-50"
          >
            <Link href="/tienda">Ver tienda</Link>
          </Button>

          <Button
            asChild
            className="h-10 w-full rounded-xl bg-black text-white transition-colors duration-200 hover:bg-[#0477BF] hover:text-white"
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
