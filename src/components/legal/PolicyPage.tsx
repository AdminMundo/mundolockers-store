import Link from "next/link";

type Section = {
  title: string;
  content: React.ReactNode;
};

type Props = {
  badge: string;
  title: string;
  subtitle: string;
  updatedAt: string;
  sections: Section[];
};

export function PolicyPage({ badge, title, subtitle, updatedAt, sections }: Props) {
  return (
    <main className="min-h-screen bg-[#F5F5F7]">
      {/* Hero */}
      <section className="bg-[#0F172A] pt-28 pb-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <span className="inline-flex rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            {badge}
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-7 text-white/60">{subtitle}</p>
          <p className="mt-3 text-xs text-white/35">
            Última actualización: {updatedAt}
          </p>
        </div>
      </section>

      {/* Contenido */}
      <div className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <div className="-mt-6 rounded-[32px] border border-black/10 bg-white shadow-sm">
          <div className="divide-y divide-black/8">
            {sections.map((section, i) => (
              <div key={i} className="px-8 py-8">
                <h2 className="text-base font-semibold text-zinc-900">
                  {i + 1}. {section.title}
                </h2>
                <div className="mt-3 text-sm leading-7 text-zinc-600 [&_a]:font-medium [&_a]:text-zinc-900 [&_a]:underline [&_a]:underline-offset-2 [&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:list-disc [&_strong]:font-semibold [&_strong]:text-zinc-800">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* Footer card */}
          <div className="rounded-b-[32px] border-t border-black/8 bg-zinc-50 px-8 py-6">
            <p className="text-sm text-zinc-500">
              ¿Tienes preguntas?{" "}
              <a href="mailto:lockerstore2@gmail.com" className="font-medium text-zinc-800 underline underline-offset-2">
                lockerstore2@gmail.com
              </a>{" "}
              o{" "}
              <a href="https://wa.me/56994131814" target="_blank" rel="noopener noreferrer" className="font-medium text-zinc-800 underline underline-offset-2">
                WhatsApp +56 9 9413 1814
              </a>
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/tienda" className="inline-flex h-9 items-center rounded-xl bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-700">
                Ver tienda
              </Link>
              <Link href="/" className="inline-flex h-9 items-center rounded-xl border border-black/10 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50">
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
