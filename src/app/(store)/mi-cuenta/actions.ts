"use server";

import { createSupabaseServerAuthClient } from "@/lib/supabase/auth-server";

export type ChangePasswordState = {
  error: string | null;
  success: boolean;
};

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres.", success: false };
  }
  if (password !== confirm) {
    return { error: "Las contraseñas no coinciden.", success: false };
  }

  const supabase = await createSupabaseServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Debes iniciar sesión.", success: false };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: "No se pudo actualizar la contraseña. Intenta nuevamente.", success: false };
  }

  return { error: null, success: true };
}
