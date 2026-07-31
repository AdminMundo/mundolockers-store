"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerAuthClient } from "@/lib/supabase/auth-server";

export type SignupActionState = {
  error: string | null;
  success: boolean;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lockersstore.cl";

export async function signupAction(
  _prevState: SignupActionState,
  formData: FormData,
): Promise<SignupActionState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!nombre || !email || !password) {
    return { error: "Completa nombre, correo y contraseña.", success: false };
  }

  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres.", success: false };
  }

  const supabase = await createSupabaseServerAuthClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: nombre },
      emailRedirectTo: `${SITE_URL}/mi-cuenta`,
    },
  });

  if (error) {
    const message = error.message.toLowerCase().includes("already registered")
      ? "Ese correo ya tiene una cuenta. Intenta iniciar sesión."
      : "No se pudo crear la cuenta. Intenta nuevamente.";
    return { error: message, success: false };
  }

  // Si Supabase entrega sesión de inmediato (confirmación de correo
  // desactivada), la cuenta queda lista para usar altiro.
  if (data.session) {
    redirect("/mi-cuenta");
  }

  // Si no, falta confirmar el correo — se avisa en la misma página.
  return { error: null, success: true };
}
