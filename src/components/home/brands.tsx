import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

type Brand = {
  name: string;
  logo: string; // /public/...
  href?: string; // opcional
};

const BRANDS: Brand[] = [
  { name: "CODELCO", logo: "/brand/Codelco.webp" },
  { name: "Atacama Mineral", logo: "/brand/Atacama.webp" },
  { name: "Walmart", logo: "/brand/Walmart-logo-1.png" },
  { name: "PDI", logo: "/brand/PDI.webp" },
  { name: "Carabineros", logo: "/brand/Carabineros.webp" },
  { name: "Cencosud", logo: "/brand/Cencosud.webp" },
  { name: "Colegios", logo: "/brand/british.webp" },
  { name: "Colegios", logo: "/brand/ColegioPedrodevldivia.svg" },
  { name: "Armada", logo: "/brand/Armada.webp" },
  { name: "Unimarc", logo: "/brand/Unimarc.webp" },
  { name: "Construmart", logo: "/brand/Construmart.svg" },
];

// duplicamos para loop infinito sin saltos
const LOOP = [...BRANDS, ...BRANDS];

export default function BrandsSection() {
  return (
    <section className="bg-[#F5F5F7] text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Marcas e instituciones que confían en nosotros
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Proyectos para industria, minería, educación e instituciones.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs text-zinc-800 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                <ShieldCheck className="h-4 w-4" />
                Garantía y postventa
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs text-zinc-800 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                <BadgeCheck className="h-4 w-4" />
                Despacho a todo Chile
              </span>

              {/* Convenio Marco */}
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs text-zinc-800 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                <BadgeCheck className="h-4 w-4" />
                Convenio Marco
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-xl border-black/10 bg-white/60 text-zinc-900
                          transition-colors duration-200
                          hover:bg-white hover:text-zinc-900
                          hover:border-[#FDC90D] hover:shadow-[0_10px_25px_rgba(253,201,13,0.18)]"
            >
              <Link href="/proyectos">Ver proyectos</Link>
            </Button>

            <Button
              asChild
              className="h-10 rounded-xl bg-black text-white transition-colors
                       hover:bg-[#FDC90D] hover:text-black"
            >
              <Link href="/cotizar">Cotizar</Link>
            </Button>
          </div>
        </div>

        {/* Contenedor glass flotante */}
        <div className="mt-8 rounded-3xl border border-black/10 bg-white/55 backdrop-blur-2xl shadow-[0_18px_45px_rgba(0,0,0,0.12)] overflow-hidden">
          {/* línea sutil tipo navbar */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-black/15 to-transparent" />

          {/* carrusel infinito */}
          <div className="relative">
            {/* fades laterales */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white/80 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white/80 to-transparent" />

            <div className="py-6">
              <div className="brands-marquee flex gap-10 px-6">
                {LOOP.map((b, idx) => {
                  const Item = (
                    <div className="flex h-20 w-[170px] items-center justify-center rounded-2xl border border-black/10 bg-white/60 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
                      <Image
                        src={b.logo}
                        alt={b.name}
                        width={170}
                        height={70}
                        loading="lazy"
                        decoding="async"
                        className="h-12 w-auto object-contain opacity-95"
                      />
                    </div>
                  );

                  return b.href ? (
                    <Link
                      key={`${b.name}-${idx}`}
                      href={b.href}
                      className="hover:opacity-100"
                      aria-label={`Ver ${b.name}`}
                    >
                      {Item}
                    </Link>
                  ) : (
                    <div key={`${b.name}-${idx}`}>{Item}</div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
