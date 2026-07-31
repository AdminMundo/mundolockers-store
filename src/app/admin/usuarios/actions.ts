"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { addDbAdmin, isEnvAdminEmail, removeDbAdmin } from "@/lib/auth/roles";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function promoteToAdminAction(email: string): Promise<void> {
  const admin = await requireAdmin();

  const target = email.trim().toLowerCase();
  if (!target) return;

  await addDbAdmin(target, admin.email ?? null);
  revalidatePath("/admin/usuarios");
}

export async function demoteAdminAction(email: string): Promise<void> {
  await requireAdmin();

  const target = email.trim().toLowerCase();
  // Los admins fijos (ADMIN_EMAILS) no se pueden quitar desde el panel.
  if (!target || isEnvAdminEmail(target)) return;

  await removeDbAdmin(target);
  revalidatePath("/admin/usuarios");
}

export type AdminResetPasswordState = {
  error: string | null;
  success: boolean;
};

export async function adminResetPasswordAction(
  userId: string,
  _prevState: AdminResetPasswordState,
  formData: FormData,
): Promise<AdminResetPasswordState> {
  await requireAdmin();

  const password = String(formData.get("password") ?? "");
  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres.", success: false };
  }

  const supabase = createSupabaseServer();
  const { error } = await supabase.auth.admin.updateUserById(userId, { password });

  if (error) {
    return { error: "No se pudo actualizar la contraseña. Intenta nuevamente.", success: false };
  }

  return { error: null, success: true };
}
