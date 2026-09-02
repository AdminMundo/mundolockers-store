import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { requireAdmin } from "@/lib/auth/admin";
import { createSupabaseServer } from "@/lib/supabase/server";
import { sanitizeFileName } from "@/lib/utils";

const MAX_WIDTH = 1600;
const ALLOWED_IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp"]);
const ALLOWED_EXTENSIONS = new Set([...ALLOWED_IMAGE_EXTENSIONS, "pdf"]);

const CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  pdf: "application/pdf",
};

async function compressImage(buffer: Buffer, ext: string): Promise<Buffer> {
  const pipeline = sharp(buffer).resize({
    width: MAX_WIDTH,
    withoutEnlargement: true,
  });

  switch (ext) {
    case "png":
      return pipeline.png({ compressionLevel: 9, quality: 85 }).toBuffer();
    case "webp":
      return pipeline.webp({ quality: 80 }).toBuffer();
    default:
      return pipeline.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  }
}

export async function POST(req: NextRequest) {
  await requireAdmin();

  const formData = await req.formData();
  const file = formData.get("file");
  const bucket = formData.get("bucket");
  const folder = formData.get("folder");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
  }
  if (typeof bucket !== "string" || typeof folder !== "string") {
    return NextResponse.json(
      { error: "Falta bucket o folder" },
      { status: 400 },
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json(
      { error: "Formato de archivo no permitido" },
      { status: 400 },
    );
  }

  const rawName = file.name.replace(/\.[^.]+$/, "");
  const safeName = sanitizeFileName(rawName);
  const filePath = `${folder}/${Date.now()}-${safeName}.${ext}`;

  const originalBuffer = Buffer.from(await file.arrayBuffer());

  let uploadBuffer: Buffer = originalBuffer;
  if (ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
    try {
      uploadBuffer = await compressImage(originalBuffer, ext);
    } catch {
      // Si sharp no puede procesar el archivo (formato raro, corrupto),
      // se sube el original tal cual en vez de fallar la subida completa.
      uploadBuffer = originalBuffer;
    }
  }
  // PDFs (u otro archivo no-imagen permitido) se suben tal cual, sin pasar
  // por sharp.

  const supabase = createSupabaseServer();
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, uploadBuffer, {
      contentType: file.type || CONTENT_TYPES[ext] || "application/octet-stream",
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return NextResponse.json({ publicUrl: data.publicUrl });
}
