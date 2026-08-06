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
