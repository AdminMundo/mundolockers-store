import "./globals.css";
import type { Metadata, Viewport } from "next";
import Navbar from "@/components/navbar";
import { Inter } from "next/font/google";
import Footer from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mundolockers.cl"),
  title: "Mundo Lockers Store | Lockers metálicos y plásticos en Chile",
  description:
    "Lockers metálicos y plásticos para industria, colegios, minería y hogar. Compra online o cotiza por WhatsApp. Despacho a todo Chile.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mundo Lockers Store | Lockers metálicos y plásticos en Chile",
    description:
      "Compra lockers metálicos y plásticos. Modelos para industria, colegios y minería. Despacho a todo Chile.",
    url: "/",
    siteName: "Mundo Lockers Store",
    type: "website",
    locale: "es_CL",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mundo Lockers Store",
    description:
      "Compra lockers metálicos y plásticos. Modelos para industria, colegios y minería. Despacho a todo Chile.",
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
  // Ajusta rutas reales cuando tengas íconos
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
    <html lang="es" className={`${inter.variable}`}>
      <body className={`${inter.className} ${inter.variable}`}>
        <Navbar />
        
        {children}
        <Footer />
      </body>
    </html>
  );
}
