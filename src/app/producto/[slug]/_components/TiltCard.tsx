"use client";

import { useRef, useState } from "react";

export default function TiltCard({
  children,
  className = "",
  maxTilt = 10,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left; // 0..w
    const y = e.clientY - rect.top;  // 0..h
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const dx = (x - cx) / cx; // -1..1
    const dy = (y - cy) / cy; // -1..1

    const rotateY = dx * maxTilt;
    const rotateX = -dy * maxTilt;

    setStyle({
      transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    });
  }

  function onLeave() {
    setStyle({
      transform: `perspective(900px) rotateX(0deg) rotateY(0deg)`,
      transition: "transform 200ms ease",
    });
    // quita transición después para no “pegar” el hover
    window.setTimeout(() => setStyle({}), 200);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={[
        "will-change-transform",
        "transition-shadow duration-200",
        "hover:shadow-lg",
        className,
      ].join(" ")}
      style={style}
    >
      {children}
    </div>
  );
}
