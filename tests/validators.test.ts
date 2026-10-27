import { describe, expect, it } from "vitest";
import { postCreateSchema, hasImageSignature } from "../src/lib/admin/validators";
import { slugify } from "../src/lib/admin/db";

const PNG_HEADER = "iVBORw0KGgoAAAANSUhEUg"; // 89 50 4E 47 0D 0A 1A 0A ...
const JPEG_HEADER = "/9j/4AAQSkZJRg"; // FF D8 FF E0 ...
const WEBP_HEADER = "UklGRiQAAABXRUJQVlA4"; // "RIFF" <len> "WEBP" ...

const base = {
  title: "Título de teste",
  excerpt: "Resumo com mais de dez caracteres",
  content: "Conteúdo com pelo menos vinte caracteres",
};

function coverOk(coverImage: string): boolean {
  return postCreateSchema.safeParse({ ...base, coverImage }).success;
}

describe("capa de post", () => {
  it("aceita só URL de imagem do Cloudinary na escrita do post", () => {
    expect(coverOk("https://res.cloudinary.com/duomidea/image/upload/v1/duo-midia/blog/capas/x.png")).toBe(true);
    expect(coverOk("https://exemplo.com/capa.jpg")).toBe(false);
    expect(coverOk("/assets/capa.png")).toBe(false);
    expect(coverOk("https://www.duomidia.net/_serverFn/abc")).toBe(false);
  });

  it("não aceita data URL na escrita do post (imagens entram pelo upload do Cloudinary)", () => {
    expect(coverOk(`data:image/png;base64,${PNG_HEADER}AAAA`)).toBe(false);
    expect(coverOk(`data:image/jpeg;base64,${JPEG_HEADER}AAAA`)).toBe(false);
    expect(coverOk(`data:image/webp;base64,${WEBP_HEADER}AAAA`)).toBe(false);
  });

  it("rejeita SVG, HTML e outros tipos em data URL", () => {
    expect(coverOk("data:image/svg+xml;base64,PHN2Zz4=")).toBe(false);
    expect(coverOk("data:text/html;base64,PGgxPg==")).toBe(false);
  });

  it("rejeita conteúdo cujo cabeçalho não corresponde ao tipo declarado", () => {
    // Bytes de PNG declarados como JPEG
    expect(coverOk(`data:image/jpeg;base64,${PNG_HEADER}AAAA`)).toBe(false);
    expect(hasImageSignature(`data:image/png;base64,${JPEG_HEADER}AAAA`)).toBe(false);
  });

  it("não lança exceção com base64 malformado", () => {
    expect(hasImageSignature("data:image/png;base64,@@@")).toBe(false);
    expect(coverOk("data:image/png;base64,@@@")).toBe(false);
  });

  it("rejeita URL longa demais", () => {
    expect(coverOk(`https://x.com/${"a".repeat(2100)}`)).toBe(false);
  });
});

describe("slugify", () => {
  it("normaliza acentos e separadores", () => {
    expect(slugify("Como planejar conteúdo, sem sufoco!")).toBe(
      "como-planejar-conteudo-sem-sufoco",
    );
  });

  it("usa 'artigo' quando não sobra nada", () => {
    expect(slugify("!!!")).toBe("artigo");
  });
});
