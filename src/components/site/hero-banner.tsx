import type { ReactNode } from "react";
import Link from "next/link";

type Crumb = { label: string; href: string };

const CORNER_POSITIONS = [
  "left-4 top-4 border-l-2 border-t-2",
  "right-4 top-4 border-r-2 border-t-2",
  "left-4 bottom-4 border-l-2 border-b-2",
  "right-4 bottom-4 border-r-2 border-b-2",
];

/** Ícono de locker en línea, a modo de plano técnico (no una foto/render). */
function LockerGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 320"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect x="10" y="10" width="180" height="300" rx="14" stroke="currentColor" strokeWidth="3" />
      <line x1="10" y1="72" x2="190" y2="72" stroke="currentColor" strokeWidth="2" />
      <line x1="32" y1="30" x2="32" y2="56" stroke="currentColor" strokeWidth="2" />
      <line x1="58" y1="30" x2="58" y2="56" stroke="currentColor" strokeWidth="2" />
      <line x1="84" y1="30" x2="84" y2="56" stroke="currentColor" strokeWidth="2" />
      <rect x="150" y="150" width="16" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
      <line x1="10" y1="284" x2="190" y2="284" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function HeroBanner({
  eyebrow,
  title,
  description,
  breadcrumb,
  actions,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  breadcrumb?: Crumb[];
  actions?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-[#EEEDEB] pt-24 md:pt-28">
      {/* Fondo tipo plano técnico: grilla fina + esquineros, mismo lenguaje que las tarjetas de producto */}
      <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,rgba(4,119,191,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(4,119,191,0.07)_1px,transparent_1px)] [background-size:32px_32px]" />
      {CORNER_POSITIONS.map((pos) => (
        <span
          key={pos}
          className={`pointer-events-none absolute h-4 w-4 rounded-[2px] border-[#0477BF]/25 ${pos}`}
        />
      ))}

      {/* Locker en línea, grande y discreto, alineado a la derecha en desktop */}
      <LockerGlyph className="pointer-events-none absolute -right-6 top-1/2 hidden h-[420px] w-auto -translate-y-1/2 text-[#0477BF]/10 md:block lg:h-[480px]" />

      <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-8 md:flex md:min-h-105 md:flex-col md:justify-center md:py-16">
        <div className="md:max-w-sm">
          {breadcrumb ? (
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                {breadcrumb.map((c, i) => (
                  <li key={`${c.href}-${i}`} className="flex items-center gap-2">
                    <Link href={c.href} className="hover:text-zinc-900">
                      {c.label}
                    </Link>
                    {i < breadcrumb.length - 1 ? (
                      <span className="text-zinc-400">/</span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          {eyebrow ? (
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
              {eyebrow}
            </p>
          ) : null}

          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
            {title}
          </h1>

          {description ? (
            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-600 md:text-base">
              {description}
            </p>
          ) : null}

          {actions ? <div className="mt-7 flex flex-wrap gap-4">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}
