import { describe, expect, it } from "vitest";
import { jsonLd, pageSeo, SITE_URL } from "../src/lib/seo";

describe("jsonLd", () => {
  it("não deixa o conteúdo fechar a tag <script>", () => {
    const out = jsonLd({ headline: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("</script>");
    expect(JSON.parse(out)).toEqual({ headline: "</script><script>alert(1)</script>" });
  });
});

describe("pageSeo", () => {
  it("gera canonical absoluta e og:url para páginas indexáveis", () => {
    const seo = pageSeo({ title: "T", description: "D", path: "/servicos" });
    expect(seo.links).toEqual([{ rel: "canonical", href: `${SITE_URL}/servicos` }]);
    expect(seo.meta).toContainEqual({ property: "og:url", content: `${SITE_URL}/servicos` });
    expect(seo.meta.some((m) => "name" in m && m.name === "robots")).toBe(false);
  });

  it("páginas noindex recebem robots e não têm canonical", () => {
    const seo = pageSeo({ title: "T", description: "D", path: "/entrar", noindex: true });
    expect(seo.links).toEqual([]);
    expect(seo.meta).toContainEqual({ name: "robots", content: "noindex, nofollow" });
  });
});
