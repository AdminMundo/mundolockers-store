import type { ReactNode } from "react";
import Script from "next/script";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import WhatsAppFloatingButton from "@/components/whatsapp-floating-button";

type StoreLayoutProps = {
  children: ReactNode;
};

// Layout sin cookies()/auth: el Navbar resuelve la sesión del lado del
// cliente (vía /api/auth/me) para que las páginas de la tienda puedan
// cachearse con ISR en vez de forzarse a dynamic por el estado de login.
export default function StoreLayout({ children }: StoreLayoutProps) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <WhatsAppFloatingButton />
      {/* Asistente del CRM (crm.lockersstore.cl): separa ventas, pedidos, postventa y facturación. A la izquierda por el botón de WhatsApp. */}
      <Script src="https://crm.lockersstore.cl/asistente.js" data-lado="izquierda" strategy="lazyOnload" />
    </>
  );
}
