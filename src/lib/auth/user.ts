import "server-only";

import { redirect } from "next/navigation";
import { createSupabaseServerAuthClient } from "@/lib/supabase/auth-server";

/** Exige solo una sesión activa (cliente o admin) — sin filtro de ADMIN_EMAILS. */
export async function requireUser() {
  const supabase = await createSupabaseServerAuthClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/mi-cuenta");
  }

  return user;
}
