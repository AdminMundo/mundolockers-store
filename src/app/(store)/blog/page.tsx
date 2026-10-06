import type { Metadata } from "next";
import { getAllPosts, SITE_URL } from "@/lib/blog";
import { BlogListing } from "@/components/blog/blog-listing";

const TITLE = "Blog de lockers y casilleros";
const DESCRIPTION =
  "Guías y consejos para comprar lockers metálicos y casilleros en Chile: medidas, cerraduras, materiales, precios y proyectos para colegios, empresas y minería.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: { title: `${TITLE} | LockerStore`, description: DESCRIPTION, url: `${SITE_URL}/blog`, type: "website" },
  twitter: { card: "summary_large_image", title: `${TITLE} | LockerStore`, description: DESCRIPTION },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;

  return (
    <BlogListing
      eyebrow="Blog"
      title="Guías y consejos para comprar lockers"
      description="Medidas, cerraduras, materiales y proyectos para colegios, empresas y minería, escritos para ayudarte a comprar mejor."
      posts={getAllPosts()}
      page={Number(page) || 1}
    />
  );
}
