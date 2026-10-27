import { describe, expect, it } from "vitest";
import { postCreateSchema, validateOr400 } from "../src/lib/admin/validators";

const valid = {
  title: "Título válido",
  excerpt: "Resumo válido aqui",
  content: "Conteúdo válido com mais de vinte caracteres",
  status: "draft",
};

describe("validateOr400", () => {
  it("devolve os dados quando a entrada é válida", () => {
    const parse = validateOr400(postCreateSchema);
    expect(parse(valid).title).toBe("Título válido");
  });

  it("lança Response 400 com o nome do campo quando a entrada é inválida", async () => {
    const parse = validateOr400(postCreateSchema);
    let thrown: unknown;
    try {
      parse({ ...valid, title: "a" });
    } catch (e) {
      thrown = e;
    }
    expect(thrown).toBeInstanceOf(Response);
    const res = thrown as Response;
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error: string };
    expect(body.error.startsWith("title:")).toBe(true);
  });
});
