// Persistência simples, funciona sem Mongo e migra para Mongo sem mudar a interface.
// Em produção com Mongo: substitua getStore() por conexão real e mantenha a mesma API.

import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

function projectRoot(): string {
  // Tenta ancorar no arquivo atual, não em process.cwd() (que varia em dev/prod/serverless)
  try {
    const dir = dirname(fileURLToPath(import.meta.url));
    // src/lib/admin -> project root é 3 níveis acima
    return join(dir, "..", "..", "..");
  } catch {
    return process.cwd();
  }
}

export type AdminDoc = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin";
  status: "active" | "disabled";
  createdAt: string;
  updatedAt: string;
};

export type ClientDoc = {
  id: string;
  nome: string;
  contato?: string | null;
  email?: string | null;
  telefone?: string | null;
  empresa?: string | null;
  documento?: string | null;
  tipo?: string | null;
  status: "lead" | "ativo" | "inativo" | "em_negociacao";
  servicos: string[];
  observacoes?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type PostDoc = {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  excerpt: string;
  content: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  deletedAt?: string | null;
};

type Store = { admins: AdminDoc[]; clients: ClientDoc[]; posts: PostDoc[] };

function dataFilePath(): string {
  return join(projectRoot(), ".data", "store.json");
}

function defaultStore(): Store {
  return { admins: [], clients: [], posts: [] };
}

let memStore: Store | null = null;
let useFile: boolean | null = null;

function canUseFile(): boolean {
  try {
    mkdirSync(join(projectRoot(), ".data"), { recursive: true });
    return true;
  } catch {
    return false;
  }
}

function getStore(): Store {
  if (memStore && useFile === false) return memStore;
  if (useFile === null) useFile = canUseFile();
  if (!useFile) {
    if (!memStore) memStore = defaultStore();
    return memStore;
  }
  const file = dataFilePath();
  if (!existsSync(file)) {
    const s = defaultStore();
    try {
      writeFileSync(file, JSON.stringify(s, null, 2), "utf-8");
    } catch {}
    return s;
  }
  try {
    const raw = readFileSync(file, "utf-8");
    const parsed = JSON.parse(raw) as Partial<Store> & { posts?: unknown };
    const admins = Array.isArray(parsed.admins) ? parsed.admins : [];
    const clients = Array.isArray(parsed.clients) ? parsed.clients : [];
    const posts = Array.isArray(parsed.posts) ? (parsed.posts as PostDoc[]) : [];
    return { admins, clients, posts };
  } catch {
    return defaultStore();
  }
}

function saveStore(store: Store) {
  if (useFile === false) {
    memStore = store;
    return;
  }
  try {
    writeFileSync(dataFilePath(), JSON.stringify(store, null, 2), "utf-8");
  } catch {
    memStore = store;
    useFile = false;
  }
}

export function normalizeEmail(e: string) {
  return e.trim().toLowerCase();
}
export function newId() {
  return randomUUID();
}
export function nowIso() {
  return new Date().toISOString();
}

export function findAdminByEmail(email: string): AdminDoc | null {
  const s = getStore();
  const n = normalizeEmail(email);
  return s.admins.find((a) => a.email === n) ?? null;
}
export function findAdminById(id: string): AdminDoc | null {
  const s = getStore();
  return s.admins.find((a) => a.id === id) ?? null;
}
export function upsertAdmin(doc: AdminDoc) {
  const s = getStore();
  const idx = s.admins.findIndex((a) => a.id === doc.id);
  if (idx >= 0) s.admins[idx] = doc;
  else s.admins.push(doc);
  saveStore(s);
}
export function listAdmins(): AdminDoc[] {
  return [...getStore().admins];
}

export function findClientById(id: string, includeDeleted = false): ClientDoc | null {
  const s = getStore();
  const c = s.clients.find((x) => x.id === id) ?? null;
  if (!c) return null;
  if (!includeDeleted && c.deletedAt) return null;
  return c;
}
export function upsertClient(doc: ClientDoc) {
  const s = getStore();
  const idx = s.clients.findIndex((c) => c.id === doc.id);
  if (idx >= 0) s.clients[idx] = doc;
  else s.clients.push(doc);
  saveStore(s);
}

export type ClientListParams = {
  q?: string;
  status?: string;
  sortBy: "createdAt" | "nome";
  sortDir: "asc" | "desc";
  page: number;
  limit: number;
  includeDeleted?: boolean;
};

export function listClients(params: ClientListParams): { items: ClientDoc[]; total: number } {
  let arr = getStore().clients.filter((c) => (params.includeDeleted ? true : !c.deletedAt));
  const q = params.q?.trim().toLowerCase();
  if (q) {
    arr = arr.filter((c) => {
      const hay = `${c.nome} ${c.empresa ?? ""} ${c.email ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }
  if (params.status && params.status !== "todos") {
    arr = arr.filter((c) => c.status === params.status);
  }
  arr.sort((a, b) => {
    const dir = params.sortDir === "asc" ? 1 : -1;
    if (params.sortBy === "nome") return dir * a.nome.localeCompare(b.nome, "pt-BR");
    return dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  });
  const total = arr.length;
  const start = (params.page - 1) * params.limit;
  const items = arr.slice(start, start + params.limit);
  return { items, total };
}

export function dashboardStats() {
  const all = getStore().clients.filter((c) => !c.deletedAt);
  const by = (s: ClientDoc["status"]) => all.filter((c) => c.status === s).length;
  const recentes = [...all].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5);
  return {
    total: all.length,
    ativos: by("ativo"),
    inativos: by("inativo"),
    leads: by("lead"),
    emNegociacao: by("em_negociacao"),
    recentes,
  };
}

// ── Blog helpers ────────────────────────────────────────────────────────────

export function slugify(input: string): string {
  return (
    input
      .trim()
      .toLowerCase()
      .normalize("NFD")
      // Remove diacríticos
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "artigo"
  );
}

export function ensureUniquePostSlug(base: string, excludeId?: string): string {
  const store = getStore();
  const existing = new Set(
    store.posts.filter((p) => p.id !== excludeId && !p.deletedAt).map((p) => p.slug),
  );
  if (!existing.has(base)) return base;
  let i = 2;
  while (existing.has(`${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}

// ── Posts ──────────────────────────────────────────────────────────────────

export function findPostById(id: string, includeDeleted = false): PostDoc | null {
  const p = getStore().posts.find((x) => x.id === id) ?? null;
  if (!p) return null;
  if (!includeDeleted && p.deletedAt) return null;
  return p;
}

export function findPostBySlug(slug: string): PostDoc | null {
  const p = getStore().posts.find((x) => x.slug === slug && !x.deletedAt) ?? null;
  return p ?? null;
}

export function findPublishedPostBySlug(slug: string): PostDoc | null {
  const p = getStore().posts.find((x) => x.slug === slug && x.status === "published" && !x.deletedAt) ?? null;
  return p ?? null;
}

export function upsertPost(doc: PostDoc) {
  const s = getStore();
  const idx = s.posts.findIndex((p) => p.id === doc.id);
  if (idx >= 0) s.posts[idx] = doc;
  else s.posts.push(doc);
  saveStore(s);
}

export type PostListParams = {
  q?: string;
  status?: string;
  sortBy?: "publishedAt" | "createdAt" | "title";
  sortDir?: "asc" | "desc";
  page: number;
  limit: number;
  includeDeleted?: boolean;
};

export function listPosts(params: PostListParams): { items: PostDoc[]; total: number } {
  let arr = getStore().posts.filter((p) => (params.includeDeleted ? true : !p.deletedAt));
  const q = params.q?.trim().toLowerCase();
  if (q) {
    arr = arr.filter((p) => {
      const hay = `${p.title} ${p.excerpt} ${p.slug}`.toLowerCase();
      return hay.includes(q);
    });
  }
  if (params.status && params.status !== "todos") {
    arr = arr.filter((p) => p.status === params.status);
  }
  const sortBy = params.sortBy ?? "createdAt";
  const dir = params.sortDir === "asc" ? 1 : -1;
  arr.sort((a, b) => {
    if (sortBy === "title") return dir * a.title.localeCompare(b.title, "pt-BR");
    if (sortBy === "publishedAt") {
      const av = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bv = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      if (av !== bv) return dir * (av - bv);
      return dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    return dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  });
  const total = arr.length;
  const start = (params.page - 1) * params.limit;
  const items = arr.slice(start, start + params.limit);
  return { items, total };
}

export function listPublishedPosts(params: { q?: string; page: number; limit: number }): {
  items: PostDoc[];
  total: number;
} {
  let arr = getStore().posts.filter((p) => p.status === "published" && !p.deletedAt);
  const q = params.q?.trim().toLowerCase();
  if (q) {
    arr = arr.filter((p) => `${p.title} ${p.excerpt}`.toLowerCase().includes(q));
  }
  arr.sort((a, b) => {
    const av = a.publishedAt ? new Date(a.publishedAt).getTime() : new Date(a.createdAt).getTime();
    const bv = b.publishedAt ? new Date(b.publishedAt).getTime() : new Date(b.createdAt).getTime();
    return bv - av;
  });
  const total = arr.length;
  const start = (params.page - 1) * params.limit;
  const items = arr.slice(start, start + params.limit);
  return { items, total };
}

export function recentPublishedPosts(limit = 6): PostDoc[] {
  return listPublishedPosts({ page: 1, limit }).items;
}
