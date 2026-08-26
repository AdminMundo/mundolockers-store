"use client";

import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";

import LockerPreviewSvg, { LockGlyph } from "./LockerPreviewSvg";
import {
  BASE_STYLES,
  COLUMN_WIDTH_CM,
  DOOR_STYLES,
  LOCK_TYPES,
  LOCKER_COLORS,
  PRODUCT_DEPTH_CM,
  PRODUCT_HEIGHT_CM,
  ROW_TERM_LABELS,
  type BaseStyle,
  type DoorStyle,
  type LockType,
} from "../_lib/locker-options";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lockersstore.cl";
const WHATSAPP_NUMBER = "56936289818";

function OptionCard({
  active,
  onClick,
  label,
  caption,
  tag,
  glyph,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  caption: string;
  tag?: string;
  glyph?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "flex flex-col items-start gap-1 rounded-2xl border p-3 text-left transition-colors duration-200",
        active
          ? "border-zinc-900 bg-zinc-50 ring-2 ring-zinc-900"
          : "border-zinc-200 bg-white hover:border-[#0477BF]/50",
      ].join(" ")}
    >
      <div className="flex w-full items-center justify-between gap-2">
        {glyph ? (
          <svg viewBox="-6 -7 12 14" className="h-6 w-6 shrink-0">
            {glyph}
          </svg>
        ) : null}
        {tag ? (
          <span className="ml-auto rounded-full bg-[#0477BF]/10 px-2 py-0.5 text-[10px] font-medium text-[#0477BF]">
            {tag}
          </span>
        ) : null}
      </div>
      <div className="text-sm font-medium text-zinc-900">{label}</div>
      <div className="text-xs leading-4 text-zinc-500">{caption}</div>
    </button>
  );
}

function Stepper({
  label,
  sublabel,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  sublabel?: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  return (
    <div>
      <div className="text-sm font-medium text-zinc-900">{label}</div>
      {sublabel ? <div className="text-xs text-zinc-500">{sublabel}</div> : null}
      <div className="mt-2 inline-flex items-center rounded-xl border border-zinc-200 bg-white">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="grid h-10 w-10 place-items-center rounded-l-xl text-zinc-700 hover:bg-zinc-50"
          aria-label={`Disminuir ${label.toLowerCase()}`}
        >
          −
        </button>
        <div className="grid h-10 w-12 place-items-center text-sm text-zinc-900">{value}</div>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="grid h-10 w-10 place-items-center rounded-r-xl text-zinc-700 hover:bg-zinc-50"
          aria-label={`Aumentar ${label.toLowerCase()}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function LockerConfigurator() {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [colorId, setColorId] = useState("gris");
  const [base, setBase] = useState<BaseStyle>("patas");
  const [doorStyle, setDoorStyle] = useState<DoorStyle>("celosia");
  const [lockType, setLockType] = useState<LockType>("candado");

  const totalDoors = columns * rows;
  const rowTermLabel = ROW_TERM_LABELS[rows - 1];
  const color = useMemo(
    () => LOCKER_COLORS.find((c) => c.id === colorId) ?? LOCKER_COLORS[0],
    [colorId],
  );
  const lock = useMemo(
    () => LOCK_TYPES.find((l) => l.id === lockType) ?? LOCK_TYPES[0],
    [lockType],
  );

  const widthCm = COLUMN_WIDTH_CM[columns] ?? COLUMN_WIDTH_CM[1];
  const dimensionsLabel = `${widthCm} × ${PRODUCT_HEIGHT_CM} × ${PRODUCT_DEPTH_CM} cm`;

  const whatsappHref = useMemo(() => {
    const lines = [
      "Hola, quiero cotizar un locker armado con el configurador:",
      "",
      `Cuerpos (columnas): ${columns}`,
      `Puertas por cuerpo (filas): ${rows} (${rowTermLabel})`,
      `Total de puertas: ${totalDoors}`,
      `Medidas aproximadas (ancho × alto × profundidad): ${dimensionsLabel}`,
      `Color: ${color.label}${color.ral ? ` (${color.ral})` : ""}`,
      `Base: ${base === "patas" ? "Patas" : "Zócalo"}`,
      `Ventilación de puertas: ${
        doorStyle === "celosia" ? "Celosía normal" : "Puertas con rejilla/malla"
      }`,
      `Tipo de cerradura: ${lock.label}`,
      "",
      "* Diseño referencial (configurador visual, no vinculante). Precio final, tono de color exacto y disponibilidad se confirman al cotizar.",
      `Link: ${SITE_URL}/arma-tu-locker`,
    ].filter(Boolean);

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [columns, rows, rowTermLabel, totalDoors, dimensionsLabel, color, base, doorStyle, lock]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] items-start">
      {/* Preview */}
      <div className="lg:sticky lg:top-28">
        <div className="relative overflow-hidden rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm">
          <div className="absolute inset-3 overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-50 to-white">
            <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(to_right,rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.035)_1px,transparent_1px)] [background-size:20px_20px]" />
          </div>
          {[
            "left-3 top-3 border-l-2 border-t-2",
            "right-3 top-3 border-r-2 border-t-2",
            "left-3 bottom-3 border-l-2 border-b-2",
            "right-3 bottom-3 border-r-2 border-b-2",
          ].map((pos) => (
            <span
              key={pos}
              className={`pointer-events-none absolute h-3 w-3 rounded-[2px] border-zinc-300 ${pos}`}
            />
          ))}

          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700">
                {columns} cuerpos × {rows} filas · {totalDoors} puertas
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700">
                {dimensionsLabel}
              </span>
            </div>

            <div className="mt-6 flex h-[360px] items-end justify-center">
              <LockerPreviewSvg
                columns={columns}
                rows={rows}
                colorHex={color.hex}
                base={base}
                doorStyle={doorStyle}
                lockType={lockType}
                className="h-full w-auto max-w-full"
              />
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-zinc-500">
              <div>
                <dt className="inline text-zinc-400">Color: </dt>
                <dd className="inline text-zinc-700">
                  {color.label}
                  {color.ral ? ` (${color.ral})` : ""}
                </dd>
              </div>
              <div>
                <dt className="inline text-zinc-400">Base: </dt>
                <dd className="inline text-zinc-700">{base === "patas" ? "Patas" : "Zócalo"}</dd>
              </div>
              <div>
                <dt className="inline text-zinc-400">Ventilación: </dt>
                <dd className="inline text-zinc-700">
                  {doorStyle === "celosia" ? "Celosía normal" : "Rejilla/malla"}
                </dd>
              </div>
              <div>
                <dt className="inline text-zinc-400">Chapa: </dt>
                <dd className="inline text-zinc-700">{lock.label}</dd>
              </div>
              <div className="col-span-2">
                <dt className="inline text-zinc-400">Medidas: </dt>
                <dd className="inline text-zinc-700">{dimensionsLabel}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Selectores */}
      <div className="space-y-5">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="grid grid-cols-2 gap-4">
            <Stepper label="Cuerpos" value={columns} min={1} max={5} onChange={setColumns} />
            <Stepper
              label="Puertas por cuerpo"
              sublabel={rowTermLabel}
              value={rows}
              min={1}
              max={4}
              onChange={setRows}
            />
          </div>
          <div className="mt-3 text-sm text-zinc-600">
            Total: <span className="font-medium text-zinc-900">{totalDoors} puertas</span>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="text-sm font-medium text-zinc-900">Color</div>
          <div className="mt-3 flex flex-wrap gap-3">
            {LOCKER_COLORS.map((c) => {
              const active = c.id === colorId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColorId(c.id)}
                  className={[
                    "grid h-9 w-9 place-items-center rounded-full",
                    active ? "ring-2 ring-zinc-900 ring-offset-2" : "ring-1 ring-zinc-200",
                  ].join(" ")}
                  aria-label={`Color ${c.label}`}
                  title={c.label}
                >
                  <span
                    className="h-6 w-6 rounded-full border border-black/10"
                    style={{ backgroundColor: c.hex }}
                  />
                </button>
              );
            })}
          </div>
          <div className="mt-2 text-xs text-zinc-500">
            Seleccionado:{" "}
            <span className="text-zinc-900">
              {color.label}
              {color.ral ? ` (${color.ral})` : ""}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="text-sm font-medium text-zinc-900">Base</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {BASE_STYLES.map((opt) => (
              <OptionCard
                key={opt.id}
                active={base === opt.id}
                onClick={() => setBase(opt.id)}
                label={opt.label}
                caption={opt.caption}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="text-sm font-medium text-zinc-900">Ventilación de puertas</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {DOOR_STYLES.map((opt) => (
              <OptionCard
                key={opt.id}
                active={doorStyle === opt.id}
                onClick={() => setDoorStyle(opt.id)}
                label={opt.label}
                caption={opt.caption}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="text-sm font-medium text-zinc-900">Tipo de cerradura</div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {LOCK_TYPES.map((opt) => (
              <OptionCard
                key={opt.id}
                active={lockType === opt.id}
                onClick={() => setLockType(opt.id)}
                label={opt.label}
                caption={opt.caption}
                tag={opt.isDefault ? "Predeterminada" : undefined}
                glyph={<LockGlyph type={opt.id} />}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#0477BF]/20 bg-[#0477BF]/5 p-5">
          <p className="text-xs leading-5 text-zinc-600">
            Diseño referencial: el precio final, el tono de color exacto y la
            disponibilidad se confirman al cotizar.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#0477BF] text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#0477BF]/85"
          >
            <MessageCircle className="h-4 w-4" />
            Cotizar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
