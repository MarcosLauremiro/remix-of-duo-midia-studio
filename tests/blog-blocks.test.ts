import { describe, expect, it } from "vitest";
import { postCreateSchema, postUpdateSchema } from "../src/lib/admin/validators";
import { MAX_POST_BLOCKS, postBlocks } from "../src/lib/blog";

const CLOUDINARY_IMAGE =
  "https://res.cloudinary.com/duomidea/image/upload/v1/duo-midia/blog/capas/x.png";

const base = {
  title: "Título de teste",
  excerpt: "Descrição com mais de dez caracteres",
  blocks: [{ subtitle: "Primeiro bloco", text: "Texto do primeiro bloco", image: null }],
};

describe("blocos do post (criação)", () => {
  it("aceita um bloco sem imagem", () => {
    expect(postCreateSchema.safeParse(base).success).toBe(true);
  });

  it("aceita bloco com imagem do Cloudinary e imagem vazia", () => {
    const withImage = {
      ...base,
      blocks: [
        { subtitle: "Com imagem", text: "Texto", image: CLOUDINARY_IMAGE },
        { subtitle: "Sem imagem", text: "Texto", image: "" },
      ],
    };
    expect(postCreateSchema.safeParse(withImage).success).toBe(true);
  });

  it("exige pelo menos um bloco", () => {
    expect(postCreateSchema.safeParse({ ...base, blocks: [] }).success).toBe(false);
  });

  it("exige subtítulo e texto em cada bloco", () => {
    const semSubtitulo = { ...base, blocks: [{ subtitle: "", text: "Texto", image: null }] };
    const semTexto = { ...base, blocks: [{ subtitle: "Subtítulo", text: " ", image: null }] };
    expect(postCreateSchema.safeParse(semSubtitulo).success).toBe(false);
    expect(postCreateSchema.safeParse(semTexto).success).toBe(false);
  });

  it("recusa imagem de bloco que não seja do Cloudinary", () => {
    const externa = {
      ...base,
      blocks: [{ subtitle: "Subtítulo", text: "Texto", image: "https://exemplo.com/a.jpg" }],
    };
    expect(postCreateSchema.safeParse(externa).success).toBe(false);
  });

  it(`limita a ${MAX_POST_BLOCKS} blocos`, () => {
    const muitos = Array.from({ length: MAX_POST_BLOCKS + 1 }, () => base.blocks[0]);
    expect(postCreateSchema.safeParse({ ...base, blocks: muitos }).success).toBe(false);
  });
});

describe("blocos do post (edição)", () => {
  it("blocks é opcional na atualização, para não mexer no conteúdo", () => {
    expect(postUpdateSchema.safeParse({ id: "p1", title: "Novo título" }).success).toBe(true);
  });
});

describe("postBlocks (leitura)", () => {
  it("usa os blocos quando existem", () => {
    const blocks = [{ subtitle: "S", text: "T", image: null }];
    expect(postBlocks({ blocks, content: "antigo" })).toEqual(blocks);
  });

  it("transforma o texto único de post antigo em um bloco sem subtítulo", () => {
    expect(postBlocks({ content: "Parágrafo antigo" })).toEqual([
      { subtitle: "", text: "Parágrafo antigo", image: null },
    ]);
  });

  it("devolve lista vazia quando não há conteúdo", () => {
    expect(postBlocks({ blocks: [], content: "  " })).toEqual([]);
  });
});
