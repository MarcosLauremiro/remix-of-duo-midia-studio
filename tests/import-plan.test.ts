import { describe, expect, it } from "vitest";
import { canonicalize, planImport } from "../scripts/lib/import-plan.mjs";

const HASH = "scrypt$16384$8$1$aabbccddeeff00112233445566778899$00112233";
const ts = "2026-01-01T00:00:00.000Z";

const admin = {
  id: "adm-1",
  name: "Admin",
  email: "a@x.com",
  passwordHash: HASH,
  role: "admin",
  status: "active",
  createdAt: ts,
  updatedAt: ts,
};
const client = {
  id: "cli-1",
  nome: "Cliente",
  status: "lead",
  servicos: [],
  createdAt: ts,
  updatedAt: ts,
  deletedAt: null,
};
const post = {
  id: "pst-1",
  title: "Título",
  slug: "titulo",
  excerpt: "Resumo válido aqui",
  content: "Conteúdo válido aqui com vinte",
  coverImage: null,
  status: "draft",
  publishedAt: null,
  createdAt: ts,
  updatedAt: ts,
  deletedAt: null,
};

const store = { admins: [admin], clients: [client], posts: [post] };

function dbWith(docs: Partial<Record<"admins" | "clients" | "posts", object[]>>) {
  const out: Record<string, Map<string, object>> = {};
  for (const name of ["admins", "clients", "posts"]) {
    out[name] = new Map(
      (docs[name as keyof typeof docs] ?? []).map((d) => [(d as { id: string }).id, d]),
    );
  }
  return out;
}

describe("planImport", () => {
  it("planeja inserir tudo quando o banco está vazio", () => {
    const r = planImport(store, dbWith({}));
    expect(r.ok).toBe(true);
    expect(r.collections.admins.insert).toHaveLength(1);
    expect(r.collections.clients.insert).toHaveLength(1);
    expect(r.collections.posts.insert).toHaveLength(1);
  });

  it("é idempotente: após a importação, nada mais é inserido", () => {
    const first = planImport(store, dbWith({}));
    const after = dbWith({
      admins: first.collections.admins.insert,
      clients: first.collections.clients.insert,
      posts: first.collections.posts.insert,
    });
    const second = planImport(store, after);
    for (const name of ["admins", "clients", "posts"]) {
      expect(second.collections[name].insert).toHaveLength(0);
      expect(second.collections[name].unchanged).toBe(store[name as "admins"].length);
      expect(second.collections[name].conflicts).toHaveLength(0);
    }
  });

  it("não sobrescreve: documento diferente no banco vira conflito", () => {
    const edited = { ...client, nome: "Nome editado no banco" };
    const r = planImport(store, dbWith({ clients: [edited] }));
    expect(r.collections.clients.conflicts).toEqual(["cli-1"]);
    expect(r.collections.clients.insert).toHaveLength(0);
    expect(r.ok).toBe(true);
  });

  it("trata deletedAt ausente e null como iguais", () => {
    const { deletedAt, ...withoutField } = client;
    const r = planImport(store, dbWith({ clients: [withoutField] }));
    expect(r.collections.clients.unchanged).toBe(1);
  });

  it("bloqueia hash de senha em formato desconhecido", () => {
    const bad = { ...admin, passwordHash: "texto-puro" };
    const r = planImport({ ...store, admins: [bad] }, dbWith({}));
    expect(r.ok).toBe(false);
    expect(r.collections.admins.invalid[0].reason).toMatch(/hash/);
  });

  it("bloqueia ids duplicados no arquivo", () => {
    const r = planImport({ ...store, clients: [client, { ...client, nome: "Outro" }] }, dbWith({}));
    expect(r.ok).toBe(false);
    expect(r.collections.clients.duplicates).toEqual(["cli-1"]);
  });

  it("rejeita store que não é objeto", () => {
    expect(() => planImport(null, dbWith({}))).toThrow();
  });

  it("canonicalize ignora ordem das chaves e _id", () => {
    expect(canonicalize("clients", { _id: "x", b: 1, a: 2 })).toBe(
      canonicalize("clients", { a: 2, b: 1 }),
    );
  });
});
