"use client";

import { useActionState } from "react";
import { signupAction, type SignupActionState } from "@/app/(auth)/registro/actions";

const initialState: SignupActionState = {
  error: null,
  success: false,
};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(signupAction, initialState);

  if (state.success) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
        Creamos tu cuenta. Revisa tu correo para confirmarla antes de iniciar
        sesión.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="nombre" className="text-sm font-medium text-black/80">
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          required
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30"
          placeholder="Tu nombre"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-black/80">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30"
          placeholder="tu@correo.cl"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-black/80">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30"
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      {state.error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  );
}
