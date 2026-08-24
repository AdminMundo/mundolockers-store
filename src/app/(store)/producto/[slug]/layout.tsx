import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, buildProductMetaDescription } from "@/lib/product";
import HeroBanner from "@/components/site/hero-banner";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lockersstore.cl";

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Producto no encontrado",
      robots: { index: false, follow: false },
    };
  }

  const title = product.name;
  const description = buildProductMetaDescription(product);

  const ogImage = product.image_url ?? "/images/home/Encabezadoprincipal.webp";
  const canonicalUrl = `/producto/${product.slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${title} | LockerStore`,
      description,
      url: canonicalUrl,
      siteName: "LockerStore",
      type: "website",
      locale: "es_CL",
      images: [{ url: ogImage, width: 800, height: 600, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | LockerStore`,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ProductLayout({ children, params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  // JSON-LD: Product + BreadcrumbList
  const productUrl = `${SITE_URL}/producto/${product.slug}`;
  const productSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.name,
        description: product.description ?? undefined,
        image: product.image_url ?? undefined,
        sku: product.sku ?? undefined,
        brand: { "@type": "Brand", name: "LockerStore" },
        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "CLP",
          ...(product.price_from_clp > 0
            ? { price: product.price_from_clp.toString() }
            : { priceSpecification: { "@type": "PriceSpecification", description: "Consultar precio" } }),
          availability: product.variants?.some((v) => v.stock_status === "in_stock")
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          seller: { "@type": "Organization", name: "LockerStore" },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Tienda", item: `${SITE_URL}/tienda` },
          ...(product.category_slug
            ? [
                {
                  "@type": "ListItem",
                  position: 3,
                  name: product.category_name ?? "Categoría",
                  item: `${SITE_URL}/tienda/${product.category_slug}`,
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: product.name,
                  item: productUrl,
                },
              ]
            : [
                {
                  "@type": "ListItem",
                  position: 3,
                  name: product.name,
                  item: productUrl,
                },
              ]),
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <HeroBanner
        eyebrow={product.category_name ?? "Producto"}
        title={product.name}
        description={
          product.description?.trim() ||
          "Consulta variantes, especificaciones y cotiza por WhatsApp."
        }
        breadcrumb={[
          { label: "Tienda", href: "/tienda" },
          ...(product.category_slug
            ? [
                {
                  label: product.category_name ?? "Categoría",
                  href: `/tienda/${product.category_slug}`,
                },
              ]
            : []),
          { label: product.name, href: `/producto/${product.slug}` },
        ]}
      />

      {children}
    </>
  );
}
