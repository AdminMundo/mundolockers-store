"use client";

export default function PopOutImage({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={["group", className].join(" ")}>
      {/* ESTE es el contenedor que le da altura y position */}
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-zinc-50">
        {/* glow suave */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute -inset-24 rounded-full bg-white/60 blur-2xl" />
        </div>

        {/* contenido pop-out */}
        <div className="absolute inset-0 transition-transform duration-300 ease-out group-hover:-translate-y-3 group-hover:scale-[1.06]">
          {children}
        </div>

        {/* ring premium */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-black/5" />
      </div>

      {/* sombra externa */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100 bg-black/10" />
    </div>
  );
}
