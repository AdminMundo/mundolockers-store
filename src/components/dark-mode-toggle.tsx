"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const VARIANT_BUTTON = {
  // Para fondos claros (secciones de la home).
  light: "border border-black/10 bg-white/70 hover:border-[#0477BF]/50 dark:border-white/10 dark:bg-white/5 dark:hover:border-[#0477BF]/50",
  // Para el navbar, que es un panel vidrio-oscuro siempre (no cambia con el tema).
  onDark: "border border-white/15 bg-white/5 hover:border-[#0477BF]/60 hover:bg-white/10",
} as const;

const VARIANT_ICON = {
  light: "text-zinc-700 group-hover:text-[#0477BF] dark:text-zinc-300",
  onDark: "text-white/80 group-hover:text-white",
} as const;

export default function DarkModeToggle({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "onDark";
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita mismatch de hidratación: el tema real solo se conoce en el cliente.
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Modo claro" : "Modo oscuro"}
      className={[
        "group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
        "backdrop-blur-xl transition-colors duration-200",
        VARIANT_BUTTON[variant],
        className ?? "",
      ].join(" ")}
    >
      {/* Locker en línea: la puerta se "cierra" (rota) al pasar a modo oscuro */}
      <svg
        viewBox="0 0 24 32"
        className={`h-5 w-5 transition-colors ${VARIANT_ICON[variant]}`}
        fill="none"
        aria-hidden="true"
      >
        {/* Cuerpo del locker */}
        <rect x="2" y="2" width="20" height="28" rx="2" stroke="currentColor" strokeWidth="1.6" />
        {/* Rejilla de ventilación */}
        <line x1="5" y1="7" x2="10" y2="7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="5" y1="9.5" x2="10" y2="9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        {/* Puerta: pivota sobre el borde derecho, se cierra en modo oscuro */}
        <g
          style={{
            transformOrigin: "20px 16px",
            transform: isDark ? "rotateY(0deg)" : "rotateY(35deg)",
            transition: "transform 400ms ease",
          }}
        >
          <rect x="12" y="4" width="8" height="24" rx="1" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="14.5" cy="16" r="0.9" fill="currentColor" />
        </g>
      </svg>
    </button>
  );
}
