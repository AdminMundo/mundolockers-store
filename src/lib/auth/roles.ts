import "server-only";

import { createSupabaseServer } from "@/lib/supabase/server";

const ENV_ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);

/**
 * Chequeo rápido y síncrono (solo variable de entorno). Se usa donde no se
 * puede/conviene esperar una consulta a la base de datos (edge middleware,
 * decisiones de UX no críticas para seguridad).
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ENV_ADMIN_EMAILS.has(email.toLowerCase());
}

/** True si el correo es admin "fijo" (definido por ADMIN_EMAILS, no removible desde el panel). */
export function isEnvAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ENV_ADMIN_EMAILS.has(email.toLowerCase());
}

async function getDbAdminEmails(): Promise<Set<string>> {
  const supabase = createSupabaseServer();
  const { data } = await supabase.from("admin_users").select("email");
  return new Set((data ?? []).map((row) => row.email.toLowerCase()));
}

/** Chequeo completo (env + admins asignados desde el panel). Usar para toda decisión de acceso real. */
export async function isAdminEmailAsync(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;
  const lower = email.toLowerCase();
  if (ENV_ADMIN_EMAILS.has(lower)) return true;
  const dbEmails = await getDbAdminEmails();
  return dbEmails.has(lower);
}

/** Set combinado (env + DB) para chequear membresía de muchos usuarios sin una query por fila. */
export async function getAdminEmailSet(): Promise<Set<string>> {
  const dbEmails = await getDbAdminEmails();
  return new Set([...ENV_ADMIN_EMAILS, ...dbEmails]);
}

export async function addDbAdmin(email: string, addedBy: string | null) {
  const supabase = createSupabaseServer();
  return supabase
    .from("admin_users")
    .upsert({ email: email.toLowerCase(), added_by: addedBy }, { onConflict: "email" });
}

export async function removeDbAdmin(email: string) {
  const supabase = createSupabaseServer();
  return supabase.from("admin_users").delete().eq("email", email.toLowerCase());
}
