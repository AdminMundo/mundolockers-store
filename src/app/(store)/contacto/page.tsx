import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos por WhatsApp, correo o visítanos en nuestra bodega en Quinta Normal, Santiago. Atención personalizada para proyectos y cotizaciones.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/contacto" },
  openGraph: {
    title: "Contacto | LockerStore",
    description:
      "Contáctanos por WhatsApp, correo o visítanos en nuestra bodega en Quinta Normal, Santiago. Atención personalizada para proyectos y cotizaciones.",
    url: "/contacto",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contacto | LockerStore",
    description:
      "Contáctanos por WhatsApp o visítanos en Quinta Normal, Santiago. Atención personalizada para proyectos y cotizaciones.",
  },
};

const WHATSAPP = "56936289818";
const WHATSAPP_TEXT = encodeURIComponent("Hola LockerStore, necesito cotizar. ¿Me ayudas?");
const EMAIL = "ventas@lockersstore.cl";

const CHANNELS = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "+56 9 3628 9818",
    desc: "Respuesta rápida para cotizaciones y consultas.",
    href: `https://wa.me/${WHATSAPP}?text=${WHATSAPP_TEXT}`,
    cta: "Escribir por WhatsApp",
    external: true,
  },
  {
    icon: Mail,
    title: "Correo electrónico",
    value: EMAIL,
    desc: "Para proyectos, licitaciones y documentación formal.",
    href: `mailto:${EMAIL}`,
    cta: "Enviar correo",
    external: false,
  },
  {
    icon: MapPin,
    title: "Bodega / Retiro",
    value: "Quinta Normal, Santiago",
    desc: "Retiro de productos sin costo, coordinando previamente con nuestro equipo.",
    href: `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hola, quiero coordinar el retiro de mi pedido.")}`,
    cta: "Coordinar retiro",
    external: true,
  },
];

// LocalBusiness ya se publica sitewide desde el layout raíz (src/app/layout.tsx).

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-[#EEEDEB]">
      {/* Hero */}
      <section className="bg-[#0F172A] pt-28 pb-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <span className="inline-flex rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            Contacto
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Hablemos
          </h1>
          <p className="mt-4 text-base leading-7 text-white/60">
            Estamos disponibles para asesorarte en tu proyecto, resolver dudas sobre
            productos y coordinar despacho o instalación.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <div className="-mt-6 rounded-[32px] border border-black/10 bg-white shadow-sm overflow-hidden">

          {/* Canales de contacto */}
          <div className="divide-y divide-black/8">
            {CHANNELS.map((ch) => (
              <div key={ch.title} className="flex gap-5 px-8 py-8">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-100">
                  <ch.icon className="h-5 w-5 text-zinc-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-semibold text-zinc-900">{ch.title}</h2>
                  <p className="mt-0.5 text-sm font-medium text-zinc-700">{ch.value}</p>
                  <p className="mt-1 text-sm text-zinc-500">{ch.desc}</p>
                  <a
                    href={ch.href}
                    target={ch.external ? "_blank" : undefined}
                    rel={ch.external ? "noopener noreferrer" : undefined}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-600"
                  >
                    {ch.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Horario */}
          <div className="border-t border-black/8 bg-zinc-50 px-8 py-8">
            <div className="flex gap-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-100">
                <Clock className="h-5 w-5 text-zinc-700" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-zinc-900">Horario de atención</h2>
                <ul className="mt-2 space-y-1 text-sm text-zinc-600">
                  <li><span className="font-medium text-zinc-800">Lunes a Viernes:</span> 8:30 – 17:30</li>
                  <li><span className="font-medium text-zinc-800">Sábado:</span> Cerrado</li>
                  <li><span className="font-medium text-zinc-800">Domingo:</span> Cerrado</li>
                </ul>
                <p className="mt-2 text-xs text-zinc-400">
                  Mensajes fuera de horario son respondidos el próximo día hábil.
                </p>
              </div>
            </div>
          </div>

          {/* Para proyectos */}
          <div className="border-t border-black/8 px-8 py-8">
            <h2 className="text-sm font-semibold text-zinc-900">Proyectos y licitaciones</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Para proyectos institucionales, colegios, industrias y licitaciones públicas
              ofrecemos condiciones especiales de precio, despacho, instalación y facturación.
              Escríbenos con el detalle de tu proyecto y te preparamos una propuesta.
            </p>
          </div>

          {/* CTA */}
          <div className="rounded-b-[32px] border-t border-black/8 bg-white px-8 py-6">
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="h-9 rounded-xl bg-black text-white transition-colors duration-200 hover:bg-[#0477BF] hover:text-white"
              >
                <a
                  href={`https://wa.me/${WHATSAPP}?text=${WHATSAPP_TEXT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-9 rounded-xl border border-[#0477BF]/40 bg-white text-zinc-900 transition-colors duration-200 hover:border-[#0477BF] hover:shadow-[0_0_0_3px_rgba(4,119,191,0.15)]"
              >
                <Link href="/cotizar">Formulario de cotización</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-9 rounded-xl border border-[#0477BF]/40 bg-white text-zinc-900 transition-colors duration-200 hover:border-[#0477BF] hover:shadow-[0_0_0_3px_rgba(4,119,191,0.15)]"
              >
                <Link href="/tienda">Ver tienda</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
