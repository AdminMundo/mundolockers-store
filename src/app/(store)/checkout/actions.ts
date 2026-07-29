"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { createFlowPayment } from "@/lib/flow";
import { escapeHtml, sanitizeHeaderText } from "@/lib/utils";
import { sendTransactionalEmail } from "@/lib/resend";

export type CreatePedidoResult =
  | { success: true; orderId: string }
  | { success: false; error: string };

export type CreateFlowPaymentResult =
  | { success: true; redirectUrl: string }
  | { success: false; error: string };

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lockersstore.cl";

/**
 * El monto a cobrar se lee siempre desde el pedido ya guardado en la base de
 * datos (calculado server-side en createPedidoAction) — nunca se acepta un
 * monto que venga del navegador, para que no se pueda alterar el precio a
 * pagar en Flow.
 */
export async function createFlowPaymentAction(
  orderId: string,
  email: string,
): Promise<CreateFlowPaymentResult> {
  try {
    const supabase = createSupabaseServer();

    const { data: pedido, error } = await supabase
      .from("pedidos")
      .select("id, numero, total, estado_pago")
      .eq("id", orderId)
      .single();

    if (error || !pedido) {
      return { success: false, error: "No se encontró el pedido a pagar." };
    }

    if (pedido.estado_pago === "pagado") {
      return { success: false, error: "Este pedido ya fue pagado." };
    }

    const label = pedido.numero
      ? `#${String(pedido.numero).padStart(4, "0")}`
      : pedido.id.slice(0, 8).toUpperCase();

    const { url, token } = await createFlowPayment({
      commerceOrder: pedido.id,
      subject: `Pedido LockerStore ${label}`,
      amount: pedido.total,
      email,
      urlConfirmation: `${SITE_URL}/api/flow/webhook`,
      urlReturn: `${SITE_URL}/api/flow/return`,
    });

    return { success: true, redirectUrl: `${url}?token=${token}` };
  } catch (err) {
    console.error("createFlowPaymentAction error:", err);
    return { success: false, error: "No se pudo iniciar el pago con Flow. Intenta nuevamente." };
  }
}

export type CreatePedidoInput = {
  nombre: string;
  correo: string;
  telefono: string;
  empresa: string;
  tipo_documento: string;
  rut_empresa: string;
  tipo_entrega: string;
  region: string;
  ciudad: string;
  direccion: string;
  tipo_pago: string;
  notas: string;
  productosJson: string;
};

type RequestedLine = {
  productId: string;
  variantId: string | null;
  quantity: number;
};

type ProductRow = {
  id: string;
  name: string;
  sku: string | null;
  slug: string;
  price_clp: number | null;
  is_active: boolean | null;
};

type VariantRow = {
  id: string;
  product_id: string;
  name: string | null;
  color: string | null;
  door_color: string | null;
  price_clp: number | null;
  is_active: boolean | null;
  variant_sku: string | null;
};

function getVariantLabel(variant: VariantRow): string {
  return variant.door_color || variant.color || variant.name || "Variante";
}

function parseRequestedLines(raw: string): RequestedLine[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) return [];

  const lines: RequestedLine[] = [];
  for (const entry of parsed) {
    if (typeof entry !== "object" || entry === null) continue;
    const e = entry as Record<string, unknown>;
    const productId = e.productId;
    const variantId = e.variantId;
    const quantity = e.quantity;

    if (typeof productId !== "string" || !productId) continue;
    if (!(variantId === null || typeof variantId === "string")) continue;
    if (typeof quantity !== "number" || !Number.isFinite(quantity)) continue;

    const safeQuantity = Math.min(999, Math.max(1, Math.floor(quantity)));
    lines.push({ productId, variantId: variantId || null, quantity: safeQuantity });
  }

  return lines;
}

/**
 * Recalcula precios y totales desde la base de datos. El cliente solo indica
 * qué producto/variante/cantidad quiere — nunca el precio ni el total, para
 * evitar que un pedido se cree (y se cobre vía Flow) con montos manipulados.
 */
async function buildValidatedOrder(
  supabase: ReturnType<typeof createSupabaseServer>,
  productosJson: string,
): Promise<
  | { ok: true; productos: Record<string, unknown>[]; subtotal: number; total: number }
  | { ok: false; error: string }
> {
  const requested = parseRequestedLines(productosJson);
  if (requested.length === 0) {
    return { ok: false, error: "El carrito de compra está vacío o no es válido." };
  }

  const productIds = [...new Set(requested.map((r) => r.productId))];
  const variantIds = [...new Set(requested.map((r) => r.variantId).filter((v): v is string => v !== null))];

  const [productsRes, variantsRes] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, sku, slug, price_clp, is_active")
      .in("id", productIds)
      .returns<ProductRow[]>(),
    variantIds.length > 0
      ? supabase
          .from("product_variants")
          .select("id, product_id, name, color, door_color, price_clp, is_active, variant_sku")
          .in("id", variantIds)
          .returns<VariantRow[]>()
      : Promise.resolve({ data: [] as VariantRow[], error: null }),
  ]);

  if (productsRes.error) {
    return { ok: false, error: "No se pudo verificar el catálogo de productos." };
  }
  if (variantsRes.error) {
    return { ok: false, error: "No se pudo verificar las variantes de producto." };
  }

  const productsById = new Map(productsRes.data.map((p) => [p.id, p]));
  const variantsById = new Map((variantsRes.data ?? []).map((v) => [v.id, v]));

  const productos: Record<string, unknown>[] = [];
  let subtotal = 0;

  for (const line of requested) {
    const product = productsById.get(line.productId);
    if (!product || !product.is_active) {
      return { ok: false, error: "Uno de los productos de tu pedido ya no está disponible." };
    }

    const variant = line.variantId ? variantsById.get(line.variantId) : null;
    if (line.variantId && (!variant || variant.product_id !== product.id || !variant.is_active)) {
      return { ok: false, error: "Una de las variantes seleccionadas ya no está disponible." };
    }

    const unitPrice = variant?.price_clp ?? product.price_clp;
    if (typeof unitPrice !== "number" || unitPrice <= 0) {
      return { ok: false, error: `"${product.name}" no tiene precio de compra directa disponible.` };
    }

    const lineSubtotal = unitPrice * line.quantity;
    subtotal += lineSubtotal;

    productos.push({
      productId: product.id,
      variantId: variant?.id ?? null,
      name: product.name,
      sku: variant?.variant_sku ?? product.sku ?? product.slug,
      variant: variant ? getVariantLabel(variant) : null,
      quantity: line.quantity,
      unitPrice,
    });
  }

  const iva = Math.round(subtotal * 0.19);
  const total = subtotal + iva;

  return { ok: true, productos, subtotal, total };
}

export async function createPedidoAction(
  input: CreatePedidoInput,
): Promise<CreatePedidoResult> {
  try {
    const supabase = createSupabaseServer();

    const validated = await buildValidatedOrder(supabase, input.productosJson);
    if (!validated.ok) {
      return { success: false, error: validated.error };
    }
    const { productos, subtotal, total } = validated;

    const notasCompleta = [
      input.tipo_documento === "factura" && input.rut_empresa
        ? `Factura — RUT: ${input.rut_empresa}`
        : "Boleta",
      input.notas,
    ]
      .filter(Boolean)
      .join("\n");

    const { data, error } = await supabase
      .from("pedidos")
      .insert({
        nombre: input.nombre,
        correo: input.correo,
        telefono: input.telefono,
        empresa: input.empresa || null,
        rut: input.rut_empresa || null,
        tipo_entrega: input.tipo_entrega,
        region: input.region || null,
        ciudad: input.ciudad || null,
        direccion: input.direccion || null,
        productos,
        subtotal,
        costo_despacho: 0,
        total,
        tipo_pago: input.tipo_pago,
        estado: "recibido",
        estado_pago: "pendiente",
        notas: notasCompleta || null,
      })
      .select("id, numero")
      .single();

    if (error || !data) {
      console.error("createPedidoAction error:", error);
      return { success: false, error: error?.message ?? "Error desconocido" };
    }

    // Notificación por email — cada envío es independiente y queda logueado si falla
    try {
      const notifyEmail = process.env.QUOTE_NOTIFICATION_EMAIL;
      if (notifyEmail) {
        const numeroLabel = data.numero
          ? `#${String(data.numero).padStart(4, "0")}`
          : data.id.slice(0, 8).toUpperCase();

        const entrega =
          input.tipo_entrega === "despacho"
            ? `Despacho — ${escapeHtml(input.ciudad)}, ${escapeHtml(input.region)}`
            : "Retiro en tienda";

        const esTransferencia = input.tipo_pago === "transferencia";
        const metodoPago = esTransferencia ? "transferencia bancaria" : "tarjeta / Flow";
        const nombreSubject = sanitizeHeaderText(input.nombre);

        const emails = [
          sendTransactionalEmail({
            to: notifyEmail,
            from: "LockerStore <pedidos@lockersstore.cl>",
            subject: `Nuevo pedido ${numeroLabel} — ${nombreSubject}`,
            html: `
              <h2>Nuevo pedido ${numeroLabel}</h2>
              <p><strong>Cliente:</strong> ${escapeHtml(input.nombre)}</p>
              <p><strong>Correo:</strong> ${escapeHtml(input.correo)}</p>
              <p><strong>Teléfono:</strong> ${escapeHtml(input.telefono)}</p>
              ${input.empresa ? `<p><strong>Empresa:</strong> ${escapeHtml(input.empresa)}</p>` : ""}
              <p><strong>Método de pago:</strong> ${metodoPago}</p>
              <p><strong>Entrega:</strong> ${entrega}</p>
              <p><strong>Total:</strong> $${total.toLocaleString("es-CL")}</p>
              ${input.notas ? `<p><strong>Notas:</strong> ${escapeHtml(input.notas)}</p>` : ""}
              <hr/>
              <p>Ver pedido en admin: <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lockersstore.cl"}/admin/pedidos">Panel de pedidos</a></p>
            `,
          }),
        ];

        // Email al cliente solo si es transferencia (Flow confirma por webhook)
        if (esTransferencia) {
          emails.push(
            sendTransactionalEmail({
              to: input.correo,
              from: "LockerStore <pedidos@lockersstore.cl>",
              subject: `Tu pedido ${numeroLabel} fue recibido — LockerStore`,
              html: `
                <h2>Recibimos tu pedido ${numeroLabel}</h2>
                <p>Hola ${escapeHtml(input.nombre)},</p>
                <p>Tu pedido fue recibido correctamente. Nos contactaremos contigo para coordinar el pago por transferencia bancaria.</p>
                <p><strong>Total:</strong> $${total.toLocaleString("es-CL")}</p>
                <p><strong>Entrega:</strong> ${entrega}</p>
                <hr/>
                <p>Si tienes dudas escríbenos a <a href="mailto:pedidos@lockersstore.cl">pedidos@lockersstore.cl</a></p>
              `,
            }),
          );
        }

        // En paralelo y de forma independiente: si uno falla, no bloquea al otro.
        await Promise.allSettled(emails);
      }
    } catch (emailErr) {
      console.error("[createPedidoAction] error enviando notificaciones:", emailErr);
    }

    return { success: true, orderId: data.id };
  } catch (err) {
    console.error("createPedidoAction exception:", err);
    return { success: false, error: "Error al crear el pedido. Intenta nuevamente." };
  }
}
