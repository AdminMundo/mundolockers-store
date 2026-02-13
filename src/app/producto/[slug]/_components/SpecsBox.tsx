import type { Json } from "@/lib/product";

export default function SpecsBox({ specs }: { specs: Json | null }) {
  return (
    <section
      id="especificaciones"
      className="rounded-2xl border border-zinc-200 bg-white p-5"
    >
      <h2 className="text-sm font-semibold text-zinc-900">Especificaciones</h2>
      <div className="mt-3 text-sm text-zinc-700">{renderSpecs(specs)}</div>
    </section>
  );
}

function tryParseJSON(value: unknown): unknown {
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  const looksJson =
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"));

  if (!looksJson) return value;

  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

function renderValue(value: unknown) {
  const parsed = tryParseJSON(value);

  if (Array.isArray(parsed)) {
    return (
      <ul className="list-disc pl-5 space-y-1">
        {parsed.map((v, i) => (
          <li key={i}>{String(v)}</li>
        ))}
      </ul>
    );
  }

  if (typeof parsed === "object" && parsed !== null) {
    const entries = Object.entries(parsed as Record<string, unknown>);
    return (
      <dl className="grid grid-cols-1 gap-2">
        {entries.map(([k, v]) => (
          <div
            key={k}
            className="flex items-start justify-between gap-6 border-b border-zinc-100 py-1"
          >
            <dt className="text-zinc-500">{k}</dt>
            <dd className="text-zinc-900 text-right">
              {renderValue(v)}
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  return <span>{String(parsed)}</span>;
}

function renderSpecs(specs: Json | null) {
  if (!specs || typeof specs !== "object") {
    return <p className="text-zinc-500">Próximamente.</p>;
  }

  if (Array.isArray(specs)) {
    return renderValue(specs);
  }

  const entries = Object.entries(specs as Record<string, unknown>);

  // Orden lógico ecommerce
  const order = ["Medidas", "Puerta", "Incluye", "Otros", "Notas"];
  entries.sort((a, b) => {
    const ia = order.indexOf(a[0]);
    const ib = order.indexOf(b[0]);
    if (ia === -1 && ib === -1) return a[0].localeCompare(b[0]);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  return (
    <div className="space-y-4">
      {entries.map(([section, value]) => (
        <div key={section}>
          <h3 className="text-sm font-medium text-zinc-900 mb-1">
            {section}
          </h3>
          <div className="text-sm text-zinc-700">
            {renderValue(value)}
          </div>
        </div>
      ))}
    </div>
  );
}
