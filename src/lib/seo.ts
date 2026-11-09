// Metadados de SEO compartilhados pelas rotas. Sem efeitos colaterais: usado no servidor e no cliente.

export const SITE_URL = "https://www.duomidia.net";
export const SITE_NAME = "DUO | Mídia & Studio";
export const DEFAULT_DESCRIPTION =
  "Estratégia, criação e produção para marcas que querem crescer: conteúdo, redes sociais, vídeo e eventos.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

type PageSeo = {
  /** Título completo da página (já inclui o nome do site quando necessário). */
  title: string;
  description: string;
  /** Caminho da página, começando com "/". Vira a URL canônica. */
  path: string;
  image?: string | null;
  type?: "website" | "article";
  /** Páginas de uso interno (login, demo) ficam fora do índice de buscas. */
  noindex?: boolean;
};

/** Meta tags e canonical de uma página. Usar em `head()` das rotas. */
export function pageSeo({ title, description, path, image, type = "website", noindex }: PageSeo) {
  const url = `${SITE_URL}${path}`;
  const img = image ?? DEFAULT_OG_IMAGE;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      ...(noindex ? [{ name: "robots", content: "noindex, nofollow" }] : []),
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:type", content: type },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:image", content: img },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: img },
    ],
    links: noindex ? [] : [{ rel: "canonical", href: url }],
  };
}

/**
 * Serializa JSON-LD para um <script>. Escapa "<" para que um título com "</script>" não feche a tag.
 */
export function jsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
