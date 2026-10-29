"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { addDbAdmin, isEnvAdminEmail, removeDbAdmin, type StaffRole } from "@/lib/auth/roles";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function promoteStaffAction(email: string, role: StaffRole): Promise<void> {
  const admin = await requireAdmin();

  const target = email.trim().toLowerCase();
  if (!target) return;

  await addDbAdmin(target, role, admin.email ?? null);
  revalidatePath("/admin/usuarios");
}

export async function revokeStaffAction(email: string): Promise<void> {
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

  // Si el correo anterior tenía rol asignado desde el panel, se traslada al correo nuevo.
  if (prevLower && !isEnvAdminEmail(prevLower)) {
    const { data: existingAdminRow } = await supabase
      .from("admin_users")
      .select("role, added_by")
      .eq("email", prevLower)
      .maybeSingle();

    if (existingAdminRow) {
      await removeDbAdmin(prevLower);
      await addDbAdmin(
        newEmail,
        (existingAdminRow.role as StaffRole | null) ?? "admin",
        existingAdminRow.added_by ?? null,
      );
    }
  }

  revalidatePath("/admin/usuarios");
  return { error: null, success: true };
}

export type CreateStaffUserState = {
  error: string | null;
  success: boolean;
};

export async function createStaffUserAction(
  _prevState: CreateStaffUserState,
  formData: FormData,
): Promise<CreateStaffUserState> {
  const admin = await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const role = String(formData.get("role") ?? "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Correo inválido.", success: false };
  }
  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres.", success: false };
  }
  if (role !== "admin" && role !== "vendedor") {
    return { error: "Selecciona un rol válido.", success: false };
  }

  const supabase = createSupabaseServer();
  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: fullName ? { full_name: fullName } : undefined,
  });

  if (error) {
    const message = /already|registered|exists/i.test(error.message)
      ? "Ese correo ya tiene una cuenta."
      : "No se pudo crear el usuario. Intenta nuevamente.";
    return { error: message, success: false };
  }

  await addDbAdmin(email, role, admin.email ?? null);

  revalidatePath("/admin/usuarios");
  return { error: null, success: true };
}

export type DeleteUserState = {
  error: string | null;
};

export async function deleteUserAction(
  userId: string,
  email: string,
  _prevState: DeleteUserState,
  _formData: FormData,
): Promise<DeleteUserState> {
  const admin = await requireAdmin();

  const target = email.trim().toLowerCase();
  if (isEnvAdminEmail(target)) {
    return { error: "No puedes eliminar un admin fijo definido por variable de entorno." };
  }
  if (admin.email && target === admin.email.toLowerCase()) {
    return { error: "No puedes eliminar tu propia cuenta." };
  }

  const supabase = createSupabaseServer();
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    return { error: "No se pudo eliminar el usuario. Intenta nuevamente." };
  }

  await removeDbAdmin(target);
  revalidatePath("/admin/usuarios");
  return { error: null };
}
