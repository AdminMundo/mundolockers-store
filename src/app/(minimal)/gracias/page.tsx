import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Pedido confirmado | LockerStore",
  robots: { index: false, follow: false },
};

type GraciasPageProps = {
  searchParams: Promise<{ pedido?: string }>;
};

type OrderProduct = {
  name?: string;
  sku?: string | null;
  quantity: number;
  variant?: string | null;
  unitPrice?: number | null;
};

function formatPrice(value: number | null | undefined) {
  if (value == null) return "—";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

// Datos bancarios desde variables de entorno
function getBankData() {
  return {
    bank: process.env.TRANSFER_BANK ?? "Banco de Chile",
    accountType: process.env.TRANSFER_ACCOUNT_TYPE ?? "Cuenta Corriente",
    accountNumber: process.env.TRANSFER_ACCOUNT_NUMBER ?? "—",
    rut: process.env.TRANSFER_RUT ?? "—",
    name: process.env.TRANSFER_NAME ?? "LockerStore SpA",
    email: process.env.TRANSFER_EMAIL ?? process.env.QUOTE_NOTIFICATION_EMAIL ?? "—",
  };
}

export default async function GraciasPage({ searchParams }: GraciasPageProps) {
  const { pedido: orderId } = await searchParams;
  const bank = getBankData();

  let pedido: {
    id: string;
    numero: number | null;
    nombre: string;
    correo: string | null;
    tipo_entrega: string | null;
    ciudad: string | null;
    region: string | null;
    direccion: string | null;
    productos: unknown;
    subtotal: number | null;
    total: number | null;
    notas: string | null;
  } | null = null;

  if (orderId) {
    const supabase = createSupabaseServer();
    const { data } = await supabase
      .from("pedidos")
      .select("id, numero, nombre, correo, tipo_entrega, ciudad, region, direccion, productos, subtotal, total, notas")
      .eq("id", orderId)
      .maybeSingle();
    pedido = data;
  }

  const productos = Array.isArray(pedido?.productos)
    ? (pedido!.productos as OrderProduct[])
    : [];

  const numeroLabel = pedido?.numero
    ? `#${String(pedido.numero).padStart(4, "0")}`
    : orderId
      ? `#${orderId.slice(0, 6).toUpperCase()}`
      : null;

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-12 sm:px-6">

        {/* Checkmark header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg
              className="h-8 w-8 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-neutral-950">
            ¡Pedido confirmado!
          </h1>

          {numeroLabel && (
            <p className="mt-2 font-mono text-base text-neutral-500">
              Pedido {numeroLabel}
            </p>
          )}

          {pedido?.nombre && (
            <p className="mt-2 text-sm text-neutral-600">
              Gracias, <strong>{pedido.nombre}</strong>. Tu pedido está registrado y pendiente de pago.
            </p>
          )}
        </div>

        {/* Datos de transferencia */}
        <section className="mt-8 overflow-hidden rounded-[28px] border border-neutral-950 bg-white shadow-sm">
          <div className="bg-neutral-950 px-6 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-white/80">
              Realiza tu transferencia
            </h2>
            <p className="mt-1 text-xs text-white/55">
              Una vez recibido el pago, procesaremos y coordinaremos tu entrega.
            </p>
          </div>

          <div className="divide-y divide-black/8">
            {[
              { label: "Banco", value: bank.bank },
              { label: "Tipo de cuenta", value: bank.accountType },
              { label: "N° de cuenta", value: bank.accountNumber },
              { label: "RUT", value: bank.rut },
              { label: "Nombre", value: bank.name },
              { label: "Monto a transferir", value: formatPrice(pedido?.total) },
              { label: "Enviar comprobante a", value: bank.email },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between gap-4 px-6 py-4">
                <span className="text-sm text-neutral-500">{label}</span>
                <span className="text-right text-sm font-medium text-neutral-950">
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 px-6 py-4">
            <p className="text-xs leading-5 text-amber-800">
              Incluye en el comentario de la transferencia tu nombre o número de pedido{" "}
              {numeroLabel ? <strong>{numeroLabel}</strong> : ""} para agilizar la confirmación.
            </p>
          </div>
        </section>

        {/* Resumen del pedido */}
        {pedido && (
          <section className="mt-6 rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
              Resumen del pedido
            </h2>

            {productos.length > 0 && (
              <ul className="mt-4 divide-y divide-black/8">
                {productos.map((item, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 py-3 text-sm">
                    <div>
                      <span className="font-medium text-neutral-900">{item.name ?? "Producto"}</span>
                      {item.variant && (
                        <span className="ml-1 text-neutral-500">· {item.variant}</span>
                      )}
                      <span className="ml-2 text-neutral-400">×{item.quantity}</span>
                    </div>
                    <span className="shrink-0 font-medium text-neutral-800">
                      {formatPrice((item.unitPrice ?? 0) * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 border-t border-black/8 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium">{formatPrice(pedido.subtotal)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-neutral-600">Despacho</span>
                <span className="text-neutral-500">Se coordina con el equipo</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-black/8 pt-3">
                <span className="font-semibold text-neutral-950">Total a transferir</span>
                <span className="text-xl font-semibold text-neutral-950">
                  {formatPrice(pedido.total)}
                </span>
              </div>
            </div>

            {/* Entrega */}
            {(pedido.tipo_entrega || pedido.correo) && (
              <div className="mt-4 grid gap-3 border-t border-black/8 pt-4 sm:grid-cols-2">
                {pedido.tipo_entrega && (
                  <div className="rounded-2xl bg-neutral-50 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                      Entrega
                    </p>
                    <p className="mt-1 text-sm text-neutral-700">
                      {pedido.tipo_entrega === "despacho"
                        ? `Despacho${pedido.ciudad ? ` — ${pedido.ciudad}` : ""}${pedido.region ? `, ${pedido.region}` : ""}`
                        : "Retiro en tienda"}
                    </p>
                  </div>
                )}
                {pedido.correo && (
                  <div className="rounded-2xl bg-neutral-50 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                      Confirmación enviada a
                    </p>
                    <p className="mt-1 text-sm text-neutral-700">{pedido.correo}</p>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Acciones */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/tienda"
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Seguir comprando
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
