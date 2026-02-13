"use client";

export default function CTAGroup({ productName }: { productName: string }) {
  const text = encodeURIComponent(`Hola! Quiero cotizar: ${productName}`);
  const href = `https://wa.me/569XXXXXXXX?text=${text}`;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <a
        href={href}
        className="h-11 inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white text-sm font-medium text-zinc-900 hover:bg-zinc-50"
      >
        Cotizar por WhatsApp
      </a>

      <a
        href="#especificaciones"
        className="h-11 inline-flex items-center justify-center rounded-2xl bg-yellow-400 text-sm font-semibold text-zinc-900 hover:bg-yellow-300"
      >
        Ver especificaciones
      </a>
    </div>
  );
}
