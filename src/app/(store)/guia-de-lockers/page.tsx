import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Package, Smartphone, School, Mountain, Warehouse, KeyRound, Layers, Wind, Ruler, Truck, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Guía de Lockers en Chile: Tipos, Precios y Cómo Elegir",
  description:
    "Guía completa de lockers en Chile: tipos según el uso (industria, colegios, minería, celulares), materiales, qué revisar antes de comprar y rango de precios. Fabricante nacional, despacho a todo Chile.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/guia-de-lockers" },
  openGraph: {
    title: "Guía de Lockers en Chile | LockerStore",
    description:
      "Tipos de lockers según el uso, materiales, qué revisar antes de comprar y precios en Chile.",
    url: "/guia-de-lockers",
    type: "article",
    images: [{ url: "/images/home/Encabezadoprincipal.webp", width: 1200, height: 630, alt: "Lockers metálicos LockerStore" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guía de Lockers en Chile | LockerStore",
    description: "Tipos de lockers según el uso, materiales, qué revisar antes de comprar y precios en Chile.",
    images: ["/images/home/Encabezadoprincipal.webp"],
  },
};

const LOCKER_TYPES = [
  {
    icon: Package,
    title: "Lockers metálicos",
    desc: "La opción más versátil, en configuraciones de 1 a 20 puertas. Para vestidores, empresas e instituciones.",
    price: "$48.000 – $200.000",
    href: "/tienda/lockers-metalicos",
  },
  {
    icon: Smartphone,
    title: "Lockers para celulares",
    desc: "Compartimientos individuales para colegios, oficinas y espacios de trabajo colaborativo.",
    price: "Desde $190.000",
    href: "/tienda/lockers-phone",
  },
  {
    icon: School,
    title: "Lockers kids",
    desc: "Módulos más bajos y livianos, pensados para que niños y niñas los usen de forma autónoma.",
    price: "$125.990 – $289.989",
    href: "/tienda/lockers-kids",
  },
  {
    icon: Mountain,
    title: "Lockers mineros",
    desc: "Estructura reforzada y mejor ventilación para EPP y ropa de trabajo en condiciones exigentes.",
    price: "$249.990 – $389.990",
    href: "/tienda/lockers-mineros",
  },
];

const CHECKLIST = [
  {
    icon: Layers,
    title: "Capacidad",
    desc: "Cuántas puertas y cuerpos necesitas — desde 1 puerta individual hasta 20 puertas para proyectos grandes.",
  },
  {
    icon: KeyRound,
    title: "Tipo de cerradura",
    desc: "Portacandado (el usuario pone su propio candado) o chapa con llave incluida, según sea uso fijo o rotativo.",
  },
  {
    icon: Wind,
    title: "Ventilación",
    desc: "Las puertas con celosía evitan la humedad y malos olores — importante para ropa y calzado.",
  },
  {
    icon: Ruler,
    title: "Espesor del acero",
    desc: "A mayor exigencia de uso (industria, minería) conviene un calibre más grueso que en uso liviano de oficina.",
  },
  {
    icon: Truck,
    title: "Despacho e instalación",
    desc: "Confirma si el proveedor despacha a tu región y si la instalación queda incluida o es aparte.",
  },
];

const COMPLEMENTS = [
  { title: "Bancas metálicas", desc: "Para camarines, gimnasios y vestidores.", href: "/tienda/bancas" },
  { title: "Kardex y cajoneras", desc: "Para archivar documentos y herramientas.", href: "/tienda/kardex-y-cajoneras" },
  { title: "Estanterías mecano", desc: "Para bodegas y almacenaje industrial.", href: "/tienda/estantes-mecano" },
  { title: "Storages y roperillos", desc: "Para guardar ropa y equipos en espacios reducidos.", href: "/tienda/storages-roperillos" },
];

export default function GuiaDeLockersPage() {
  return (
    <main className="min-h-screen bg-[#EEEDEB]">
      {/* Hero — mismo tratamiento que /nosotros y /contacto */}
      <section className="relative overflow-hidden bg-[#0F172A] pt-28 pb-16">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,rgba(4,119,191,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(4,119,191,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-[#0477BF]/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <span className="inline-flex rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            Guía
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Guía de Lockers: tipos, materiales y cómo elegir
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
            Todo lo que hay que saber antes de comprar lockers en Chile — para gimnasios,
            colegios, empresas, minería o proyectos institucionales.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
        <div className="-mt-6 rounded-[32px] border border-black/10 bg-white shadow-sm overflow-hidden">
          {/* ¿Qué es un locker? */}
          <div className="px-8 py-10 md:px-12">
            <h2 className="text-2xl font-semibold text-zinc-900">¿Qué es un locker y para qué sirve?</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">
              Un locker es un módulo con uno o más compartimientos individuales, cerrados con
              llave o candado, pensado para guardar pertenencias de forma segura en espacios
              compartidos: vestidores, colegios, oficinas, faenas mineras o industrias. En Chile
              se usan sobre todo en gimnasios, colegios, empresas e instalaciones industriales
              que necesitan resguardar objetos personales de varias personas en un mismo lugar.
            </p>
          </div>

          {/* Tipos de lockers — grid con las 4 categorías reales */}
          <div className="border-t border-black/8 bg-zinc-50 px-8 py-10 md:px-12">
            <h2 className="text-xl font-semibold text-zinc-900">Tipos de lockers según el uso</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              La elección correcta depende del espacio, del objeto a guardar y de las condiciones de uso.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {LOCKER_TYPES.map((t) => (
                <Link
                  key={t.title}
                  href={t.href}
                  className="group flex gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-[#0477BF] hover:shadow-[0_10px_25px_rgba(4,119,191,0.12)]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0477BF]/10 text-[#0477BF]">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-zinc-900">{t.title}</h3>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-[#0477BF]" />
                    </div>
                    <p className="mt-1 text-sm leading-6 text-zinc-500">{t.desc}</p>
                    <p className="mt-2 text-xs font-medium text-[#0477BF]">{t.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Materiales */}
          <div className="border-t border-black/8 px-8 py-10 md:px-12">
            <h2 className="text-xl font-semibold text-zinc-900">
              Materiales: por qué la mayoría de los lockers son metálicos
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">
              El acero es el material más usado para fabricar lockers porque resiste mejor la
              humedad, el uso intensivo y el paso del tiempo que otros materiales — algo clave en
              vestidores, gimnasios o faenas industriales. En LockerStore fabricamos en acero SAE
              1010, con pintura electrostática en polvo (previo decapado y fosfatado) para mayor
              resistencia a la corrosión. Es también el material que permite personalizar cada
              proyecto con numeración, señalética y colores corporativos sin perder resistencia
              estructural.
            </p>
          </div>

          {/* Checklist antes de comprar */}
          <div className="border-t border-black/8 bg-zinc-50 px-8 py-10 md:px-12">
            <h2 className="text-xl font-semibold text-zinc-900">Qué revisar antes de comprar un locker</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {CHECKLIST.map((c) => (
                <div key={c.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100">
                    <c.icon className="h-5 w-5 text-zinc-700" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">{c.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-zinc-500">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Precios */}
          <div className="border-t border-black/8 px-8 py-10 md:px-12">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-[#0477BF]" />
              <h2 className="text-xl font-semibold text-zinc-900">Precio de los lockers en Chile</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              El precio varía principalmente según la cantidad de puertas/compartimientos y el
              uso al que está destinado. Rangos referenciales de nuestro catálogo actual:
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {LOCKER_TYPES.map((t) => (
                <div key={t.title} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-center">
                  <div className="text-xs font-medium text-zinc-500">{t.title}</div>
                  <div className="mt-1 text-sm font-semibold text-zinc-900">{t.price}</div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-zinc-600">
              Para proyectos institucionales o compras por volumen, los precios pueden variar —
              puedes{" "}
              <Link href="/cotizar" className="font-medium text-zinc-900 underline underline-offset-2">
                solicitar una cotización
              </Link>{" "}
              con tus cantidades exactas.
            </p>
          </div>

          {/* Complementos */}
          <div className="border-t border-black/8 bg-zinc-50 px-8 py-10 md:px-12">
            <div className="flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-[#0477BF]" />
              <h2 className="text-xl font-semibold text-zinc-900">Complementa tu proyecto</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Junto a los lockers, estos productos se compran habitualmente para completar
              vestidores, oficinas y bodegas.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {COMPLEMENTS.map((c) => (
                <Link
                  key={c.title}
                  href={c.href}
                  className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 transition hover:border-[#0477BF]"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{c.title}</p>
                    <p className="text-xs text-zinc-500">{c.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-[#0477BF]" />
                </Link>
              ))}
            </div>
          </div>

          {/* CTA final */}
          <div className="rounded-b-[32px] border-t border-black/8 bg-white px-8 py-6 md:px-12">
            <p className="text-sm font-medium text-zinc-800">¿Tienes un proyecto en mente?</p>
            <p className="mt-1 text-sm text-zinc-500">Escríbenos y te asesoramos sin costo.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button asChild className="h-9 rounded-xl bg-black text-white transition-colors duration-200 hover:bg-[#0477BF] hover:text-white">
                <Link href="/cotizar">
                  Cotizar ahora <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-9 rounded-xl border border-[#0477BF]/40 bg-white text-zinc-900 transition-colors duration-200 hover:border-[#0477BF] hover:shadow-[0_0_0_3px_rgba(4,119,191,0.15)]">
                <Link href="/tienda">Ver tienda</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
