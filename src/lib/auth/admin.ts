import "server-only";

import { redirect } from "next/navigation";
import { createSupabaseServerAuthClient } from "@/lib/supabase/auth-server";
import { getStaffRole } from "@/lib/auth/roles";

/** Admin o vendedor: puede entrar al panel /admin, pero no necesariamente a toda sección. */
export async function requireStaff() {
  const supabase = await createSupabaseServerAuthClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  const role = await getStaffRole(user.email);
  if (!role) {
    redirect("/");
  }

  return { user, role };
}

/** Solo admin completo (no vendedor). Usar en secciones sensibles: productos, pedidos, clientes, usuarios. */
export async function requireAdmin() {
  const { user, role } = await requireStaff();

  if (role !== "admin") {
    redirect("/admin/cotizaciones");
  }

  return user;
}
