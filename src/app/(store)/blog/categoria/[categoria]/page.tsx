import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BLOG_CATEGORIES,
  getPostsByCategory,
  isBlogCategory,
  SITE_URL,
  type BlogCategorySlug,
} from "@/lib/blog";
import { BlogListing } from "@/components/blog/blog-listing";

type Params = { categoria: string };

export function generateStaticParams() {
  return (Object.keys(BLOG_CATEGORIES) as BlogCategorySlug[]).map((categoria) => ({ categoria }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { categoria } = await params;
  if (!isBlogCategory(categoria)) return { title: "Categoría no encontrada", robots: { index: false } };

  const name = BLOG_CATEGORIES[categoria];
  const description = `Artículos del blog de LockerStore sobre ${name.toLowerCase()}: guías y consejos para comprar lockers y casilleros metálicos en Chile.`;
  const url = `/blog/categoria/${categoria}`;

  return {
    title: `${name} | Blog`,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${name} | LockerStore`, description, url: `${SITE_URL}${url}`, type: "website" },
    twitter: { card: "summary_large_image", title: `${name} | LockerStore`, description },
  };
}

export default async function BlogCategoriaPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { categoria } = await params;
  if (!isBlogCategory(categoria)) notFound();

  const { page } = await searchParams;
  const name = BLOG_CATEGORIES[categoria];

  return (
    <BlogListing
      eyebrow="Blog"
      title={name}
      description={`Artículos sobre ${name.toLowerCase()} para comprar lockers y casilleros metálicos en Chile.`}
      posts={getPostsByCategory(categoria)}
      page={Number(page) || 1}
      activeCategory={categoria}
    />
  );
}
