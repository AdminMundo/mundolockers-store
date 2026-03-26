import Link from "next/link";

import { formatClp } from "@/lib/cart/format";
import type { CartSummary } from "@/lib/cart/types";

type Props = {
  summary: CartSummary;
};

function ActionLink({
  href,
  disabled,
  children,
  variant = "primary",
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const baseClassName =
    "inline-flex min-h-12 w-full items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium transition";

  if (disabled) {
    return (
      <span
        className={`${baseClassName} cursor-not-allowed bg-neutral-200 text-neutral-500`}
        aria-disabled="true"
      >
        {children}
      </span>
    );
  }

  if (variant === "secondary") {
    return (
      <Link
        href={href}
        className={`${baseClassName} border border-black/10 bg-white text-neutral-900 duration-200 hover:border-[#F5B301] hover:bg-white hover:shadow-[0_0_0_3px_rgba(245,179,1,0.15)]`}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`${baseClassName} bg-neutral-950 text-white duration-200 hover:bg-[#FDC90D] hover:text-neutral-950 hover:shadow-[0_0_0_3px_rgba(245,179,1,0.15)]`}
    >
      {children}
    </Link>
  );
}

export function CartSummaryCard({ summary }: Props) {
  const hasPurchaseItems = summary.purchaseLineCount > 0;
  const hasQuoteItems = summary.quoteLineCount > 0;

  return (
    <aside className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight text-neutral-950 sm:text-xl">
        Resumen
      </h2>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-neutral-600">Productos compra</span>
          <span className="font-medium text-neutral-950">
            {summary.purchaseQuantity}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-neutral-600">Productos cotización</span>
          <span className="font-medium text-neutral-950">
            {summary.quoteQuantity}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-neutral-600">Subtotal compra</span>
          <span className="font-medium text-neutral-950">
            {formatClp(summary.purchaseSubtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-neutral-600">Envío</span>
          <span className="font-medium text-neutral-950">
            Se calcula en checkout
          </span>
        </div>
      </div>

      <div className="mt-5 border-t border-black/10 pt-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-neutral-700">Total estimado</span>
          <span className="text-2xl font-semibold tracking-tight text-neutral-950">
            {formatClp(summary.purchaseSubtotal)}
          </span>
        </div>

        <p className="mt-2 text-xs leading-5 text-neutral-500">
          El total solo considera productos de compra directa. Los productos de
          cotización siguen un flujo separado.
        </p>
      </div>

      {summary.mixedFlow ? (
        <div className="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
          Tu carrito tiene productos de compra directa y productos para
          cotizar. Cada flujo continúa por separado.
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        <ActionLink href="/checkout" disabled={!hasPurchaseItems}>
          Finalizar compra
        </ActionLink>

        <ActionLink
          href="/cotizar"
          disabled={!hasQuoteItems}
          variant="secondary"
        >
          Solicitar cotización
        </ActionLink>
      </div>

      <div className="mt-5 rounded-2xl bg-neutral-50 px-4 py-3 text-xs leading-5 text-neutral-600">
        Compra directa para productos estándar. Cotización para volumen,
        instituciones, personalización o proyectos especiales.
      </div>
    </aside>
  );
}