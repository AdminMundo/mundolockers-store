"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/auth/admin";
import { createSupabaseServer } from "@/lib/supabase/server";

export type EstadoCotizacion = "pendiente" | "en-proceso" | "respondida" | "cerrada";

export async function updateEstadoAction(
  id: string,
  estado: EstadoCotizacion,
): Promise<{ error: string | null }> {
  await requireStaff();
  const supabase = createSupabaseServer();

  const { error } = await supabase
    .from("cotizaciones")
    .update({ estado })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/cotizaciones");
  return { error: null };
}

export async function deleteCotizacionAction(id: string) {
  await requireStaff();
  const supabase = createSupabaseServer();
  await supabase.from("cotizaciones").delete().eq("id", id);
  revalidatePath("/admin/cotizaciones");
}
