"use client";

import { useEffect, useRef } from "react";
import WebGLFluid from "webgl-fluid";

// Simulación de fluido (humo/tinta) que sigue el cursor, tomada de
// https://github.com/PavelDoGreat/WebGL-Fluid-Simulation vía el paquete
// "webgl-fluid". Se desactiva en touch/prefers-reduced-motion para no
// gastar batería/rendimiento donde el hover no aplica.
export default function ConfiguratorBannerFluid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReducedMotion || isCoarsePointer) return;

    WebGLFluid(canvas, {
      TRIGGER: "hover",
      // Sin auto-splash: queda negro hasta que alguien pasa el mouse.
      IMMEDIATE: false,
      AUTO: false,
      COLORFUL: true,
      COLOR_UPDATE_SPEED: 6,
      SPLAT_RADIUS: 0.32,
      SPLAT_FORCE: 4000,
      SPLAT_COUNT: 4,
      CURL: 20,
      DENSITY_DISSIPATION: 1.4,
      BLOOM_INTENSITY: 0.45,
      BACK_COLOR: { r: 0.04, g: 0.055, b: 0.1 },
      TRANSPARENT: false,
    });

    return () => {
      // La librería no expone un método de limpieza (su loop de
      // requestAnimationFrame nunca se cancela solo). Al desmontar,
      // perdemos el contexto WebGL a propósito para que las llamadas
      // gl.* siguientes queden como no-op y el costo caiga casi a cero.
      const gl =
        canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
