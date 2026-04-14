import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center px-4 text-center">
      {/* Logo */}
      <Link href="/" className="mb-10 inline-block">
        <Image
          src="/brand/logometalico2.webp"
          alt="LockerStore"
          width={200}
          height={56}
          priority
          className="h-10 w-auto opacity-90 brightness-110 contrast-125 drop-shadow-[0_4px_18px_rgba(0,0,0,0.28)]"
        />
      </Link>

      {/* Error code */}
      <p className="text-8xl font-bold text-white/10 select-none leading-none">404</p>

      {/* Message */}
      <h1 className="mt-4 text-2xl font-semibold text-white">
        Página no encontrada
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-6 text-white/50">
        La página que buscas no existe o fue movida. Puedes seguir navegando
        desde el inicio o buscar directamente en la tienda.
      </p>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button
          asChild
          className="h-10 rounded-xl bg-[#E18147] text-white font-semibold hover:brightness-110 shadow-[0_2px_12px_rgba(225,129,71,0.35)]"
        >
          <Link href="/tienda">
            Ver tienda <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-10 rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10"
        >
          <Link href="/">Volver al inicio</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-10 rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10"
        >
          <Link href="/cotizar">
            <Search className="mr-2 h-4 w-4" />
            Cotizar
          </Link>
        </Button>
      </div>

      {/* Footer hint */}
      <p className="mt-12 text-xs text-white/25">
        ¿Necesitas ayuda?{" "}
        <a
          href="https://wa.me/56994131814"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-white/50"
        >
          Escríbenos por WhatsApp
        </a>
      </p>
    </div>
  );
}
