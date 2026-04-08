"use client";

import { useState, useTransition, type ChangeEvent } from "react";
import { createSupabaseBrowserAuthClient } from "@/lib/supabase/auth-browser";

type ProductImageUploadProps = {
  name: string;
  defaultValue?: string;
  bucket?: string;
  folder?: string;
  label?: string;
};

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProductImageUpload({
  name,
  defaultValue = "",
  bucket = "product-images",
  folder = "products",
  label,
}: ProductImageUploadProps) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    startTransition(async () => {
      try {
        const supabase = createSupabaseBrowserAuthClient();

        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const rawName = file.name.replace(/\.[^.]+$/, "");
        const safeName = sanitizeFileName(rawName);
        const filePath = `${folder}/${Date.now()}-${safeName}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          setError(uploadError.message);
          return;
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        setValue(data.publicUrl);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "No se pudo subir la imagen"
        );
      }
    });
  }

  return (
    <div className="space-y-3">
      {label ? (
        <label className="text-sm font-medium text-black/70">{label}</label>
      ) : null}

      <input type="hidden" name={name} value={value} readOnly />

      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center rounded-2xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90">
          {isPending ? "Subiendo..." : "Subir imagen"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            onChange={handleFileChange}
            disabled={isPending}
          />
        </label>

        {value ? (
          <button
            type="button"
            onClick={() => setValue("")}
            className="inline-flex items-center rounded-2xl border border-black/10 px-4 py-2.5 text-sm font-medium text-black/75 transition hover:border-black/20"
          >
            Quitar
          </button>
        ) : null}
      </div>

      <input
        value={value}
        readOnly
        placeholder="La URL se llenará automáticamente"
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black/70 outline-none"
      />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Error al subir imagen: {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[24px] border border-black/10 bg-[#F8F8FA]">
        {value ? (
          <img
            src={value}
            alt="Vista previa"
            className="h-[220px] w-full object-contain p-4"
          />
        ) : (
          <div className="flex h-[220px] items-center justify-center text-sm text-black/45">
            Aún no hay imagen cargada.
          </div>
        )}
      </div>
    </div>
  );
}