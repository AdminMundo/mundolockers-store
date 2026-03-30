import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/product";
import ProductHeroHeader from "./_components/ProductHeroHeader";
import { getCategoryAsset } from "@/lib/categoryAssets";

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
      title: "Producto no encontrado | MundoLockers",
      robots: { index: false, follow: false },
    };
  }



  const title = `${product.name} | MundoLockers`;
  const description =
    (product.description?.trim() && product.description.trim().slice(0, 155)) ||
    `Compra y cotiza ${product.name} en MundoLockers.`;

  // OG necesita URL absoluta idealmente, pero por ahora dejamos relativa (funciona local).
  const ogImage = product.image_url ?? "/images/og-default.webp";
  const canonicalUrl = `/producto/${product.slug}`;
  


 

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "MundoLockers",
      type: "website",
      images: [
        {
          url: ogImage,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ProductLayout({ children, params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  

  if (!product) return notFound();

  const catAsset = getCategoryAsset(product.category_slug);

  return (
    <>
      <ProductHeroHeader
        title={product.name}
        subtitle={product.category_name ?? "Producto"}
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
                  href: `/tienda?cat=${product.category_slug}`,
                },
              ]
            : []),
          { label: product.name, href: `/producto/${product.slug}` },
        ]}
        backgroundImage="/images/tienda/shopencabezado.svg"
      topImage=
      {catAsset ?? {
        src: product.image_url ?? "/images/categoria/Estanterias/Estanteriaespecificacion.svg",
        alt: product.name,
      
        }}
      />

      {children}
    </>
  );
}
