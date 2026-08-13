import Link from "next/link";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import VideoHero from "@/components/site/video-hero";
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

      <VideoHero
        eyebrow="Fabricación 100% nacional"
        title={
          <>
            Hecho en Chile, <br /> Hecho para Durar
          </>
        }
        description="Acero soldado, pintado y armado en nuestra propia planta. Así nace cada locker que despachamos a todo el país."
        actions={
          <>
            <Button
              asChild
              className="h-12 rounded-xl bg-white px-7 text-base font-semibold text-zinc-900 transition-colors duration-200 hover:bg-[#0477BF] hover:text-white"
            >
              <Link href="/cotizar">Cotizar Ahora</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-12 rounded-xl border border-white/40 bg-white/10 px-7 text-base font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:border-white hover:bg-white/20"
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
