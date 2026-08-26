"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

// El modo oscuro es un piloto acotado a home + navbar/footer. Como next-themes
// aplica la clase "dark" a <html> (persiste entre navegaciones), este guard
// la fuerza a "light" apenas se sale de "/" para que no se filtre a páginas
// (tienda, producto, admin, etc.) que no tienen estilos dark: definidos.
export function ThemeScopeGuard() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useLayoutEffect(() => {
    if (pathname !== "/" && theme === "dark") {
      setTheme("light");
    }
  }, [pathname, theme, setTheme]);

  return null;
}
