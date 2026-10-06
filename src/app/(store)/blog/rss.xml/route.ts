import { BLOG_CATEGORIES, getAllPosts, SITE_URL } from "@/lib/blog";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(iso: string): string {
  return new Date(`${iso}T12:00:00-04:00`).toUTCString();
}

export function GET() {
  const posts = getAllPosts();
  const lastBuild = posts[0] ? toRfc822(posts[0].updated) : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const link = `${SITE_URL}/blog/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(post.description)}</description>
      <category>${escapeXml(BLOG_CATEGORIES[post.category])}</category>
      <author>${escapeXml(`contacto@lockersstore.cl (${post.author})`)}</author>
      <pubDate>${toRfc822(post.date)}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog de LockerStore</title>
    <link>${SITE_URL}/blog</link>
    <description>Guías y consejos para comprar lockers metálicos y casilleros en Chile.</description>
    <language>es-cl</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
