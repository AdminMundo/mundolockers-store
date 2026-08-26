import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeScopeGuard } from "@/components/theme-scope-guard";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lockersstore.cl";
const OG_IMAGE = "/images/home/Encabezadoprincipal.webp";
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

// Datos de la empresa: mismos que ya se mostraban en /contacto. Se publica en
// el layout raíz (no en next/script) para que aparezca en el HTML de cada
// página sin depender de que el cliente hidrate.
const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "LockerStore",
  description: "Fabricante y comercializador de lockers metálicos y plásticos en Chile.",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/logo-color.webp`,
  telephone: "+56936289818",
  email: "ventas@lockersstore.cl",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Quinta Normal",
    addressRegion: "Región Metropolitana",
    addressCountry: "CL",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:30",
      closes: "17:30",
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LockerStore | Lockers metálicos y plásticos en Chile",
    template: "%s | LockerStore",
  },
  description:
    "Lockers metálicos y plásticos para industria, colegios, minería y hogar. Compra online o cotiza por WhatsApp. Despacho a todo Chile.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LockerStore | Lockers metálicos y plásticos en Chile",
    description:
      "Compra lockers metálicos y plásticos. Modelos para industria, colegios y minería. Despacho a todo Chile.",
    url: "/",
    siteName: "LockerStore",
    type: "website",
    locale: "es_CL",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "LockerStore — Lockers en Chile" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LockerStore | Lockers en Chile",
    description:
      "Compra lockers metálicos y plásticos. Modelos para industria, colegios y minería. Despacho a todo Chile.",
    images: [OG_IMAGE],
  },
  verification: {
    google: "LURg7cHufJYiOLZB-lFhuaxpgoENeXhKuG66nUuvmfY",
    other: {
      "msvalidate.01": "B30E2D4425074AD2F402D35A69A83296",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "android-chrome-192x192", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/android-chrome-512x512.png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#EEEDEB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <body className={`${inter.className} ${inter.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <ThemeScopeGuard />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
          />
          {GOOGLE_ADS_ID && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
                strategy="afterInteractive"
              />
              <Script id="gtag-init" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GOOGLE_ADS_ID}');
                `}
              </Script>
            </>
          )}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
