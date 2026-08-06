import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "56994131814";
const WHATSAPP_TEXT = encodeURIComponent(
  "Hola LockerStore, necesito cotizar. ¿Me ayudas?",
);

export default function Footer() {
  return (
    <footer className="bg-[#EEEDEB]">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-14">
        <div
          className={[
            "relative overflow-hidden rounded-3xl",
            "bg-gradient-to-b from-[#0477BF] to-[#04527f] text-white",
            "shadow-[0_20px_50px_rgba(4,119,191,0.25)]",
            "p-7 md:p-10",
          ].join(" ")}
        >
          {/* Círculos decorativos */}
          <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute right-[-8rem] top-1/4 h-[26rem] w-[26rem] rounded-full bg-[#03395c]/50 blur-3xl" />
          <div className="pointer-events-none absolute left-1/3 bottom-[-6rem] h-72 w-72 rounded-full bg-white/5 blur-3xl" />

          <div className="relative">
            <div className="grid gap-10 md:grid-cols-4">
              {/* Brand */}
              <div className="md:col-span-1">
                <Link href="/" className="group flex items-center shrink-0">
                  <Image
                    src="/brand/logometalico2.webp"
                    alt="LockerStore"
                    width={320}
                    height={90}
                    priority
                    sizes="(max-width: 768px) 180px, 320px"
                    className="
                      logo-float
                      h-10 md:h-9 w-auto
                      opacity-95 brightness-110 contrast-125
                      drop-shadow-[0_4px_18px_rgba(0,0,0,0.28)]
                      transition-all duration-500 ease-out
                      group-hover:scale-[1.04]
                      group-hover:drop-shadow-[0_8px_24px_rgba(255,255,255,0.28)]
                    "
                  />
                </Link>

                <p className="mt-3 text-sm text-white/70">
                  Lockers metálicos y plásticos para industria, colegios y
                  proyectos institucionales.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    asChild
                    className="h-10 rounded-xl bg-white text-[#04527f] px-5 text-sm font-medium transition-colors duration-200 hover:bg-white/90"
                  >
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Cotizar WhatsApp <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="h-10 rounded-xl border border-white/30 bg-transparent text-white transition-colors duration-200 hover:border-white hover:bg-white/10"
                  >
                    <Link href="/tienda">Ver tienda</Link>
                  </Button>
                </div>
              </div>

              {/* Tienda */}
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-white">Tienda</h3>
                <ul className="mt-4 space-y-3 text-sm text-white/70">
                  <li>
                    <Link
                      className="transition-colors hover:text-white"
                      href="/tienda/lockers-metalicos"
                    >
                      Lockers Metálicos
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition-colors hover:text-white"
                      href="/tienda/lockers-kids"
                    >
                      Lockers Kids
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition-colors hover:text-white"
                      href="/tienda/bancas"
                    >
                      Bancas
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition-colors hover:text-white"
                      href="/tienda/lockers-mineros"
                    >
                      Lockers Mineros
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition-colors hover:text-white"
                      href="/tienda/lockers-phone"
                    >
                      Lockers Para Telefonos
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition-colors hover:text-white"
                      href="/tienda/kardex-y-cajoneras"
                    >
                      Kardex &amp; Cajoneras
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Ayuda */}
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-white">Ayuda</h3>
                <ul className="mt-4 space-y-3 text-sm text-white/70">
                  <li>
                    <Link className="transition-colors hover:text-white" href="/nosotros">
                      Quiénes somos
                    </Link>
                  </li>
                  <li>
                    <Link className="transition-colors hover:text-white" href="/contacto">
                      Contacto
                    </Link>
                  </li>
                  <li>
                    <Link className="transition-colors hover:text-white" href="/despacho">
                      Despacho e instalación
                    </Link>
                  </li>
                  <li>
                    <Link className="transition-colors hover:text-white" href="/garantia">
                      Garantía
                    </Link>
                  </li>
                  <li>
                    <Link className="transition-colors hover:text-white" href="/medios-de-pago">
                      Medios de pago
                    </Link>
                  </li>
                  <li>
                    <Link className="transition-colors hover:text-white" href="/#faq">
                      Preguntas frecuentes
                    </Link>
                  </li>
                  <li>
                    <Link className="transition-colors hover:text-white" href="/cotizar">
                      Cotizar
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contacto */}
              <div>
                <h3 className="text-sm font-semibold tracking-tight text-white">Contacto</h3>

                <ul className="mt-4 space-y-4 text-sm text-white/70">
                  <li className="flex gap-3">
                    <Mail className="mt-0.5 h-4 w-4 text-white/50" />
                    <a
                      className="transition-colors hover:text-white"
                      href="mailto:lockerstore2@gmail.com"
                    >
                      lockerstore2@gmail.com
                    </a>
                  </li>

                  <li className="flex gap-3">
                    <MessageCircle className="mt-0.5 h-4 w-4 text-white/50" />
                    <a
                      className="transition-colors hover:text-white"
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      +56 9 94131814
                    </a>
                  </li>
                </ul>

                <div className="mt-5 text-xs text-white/50">
                  Dominio: <span className="text-white/80">lockersstore.cl</span>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
              <p>
                © {new Date().getFullYear()} LockerStore. Todos los derechos
                reservados.
              </p>

              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <Link className="transition-colors hover:text-white" href="/politicas/privacidad">
                  Privacidad
                </Link>
                <Link className="transition-colors hover:text-white" href="/politicas/terminos">
                  Términos
                </Link>
                <Link
                  className="transition-colors hover:text-white"
                  href="/politicas/cambios-y-devoluciones"
                >
                  Cambios y devoluciones
                </Link>
                <Link className="transition-colors hover:text-white" href="/login">
                  Administrador
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
