import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "56933882434";
const WHATSAPP_TEXT = encodeURIComponent(
  "Hola Mundo Lockers, necesito cotizar. ¿Me ayudas?"
);

export default function Footer() {
  return (
    <footer className="bg-[#F5F5F7] text-zinc-900">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-14">
        <div
          className={[
            "rounded-3xl border border-black/10",
            "bg-white/60 backdrop-blur-2xl",
            "shadow-[0_18px_45px_rgba(0,0,0,0.10)]",
            "p-7 md:p-10",
          ].join(" ")}
        >
          <div className="grid gap-10 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link href="/" className="inline-flex items-center gap-3">
                <Image
                  src="/brand/logobueno.png"
                  alt="Mundo Lockers"
                  width={140}
                  height={32}
                  priority={false}
                />
              </Link>

              <p className="mt-3 text-sm text-zinc-600">
                Lockers metálicos y plásticos para industria, colegios y
                proyectos institucionales.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  asChild
                  className="h-10 rounded-xl bg-black text-white hover:bg-[#FDC90D] hover:text-black"
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
                  className="h-10 rounded-xl border-black/10 bg-white/60 text-zinc-900 hover:bg-white"
                >
                  <Link href="/tienda">Ver tienda</Link>
                </Button>
              </div>
            </div>

            {/* Tienda */}
            <div>
              <h3 className="text-sm font-semibold tracking-tight">Tienda</h3>
              <ul className="mt-4 space-y-3 text-sm text-zinc-700">
                <li>
                  <Link className="hover:text-black" href="/tienda?cat=lockers-metalicos">
                    Lockers Metálicos
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-black" href="/tienda?cat=lockers-kids">
                    Lockers Kids
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-black" href="/tienda?cat=lockers-escolares">
                    Lockers Escolares
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-black" href="/tienda?cat=lockers-mineros">
                    Lockers Mineros
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-black" href="/tienda?cat=kardex-cajoneras">
                    Kardex &amp; Cajoneras
                  </Link>
                </li>
              </ul>
            </div>

            {/* Ayuda */}
            <div>
              <h3 className="text-sm font-semibold tracking-tight">Ayuda</h3>
              <ul className="mt-4 space-y-3 text-sm text-zinc-700">
                <li>
                  <Link className="hover:text-black" href="/despacho">
                    Despacho e instalación
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-black" href="/garantia">
                    Garantía
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-black" href="/medios-de-pago">
                    Medios de pago
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-black" href="/faq">
                    Preguntas frecuentes
                  </Link>
                </li>
                <li>
                  <Link className="hover:text-black" href="/cotizar">
                    Cotizar
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="text-sm font-semibold tracking-tight">Contacto</h3>

              <ul className="mt-4 space-y-4 text-sm text-zinc-700">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-zinc-500" />
                  <span>
                    Comandante Chacón #5720, Quinta Normal – Santiago.
                  </span>
                </li>

                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-zinc-500" />
                  <a className="hover:text-black" href="mailto:ventas@mundolockers.cl">
                    ventas@mundolockers.cl
                  </a>
                </li>

                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-zinc-500" />
                  <div className="space-y-1">
                    <a className="block hover:text-black" href="tel:+56224354519">
                      +56 2 243 54 519
                    </a>
                    <a className="block hover:text-black" href="tel:+56224354518">
                      +56 2 243 54 518
                    </a>
                  </div>
                </li>

                <li className="flex gap-3">
                  <MessageCircle className="mt-0.5 h-4 w-4 text-zinc-500" />
                  <a
                    className="hover:text-black"
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +56 9 3388 2434
                  </a>
                </li>
              </ul>

              <div className="mt-5 text-xs text-zinc-500">
                Dominio: <span className="text-zinc-700">mundolockers.com</span>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-col gap-3 border-t border-black/10 pt-6 text-xs text-zinc-500 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} Mundo Lockers. Todos los derechos reservados.</p>

            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <Link className="hover:text-black" href="/politicas/privacidad">
                Privacidad
              </Link>
              <Link className="hover:text-black" href="/politicas/terminos">
                Términos
              </Link>
              <Link className="hover:text-black" href="/politicas/cambios-y-devoluciones">
                Cambios y devoluciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
