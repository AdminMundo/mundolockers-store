"use client";

import { useState } from "react";

import LockerPreviewSvg from "@/app/(store)/arma-tu-locker/_components/LockerPreviewSvg";
import { LOCKER_COLORS } from "@/app/(store)/arma-tu-locker/_lib/locker-options";

const TEASER_COLOR_IDS = [
  "traffic-red",
  "ultramarine-blue",
  "yellow-green",
  "signal-yellow",
  "claret-violet",
  "orange",
];

const TEASER_COLORS = TEASER_COLOR_IDS.map(
  (id) => LOCKER_COLORS.find((c) => c.id === id)!,
);

export default function ConfiguratorBannerPreview() {
  const [colorId, setColorId] = useState(TEASER_COLORS[0].id);
  const color = TEASER_COLORS.find((c) => c.id === colorId) ?? TEASER_COLORS[0];

  return (
    <div className="relative pointer-events-auto">
      <div className="relative mx-auto flex h-[240px] w-full max-w-[420px] items-end justify-center">
        <div className="pointer-events-none absolute inset-x-10 top-10 h-40 rounded-full bg-white/10 blur-3xl" />
        <LockerPreviewSvg
          columns={2}
          rows={2}
          colorHex={color.hex}
          base="patas"
          doorStyle="celosia"
          lockType="candado"
          className="relative h-full w-auto drop-shadow-[0_28px_34px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out hover:scale-[1.04]"
        />
      </div>

      <div className="mt-4 flex flex-col items-center gap-2">
        <span className="text-xs font-medium text-white/60">
          Toca un color para probarlo
        </span>
        <div className="flex items-center gap-2">
          {TEASER_COLORS.map((c) => {
            const active = c.id === colorId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setColorId(c.id)}
                aria-label={`Ver en ${c.label}`}
                title={c.label}
                className={[
                  "grid h-8 w-8 place-items-center rounded-full transition-all duration-200",
                  active
                    ? "ring-2 ring-white ring-offset-2 ring-offset-[#0F172A] scale-110"
                    : "ring-1 ring-white/25 hover:ring-white/50",
                ].join(" ")}
              >
                <span
                  className="h-5 w-5 rounded-full"
                  style={{ backgroundColor: c.hex }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
