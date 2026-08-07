import { NextResponse } from "next/server";
import { createSupabaseServerAuthClient } from "@/lib/supabase/auth-server";
import { isAdminEmailAsync } from "@/lib/auth/roles";

/**
 * Resuelve la sesión actual para el Navbar. Vive en una ruta aparte (en vez
 * de leerse en el layout compartido) para que las páginas de la tienda no
 * queden forzadas a renderizado dinámico solo por mostrar "Mi cuenta" vs
 * "Iniciar sesión" — esta ruta sí es dinámica (usa cookies), pero al ser
 * un fetch del cliente no le quita el cache a la página en sí.
 */
export async function GET() {
  const supabase = await createSupabaseServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ user: null });
  }

  const isAdmin = await isAdminEmailAsync(user.email);

  return NextResponse.json({
    user: { email: user.email ?? null, isAdmin },
  });
}
