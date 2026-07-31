"use client";

import { useActionState } from "react";
import { changePasswordAction, type ChangePasswordState } from "./actions";

const initialState: ChangePasswordState = { error: null, success: false };

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, initialState);

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-black/70">
          Nueva contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          placeholder="Mínimo 6 caracteres"
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirm" className="text-sm font-medium text-black/70">
          Confirmar contraseña
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          placeholder="Repite la contraseña"
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30"
        />
      </div>

      <div className="sm:col-span-2">
        {state.error && (
          <p className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </p>
        )}
        {state.success && (
          <p className="mb-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Contraseña actualizada.
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-2xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </div>
    </form>
  );
}
