"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  className?: string;
  children?: React.ReactNode;
};

export default function WhatsAppButton({ href, className, children }: Props) {
  return (
    <Button
      type="button"
      className={cn(
        "h-9 rounded-xl border border-black/10 bg-white/30 text-zinc-900 hover:bg-white/55 hover:text-zinc-900",
        className
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(href, "_blank", "noopener,noreferrer");
      }}
    >
      {children ?? "WhatsApp"}
    </Button>
  );
}