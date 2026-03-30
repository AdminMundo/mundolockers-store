import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import CategoriesSection from "@/components/home/categories";
import BrandsSection from "@/components/home/brands";
import FeaturedProductsSection from "@/components/home/featured-products";
import SchoolCampaignSection from "@/components/home/school-campaign";
import WhyUsSection from "@/components/home/why-us";
import ProcessFaqSection from "@/components/home/process-faq";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Mundo Lockers Store",
      url: "https://www.mundolockers.com",
      logo: "https://www.mundolockers.com/brand/logobueno.png",
    },
    {
      "@type": "WebSite",
      name: "Mundo Lockers Store",
      url: "https://www.mundolockers.com",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.mundolockers.com/tienda?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function HomePage() {
  return (
    <main className="bg-[#F5F5F7] text-zinc-900">
      {/* Schema JSON-LD */}
      <Script
        id="jsonld-home"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO FULL BACKGROUND */}
      <section className="relative min-h-[86vh] w-full overflow-hidden pt-24 md:pt-28">
        {/* Fade inferior para mezclar con el fondo real */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#F5F5F7]" />

        {/* Imagen de fondo */}
        <Image
          src="/images/home/Encabezadoprincipal.svg"
          alt="Showroom de lockers Mundo Lockers"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:120px_120px]" />

        {/* Contenido */}
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="pt-32 md:pt-36">
            <div className="max-w-[520px]">
              <h1 className="hero-title">
                Lockers para <br /> Cada Espacio
              </h1>

              <p className="hero-subtitle">
                Seguridad y orden para tu industria, oficina o institución.
              </p>

              <div className="mt-7 flex gap-4">
                <Button
                  asChild
                  className="h-12 bg-yellow-400 px-7 text-base font-semibold text-black hover:bg-yellow-300"
                >
                  <Link href="/cotizar">Cotizar Ahora</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-12 border-white/20 bg-white/5 px-7 text-base font-semibold text-white hover:bg-white/10"
                >
                  <Link href="/tienda">Ver Productos</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      <CategoriesSection />
      {/* CAMPAÑA ESCOLAR */}
      <SchoolCampaignSection />
      {/* PRODUCTOS DESTACADOS */}
      <FeaturedProductsSection />
      {/* POR QUÉ ELEGIRNOS */}
      <WhyUsSection />
      {/* MARCAS */}
      <BrandsSection />
      {/* PROCESO Y FAQ */} 
      <ProcessFaqSection />
      
    </main>
  );
}
