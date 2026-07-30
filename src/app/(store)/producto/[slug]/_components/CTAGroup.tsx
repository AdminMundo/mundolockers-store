"use client";

export default function CTAGroup({ productName }: { productName: string }) {
  const text = encodeURIComponent(`Hola! Quiero cotizar: ${productName}`);
  const href = `https://wa.me/569?text=${text}`;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <a
        href={href}
        className="h-11 inline-flex items-center justify-center rounded-2xl border border-[#0477BF]/40 bg-white text-sm font-medium text-zinc-900 transition-colors duration-200 hover:border-[#0477BF] hover:shadow-[0_0_0_3px_rgba(4,119,191,0.15)]"
      >
        Cotizar por WhatsApp
      </a>

      <a
        href="#especificaciones"
        className="h-11 inline-flex items-center justify-center rounded-2xl bg-[#0477BF] text-sm font-semibold text-white hover:bg-[#0477BF]/85"
      >
        Ver especificaciones
      </a>
    </div>
  );
}
