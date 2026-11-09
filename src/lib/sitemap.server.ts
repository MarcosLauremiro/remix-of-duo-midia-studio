// Sitemap XML: páginas públicas fixas e um item por artigo publicado. Só servidor (lê o banco).
import { listPublishedPostsForSitemapFn } from "./admin/blog.server";
import { SITE_URL } from "./seo";

const STATIC_PATHS = [
  "/",
  "/servicos",
  "/duomidia",
  "/duostudio",
  "/pacotes",
  "/imprensa",
  "/blog",
];

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isoDay(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

export async function buildSitemapXml(): Promise<string> {
  let posts: Awaited<ReturnType<typeof listPublishedPostsForSitemapFn>> = [];
  try {
    posts = await listPublishedPostsForSitemapFn();
  } catch (e) {
    // Sem o banco, o sitemap sai só com as páginas fixas, em vez de falhar.
    console.error("[sitemap] falha ao ler artigos", e instanceof Error ? e.name : "erro");
  }

  const urls = [
    ...STATIC_PATHS.map((path) => `  <url><loc>${escapeXml(SITE_URL + path)}</loc></url>`),
    ...posts.map((p) => {
      const loc = escapeXml(`${SITE_URL}/blog/${p.slug}`);
      const lastmod = isoDay(p.updatedAt ?? p.publishedAt);
      return lastmod
        ? `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`
        : `  <url><loc>${loc}</loc></url>`;
    }),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}
