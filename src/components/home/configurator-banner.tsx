import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import LockerPreviewSvg from "@/app/(store)/arma-tu-locker/_components/LockerPreviewSvg";
import { LOCKER_COLORS } from "@/app/(store)/arma-tu-locker/_lib/locker-options";

export default function ConfiguratorBannerSection() {
  return (
    <section className="bg-[#EEEDEB] text-zinc-900 dark:bg-[#0F172A] dark:text-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Link
          href="/arma-tu-locker"
          className="group relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-[#0477BF] to-[#04395c] p-7 text-white shadow-[0_20px_50px_rgba(4,119,191,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(4,119,191,0.35)] sm:flex-row sm:justify-between md:p-9 dark:border-white/10"
        >
          {/* Glow decorativo */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:22px_22px]" />

          <div className="relative flex items-center gap-5">
            <div className="hidden h-24 w-20 shrink-0 items-end justify-center rounded-2xl bg-white/10 p-2 backdrop-blur-sm sm:flex">
              <LockerPreviewSvg
                columns={2}
                rows={2}
                colorHex="#CC0605"
                base="patas"
                doorStyle="celosia"
                lockType="candado"
                className="h-full w-auto"
              />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/85">
                <Sparkles className="h-3 w-3" />
                Nuevo
              </span>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-white md:text-2xl">
                Arma tu locker a tu manera
              </h2>
              <p className="mt-1 max-w-md text-sm text-white/75">
                Elige puertas, color, base y chapa, y visualiza tu locker
                antes de cotizarlo.
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                {LOCKER_COLORS.slice(1, 7).map((c) => (
                  <span
                    key={c.id}
                    className="h-4 w-4 rounded-full border border-white/40"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
                <span className="ml-1 text-xs text-white/60">+ colores</span>
              </div>
            </div>
          </div>

          <span className="relative inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0477BF] transition-colors duration-200 group-hover:bg-white/90">
            Probar configurador
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>
    </section>
  );
}
