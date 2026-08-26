import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

export default function GuideBannerSection() {
  return (
    <section className="bg-[#EEEDEB] text-zinc-900 dark:bg-[#0F172A] dark:text-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Link
          href="/guia-de-lockers"
          className="group flex flex-col items-start gap-5 rounded-3xl border border-black/10 bg-white p-7 shadow-sm transition hover:border-[#0477BF] hover:shadow-[0_10px_30px_rgba(4,119,191,0.12)] sm:flex-row sm:items-center sm:justify-between md:p-9 dark:border-white/10 dark:bg-[#1E293B]"
        >
          <div className="flex items-start gap-4 sm:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0477BF]/10 text-[#0477BF]">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900 md:text-xl dark:text-zinc-50">
                ¿No sabes qué locker elegir?
              </h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Lee nuestra guía completa: tipos de lockers, materiales, precios y qué revisar antes de comprar.
              </p>
            </div>
          </div>

          <span className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 group-hover:bg-[#0477BF]">
            Leer la guía <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>
    </section>
  );
}
