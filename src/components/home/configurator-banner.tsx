import Link from "next/link";
import { ArrowRight, LayoutGrid, Palette, KeyRound, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

import ConfiguratorBannerPreview from "./configurator-banner-preview";
import ConfiguratorBannerFluid from "./configurator-banner-fluid";

export default function ConfiguratorBannerSection() {
  return (
    <section className="bg-[#EEEDEB] text-zinc-900 dark:bg-[#0F172A] dark:text-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="relative overflow-hidden rounded-3xl bg-[#0a0e1a] text-white shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          {/* Respaldo estático (siempre visible, incluso en celular/reduced
              motion) + la simulación de fluido encima en desktop. */}
          <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-1/4 -top-1/4 h-[70%] w-[60%] rounded-[45%] bg-[#6D1439]/60 mix-blend-screen blur-3xl" />
            <div className="absolute -bottom-1/4 -right-1/4 h-[60%] w-[55%] rounded-[45%] bg-[#0477BF]/60 mix-blend-screen blur-3xl" />
          </div>

          <ConfiguratorBannerFluid />

          <div className="relative z-10 grid gap-8 p-8 pointer-events-none md:grid-cols-2 md:items-center md:p-12">
            {/* Copy */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85 backdrop-blur-xl">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  Nuevo
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur-xl">
                  Configurador visual
                </span>
              </div>

              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                Arma tu locker a tu manera
              </h2>

              <p className="mt-3 text-sm text-white/70 md:text-base">
                Juega con puertas, cuerpos, colores, base y chapa, y mira tu
                locker cobrar vida antes de cotizarlo. Tu diseño, tus reglas.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/75 backdrop-blur-xl">
                  <Palette className="h-4 w-4" aria-hidden="true" />
                  9 colores
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/75 backdrop-blur-xl">
                  <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                  Puertas a medida
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/75 backdrop-blur-xl">
                  <KeyRound className="h-4 w-4" aria-hidden="true" />5 tipos de chapa
                </span>
              </div>

              <div className="mt-7">
                <Button
                  asChild
                  className="pointer-events-auto h-12 rounded-xl bg-white px-7 text-base font-semibold text-[#0F172A] transition-all duration-200 hover:bg-[#0477BF] hover:text-white hover:shadow-[0_10px_30px_rgba(4,119,191,0.35)]"
                >
                  <Link href="/arma-tu-locker">
                    Pruébalo tú mismo
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>

              <p className="mt-3 text-xs text-white/45">
                Diseño referencial: el detalle final se confirma al cotizar.
              </p>
            </div>

            {/* Preview interactivo */}
            <ConfiguratorBannerPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
