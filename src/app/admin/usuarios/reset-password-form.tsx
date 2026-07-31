"use client";

import { useActionState, useState } from "react";
import { adminResetPasswordAction, type AdminResetPasswordState } from "./actions";

const initialState: AdminResetPasswordState = { error: null, success: false };

export function ResetPasswordControl({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    adminResetPasswordAction.bind(null, userId),
    initialState,
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-xl border border-black/10 px-3 py-1.5 text-xs font-medium text-black/70 transition hover:border-black/25"
      >
        Cambiar contraseña
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2">
        <input
          type="password"
          name="password"
          placeholder="Nueva contraseña"
          minLength={6}
          required
          autoComplete="new-password"
          className="w-36 rounded-xl border border-black/10 px-2.5 py-1.5 text-xs outline-none focus:border-black/30"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center rounded-xl bg-black px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "..." : "Guardar"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-black/40 hover:text-black/70"
        >
          Cancelar
        </button>
      </div>
      {state.error && <span className="text-xs text-red-600">{state.error}</span>}
      {state.success && <span className="text-xs text-green-600">Contraseña actualizada.</span>}
    </form>
  );
}
