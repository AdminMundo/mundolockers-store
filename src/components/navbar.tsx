"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, User } from "lucide-react";

type NavUser = { email: string | null; isAdmin: boolean } | null;

export default function Navbar() {
  const [user, setUser] = useState<NavUser>(null);
  const accountHref = user ? (user.isAdmin ? "/admin" : "/mi-cuenta") : "/login";
  const accountLabel = user ? (user.isAdmin ? "Admin" : "Mi cuenta") : "Iniciar sesión";

  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 10;
      setScrolled((prev) => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Se resuelve en el cliente (no en el layout) para que las páginas de la
  // tienda puedan cachearse; se re-consulta en cada navegación para no
  // quedar desincronizado después de iniciar/cerrar sesión.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (!cancelled) setUser(data.user ?? null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

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
            scrolled ? "bg-zinc-950/90" : "bg-zinc-950/75",
            "after:pointer-events-none after:absolute after:inset-x-6 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/25 after:to-transparent after:opacity-40",
          ].join(" ")}
        >
          {/* Left: Logo */}
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
                group-hover:brightness-125
                group-hover:drop-shadow-[0_8px_24px_rgba(255,255,255,0.18)]
              "
            />
          </Link>

          {/* Desktop: Menu + Search */}
          <div className="hidden items-center gap-6 md:flex">
            <nav className="flex items-center gap-8 text-base md:text-lg text-white/80">
              <Link href="/" className="hover:text-white transition">
                Inicio
              </Link>
              <Link href="/tienda" className="hover:text-white transition">
                Tienda
              </Link>
              <Link href="/cotizar" className="hover:text-white transition">
                Cotizar
              </Link>
              <Link href="/carrito" className="hover:text-white transition">
                Carrito
              </Link>
              <Link
                href={accountHref}
                title={accountLabel}
                aria-label={accountLabel}
                className="flex items-center hover:text-white transition"
              >
                <User className="h-5 w-5" />
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

            <Link
              href="/cotizar"
              className="inline-flex h-10 items-center rounded-full bg-[#0477BF] px-4 text-sm font-semibold text-white shadow-[0_2px_10px_rgba(4,119,191,0.3)] transition-all hover:brightness-110"
            >
              Cotizar
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href="https://wa.me/56994131814?text=Hola!%20Quiero%20cotizar%20lockers."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#0477BF] px-5 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(4,119,191,0.35)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_4px_18px_rgba(4,119,191,0.45)] hover:scale-[1.03] active:scale-[0.98]"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.528 5.858L0 24l6.293-1.506A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.002-1.37l-.36-.214-3.733.893.942-3.641-.234-.374A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
              </svg>
              Cotizar
            </a>


          </div>

          {/* Mobile Search Panel */}
          {mobileSearchOpen && (
            <div className="absolute left-3 right-3 top-[calc(100%+10px)] rounded-2xl border border-white/10 bg-zinc-950/90 p-3 backdrop-blur-xl shadow-[0_12px_35px_rgba(0,0,0,0.35)] md:hidden">
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
                  className="h-11 flex-1 bg-[#0477BF] text-white hover:bg-[#0477BF]/85"
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

              <nav className="mt-3 flex items-center gap-1 border-t border-white/10 pt-3">
                {[
                  { label: "Inicio", href: "/" },
                  { label: "Tienda", href: "/tienda" },
                  { label: "Cotizar", href: "/cotizar" },
                  { label: "Carrito", href: "/carrito" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSearchOpen(false)}
                    className="flex-1 rounded-xl py-2 text-center text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white transition"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href={accountHref}
                  onClick={() => setMobileSearchOpen(false)}
                  title={accountLabel}
                  aria-label={accountLabel}
                  className="flex items-center justify-center rounded-xl py-2 px-3 text-white/70 hover:bg-white/10 hover:text-white transition"
                >
                  <User className="h-4 w-4" />
                </Link>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
