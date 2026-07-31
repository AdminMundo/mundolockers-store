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

export type AdminUpdateEmailState = {
  error: string | null;
  success: boolean;
};

export async function adminUpdateEmailAction(
  userId: string,
  currentEmail: string,
  _prevState: AdminUpdateEmailState,
  formData: FormData,
): Promise<AdminUpdateEmailState> {
  await requireAdmin();

  const newEmail = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    return { error: "Correo inválido.", success: false };
  }

  const prevLower = currentEmail.trim().toLowerCase();
  if (newEmail === prevLower) {
    return { error: null, success: true };
  }

  const supabase = createSupabaseServer();
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    email: newEmail,
    email_confirm: true,
  });

  if (error) {
    const message = /already|registered|exists/i.test(error.message)
      ? "Ese correo ya está en uso por otra cuenta."
      : "No se pudo actualizar el correo. Intenta nuevamente.";
    return { error: message, success: false };
  }

  // Si el correo anterior tenía admin asignado desde el panel, se traslada al correo nuevo.
  if (prevLower && !isEnvAdminEmail(prevLower)) {
    const { data: existingAdminRow } = await supabase
      .from("admin_users")
      .select("added_by")
      .eq("email", prevLower)
      .maybeSingle();

    if (existingAdminRow) {
      await removeDbAdmin(prevLower);
      await addDbAdmin(newEmail, existingAdminRow.added_by ?? null);
    }
  }

  revalidatePath("/admin/usuarios");
  return { error: null, success: true };
}
