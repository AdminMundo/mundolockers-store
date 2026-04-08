"use client";

import { useTransition } from "react";
import { deleteProductAction } from "@/app/admin/productos/[slug]/actions";

type Props = {
  sku: string;
};

export default function DeleteProductButton({ sku }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        const ok = window.confirm(
          `¿Seguro que quieres eliminar el producto con SKU "${sku}"?\n\nEsta acción no se puede deshacer.`
        );

        if (!ok) return;

        startTransition(async () => {
          await deleteProductAction(formData);
        });
      }}
    >
      <input type="hidden" name="sku" value={sku} />

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Eliminando..." : "Eliminar"}
      </button>
    </form>
  );
}