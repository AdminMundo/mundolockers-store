import "server-only";

import { redirect } from "next/navigation";
import { createSupabaseServerAuthClient } from "@/lib/supabase/auth-server";

const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);

export async function requireAdmin() {
  const supabase = await createSupabaseServerAuthClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  const email = user.email?.toLowerCase() ?? "";

  if (!ADMIN_EMAILS.has(email)) {
    redirect("/");
  }

  return user;
}