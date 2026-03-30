import Image from "next/image";

export type DetailDot = { src: string; alt: string };

export default function ProductDetailDots({ items }: { items: DetailDot[] }) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      {items.slice(0, 3).map((it) => (
        <div
          key={it.src}
          className={[
            "relative h-16 w-16 overflow-hidden rounded-full",
            "border border-zinc-200 bg-zinc-50 shadow-sm",
            "transition duration-200 ease-out",
            "hover:-translate-y-0.5 hover:shadow-md",
            "hover:ring-2 hover:ring-zinc-900/20 hover:ring-offset-2 hover:ring-offset-white",
          ].join(" ")}
        >
          <Image
            src={it.src}
            alt={it.alt}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
