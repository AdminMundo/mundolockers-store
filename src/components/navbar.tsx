"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 10;
      setScrolled((prev) => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function goSearch() {
    const q = query.trim();
    if (!q) return;
    setMobileSearchOpen(false);
    router.push(`/tienda?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div
          className={[
            "relative flex items-center justify-between gap-3",
            "h-16 md:h-20",
            "rounded-2xl md:rounded-3xl",
            "border border-white/10",
            "backdrop-blur-xl",
            "shadow-[0_10px_30px_rgba(0,0,0,0.25)]",
            "px-4 md:px-6",
            "transition-all duration-300",
            scrolled ? "bg-zinc-950/40" : "bg-white/5",
            "after:pointer-events-none after:absolute after:inset-x-6 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/25 after:to-transparent after:opacity-40",
          ].join(" ")}
        >
          {/* Left: Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/brand/logonuevo.webp"
              alt="Mundo Lockers"
              width={260}
              height={60}
              priority
              sizes="(max-width: 768px) 160px, 260px"
              className="h-10 md:h-12 w-auto"
            />
          </Link>

          {/* Desktop: Menu + Search */}
          <div className="hidden items-center gap-6 md:flex">
            <nav className="flex items-center gap-8 text-base md:text-lg text-white/80">
              <Link href="/tienda" className="hover:text-white transition">
                Tienda
              </Link>
              <Link href="/cotizar" className="hover:text-white transition">
                Cotizar
              </Link>
              <Link href="/carrito" className="hover:text-white transition">
                Carrito
              </Link>
            </nav>

            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                goSearch();
              }}
              className="relative"
              aria-label="Búsqueda de productos"
            >
              <button
                type="submit"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white/55 hover:text-white/80"
                aria-label="Buscar"
              >
                <Search className="h-4 w-4" />
              </button>

              <Input
                type="search"
                inputMode="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar..."
                aria-label="Buscar productos"
                className="h-10 w-[240px] rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/45 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </form>
          </div>

          {/* Mobile: search icon + CTA */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              type="button"
              variant="outline"
              onClick={() => setMobileSearchOpen((v) => !v)}
              className="h-10 w-10 border-white/15 bg-white/5 p-0 text-white hover:bg-white/10"
              aria-label="Abrir búsqueda"
            >
              {mobileSearchOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>

            <Button
              asChild
              className="h-10 bg-yellow-400 px-4 text-base font-semibold text-black hover:bg-yellow-300"
            >
              <a
                href="https://wa.me/56933882434?text=Hola!%20Quiero%20cotizar%20lockers."
                target="_blank"
                rel="noopener noreferrer"
              >
                Cotizar
              </a>
            </Button>
          </div>

          {/* Desktop CTA (mantener) */}
          <Button
            asChild
            className="hidden md:inline-flex h-10 md:h-11 bg-yellow-400 px-5 md:px-6 text-base md:text-lg text-black hover:bg-yellow-300"
          >
            <a
              href="https://wa.me/56933882434?text=Hola!%20Quiero%20cotizar%20lockers."
              target="_blank"
              rel="noopener noreferrer"
            >
              Cotizar
            </a>
          </Button>

          {/* Mobile Search Panel */}
          {mobileSearchOpen && (
            <div className="absolute left-3 right-3 top-[calc(100%+10px)] rounded-2xl border border-white/10 bg-zinc-950/60 p-3 backdrop-blur-xl shadow-[0_12px_35px_rgba(0,0,0,0.35)] md:hidden">
              <div className="relative">
                <button
                  type="button"
                  onClick={goSearch}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white/55 hover:text-white/80"
                  aria-label="Buscar"
                >
                  <Search className="h-4 w-4" />
                </button>

                <Input
                  autoFocus
                  type="search"
                  inputMode="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") goSearch();
                  }}
                  placeholder="Buscar productos..."
                  aria-label="Buscar productos"
                  className="h-11 w-full rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/45 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  onClick={goSearch}
                  className="h-11 flex-1 bg-yellow-400 text-black hover:bg-yellow-300"
                >
                  Buscar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMobileSearchOpen(false)}
                  className="h-11 border-white/15 bg-white/5 text-white hover:bg-white/10"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
