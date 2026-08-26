import type { BaseStyle, DoorStyle, LockType } from "../_lib/locker-options";
import {
  COLUMN_WIDTH_CM,
  DOOR_HEIGHT_CM,
  DOOR_WIDTH_CM,
  PRODUCT_HEIGHT_CM,
} from "../_lib/locker-options";

// Reveal superior fijo (pequeña cornisa sobre la primera puerta); el resto
// del espacio que sobra entre el alto total (170cm) y el stack de puertas
// queda para patas/zócalo — así el SVG usa directamente centímetros reales
// como unidades del viewBox.
const TOP_MARGIN_CM = 3;

// El cuerpo (marco/montantes/zócalo) siempre es de este gris, sin importar
// el color elegido — solo las puertas se pintan del color seleccionado.
const FRAME_COLOR = "#8B9096";

function shade(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v)));
  const r = clamp(((n >> 16) & 0xff) + amount);
  const g = clamp(((n >> 8) & 0xff) + amount);
  const b = clamp((n & 0xff) + amount);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

// Glifos en un espacio local de -6..6 (12x12), pensados para ir dentro de un
// <g transform="translate(x,y) scale(s)"> o en un <svg viewBox="-6 -7 12 14"> propio.
export function LockGlyph({ type }: { type: LockType }) {
  const stroke = "#3f3f46";

  switch (type) {
    case "codigo":
      return (
        <g fill="none" stroke={stroke} strokeWidth="0.9" strokeLinecap="round">
          <circle cx="0" cy="0" r="3.6" />
          <line x1="0" y1="-3.6" x2="0" y2="-5" />
          <line x1="3.6" y1="0" x2="5" y2="0" />
          <line x1="0" y1="3.6" x2="0" y2="5" />
          <line x1="-3.6" y1="0" x2="-5" y2="0" />
          <line x1="0" y1="0" x2="1.8" y2="-2.8" strokeWidth="1.1" />
        </g>
      );
    case "candado":
      return (
        <g fill="none" stroke={stroke} strokeWidth="0.9" strokeLinecap="round">
          <rect x="-5" y="-1.5" width="4" height="3" rx="0.6" />
          <rect x="-1" y="-2.6" width="4.4" height="5.2" rx="0.8" fill={stroke} fillOpacity="0.12" />
          <path d="M -0.2 -2.6 v-1.6 a1.8 1.8 0 0 1 3.6 0 v1.6" />
        </g>
      );
    case "llave":
      return (
        <g fill="none" stroke={stroke} strokeWidth="0.9" strokeLinecap="round">
          <circle cx="0" cy="-1.4" r="2.3" />
          <path d="M 0 0.9 L 0 5 M -1.4 3.2 L 1.4 3.2 M -1.4 4.2 L 1.4 4.2" />
        </g>
      );
    case "electronica":
      return (
        <g fill="none" stroke={stroke} strokeWidth="0.8" strokeLinecap="round">
          <rect x="-4.5" y="-6" width="9" height="12" rx="1.2" />
          <line x1="-3" y1="-3.6" x2="3" y2="-3.6" />
          {[-2.5, 0, 2.5].map((cx) =>
            [-1, 2].map((cy) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.55" fill={stroke} stroke="none" />
            )),
          )}
        </g>
      );
    case "moneda":
      return (
        <g fill="none" stroke={stroke} strokeWidth="0.9" strokeLinecap="round">
          <circle cx="0" cy="0" r="4" />
          <rect x="-0.6" y="-2.6" width="1.2" height="5.2" fill={stroke} stroke="none" />
        </g>
      );
    default:
      return null;
  }
}

function DoorVentOverlay({
  style,
  doorW,
  doorH,
}: {
  style: DoorStyle;
  doorW: number;
  doorH: number;
}) {
  if (style === "celosia") {
    const slatY = doorH * 0.1;
    const slatGap = Math.min(doorH * 0.05, 3.2);
    return (
      <g stroke="rgba(0,0,0,0.32)" strokeWidth="0.7" strokeLinecap="round">
        {[0, 1, 2].map((i) => (
          <line
            key={i}
            x1={doorW * 0.18}
            x2={doorW * 0.82}
            y1={slatY + i * slatGap}
            y2={slatY + i * slatGap}
          />
        ))}
      </g>
    );
  }

  const meshY = doorH * 0.25;
  const meshH = doorH * 0.68;
  return (
    <rect
      x={doorW * 0.1}
      y={meshY}
      width={doorW * 0.8}
      height={meshH}
      rx="1"
      fill="url(#locker-mesh)"
    />
  );
}

export type LockerPreviewSvgProps = {
  columns: number;
  rows: number;
  colorHex: string;
  base: BaseStyle;
  doorStyle: DoorStyle;
  lockType: LockType;
  className?: string;
};

export default function LockerPreviewSvg({
  columns,
  rows,
  colorHex,
  base,
  doorStyle,
  lockType,
  className,
}: LockerPreviewSvgProps) {
  const totalWidthCm = COLUMN_WIDTH_CM[columns] ?? COLUMN_WIDTH_CM[1];
  const doorHeightCm = DOOR_HEIGHT_CM[rows] ?? DOOR_HEIGHT_CM[1];
  const gridHeightCm = doorHeightCm * rows;
  const frameBottomY = TOP_MARGIN_CM + gridHeightCm;
  const baseHeightCm = Math.max(PRODUCT_HEIGHT_CM - frameBottomY, 8);

  const viewBoxW = totalWidthCm;
  const viewBoxH = PRODUCT_HEIGHT_CM;

  const slotWidthCm = totalWidthCm / columns;
  const doorMarginCm = Math.max(slotWidthCm - DOOR_WIDTH_CM, 0);

  const strokeColor = shade(colorHex, -30);

  // Las patas ocupan todo el espacio sobrante bajo las puertas (llegan
  // hasta el piso, y = alto total del producto).
  const legHeightCm = baseHeightCm;
  const legTopHalfWidth = 2.1;
  const legBottomHalfWidth = 1.1;
  // El producto real tiene 4 patas (2 delanteras + 2 traseras), pero en
  // esta vista de frente las traseras quedan ocultas detrás de las
  // delanteras — por eso siempre se dibujan 2, cerca de cada borde,
  // sin importar cuántos cuerpos/columnas tenga el locker.
  const legEdgeInsetCm = Math.min(3, viewBoxW * 0.12);
  const legXsCm = [legEdgeInsetCm, viewBoxW - legEdgeInsetCm];

  // Escala de los glifos de chapa: el espacio local de LockGlyph es de
  // -6..6 (12cm); se reduce para que la "placa" quede a escala de puerta.
  const glyphScale = 0.34;

  return (
    <svg
      viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
      className={className ?? "w-full h-auto"}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="locker-mesh"
          width="1.8"
          height="1.8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0.9" x2="1.8" y2="0.9" stroke="rgba(0,0,0,0.35)" strokeWidth="0.3" />
          <line x1="0.9" y1="0" x2="0.9" y2="1.8" stroke="rgba(0,0,0,0.35)" strokeWidth="0.3" />
        </pattern>
      </defs>

      {/* Marco (actúa de montante entre puertas gracias al margen de cada columna) */}
      <rect x="0" y="0" width={viewBoxW} height={frameBottomY} rx="1.5" fill={FRAME_COLOR} />

      {/* Puertas */}
      {Array.from({ length: columns }).map((_, c) =>
        Array.from({ length: rows }).map((_, r) => {
          const x = c * slotWidthCm + doorMarginCm / 2;
          const y = TOP_MARGIN_CM + r * doorHeightCm;
          return (
            <g key={`${c}-${r}`}>
              <rect
                x={x}
                y={y}
                width={DOOR_WIDTH_CM}
                height={doorHeightCm}
                rx="0.8"
                fill={colorHex}
                stroke={strokeColor}
                strokeWidth="0.4"
              />
              <g transform={`translate(${x},${y})`}>
                <DoorVentOverlay style={doorStyle} doorW={DOOR_WIDTH_CM} doorH={doorHeightCm} />
              </g>
              <g
                transform={`translate(${x + DOOR_WIDTH_CM - 3.2},${y + doorHeightCm / 2}) scale(${glyphScale})`}
              >
                <rect x="-5.5" y="-6.5" width="11" height="13" rx="1.5" fill="#F4F4F5" stroke="rgba(0,0,0,0.18)" strokeWidth="0.6" />
                <LockGlyph type={lockType} />
              </g>
            </g>
          );
        }),
      )}

      {/* Base: patas o zócalo (ocupa el espacio real sobrante bajo las puertas) */}
      {base === "patas" ? (
        <g fill="#27272a">
          {legXsCm.map((x, i) => (
            <polygon
              key={i}
              points={`${x - legTopHalfWidth},${frameBottomY} ${x + legTopHalfWidth},${frameBottomY} ${x + legBottomHalfWidth},${frameBottomY + legHeightCm} ${x - legBottomHalfWidth},${frameBottomY + legHeightCm}`}
            />
          ))}
        </g>
      ) : (
        <rect
          x={viewBoxW * 0.03}
          y={frameBottomY}
          width={viewBoxW * 0.94}
          height={legHeightCm}
          rx="1"
          fill={FRAME_COLOR}
        />
      )}
    </svg>
  );
}
