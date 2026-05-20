import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Truck, Wrench, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Quiénes Somos",
  description:
    "Conoce a LockerStore: empresa chilena fabricante de lockers metálicos y plásticos para industria, colegios, minería y proyectos institucionales.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/nosotros" },
  openGraph: {
    title: "Quiénes Somos | LockerStore",
    description:
      "Conoce a LockerStore: empresa chilena fabricante de lockers metálicos y plásticos para industria, colegios, minería y proyectos institucionales.",
    url: "/nosotros",
    type: "website",
    images: [{ url: "/images/home/Encabezadoprincipal.webp", width: 1200, height: 630, alt: "Lockers LockerStore fabricación nacional" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiénes Somos | LockerStore",
    description:
      "Empresa chilena con +15 años fabricando lockers metálicos y plásticos para industria, colegios y minería.",
    images: ["/images/home/Encabezadoprincipal.webp"],
  },
};

const VALUES = [
  {
    icon: Shield,
    title: "Calidad garantizada",
    desc: "Fabricamos con acero de alta resistencia y procesos de pintura electroestática que aseguran durabilidad en entornos exigentes.",
  },
  {
    icon: Wrench,
    title: "Fabricación nacional",
    desc: "Producimos en Chile, lo que nos permite controlar cada etapa del proceso y responder rápido a requerimientos específicos.",
  },
  {
    icon: Truck,
    title: "Despacho a todo Chile",
    desc: "Coordinamos entregas desde Arica hasta Punta Arenas, con instalación disponible en la Región Metropolitana.",
  },
  {
    icon: Users,
    title: "Atención personalizada",
    desc: "Cada proyecto es único. Trabajamos contigo para encontrar la solución correcta, sea un locker o cientos de módulos.",
  },
];

const STATS = [
  { value: "+5.000", label: "Lockers instalados" },
  { value: "+500", label: "Clientes satisfechos" },
  { value: "15+", label: "Años de experiencia" },
  { value: "Todo Chile", label: "Cobertura de despacho" },
];

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      {/* Hero */}
      <section className="bg-[#0F172A] pt-28 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <span className="inline-flex rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            Empresa
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Quiénes somos
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
            Somos LockerStore, una empresa chilena especializada en la fabricación y
            comercialización de lockers metálicos y plásticos para industria, colegios,
            minería y proyectos institucionales en todo el país.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
        {/* Card principal */}
        <div className="-mt-6 rounded-[32px] border border-black/10 bg-white shadow-sm overflow-hidden">

          {/* Historia */}
          <div className="px-8 py-10 md:px-12">
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-2xl font-semibold text-zinc-900">
                  Nuestra historia
                </h2>
                <p className="mt-4 text-sm leading-7 text-zinc-600">
                  Nacimos con el objetivo de ofrecer soluciones de almacenamiento y
                  organización de alta calidad fabricadas en Chile. Con más de 15 años
                  en el mercado, hemos equipado colegios, industrias, empresas mineras
                  y organismos públicos a lo largo de todo el país.
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-600">
                  Nuestra planta de fabricación en Quinta Normal, Santiago, nos permite
                  controlar cada detalle del proceso productivo: desde el corte del
                  acero hasta el acabado final, asegurando productos resistentes,
                  seguros y adaptados a las necesidades del mercado chileno.
                </p>
              </div>
              <div className="relative h-52 md:h-64 rounded-2xl overflow-hidden bg-zinc-100">
                <Image
                  src="/images/home/Encabezadoprincipal.webp"
                  alt="Lockers LockerStore fabricación nacional"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="border-t border-black/8 bg-zinc-50 px-8 py-8 md:px-12">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-bold text-zinc-900">{s.value}</div>
                  <div className="mt-1 text-xs text-zinc-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Valores */}
          <div className="border-t border-black/8 px-8 py-10 md:px-12">
            <h2 className="text-xl font-semibold text-zinc-900">
              Por qué elegirnos
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {VALUES.map((v) => (
                <div key={v.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100">
                    <v.icon className="h-5 w-5 text-zinc-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">{v.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-zinc-500">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Misión */}
          <div className="border-t border-black/8 bg-zinc-50 px-8 py-8 md:px-12">
            <h2 className="text-xl font-semibold text-zinc-900">Nuestra misión</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600">
              Proveer soluciones de almacenamiento y organización de excelencia,
              fabricadas en Chile, que superen las expectativas de nuestros clientes
              en términos de calidad, durabilidad y servicio. Creemos en el producto
              nacional y en construir relaciones de largo plazo con cada cliente.
            </p>
          </div>

          {/* CTA */}
          <div className="rounded-b-[32px] border-t border-black/8 bg-white px-8 py-6 md:px-12">
            <p className="text-sm font-medium text-zinc-800">
              ¿Tienes un proyecto en mente?
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Escríbenos y te asesoramos sin costo.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button asChild className="h-9 rounded-xl bg-black text-white transition-colors duration-200 hover:bg-[#E18147] hover:text-white">
                <Link href="/cotizar">
                  Cotizar ahora <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-9 rounded-xl border border-[#E18147]/40 bg-white text-zinc-900 transition-colors duration-200 hover:border-[#E18147] hover:shadow-[0_0_0_3px_rgba(225,129,71,0.15)]">
                <Link href="/contacto">Contacto</Link>
              </Button>
              <Button asChild variant="outline" className="h-9 rounded-xl border border-[#E18147]/40 bg-white text-zinc-900 transition-colors duration-200 hover:border-[#E18147] hover:shadow-[0_0_0_3px_rgba(225,129,71,0.15)]">
                <Link href="/tienda">Ver tienda</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
