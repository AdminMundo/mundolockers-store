#!/usr/bin/env node
// Verifica que cada URL del sitemap.xml responda 200 y que la URL final
// (tras seguir redirects) sea exactamente la misma que la del sitemap.
// Uso: node scripts/verify-sitemap.mjs [https://www.lockersstore.cl]

const baseUrl = process.argv[2] ?? "https://www.lockersstore.cl";
const sitemapUrl = `${baseUrl.replace(/\/$/, "")}/sitemap.xml`;

async function main() {
  console.log(`Descargando ${sitemapUrl} ...`);
  const res = await fetch(sitemapUrl);
  if (!res.ok) {
    console.error(`No se pudo descargar el sitemap: HTTP ${res.status}`);
    process.exit(1);
  }
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  if (urls.length === 0) {
    console.error("El sitemap no tiene ninguna URL <loc>. Algo está mal.");
    process.exit(1);
  }

  console.log(`${urls.length} URLs encontradas. Verificando...\n`);

  const problems = [];

  for (const url of urls) {
    let res;
    try {
      res = await fetch(url, { redirect: "manual" });
    } catch (err) {
      problems.push({ url, issue: `Error de red: ${err.message}` });
      continue;
    }

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      problems.push({ url, issue: `Redirige (${res.status}) a ${location}` });
    } else if (res.status !== 200) {
      problems.push({ url, issue: `Responde HTTP ${res.status}` });
    }
  }

  if (problems.length === 0) {
    console.log(`✅ Las ${urls.length} URLs del sitemap responden 200 directo, sin redirects.`);
    process.exit(0);
  }

  console.log(`❌ ${problems.length} de ${urls.length} URLs tienen problemas:\n`);
  for (const p of problems) {
    console.log(`  - ${p.url}\n    ${p.issue}`);
  }
  process.exit(1);
}

main();
