import Link from "next/link";
import Image from "next/image";
import { ArrowRight, GraduationCap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function waLink() {
  const msg = encodeURIComponent(
    "Hola! Quiero cotizar lockers escolares para resguardo de celulares. ¿Me ayudas con modelos, capacidad y despacho?",
  );
  // Cambia al número real cuando lo tengas
  return `https://wa.me/56933882434?text=${msg}`;
}

export default function SchoolCampaignSection() {
  return (
    <section className="relative overflow-hidden bg-[#F5F5F7] text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/55 backdrop-blur-2xl shadow-[0_18px_45px_rgba(0,0,0,0.12)]">
          <div className="pointer-events-none absolute inset-0">
            {/* wash de color muy suave */}
            <div className="absolute -top-28 -left-28 h-[520px] w-[520px] rounded-full bg-yellow-300/65 blur-3xl" />
            {/* azul (equilibra y da profundidad) */}
            <div className="absolute -bottom-40 -right-40 h-[760px] w-[760px] rounded-full bg-black/35 blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-white/20" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/25" />
          </div>

          <div className="relative grid gap-8 p-8 md:grid-cols-2 md:items-center md:p-12">
            {/* Copy */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={[
                    "relative overflow-hidden",
                    "border border-yellow-400/60",
                    "bg-yellow-300/25 text-zinc-900",
                    "shadow-[0_10px_30px_rgba(250,204,21,0.25)]",
                    "backdrop-blur-xl",
                    "hover:bg-yellow-300/30",
                    "after:pointer-events-none after:absolute after:inset-x-2 after:top-0 after:h-px",
                    "after:bg-gradient-to-r after:from-transparent after:via-white/70 after:to-transparent",
                  ].join(" ")}
                >
                  Campaña Escolar
                </Badge>

                <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs text-zinc-800 backdrop-blur-xl">
                  <GraduationCap className="h-4 w-4" aria-hidden="true"/>
                  Colegios · Liceos · Universidades
                </span>
              </div>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                Lockers escolares para resguardo de celulares
              </h2>

              <p className="mt-3 text-sm text-zinc-600 md:text-base">
                Orden y seguridad en salas de clase. Elige formatos listos para
                compra o cotiza proyectos a medida con instalación y despacho.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs text-zinc-800 backdrop-blur-xl">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  Cerradura portacandado
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs text-zinc-800 backdrop-blur-xl">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true"/>
                  Numeración y personalización
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs text-zinc-800 backdrop-blur-xl">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  Despacho a todo Chile
                </span>
              </div>

              <div className="mt-7 flex flex-col gap-2 sm:flex-row">
                <Button
                  asChild
                  className="h-11 rounded-xl bg-black text-white hover:bg-black/90"
                >
                  <Link href="/tienda?cat=lockers-kids">
                    Ver lockers escolares{" "}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-xl border-black/10 bg-white/60 text-zinc-900 hover:bg-white"
                >
                  <a href={waLink()} target="_blank" rel="noopener noreferrer">
                    Cotizar WhatsApp
                  </a>
                </Button>
              </div>

              <p className="mt-3 text-xs text-zinc-500">
                ¿Necesitas un diseño por curso / sala? Te ayudamos con capacidad
                y distribución.
              </p>
            </div>

            {/* Visual */}
            <div className="relative">
              {/* Cambia esta imagen por una “school” si tienes (ideal .png/.webp) */}
              <div className="relative mx-auto h-[260px] w-full max-w-[520px]">
                <div className="pointer-events-none absolute inset-x-10 top-12 h-40 rounded-full bg-black/10 blur-3xl" />
                <Image
                  src="/images/topProductos/Lockerescolar1puerta.svg"
                  alt="Lockers escolares Mundo Lockers"
                  fill
                  sizes="(max-width: 768px) 90vw, 520px"
                  className="object-contain drop-shadow-[0_28px_34px_rgba(0,0,0,0.20)]"
                />
              </div>

              {/* mini card flotante (opcional) */}
              <div className="mx-auto mt-2 w-fit rounded-2xl border border-black/10 bg-white/60 px-4 py-2 text-xs text-zinc-700 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                Compra rápida o proyecto institucional
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
