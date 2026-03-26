import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BadgeCheck,
  ClipboardList,
  Truck,
  Wrench,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    title: "Elige modelo o categoría",
    desc: "Explora por uso (industria, colegios, minería, hogar) y filtra por medidas.",
    icon: ClipboardList,
  },
  {
    title: "Compra o cotiza rápido",
    desc: "Compra online o cotiza por WhatsApp para proyectos institucionales.",
    icon: BadgeCheck,
  },
  {
    title: "Personalización",
    desc: "Numeración, señalética, colores y configuraciones por proyecto.",
    icon: Wrench,
  },
  {
    title: "Despacho a todo Chile",
    desc: "Coordinamos entrega, retiro o instalación según tu requerimiento.",
    icon: Truck,
  },
];

const FAQ = [
  {
    q: "¿Emiten factura y aceptan orden de compra (OC)?",
    a: "Sí. Trabajamos con empresas e instituciones: factura, OC y documentación según requerimiento.",
  },
  {
    q: "¿Despachan a todo Chile?",
    a: "Sí. Coordinamos despacho a regiones y Santiago. También puedes retirar si aplica.",
  },
  {
    q: "¿Puedo personalizar numeración, colores y señalética?",
    a: "Sí. Podemos numerar puertas, agregar señalética y definir colores según el proyecto.",
  },
  {
    q: "¿Cuál es el plazo de entrega?",
    a: "Depende de stock y configuración. Para proyectos a medida coordinamos plazos al cotizar.",
  },
  {
    q: "¿Qué garantía ofrecen?",
    a: "Garantía y respaldo postventa. Si necesitas condiciones específicas (licitaciones), lo incluimos en la cotización.",
  },
  {
    q: "¿Trabajan con Convenio Marco?",
    a: "Sí. Si necesitas guía de compra institucional, te ayudamos con el proceso.",
  },
];

export default function ProcessFaqSection() {
  return (
    <section className="bg-[#F5F5F7] text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Cómo funciona
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Compra rápida o proyecto institucional en pocos pasos.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge className="bg-black/10 text-zinc-800 hover:bg-black/10">
                Garantía y postventa
              </Badge>
              <Badge className="bg-black/10 text-zinc-800 hover:bg-black/10">
                Despacho a todo Chile
              </Badge>
              <Badge className="bg-black/10 text-zinc-800 hover:bg-black/10">
                Convenio Marco
              </Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-xl border-black/10 bg-white/60 text-zinc-900 transition-colors
                      hover:bg-white hover:text-zinc-900 hover:border-[#FDC90D]"
            >
              <Link href="/tienda">
                Ver tienda <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="h-10 rounded-xl bg-black text-white transition-colors
                        hover:bg-[#FDC90D] hover:text-black"
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

        {/* Steps */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div
              key={s.title}
              className={[
                "rounded-3xl border border-black/10",
                "bg-white/60 backdrop-blur-xl",
                "shadow-[0_18px_45px_rgba(0,0,0,0.08)]",
                "p-6 transition-all duration-300",
                "hover:-translate-y-0.5",
                "hover:border-[#FDC90D]",
                "hover:shadow-[0_28px_80px_rgba(253,201,13,0.18)]",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-black/5">
                  <s.icon className="h-5 w-5 text-zinc-900" />
                </div>
                <div>
                  <h3 className="text-base font-semibold leading-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
          <div
            className={[
              "rounded-3xl border border-black/10",
              "bg-white/60 backdrop-blur-xl",
              "shadow-[0_18px_45px_rgba(0,0,0,0.08)]",
              "p-6",
            ].join(" ")}
          >
            <h3 className="text-xl font-semibold tracking-tight">
              Preguntas frecuentes
            </h3>
            <p className="mt-2 text-sm text-zinc-600">
              Respuestas rápidas para comprar o cotizar sin fricción.
            </p>

            <div className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                {FAQ.map((f) => (
                  <AccordionItem key={f.q} value={f.q}>
                    <AccordionTrigger className="text-left text-sm font-medium">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-zinc-600">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Side card: garantía / confianza */}
          <div
            className={[
              "rounded-3xl border border-black/10",
              "bg-white/60 backdrop-blur-xl",
              "shadow-[0_18px_45px_rgba(0,0,0,0.08)]",
              "p-6",
              "flex flex-col justify-between",
            ].join(" ")}
          >
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-zinc-900" />
                <h3 className="text-xl font-semibold tracking-tight">
                  Compra segura
                </h3>
              </div>
              <p className="mt-2 text-sm text-zinc-600">
                Diseñado para empresas e instituciones: flujo simple, soporte y
                postventa.
              </p>

              <ul className="mt-5 space-y-3 text-sm text-zinc-700">
                <li className="flex gap-2">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-[#FDC90D]" />
                  Stock o fabricación según modelo
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-[#FDC90D]" />
                  Personalización por proyecto
                </li>
                <li className="flex gap-2">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-[#FDC90D]" />
                  Despacho coordinado a todo Chile
                </li>
              </ul>
            </div>

            <div className="mt-6 flex gap-2">
              <Button
                asChild
                variant="outline"
                className="h-11 flex-1 rounded-xl border-black/10 bg-white/70 text-zinc-900 hover:bg-black hover:text-white hover:border-black transition-colors"
              >
                <Link href="/proyectos">Ver proyectos</Link>
              </Button>

              <Button
                asChild
                className="h-11 flex-1 rounded-xl bg-black text-white hover:bg-[#FDC90D] hover:text-black transition-colors"
              >
                <a
                  href="https://wa.me/56933882434"
                  target="_blank"
                  rel="noreferrer"
                >
                  Cotizar
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
