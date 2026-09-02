"use client";

import { useState, useTransition, type ChangeEvent } from "react";
import { FileText } from "lucide-react";

type ProductPdfUploadProps = {
  name: string;
  defaultValue?: string;
  bucket?: string;
  folder?: string;
  label?: string;
};

function fileNameFromUrl(url: string): string {
  try {
    return decodeURIComponent(url.split("/").pop() ?? url);
  } catch {
    return url;
  }
}

export default function ProductPdfUpload({
  name,
  defaultValue = "",
  bucket = "product-files",
  folder = "tech-sheets-pdf",
  label,
}: ProductPdfUploadProps) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    startTransition(async () => {
      try {
        const body = new FormData();
        body.append("file", file);
        body.append("bucket", bucket);
        body.append("folder", folder);

        const res = await fetch("/api/admin/upload-image", {
          method: "POST",
          body,
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? "No se pudo subir el PDF");
          return;
        }

        setValue(data.publicUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo subir el PDF");
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
          {isPending ? "Subiendo..." : "Subir PDF"}
          <input
            type="file"
            accept="application/pdf"
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

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Error al subir PDF: {error}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-[24px] border border-black/10 bg-[#F8F8FA]">
        {value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 text-sm text-black/70 hover:text-black"
          >
            <FileText className="h-5 w-5 shrink-0 text-[#0477BF]" />
            <span className="truncate">{fileNameFromUrl(value)}</span>
          </a>
        ) : (
          <div className="flex h-[80px] items-center justify-center text-sm text-black/45">
            Aún no hay PDF cargado.
          </div>
        )}
      </div>
    </div>
  );
}
