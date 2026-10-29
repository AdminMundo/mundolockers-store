"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/admin";
import { createSupabaseServer } from "@/lib/supabase/server";

export type EstadoPedido =
  | "recibido"
  | "gestionando"
  | "preparado"
  | "enviado"
  | "listo_retiro"
  | "entregado"
  | "cancelado";

export type EstadoPago = "pendiente" | "pagado" | "rechazado";

export async function updateEstadoPedidoAction(
  id: string,
  estado: EstadoPedido,
) {
  await requireAdmin();
  const supabase = createSupabaseServer();
  await supabase
    .from("pedidos")
    .update({ estado, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/pedidos");
}

export async function updateEstadoPagoAction(id: string, estado_pago: EstadoPago) {
  await requireAdmin();
  const supabase = createSupabaseServer();
  await supabase
    .from("pedidos")
    .update({ estado_pago, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/pedidos");
}

export async function deletePedidoAction(id: string) {
  await requireAdmin();
  const supabase = createSupabaseServer();
  await supabase.from("pedidos").delete().eq("id", id);
  revalidatePath("/admin/pedidos");
}
