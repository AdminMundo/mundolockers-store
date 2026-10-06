import Link from "next/link";
import { BLOG_CATEGORIES, type BlogCategorySlug, type BlogPost } from "@/lib/blog";
import { BlogCard } from "@/components/blog/blog-card";

export const BLOG_PAGE_SIZE = 9;

type BlogListingProps = {
  eyebrow: string;
  title: string;
  description: string;
  posts: BlogPost[];
  page: number;
  activeCategory?: BlogCategorySlug;
};

function pageHref(page: number, category?: BlogCategorySlug) {
  const base = category ? `/blog/categoria/${category}` : "/blog";
  return page > 1 ? `${base}?page=${page}` : base;
}

export function BlogListing({ eyebrow, title, description, posts, page, activeCategory }: BlogListingProps) {
  const totalPages = Math.max(1, Math.ceil(posts.length / BLOG_PAGE_SIZE));
  const current = Math.min(Math.max(1, page), totalPages);
  const visible = posts.slice((current - 1) * BLOG_PAGE_SIZE, current * BLOG_PAGE_SIZE);

  return (
    <main className="min-h-screen bg-[#EEEDEB]">
      <section className="relative overflow-hidden bg-[#0F172A] pt-28 pb-16">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,rgba(4,119,191,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(4,119,191,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-[#0477BF]/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <span className="inline-flex rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            {eyebrow}
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">{description}</p>

          <nav aria-label="Categorías del blog" className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/blog"
              className={[
                "rounded-full border px-4 py-1.5 text-sm font-medium transition",
                !activeCategory
                  ? "border-white bg-white text-[#0F172A]"
                  : "border-white/15 bg-white/5 text-white/80 hover:border-white/40 hover:text-white",
              ].join(" ")}
            >
              Todos
            </Link>
            {(Object.keys(BLOG_CATEGORIES) as BlogCategorySlug[]).map((slug) => (
              <Link
                key={slug}
                href={`/blog/categoria/${slug}`}
                className={[
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition",
                  activeCategory === slug
                    ? "border-white bg-white text-[#0F172A]"
                    : "border-white/15 bg-white/5 text-white/80 hover:border-white/40 hover:text-white",
                ].join(" ")}
              >
                {BLOG_CATEGORIES[slug]}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-24 pt-12 sm:px-6">
        {visible.length === 0 ? (
          <p className="rounded-[28px] border border-black/10 bg-white p-10 text-center text-sm text-zinc-600">
            Todavía no hay artículos en esta categoría.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav aria-label="Paginación del blog" className="mt-12 flex items-center justify-center gap-2">
            {current > 1 && (
              <Link
                href={pageHref(current - 1, activeCategory)}
                className="inline-flex h-10 items-center rounded-xl border border-black/10 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:border-[#0477BF]"
              >
                ← Anterior
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={pageHref(p, activeCategory)}
                aria-current={p === current ? "page" : undefined}
                className={[
                  "inline-flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-medium transition",
                  p === current
                    ? "border-[#0477BF] bg-[#0477BF] text-white"
                    : "border-black/10 bg-white text-zinc-700 hover:border-[#0477BF]",
                ].join(" ")}
              >
                {p}
              </Link>
            ))}
            {current < totalPages && (
              <Link
                href={pageHref(current + 1, activeCategory)}
                className="inline-flex h-10 items-center rounded-xl border border-black/10 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:border-[#0477BF]"
              >
                Siguiente →
              </Link>
            )}
          </nav>
        )}
      </div>
    </main>
  );
}
