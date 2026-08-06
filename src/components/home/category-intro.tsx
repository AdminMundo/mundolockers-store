import Link from "next/link";
import {
  Package,
  Users,
  HardHat,
  Smartphone,
  Sofa,
  Warehouse,
  Archive,
  Shirt,
  ArrowRight,
} from "lucide-react";

// Slugs deben coincidir con la tabla `categories` en Supabase — si se
// renombra o agrega una categoría ahí, actualizar esta lista también.
const ITEMS = [
  {
    icon: Package,
    name: "Lockers Metálicos",
    slug: "lockers-metalicos",
    desc: "Para industria, oficinas e instituciones.",
  },
  {
    icon: Users,
    name: "Lockers Kids",
    slug: "lockers-kids",
    desc: "Para colegios y jardines infantiles.",
  },
  {
    icon: HardHat,
    name: "Lockers Mineros",
    slug: "lockers-mineros",
    desc: "Reforzados para faenas de alta exigencia.",
  },
  {
    icon: Smartphone,
    name: "Lockers para Celulares",
    slug: "lockers-phone",
    desc: "Para colegios y espacios de trabajo colaborativo.",
  },
  {
    icon: Sofa,
    name: "Bancas",
    slug: "bancas",
    desc: "Para camarines y vestidores.",
  },
  {
    icon: Warehouse,
    name: "Estanterías Mecano",
    slug: "estantes-mecano",
    desc: "Sistema modular para bodegas.",
  },
  {
    icon: Archive,
    name: "Kardex y Cajoneras",
    slug: "kardex-y-cajoneras",
    desc: "Para archivo y oficina.",
  },
  {
    icon: Shirt,
    name: "Storages y Roperillos",
    slug: "storages-roperillos",
    desc: "Para guardar ropa, herramientas y equipos.",
  },
];

export default function CategoryIntroSection() {
  return (
    <section className="bg-[#EEEDEB] text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">
            Lockers y almacenamiento para cada necesidad
          </h2>
          <p className="mt-2 text-sm text-zinc-600 md:text-base">
            Fabricación en acero resistente, con despacho a todo Chile y
            opciones de personalización por proyecto.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <Link
              key={item.slug}
              href={`/tienda/${item.slug}`}
              className={[
                "group flex flex-col justify-between gap-4 rounded-3xl border border-black/10",
                "bg-white/70 p-5 backdrop-blur-xl",
                "shadow-[0_18px_45px_rgba(0,0,0,0.06)] transition-all duration-300",
                "hover:-translate-y-0.5 hover:border-[#0477BF] hover:shadow-[0_28px_80px_rgba(4,119,191,0.18)]",
              ].join(" ")}
            >
              <div>
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-black/5 transition-colors group-hover:bg-[#0477BF]/10">
                  <item.icon className="h-5 w-5 text-zinc-900 transition-colors group-hover:text-[#0477BF]" />
                </div>
                <h3 className="mt-4 text-base font-semibold leading-tight">
                  {item.name}
                </h3>
                <p className="mt-1.5 text-sm text-zinc-600">{item.desc}</p>
              </div>

              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#0477BF]">
                Ver productos
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
