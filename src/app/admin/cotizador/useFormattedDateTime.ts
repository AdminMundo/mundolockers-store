"use client";

import { useEffect, useState } from "react";

/**
 * Formatea una fecha/hora en el navegador después del montaje, no durante el
 * render inicial. Intl.toLocaleString puede diferir entre el servidor (Node)
 * y el navegador (distinta zona horaria o datos ICU), lo que rompe la
 * hidratación de React si se formatea directo en el render.
 */
export function useFormattedDateTime(iso: string | null): string {
  const [formatted, setFormatted] = useState("");

  // Intencional: el valor debe quedar vacío en el render inicial (servidor y
  // primer render del cliente coinciden) y recién completarse después del
  // montaje, cuando ya no puede romper la hidratación.
  useEffect(() => {
    if (!iso) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormatted("");
      return;
    }
    setFormatted(
      new Date(iso).toLocaleString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
  }, [iso]);

  return formatted;
}
