import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}

/** Escapa texto de usuario antes de interpolarlo en HTML (ej: emails). */
export function escapeHtml(value: string): string {
  return String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPES[char])
}

/** Quita saltos de línea de texto de usuario antes de usarlo en un header de email (ej: Subject). */
export function sanitizeHeaderText(value: string): string {
  return String(value).replace(/[\r\n]+/g, " ").trim()
}

/** Parsea una lista de correos separados por coma (variables de entorno de notificación). */
export function parseEmailList(raw: string | undefined | null): string[] {
  if (!raw) return []
  return raw
    .split(",")
    .map((email) => email.trim())
    .filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
}

/**
 * Corta un texto a un largo máximo sin partir palabras (útil para meta
 * descriptions: Google recomienda ~140-155 caracteres). Si corta, agrega "…".
 */
export function truncateAtWord(value: string, maxLength = 155): string {
  const text = value.trim().replace(/\s+/g, " ")
  if (text.length <= maxLength) return text

  const cut = text.slice(0, maxLength)
  const lastSpace = cut.lastIndexOf(" ")
  const safeCut = lastSpace > 0 ? cut.slice(0, lastSpace) : cut

  return `${safeCut.trimEnd()}…`
}

/** Normaliza un nombre de archivo para usarlo como parte de una URL/path. */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
}
