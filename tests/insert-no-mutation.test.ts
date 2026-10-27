import { describe, expect, it } from "vitest";
import { insertPost } from "../src/lib/data/posts";
import { insertClient } from "../src/lib/data/clients";

// Simula o comportamento do driver: insertOne acrescenta _id (ObjectId) ao objeto recebido.
function fakeDb() {
  const inserted: unknown[] = [];
  const collection = () => ({
    insertOne: async (doc: Record<string, unknown>) => {
      doc._id = { toHexString: () => "64b0000000000000000000ff" };
      inserted.push(doc);
      return { acknowledged: true };
    },
  });
  return { db: { collection } as unknown as Parameters<typeof insertPost>[0], inserted };
}

const now = new Date().toISOString();

describe("insert não altera o objeto devolvido pela server function", () => {
  it("insertPost não adiciona _id ao documento do chamador", async () => {
    const { db, inserted } = fakeDb();
    const doc = {
      id: "p1",
      title: "Título",
      slug: "titulo",
      coverImage: null,
      excerpt: "Resumo de teste",
      content: "Conteúdo de teste com vinte caracteres",
      status: "draft" as const,
      createdAt: now,
      updatedAt: now,
      publishedAt: null,
      deletedAt: null,
    };
    await insertPost(db, doc);
    expect(inserted).toHaveLength(1);
    expect("_id" in doc).toBe(false);
  });

  it("insertClient não adiciona _id ao documento do chamador", async () => {
    const { db } = fakeDb();
    const doc = {
      id: "c1",
      nome: "Cliente",
      status: "lead" as const,
      servicos: [],
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };
    await insertClient(db, doc);
    expect("_id" in doc).toBe(false);
  });
});
