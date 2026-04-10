import type { NextConfig } from "next";

const securityHeaders = [
  // Protege contra XSS: define qué fuentes de contenido son válidas
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: propio sitio + Next.js inline + Flow + Google Analytics (si se agrega)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.flow.cl https://sandbox.flow.cl",
      // Estilos: propio sitio + inline (Tailwind necesita esto)
      "style-src 'self' 'unsafe-inline'",
      // Imágenes: propio sitio + Supabase Storage + data URIs
      "img-src 'self' data: blob: https://mnoybuethuabjzlmxmmo.supabase.co",
      // Fuentes
      "font-src 'self' data:",
      // Conexiones fetch/XHR: propio sitio + Supabase + Flow
      "connect-src 'self' https://mnoybuethuabjzlmxmmo.supabase.co https://www.flow.cl https://sandbox.flow.cl",
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
};

export default nextConfig;
