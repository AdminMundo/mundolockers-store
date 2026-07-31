"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerAuthClient } from "@/lib/supabase/auth-server";
import { isAdminEmailAsync } from "@/lib/auth/roles";

export type LoginActionState = {
  error: string | null;
};

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const rawNext = String(formData.get("next") ?? "");

  if (!email || !password) {
    return { error: "Debes ingresar correo y contraseña." };
  }

  const supabase = await createSupabaseServerAuthClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Correo o contraseña inválidos." };
  }

  // Si no vino un "next" explícito, se decide según el rol del correo.
  const next = rawNext.startsWith("/")
    ? rawNext
    : (await isAdminEmailAsync(email))
      ? "/admin"
      : "/mi-cuenta";

  redirect(next);
}
