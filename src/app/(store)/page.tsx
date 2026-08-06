import Link from "next/link";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import HeroBanner from "@/components/site/hero-banner";
import CategoriesSection from "@/components/home/categories";
import CategoryIntroSection from "@/components/home/category-intro";
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
    <main className="bg-[#EEEDEB] text-zinc-900">
      {/* Schema JSON-LD */}
      <Script
        id="jsonld-home"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroBanner
        title={
          <>
            Lockers para <br /> Cada Espacio
          </>
        }
        description="Seguridad y orden para tu industria, oficina o institución."
        actions={
          <>
            <Button
              asChild
              className="h-12 rounded-xl bg-black px-7 text-base font-semibold text-white transition-colors duration-200 hover:bg-[#0477BF] hover:text-white"
            >
              <Link href="/cotizar">Cotizar Ahora</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-12 rounded-xl border border-[#0477BF]/40 bg-white px-7 text-base font-semibold text-zinc-900 transition-colors duration-200 hover:border-[#0477BF] hover:shadow-[0_0_0_3px_rgba(4,119,191,0.15)]"
            >
              <Link href="/tienda">Ver Productos</Link>
            </Button>
          </>
        }
      />

      {/* CATEGORÍAS */}
      <CategoriesSection />
      {/* CONTENIDO DESCRIPTIVO (SEO) */}
      <CategoryIntroSection />
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
