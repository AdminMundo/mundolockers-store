"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

// Ajusta estos imports a tus archivos reales:
import { Navbar } from  "components/ui/navbar";
import { Component } from "lucide-react";
// import { Footer } from "@/components/footer";

type SiteChromeProps = {
  children: ReactNode;
};

export function SiteChrome({ children }: SiteChromeProps) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname.startsWith("/login");

  if (isAdminRoute || isLoginRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      {/* <Footer /> */}
    </>
  );
}