import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lockersstore.cl";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const WORDS_PER_MINUTE = 200;

export const BLOG_CATEGORIES = {
  "guias-de-compra": "Guías de compra",
  proyectos: "Proyectos institucionales",
  consejos: "Consejos",
} as const;

export type BlogCategorySlug = keyof typeof BLOG_CATEGORIES;

export type BlogFaq = { q: string; a: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated: string;
  author: string;
  category: BlogCategorySlug;
  tags: string[];
  coverImage: string;
  coverAlt: string;
  coverWidth: number;
  coverHeight: number;
  tiendaCategoria: string;
  productosRelacionados: string[];
  faq: BlogFaq[];
  html: string;
  readingMinutes: number;
};

function readPost(file: string): BlogPost {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const words = content.trim().split(/\s+/).length;

  return {
    slug: path.basename(file, ".md"),
    title: String(data.title),
    description: String(data.description),
    date: String(data.date),
    updated: String(data.updated ?? data.date),
    author: String(data.author),
    category: data.category as BlogCategorySlug,
    tags: (data.tags ?? []) as string[],
    coverImage: String(data.coverImage),
    coverAlt: String(data.coverAlt),
    coverWidth: Number(data.coverWidth),
    coverHeight: Number(data.coverHeight),
    tiendaCategoria: String(data.tiendaCategoria),
    productosRelacionados: (data.productosRelacionados ?? []) as string[],
    faq: (data.faq ?? []) as BlogFaq[],
    html: marked.parse(content, { async: false }) as string,
    readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
  };
}

let cache: BlogPost[] | null = null;

export function getAllPosts(): BlogPost[] {
  if (!cache) {
    cache = fs
      .readdirSync(BLOG_DIR)
      .filter((f) => f.endsWith(".md"))
      .map(readPost)
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }
  return cache;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getPostsByCategory(category: BlogCategorySlug): BlogPost[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function isBlogCategory(value: string): value is BlogCategorySlug {
  return Object.prototype.hasOwnProperty.call(BLOG_CATEGORIES, value);
}

export function formatBlogDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
