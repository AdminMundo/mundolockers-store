"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { createSupabaseServerAuthClient } from "@/lib/supabase/auth-server";

export type QuoteItemInput = {
  productId: string | null;
  variantId: string | null;
  sku: string;
  name: string;
  variant: string | null;
  quantity: number;
  unitPrice: number;
};

export type SaveCotizacionFormalInput = {
  clienteRut: string;
  clienteNombre: string;
  clienteDireccion: string;
  clienteTelefono: string;
  clienteEmail: string;
  referencia: string;
  fechaEmision: string;
  vendedor: string;
  formaPago: string;
  condiciones: string;
  vigenciaDias: number;
  descuentoTipo: "pct" | "monto";
  descuentoValor: number;
  items: QuoteItemInput[];
};

export type SaveCotizacionFormalResult =
  | { success: true; id: string; folio: number }
  | { success: false; error: string };

type ProductRow = {
  id: string;
  name: string;
  sku: string | null;
  price_clp: number | null;
  image_url: string | null;
};

type VariantRow = {
  id: string;
  product_id: string;
  name: string | null;
  color: string | null;
  door_color: string | null;
  price_clp: number | null;
  variant_sku: string | null;
};

export type ProductSearchResult = {
  productId: string;
  variantId: string | null;
  sku: string;
  name: string;
  variant: string | null;
  unitPrice: number;
  imageUrl: string | null;
};

function getVariantLabel(variant: VariantRow): string | null {
  const label = variant.door_color || variant.color || variant.name;
  if (!label || label.trim().toLowerCase() === "default") return null;
  return label;
}

export async function searchProductsForQuoteAction(
  query: string,
): Promise<ProductSearchResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const supabase = createSupabaseServer();

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, sku, price_clp, image_url")
    .eq("is_active", true)
    .or(`name.ilike.%${q}%,sku.ilike.%${q}%`)
    .limit(8)
    .returns<ProductRow[]>();

  if (error || !products || products.length === 0) return [];

  const productIds = products.map((p) => p.id);
  const { data: variants } = await supabase
    .from("product_variants")
    .select("id, product_id, name, color, door_color, price_clp, variant_sku")
    .in("product_id", productIds)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .returns<VariantRow[]>();

  const variantsByProduct = new Map<string, VariantRow[]>();
  for (const v of variants ?? []) {
    const list = variantsByProduct.get(v.product_id) ?? [];
    list.push(v);
    variantsByProduct.set(v.product_id, list);
  }

  const results: ProductSearchResult[] = [];
  for (const p of products) {
    const productVariants = variantsByProduct.get(p.id) ?? [];

    if (productVariants.length === 0) {
      if (typeof p.price_clp === "number" && p.price_clp > 0) {
        results.push({
          productId: p.id,
          variantId: null,
          sku: p.sku ?? "",
          name: p.name,
          variant: null,
          unitPrice: p.price_clp,
          imageUrl: p.image_url,
        });
      }
      continue;
    }

    for (const v of productVariants) {
      const unitPrice = v.price_clp ?? p.price_clp;
      if (typeof unitPrice !== "number" || unitPrice <= 0) continue;
      results.push({
        productId: p.id,
        variantId: v.id,
        sku: v.variant_sku || p.sku || "",
        name: p.name,
        variant: getVariantLabel(v),
        unitPrice,
        imageUrl: p.image_url,
      });
    }
  }

  return results.slice(0, 12);
}

export type ClienteCotizacion = {
  rut: string;
  nombre: string;
  direccion: string | null;
  telefono: string | null;
  email: string | null;
};

export async function searchClientByRutAction(
  rut: string,
): Promise<ClienteCotizacion | null> {
  const rutTrim = rut.trim();
  if (!rutTrim) return null;

  const supabase = createSupabaseServer();
  const { data } = await supabase
    .from("clientes_cotizacion")
    .select("rut, nombre, direccion, telefono, email")
    .eq("rut", rutTrim)
    .maybeSingle<ClienteCotizacion>();

  return data ?? null;
}

function computeTotals(
  items: QuoteItemInput[],
  descuentoTipo: "pct" | "monto",
  descuentoValor: number,
) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const descuentoMonto =
    descuentoTipo === "pct" ? subtotal * (descuentoValor / 100) : descuentoValor;
  const neto = Math.max(0, subtotal - descuentoMonto);
  const iva = Math.round(neto * 0.19);
  const total = neto + iva;

  return { subtotal, descuentoMonto, neto, iva, total };
}

function validateInput(input: SaveCotizacionFormalInput): string | null {
  if (!input.clienteRut.trim()) return "El RUT del cliente es obligatorio.";
  if (!input.clienteNombre.trim()) return "La razón social del cliente es obligatoria.";

  const validItems = input.items.filter(
    (item) => item.name.trim() && item.quantity > 0,
  );
  if (validItems.length === 0) return "Agrega al menos un producto.";

  return null;
}

export async function createCotizacionFormalAction(
  input: SaveCotizacionFormalInput,
): Promise<SaveCotizacionFormalResult> {
  const validationError = validateInput(input);
  if (validationError) return { success: false, error: validationError };

  const items = input.items.filter(
    (item) => item.name.trim() && item.quantity > 0,
  );
  const { subtotal, neto, iva, total } = computeTotals(
    items,
    input.descuentoTipo,
    input.descuentoValor,
  );

  const supabase = createSupabaseServer();

  await supabase.from("clientes_cotizacion").upsert(
    {
      rut: input.clienteRut.trim(),
      nombre: input.clienteNombre.trim(),
      direccion: input.clienteDireccion.trim() || null,
      telefono: input.clienteTelefono.trim() || null,
      email: input.clienteEmail.trim() || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "rut" },
  );

  const { data, error } = await supabase
    .from("cotizaciones_formales")
    .insert({
      cliente_rut: input.clienteRut.trim(),
      cliente_nombre: input.clienteNombre.trim(),
      cliente_direccion: input.clienteDireccion.trim() || null,
      cliente_telefono: input.clienteTelefono.trim() || null,
      cliente_email: input.clienteEmail.trim() || null,
      referencia: input.referencia.trim() || null,
      fecha_emision: input.fechaEmision || new Date().toISOString().slice(0, 10),
      vendedor: input.vendedor.trim(),
      forma_pago: input.formaPago,
      condiciones: input.condiciones,
      vigencia_dias: input.vigenciaDias,
      descuento_tipo: input.descuentoTipo,
      descuento_valor: input.descuentoValor,
      subtotal,
      neto,
      iva,
      total,
      items,
      estado: "pendiente",
    })
    .select("id, folio")
    .single();

  if (error || !data) {
    return { success: false, error: error?.message ?? "No se pudo guardar la cotización." };
  }

  revalidatePath("/admin/cotizador");
  return { success: true, id: data.id, folio: data.folio };
}

export async function updateCotizacionFormalAction(
  id: string,
  input: SaveCotizacionFormalInput,
): Promise<SaveCotizacionFormalResult & { folio?: number }> {
  const validationError = validateInput(input);
  if (validationError) return { success: false, error: validationError };

  const items = input.items.filter(
    (item) => item.name.trim() && item.quantity > 0,
  );
  const { subtotal, neto, iva, total } = computeTotals(
    items,
    input.descuentoTipo,
    input.descuentoValor,
  );

  const supabase = createSupabaseServer();

  await supabase.from("clientes_cotizacion").upsert(
    {
      rut: input.clienteRut.trim(),
      nombre: input.clienteNombre.trim(),
      direccion: input.clienteDireccion.trim() || null,
      telefono: input.clienteTelefono.trim() || null,
      email: input.clienteEmail.trim() || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "rut" },
  );

  const { data, error } = await supabase
    .from("cotizaciones_formales")
    .update({
      cliente_rut: input.clienteRut.trim(),
      cliente_nombre: input.clienteNombre.trim(),
      cliente_direccion: input.clienteDireccion.trim() || null,
      cliente_telefono: input.clienteTelefono.trim() || null,
      cliente_email: input.clienteEmail.trim() || null,
      referencia: input.referencia.trim() || null,
      fecha_emision: input.fechaEmision || new Date().toISOString().slice(0, 10),
      vendedor: input.vendedor.trim(),
      forma_pago: input.formaPago,
      condiciones: input.condiciones,
      vigencia_dias: input.vigenciaDias,
      descuento_tipo: input.descuentoTipo,
      descuento_valor: input.descuentoValor,
      subtotal,
      neto,
      iva,
      total,
      items,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, folio")
    .single();

  if (error || !data) {
    return { success: false, error: error?.message ?? "No se pudo actualizar la cotización." };
  }

  revalidatePath("/admin/cotizador");
  revalidatePath(`/admin/cotizador/${data.folio}`);
  return { success: true, id: data.id, folio: data.folio };
}

export type EstadoCotizacionFormal =
  | "pendiente"
  | "enviada"
  | "aceptada"
  | "rechazada"
  | "vencida";

export async function updateEstadoFormalAction(
  id: string,
  estado: EstadoCotizacionFormal,
): Promise<{ error: string | null }> {
  const supabase = createSupabaseServer();

  const { error } = await supabase
    .from("cotizaciones_formales")
    .update({ estado, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/cotizador");
  return { error: null };
}

export async function deleteCotizacionFormalAction(id: string) {
  const supabase = createSupabaseServer();
  await supabase.from("cotizaciones_formales").delete().eq("id", id);
  revalidatePath("/admin/cotizador");
  redirect("/admin/cotizador");
}

export type TrasladadoKameResult =
  | {
      success: true;
      trasladadoPor: string | null;
      trasladadoEn: string | null;
      numeroPedido: string | null;
    }
  | { success: false; error: string };

/**
 * Aviso manual de "ya se subió a Kame" para evitar que dos vendedores dupliquen
 * el mismo pedido en el ERP. Queda registrado quién lo marcó, cuándo, y opcionalmente
 * el número de pedido que Kame asignó.
 */
export async function setTrasladadoKameAction(
  id: string,
  trasladado: boolean,
  numeroPedido?: string,
): Promise<TrasladadoKameResult> {
  const authClient = await createSupabaseServerAuthClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  const trasladadoPor = trasladado ? (user?.email ?? "Admin") : null;
  const trasladadoEn = trasladado ? new Date().toISOString() : null;
  const numeroPedidoFinal = trasladado ? (numeroPedido?.trim() || null) : null;

  const supabase = createSupabaseServer();
  const { error } = await supabase
    .from("cotizaciones_formales")
    .update({
      trasladado_kame: trasladado,
      trasladado_kame_por: trasladadoPor,
      trasladado_kame_en: trasladadoEn,
      trasladado_kame_numero_pedido: numeroPedidoFinal,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/cotizador");
  return { success: true, trasladadoPor, trasladadoEn, numeroPedido: numeroPedidoFinal };
}
