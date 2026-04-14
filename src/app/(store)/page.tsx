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

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lockersstore.cl";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "LockerStore",
      url: SITE,
      logo: `${SITE}/brand/logometalico2.webp`,
    },
    {
      "@type": "WebSite",
      name: "LockerStore",
      url: SITE,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE}/tienda?q={search_term_string}`,
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
          src="/images/home/Encabezadoprincipal.webp"
          alt="Showroom de lockers LockerStore"
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
                  className="h-12 rounded-xl bg-black px-7 text-base font-semibold text-white transition-colors duration-200 hover:bg-[#E18147] hover:text-white"
                >
                  <Link href="/cotizar">Cotizar Ahora</Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-xl border border-[#E18147]/40 bg-white px-7 text-base font-semibold text-zinc-900 transition-colors duration-200 hover:border-[#E18147] hover:shadow-[0_0_0_3px_rgba(225,129,71,0.15)]"
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
