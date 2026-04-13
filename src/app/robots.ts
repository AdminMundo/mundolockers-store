import type { MetadataRoute } from "next";

const SITE_URL = "https://www.lockersstore.cl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/checkout",
          "/carrito",
          "/gracias",
          "/pago-fallido",
          "/login",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
