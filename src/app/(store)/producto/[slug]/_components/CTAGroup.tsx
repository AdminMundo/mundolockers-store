"use client";

export default function CTAGroup({ productName }: { productName: string }) {
  const text = encodeURIComponent(`Hola! Quiero cotizar: ${productName}`);
  const href = `https://wa.me/569?text=${text}`;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <a
        href={href}
        className="h-11 inline-flex items-center justify-center rounded-2xl border border-[#E18147]/40 bg-white text-sm font-medium text-zinc-900 transition-colors duration-200 hover:border-[#E18147] hover:shadow-[0_0_0_3px_rgba(225,129,71,0.15)]"
      >
        Cotizar por WhatsApp
      </a>

      <a
        href="#especificaciones"
        className="h-11 inline-flex items-center justify-center rounded-2xl bg-[#E18147] text-sm font-semibold text-white hover:bg-[#E18147]/85"
      >
        Ver especificaciones
      </a>
    </div>
  );
}
