import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { BLOG_CATEGORIES, formatBlogDate, type BlogPost } from "@/lib/blog";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#0477BF] hover:shadow-[0_24px_60px_rgba(4,119,191,0.16)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        <Image
          src={post.coverImage}
          alt={post.coverAlt}
          width={post.coverWidth}
          height={post.coverHeight}
          loading="lazy"
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
          <span className="rounded-full bg-[#0477BF]/10 px-2.5 py-0.5 font-semibold text-[#0477BF]">
            {BLOG_CATEGORIES[post.category]}
          </span>
          <span>{formatBlogDate(post.date)}</span>
        </div>

        <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-zinc-900">
          {post.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-zinc-600">{post.description}</p>

        <div className="mt-5 flex items-center justify-between text-xs font-medium text-zinc-500">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.readingMinutes} min de lectura
          </span>
          <span className="inline-flex items-center gap-1 text-[#0477BF]">
            Leer
            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
