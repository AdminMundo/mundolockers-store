import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import LockerConfigurator from "./_components/LockerConfigurator";

export const metadata: Metadata = {
  title: "Arma tu Locker: Configurador Visual",
  description:
    "Elige puertas, cuerpos, color, base y tipo de cerradura para visualizar tu locker ideal, y cotízalo por WhatsApp con el detalle de lo que armaste.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/arma-tu-locker" },
  openGraph: {
    title: "Arma tu Locker: Configurador Visual | LockerStore",
    description:
      "Elige puertas, color, base y cerradura para visualizar tu locker ideal y cotízalo por WhatsApp.",
    url: "/arma-tu-locker",
    type: "website",
    images: [
      { url: "/images/home/Encabezadoprincipal.webp", width: 1200, height: 630, alt: "Lockers metálicos LockerStore" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arma tu Locker: Configurador Visual | LockerStore",
    description: "Elige puertas, color, base y cerradura para visualizar tu locker ideal.",
    images: ["/images/home/Encabezadoprincipal.webp"],
  },
};

export default function ArmaTuLockerPage() {
  return (
    <main className="min-h-screen bg-[#EEEDEB]">
      <section className="relative overflow-hidden bg-[#0F172A] pt-28 pb-16">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,rgba(4,119,191,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(4,119,191,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-[#0477BF]/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <span className="inline-flex rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            Configurador
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Arma tu locker a tu manera
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
            Elige puertas, cuerpos, color, base y tipo de cerradura, y mira cómo
            queda tu locker antes de cotizarlo. Diseño referencial para que
            juegues con las combinaciones — el detalle exacto se confirma al
            cotizar.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="-mt-6 rounded-[32px] border border-black/10 bg-white p-6 shadow-sm sm:p-8 md:p-10">
          <LockerConfigurator />
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/tienda/lockers-metalicos"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0477BF] hover:underline"
          >
            O mira los modelos listos para comprar
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
