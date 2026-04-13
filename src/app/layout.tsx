import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.lockersstore.cl";
const OG_IMAGE = "/images/home/Encabezadoprincipal.webp";

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
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F5F5F7",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className={`${inter.className} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
