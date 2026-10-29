"use client";

import { useActionState, useEffect, useRef } from "react";
import { createStaffUserAction, type CreateStaffUserState } from "./actions";

const initialState: CreateStaffUserState = { error: null, success: false };

export function CreateUserForm() {
  const [state, formAction, pending] = useActionState(createStaffUserAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <section className="rounded-[32px] border border-black/10 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-black">Crear usuario</h2>
        <p className="mt-1 text-sm text-black/50">
          Crea una cuenta nueva directamente (sin que la persona tenga que registrarse) y asígnale
          un rol.
        </p>
      </div>

      <form
        ref={formRef}
        onSubmit={(event) => {
          // No se usa <form action={formAction}> a propósito: React vacía los
          // campos no controlados apenas la acción termina, incluso cuando el
          // resultado es un error de validación (correo inválido, etc.).
          event.preventDefault();
          formAction(new FormData(event.currentTarget));
        }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <div className="space-y-1.5 lg:col-span-2">
          <label htmlFor="new-email" className="text-sm font-medium text-black/70">
            Correo
          </label>
          <input
            id="new-email"
            name="email"
            type="email"
            required
            autoComplete="off"
            placeholder="vendedor@lockersstore.cl"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black/20"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="new-password" className="text-sm font-medium text-black/70">
            Contraseña
          </label>
          <input
            id="new-password"
            name="password"
            type="password"
            minLength={6}
            required
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black/20"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="new-full-name" className="text-sm font-medium text-black/70">
            Nombre (opcional)
          </label>
          <input
            id="new-full-name"
            name="full_name"
            type="text"
            placeholder="Nombre completo"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black/20"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="new-role" className="text-sm font-medium text-black/70">
            Rol
          </label>
          <select
            id="new-role"
            name="role"
            defaultValue="vendedor"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black/20"
          >
            <option value="vendedor">Vendedor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="flex items-end gap-3 sm:col-span-2 lg:col-span-5">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center rounded-2xl bg-[#0F172A] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Creando..." : "Crear usuario"}
          </button>
          {state.error && <span className="text-sm text-red-600">{state.error}</span>}
          {state.success && (
            <span className="text-sm text-green-600">Usuario creado correctamente.</span>
          )}
        </div>
      </form>

      <p className="mt-3 text-xs text-black/40">
        <strong>Admin</strong>: acceso completo al panel. <strong>Vendedor</strong>: solo puede ver
        y gestionar Cotizaciones y Cotizador.
      </p>
    </section>
  );
}
