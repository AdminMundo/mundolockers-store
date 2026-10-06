import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, MessageCircle } from "lucide-react";
import {
  BLOG_CATEGORIES,
  formatBlogDate,
  getAllPosts,
  getPostBySlug,
  SITE_URL,
} from "@/lib/blog";
import { createSupabasePublicServer } from "@/lib/supabase/supabasePublicServer";
import { BlogCard } from "@/components/blog/blog-card";

type Params = { slug: string };

const WHATSAPP_NUMBER = "56936289818";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Artículo no encontrado", robots: { index: false, follow: false } };

  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = `${SITE_URL}${post.coverImage}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    keywords: post.tags,
    openGraph: {
      title: `${post.title} | LockerStore`,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: [post.author],
      images: [{ url: image, width: post.coverWidth, height: post.coverHeight, alt: post.coverAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | LockerStore`,
      description: post.description,
      images: [image],
    },
  };
}

async function getRelatedProducts(slugs: string[]) {
  if (slugs.length === 0) return [];
  const supabase = createSupabasePublicServer();
  const { data } = await supabase
    .from("products")
    .select("slug,name,price_clp,image_url")
    .eq("is_active", true)
    .in("slug", slugs);

  const bySlug = new Map((data ?? []).map((p) => [p.slug, p]));
  return slugs.map((s) => bySlug.get(s)).filter((p): p is NonNullable<typeof p> => Boolean(p));
}

const PROSE =
  "text-[15px] leading-7 text-zinc-700 " +
  "[&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-zinc-900 " +
  "[&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-zinc-900 " +
  "[&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 " +
  "[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 " +
  "[&_strong]:font-semibold [&_strong]:text-zinc-900 " +
  "[&_a]:font-medium [&_a]:text-[#0477BF] [&_a]:underline [&_a]:underline-offset-2 " +
  "[&_table]:mt-6 [&_table]:w-full [&_table]:text-sm " +
  "[&_th]:border-b [&_th]:border-black/10 [&_th]:bg-zinc-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-zinc-900 " +
  "[&_td]:border-b [&_td]:border-black/5 [&_td]:px-3 [&_td]:py-2";

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const categoryName = BLOG_CATEGORIES[post.category];
  const products = await getRelatedProducts(post.productosRelacionados);
  const otherPosts = getAllPosts().filter((p) => p.slug !== post.slug).slice(0, 2);
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola LockerStore, leí el artículo "${post.title}" y quiero cotizar.`,
  )}`;

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: [`${SITE_URL}${post.coverImage}`],
    datePublished: post.date,
    dateModified: post.updated,
    author: { "@type": "Organization", name: post.author, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "LockerStore",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/logo-color.webp` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: post.tags.join(", "),
    articleSection: categoryName,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="min-h-screen bg-[#EEEDEB]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {post.faq.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <section className="relative overflow-hidden bg-[#0F172A] pt-28 pb-16">
        <div className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,rgba(4,119,191,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(4,119,191,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-[#0477BF]/20 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <nav aria-label="Migas de pan" className="text-xs text-white/50">
            <Link href="/" className="hover:text-white">Inicio</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <span className="mx-2">/</span>
            <Link href={`/blog/categoria/${post.category}`} className="hover:text-white">{categoryName}</Link>
          </nav>

          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-white/60">{post.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/55">
            <span>{formatBlogDate(post.date)}</span>
            <span>Por {post.author}</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readingMinutes} min de lectura
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <div className="-mt-8 overflow-hidden rounded-[32px] border border-black/10 bg-white shadow-sm">
          <div className="relative flex aspect-[4/3] items-center justify-center bg-zinc-100 p-8">
            <Image
              src={post.coverImage}
              alt={post.coverAlt}
              width={post.coverWidth}
              height={post.coverHeight}
              loading="lazy"
              sizes="(min-width: 768px) 768px, 100vw"
              className="h-full w-full object-contain"
            />
          </div>

          <article className="px-6 py-10 sm:px-10 md:px-12">
            <div className={PROSE} dangerouslySetInnerHTML={{ __html: post.html }} />

            {post.faq.length > 0 && (
              <section className="mt-14 border-t border-black/10 pt-10">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Preguntas frecuentes</h2>
                <div className="mt-6 space-y-6">
                  {post.faq.map((f) => (
                    <div key={f.q}>
                      <h3 className="text-base font-semibold text-zinc-900">{f.q}</h3>
                      <p className="mt-2 text-sm leading-7 text-zinc-600">{f.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </article>
        </div>

        {products.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Productos relacionados</h2>
            <p className="mt-2 text-sm text-zinc-600">Modelos de la tienda que puedes revisar mientras lees esta guía.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {products.map((p) => (
                <Link
                  key={p.slug}
                  href={`/producto/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[24px] border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0477BF] hover:shadow-[0_18px_40px_rgba(4,119,191,0.14)]"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100">
                    {p.image_url && (
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        width={400}
                        height={400}
                        loading="lazy"
                        sizes="(min-width: 768px) 240px, 50vw"
                        className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-[1.04]"
                      />
                    )}
                  </div>
                  <h3 className="mt-4 text-sm font-semibold leading-snug text-zinc-900">{p.name}</h3>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    {p.price_clp != null && (
                      <span className="text-sm font-semibold text-[#0477BF]">
                        ${p.price_clp.toLocaleString("es-CL")}
                      </span>
                    )}
                    <ArrowRight className="h-4 w-4 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-[#0477BF]" />
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href={`/tienda/${post.tiendaCategoria}`}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0477BF] hover:text-[#04527f]"
            >
              Ver toda la categoría en la tienda
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        )}

        <section className="mt-12 overflow-hidden rounded-[32px] bg-[#0F172A] p-8 text-white md:p-10">
          <h2 className="text-2xl font-semibold tracking-tight">¿Necesitas cotizar tu proyecto?</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
            Cuéntanos cuántas personas usarán los lockers y qué espacio tienes. Te ayudamos a elegir la configuración
            y te enviamos una cotización formal con factura.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0477BF] px-5 text-sm font-semibold text-white transition hover:bg-[#0477BF]/85"
            >
              <MessageCircle className="h-4 w-4" />
              Cotizar por WhatsApp
            </a>
            <Link
              href="/cotizar"
              className="inline-flex h-11 items-center rounded-xl border border-white/20 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Formulario de cotización
            </Link>
          </div>
        </section>

        {otherPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Sigue leyendo</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {otherPosts.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
