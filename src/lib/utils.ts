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
