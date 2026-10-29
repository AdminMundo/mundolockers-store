"use client";

import { useActionState, useState } from "react";
import { deleteUserAction, type DeleteUserState } from "./actions";

const initialState: DeleteUserState = { error: null };

export function DeleteUserControl({ userId, email }: { userId: string; email: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    deleteUserAction.bind(null, userId, email),
    initialState,
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-xl border border-black/10 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:border-red-200 hover:bg-red-50"
      >
        Eliminar
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2">
        <span className="max-w-[160px] text-right text-xs text-black/50">
          ¿Eliminar esta cuenta? No se puede deshacer.
        </span>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center rounded-xl bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "..." : "Confirmar"}
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
    </form>
  );
}
