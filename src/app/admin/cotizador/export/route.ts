import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { createSupabaseServer } from "@/lib/supabase/server";

type ExportRow = {
  folio: number;
  fecha_emision: string;
  cliente_rut: string;
  cliente_nombre: string;
  cliente_telefono: string | null;
  cliente_email: string | null;
  referencia: string | null;
  vendedor: string;
  forma_pago: string;
  neto: number;
  iva: number;
  total: number;
  estado: string;
  trasladado_kame: boolean;
  trasladado_kame_por: string | null;
  trasladado_kame_en: string | null;
  trasladado_kame_numero_pedido: string | null;
  created_at: string;
};

function csvField(value: string | number | null | undefined): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[;"\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(req: NextRequest) {
  await requireAdmin();

  const sp = req.nextUrl.searchParams;
  const folio = sp.get("folio")?.trim() ?? "";
  const rut = sp.get("rut")?.trim() ?? "";
  const cliente = sp.get("cliente")?.trim() ?? "";
  const vendedor = sp.get("vendedor")?.trim() ?? "";
  const referencia = sp.get("referencia")?.trim() ?? "";
  const desde = sp.get("desde")?.trim() ?? "";
  const hasta = sp.get("hasta")?.trim() ?? "";
  const estado = sp.get("estado")?.trim() ?? "";
  const kame = sp.get("kame")?.trim() ?? "";

  const supabase = createSupabaseServer();
  let query = supabase
    .from("cotizaciones_formales")
    .select(
      "folio, fecha_emision, cliente_rut, cliente_nombre, cliente_telefono, cliente_email, referencia, vendedor, forma_pago, neto, iva, total, estado, trasladado_kame, trasladado_kame_por, trasladado_kame_en, trasladado_kame_numero_pedido, created_at",
    )
    .order("folio", { ascending: false })
    .limit(5000);

  if (folio) query = query.eq("folio", Number(folio));
  if (rut) query = query.ilike("cliente_rut", `%${rut}%`);
  if (cliente) query = query.ilike("cliente_nombre", `%${cliente}%`);
  if (vendedor) query = query.ilike("vendedor", `%${vendedor}%`);
  if (referencia) query = query.ilike("referencia", `%${referencia}%`);
  if (desde) query = query.gte("fecha_emision", desde);
  if (hasta) query = query.lte("fecha_emision", hasta);
  if (estado) query = query.eq("estado", estado);
  if (kame === "si") query = query.eq("trasladado_kame", true);
  if (kame === "no") query = query.eq("trasladado_kame", false);

  const { data, error } = await query.returns<ExportRow[]>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const header = [
    "Folio",
    "Fecha Emisión",
    "RUT Cliente",
    "Razón Social",
    "Teléfono",
    "Email Cliente",
    "Referencia/Proyecto",
    "Vendedor",
    "Forma de Pago",
    "Neto ($)",
    "IVA ($)",
    "Total ($)",
    "Estado",
    "Trasladado a Kame",
    "N° Pedido Kame",
    "Trasladado por",
    "Trasladado el",
    "Fecha Registro",
  ];

  const lines = [header.map(csvField).join(";")];

  for (const r of data ?? []) {
    lines.push(
      [
        String(r.folio).padStart(4, "0"),
        r.fecha_emision,
        r.cliente_rut,
        r.cliente_nombre,
        r.cliente_telefono ?? "",
        r.cliente_email ?? "",
        r.referencia ?? "",
        r.vendedor,
        r.forma_pago,
        Math.round(r.neto).toLocaleString("es-CL"),
        Math.round(r.iva).toLocaleString("es-CL"),
        Math.round(r.total).toLocaleString("es-CL"),
        r.estado,
        r.trasladado_kame ? "Sí" : "No",
        r.trasladado_kame_numero_pedido ?? "",
        r.trasladado_kame_por ?? "",
        r.trasladado_kame_en ?? "",
        r.created_at,
      ]
        .map(csvField)
        .join(";"),
    );
  }

  const csv = "﻿" + lines.join("\r\n");
  const filename = `Cotizaciones_LockerStore_${new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-")}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
