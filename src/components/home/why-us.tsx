import Link from "next/link";
import {
  BadgeCheck,
  Truck,
  Wrench,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ITEMS = [
  {
    title: "Calidad y garantía",
    desc: "Fabricación robusta, terminaciones premium y respaldo postventa.",
    icon: ShieldCheck,
  },
  {
    title: "Despacho a todo Chile",
    desc: "Envíos coordinados para empresas, colegios e instituciones.",
    icon: Truck,
  },
  {
    title: "Personalización",
    desc: "Colores, numeración, señalética y configuraciones por proyecto.",
    icon: Wrench,
  },
  {
    title: "Compra o cotiza rápido",
    desc: "Flujo simple: elige modelo → compra o cotiza por WhatsApp.",
    icon: BadgeCheck,
  },
];

export default function WhyUsSection() {
  return (
    <section className="bg-[#EEEDEB] text-zinc-900 dark:bg-[#0F172A] dark:text-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Por qué elegir LockerStore
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Diseñado para compra rápida y proyectos institucionales.
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            className="hidden h-10 rounded-xl border border-[#0477BF]/40 bg-white text-zinc-900 transition-colors duration-200 hover:border-[#0477BF] hover:shadow-[0_0_0_3px_rgba(4,119,191,0.15)] md:inline-flex dark:bg-[#1E293B] dark:text-zinc-50"
          >
            <Link href="/tienda">
              Ver tienda <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((it) => {
            const Icon = it.icon;
            return (
              <article
                key={it.title}
                className={[
                  "relative overflow-hidden rounded-3xl",
                  "border border-black/10 dark:border-white/10",
                  "bg-white/55 backdrop-blur-2xl dark:bg-white/5",
                  "shadow-[0_18px_45px_rgba(0,0,0,0.10)]",
                  "p-6 transition-all duration-300",
                  "hover:-translate-y-0.5",
                  "hover:border-[#0477BF]",
                  "hover:shadow-[0_28px_80px_rgba(4,119,191,0.18)]",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white/60 dark:border-white/10 dark:bg-white/10">
                    <Icon
                      className="h-5 w-5 text-zinc-900 dark:text-zinc-200"
                      aria-hidden="true"
                    />
                  </span>
                  <h3 className="text-base font-semibold leading-tight">
                    {it.title}
                  </h3>
                </div>

                <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{it.desc}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-8 md:hidden">
          <Button
            asChild
            variant="outline"
            className="h-11 w-full rounded-xl border border-[#0477BF]/40 bg-white text-zinc-900 transition-colors duration-200 hover:border-[#0477BF] hover:shadow-[0_0_0_3px_rgba(4,119,191,0.15)] dark:bg-[#1E293B] dark:text-zinc-50"
          >
            <Link href="/tienda">
              Ver tienda <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
