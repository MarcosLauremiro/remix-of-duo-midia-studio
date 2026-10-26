// Testes de integração com um MongoDB REAL de teste. Rodam só se MONGODB_URI_TEST e MONGODB_DB_TEST
// estiverem definidas (nunca usar o banco de produção). Sem elas, o bloco é ignorado.
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const uri = process.env.MONGODB_URI_TEST;
const dbName = process.env.MONGODB_DB_TEST;
// Guarda extra: o teste apaga o banco inteiro, então exige "test" no nome.
const enabled = Boolean(uri && dbName && /test/i.test(dbName));

describe.skipIf(!enabled)("repositórios (MongoDB de teste)", () => {
  let withDb: typeof import("../src/lib/data/mongo").withDb;
  let clients: typeof import("../src/lib/data/clients");
  let posts: typeof import("../src/lib/data/posts");
  let consumeLoginAttempt: typeof import("../src/lib/data/login-attempts").consumeLoginAttempt;
  let ensureIndexes: (db: unknown) => Promise<void>;
  const ts = new Date().toISOString();

  beforeAll(async () => {
    process.env.MONGODB_URI = uri;
    process.env.MONGODB_DB = dbName;
    withDb = (await import("../src/lib/data/mongo")).withDb;
    clients = await import("../src/lib/data/clients");
    posts = await import("../src/lib/data/posts");
    consumeLoginAttempt = (await import("../src/lib/data/login-attempts")).consumeLoginAttempt;
    ensureIndexes = (await import("../scripts/lib/indexes.mjs")).ensureIndexes;
    await withDb(async (db) => {
      await db.dropDatabase();
      await ensureIndexes(db);
    });
  });

  afterAll(async () => {
    if (!enabled) return;
    await withDb((db) => db.dropDatabase());
  });

  const client = (over: Record<string, unknown>) => ({
    id: crypto.randomUUID(),
    nome: "Cliente",
    contato: null,
    email: null,
    telefone: null,
    empresa: null,
    documento: null,
    tipo: null,
    status: "lead" as const,
    servicos: [],
    observacoes: null,
    createdAt: ts,
    updatedAt: ts,
    deletedAt: null,
    ...over,
  });

  it("cria, lista e filtra clientes; exclusão lógica some das listagens", async () => {
    const ana = client({ nome: "Ana Souza", status: "ativo" });
    const bia = client({ nome: "Bia Lima", status: "lead" });
    await withDb(async (db) => {
      await clients.insertClient(db, ana);
      await clients.insertClient(db, bia);
      const all = await clients.listClients(db, {
        sortBy: "nome",
        sortDir: "asc",
        page: 1,
        limit: 10,
      });
      expect(all.total).toBe(2);
      const ativos = await clients.listClients(db, {
        status: "ativo",
        sortBy: "nome",
        sortDir: "asc",
        page: 1,
        limit: 10,
      });
      expect(ativos.items.map((c) => c.id)).toEqual([ana.id]);
      await clients.saveClient(db, { ...bia, deletedAt: new Date().toISOString() });
      const after = await clients.listClients(db, {
        sortBy: "nome",
        sortDir: "asc",
        page: 1,
        limit: 10,
      });
      expect(after.total).toBe(1);
    });
  });

  it("busca trata caracteres especiais como texto literal", async () => {
    await withDb(async (db) => {
      const r = await clients.listClients(db, {
        q: ".*",
        sortBy: "nome",
        sortDir: "asc",
        page: 1,
        limit: 10,
      });
      expect(r.total).toBe(0); // ".*" não pode virar regex curinga
    });
  });

  it("slug de post é único entre posts ativos", async () => {
    const base = {
      id: crypto.randomUUID(),
      title: "Dica",
      slug: "dica",
      coverImage: null,
      excerpt: "Resumo de teste",
      content: "Conteúdo de teste com vinte caracteres",
      status: "draft" as const,
      createdAt: ts,
      updatedAt: ts,
      publishedAt: null,
      deletedAt: null,
    };
    await withDb(async (db) => {
      await posts.insertPost(db, base);
      expect(await posts.ensureUniquePostSlug(db, "dica")).toBe("dica-2");
      await expect(
        posts.insertPost(db, { ...base, id: crypto.randomUUID() }),
      ).rejects.toMatchObject({ code: 11000 });
    });
  });

  it("contador de login bloqueia após o limite", async () => {
    await withDb(async (db) => {
      const results = [];
      for (let i = 0; i < 4; i += 1)
        results.push(await consumeLoginAttempt(db, "k-teste", 3, 60_000));
      expect(results).toEqual([true, true, true, false]);
    });
  });
});
