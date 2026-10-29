import "server-only";

import { createSupabaseServer } from "@/lib/supabase/server";

export type StaffRole = "admin" | "vendedor";

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

async function getDbStaffRoles(): Promise<Map<string, StaffRole>> {
  const supabase = createSupabaseServer();
  const { data, error } = await supabase.from("admin_users").select("email, role");
  const map = new Map<string, StaffRole>();

  // Si la columna "role" todavía no existe (migración no aplicada), se cae a
  // "email" solo y todos quedan como admin — así nadie pierde acceso mientras
  // se corre la migración.
  if (error) {
    const { data: legacy } = await supabase.from("admin_users").select("email");
    for (const row of legacy ?? []) {
      map.set(row.email.toLowerCase(), "admin");
    }
    return map;
  }

  for (const row of data ?? []) {
    map.set(row.email.toLowerCase(), (row.role as StaffRole | null) ?? "admin");
  }
  return map;
}

/** Rol de staff (admin o vendedor) del correo, o null si no tiene acceso al panel. */
export async function getStaffRole(email: string | null | undefined): Promise<StaffRole | null> {
  if (!email) return null;
  const lower = email.toLowerCase();
  if (ENV_ADMIN_EMAILS.has(lower)) return "admin";
  const dbRoles = await getDbStaffRoles();
  return dbRoles.get(lower) ?? null;
}

/** Chequeo completo (env + panel). True si puede entrar a /admin, con cualquier rol. */
export async function isAdminEmailAsync(email: string | null | undefined): Promise<boolean> {
  return (await getStaffRole(email)) !== null;
}

/** True solo si es admin completo (no vendedor). Usar para decisiones de acceso sensibles. */
export async function isFullAdminEmailAsync(email: string | null | undefined): Promise<boolean> {
  return (await getStaffRole(email)) === "admin";
}

/** Set combinado (env + DB) de todos los correos con acceso al panel, de cualquier rol. */
export async function getAdminEmailSet(): Promise<Set<string>> {
  const dbRoles = await getDbStaffRoles();
  return new Set([...ENV_ADMIN_EMAILS, ...dbRoles.keys()]);
}

/** Mapa correo -> rol (env + DB), para mostrar el rol real de cada cuenta en el panel. */
export async function getStaffRoleMap(): Promise<Map<string, StaffRole>> {
  const map = await getDbStaffRoles();
  for (const email of ENV_ADMIN_EMAILS) {
    map.set(email, "admin");
  }
  return map;
}

export async function addDbAdmin(email: string, role: StaffRole, addedBy: string | null) {
  const supabase = createSupabaseServer();
  return supabase
    .from("admin_users")
    .upsert({ email: email.toLowerCase(), role, added_by: addedBy }, { onConflict: "email" });
}

export async function removeDbAdmin(email: string) {
  const supabase = createSupabaseServer();
  return supabase.from("admin_users").delete().eq("email", email.toLowerCase());
}
