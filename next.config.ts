import type { NextConfig } from "next";

const securityHeaders = [
  // Protege contra XSS: define qué fuentes de contenido son válidas
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: propio sitio + Next.js inline + Flow + Google Ads (gtag.js)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.flow.cl https://sandbox.flow.cl https://www.googletagmanager.com",
      // Estilos: propio sitio + inline (Tailwind necesita esto)
      "style-src 'self' 'unsafe-inline'",
      // Imágenes: propio sitio + Supabase Storage + data URIs + píxeles de Google Ads
      "img-src 'self' data: blob: https://mnoybuethuabjzlmxmmo.supabase.co https://www.google.com https://www.googletagmanager.com",
      // Fuentes
      "font-src 'self' data:",
      // Conexiones fetch/XHR: propio sitio + Supabase + Flow + Google Ads (conversión)
      "connect-src 'self' https://mnoybuethuabjzlmxmmo.supabase.co https://www.flow.cl https://sandbox.flow.cl https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://www.google.com https://googleads.g.doubleclick.net",
      // Frames: solo Flow para el proceso de pago
      "frame-src 'self' https://www.flow.cl https://sandbox.flow.cl",
      // Forms solo al mismo origen
      "form-action 'self' https://www.flow.cl https://sandbox.flow.cl",
      // No permite embeber el sitio en iframes externos (clickjacking)
      "frame-ancestors 'none'",
    ].join("; "),
  },
  // Evita que el sitio sea embebido en iframes (clickjacking)
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // El navegador no debe intentar adivinar el tipo de contenido
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // No enviar referrer a sitios externos
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // HSTS: 1 año, incluye subdominios
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // Restringe acceso a APIs del navegador (cámara, micrófono, geolocalización, etc.)
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(self)",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mnoybuethuabjzlmxmmo.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  async headers() {
    return [
      {
        // Aplica a todas las rutas
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  async redirects() {
    return [
      {
        // URLs viejas de categoría (?cat=x) a las nuevas rutas /tienda/x
        source: "/tienda",
        has: [{ type: "query", key: "cat", value: "(?<cat>.+)" }],
        destination: "/tienda/:cat",
        permanent: true,
      },
      {
        // Slugs de categoría previos a la limpieza (terminaban en "-1")
        source: "/tienda/:slug-1",
        destination: "/tienda/:slug",
        permanent: true,
      },
      {
        // Slugs de producto previos a la limpieza (terminaban en "-2")
        source: "/producto/:slug-2",
        destination: "/producto/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
