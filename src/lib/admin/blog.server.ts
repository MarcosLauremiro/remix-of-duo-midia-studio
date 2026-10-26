// Blog: serverFns públicas (leitura) e administrativas (CRUD protegido por sessão)
import { createServerFn } from "@tanstack/react-start";
import {
  findPostById,
  findPublishedPostBySlug,
  slugify,
  ensureUniquePostSlug,
  upsertPost,
  listPosts,
  listPublishedPosts,
  recentPublishedPosts,
  newId,
  nowIso,
  findPostBySlug,
} from "./db";
import { findAdminById, type PostDoc } from "./db";
import { getSessionAdminIdFromCookie } from "./auth";
import {
  postCreateSchema,
  postUpdateSchema,
  postListQuerySchema,
  publishedPostListQuerySchema,
  postStatusSchema,
  COVER_IMAGE_DATA_URL_PATTERN,
} from "./validators";

function requireAdmin() {
  const adminId = getSessionAdminIdFromCookie();
  if (!adminId) throw new Error("UNAUTHORIZED");
  const admin = findAdminById(adminId);
  if (!admin || admin.status !== "active") throw new Error("UNAUTHORIZED");
  return admin;
}

function toClientError(e: unknown): never {
  const msg = e instanceof Error ? e.message : "Erro interno";
  if (msg === "UNAUTHORIZED") throw new Response(JSON.stringify({ error: "Não autenticado" }), { status: 401 });
  if (msg.startsWith("VALIDATION:")) throw new Response(JSON.stringify({ error: msg.slice(11) }), { status: 400 });
  if (msg.startsWith("NOT_FOUND:")) throw new Response(JSON.stringify({ error: msg.slice(10) }), { status: 404 });
  throw new Response(JSON.stringify({ error: "Erro interno" }), { status: 500 });
}

function normalizeCoverImage(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const t = raw.trim();
  if (!t) return null;
  // Data URL só de imagem permitida (jpeg/png/webp), já validada no schema
  if (/^data:/i.test(t)) return COVER_IMAGE_DATA_URL_PATTERN.test(t) ? t : null;
  // Aceita URL absoluta ou caminho /assets; bloqueia javascript: etc
  if (/^javascript:/i.test(t)) return null;
  return t.slice(0, 2048);
}

// ── Públicas (sem auth) ────────────────────────────────────────────────────

export const listPublishedPostsFn = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => publishedPostListQuerySchema.parse(d ?? {}))
  .handler(async ({ data }) => {
    const { items, total } = listPublishedPosts({ q: data.q, page: data.page, limit: data.limit });
    return { items, total, page: data.page, limit: data.limit, totalPages: Math.max(1, Math.ceil(total / data.limit)) };
  });

export const recentBlogPostsFn = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => {
    const o = (d ?? {}) as { limit?: unknown };
    const limit = typeof o.limit === "number" ? Math.min(12, Math.max(1, Math.floor(o.limit))) : 6;
    return { limit };
  })
  .handler(async ({ data }) => {
    const items = recentPublishedPosts(data.limit);
    return { items };
  });

export const getPublishedPostBySlugFn = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => {
    const o = d as { slug?: unknown };
    if (!o || typeof o.slug !== "string" || !o.slug.trim()) throw new Error("VALIDATION:Slug inválido");
    const slug = o.slug.trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(slug) || slug.length > 80) throw new Error("VALIDATION:Slug inválido");
    return { slug };
  })
  .handler(async ({ data }) => {
    const post = findPublishedPostBySlug(data.slug);
    if (!post) throw new Response(JSON.stringify({ error: "Artigo não encontrado" }), { status: 404 });
    return { post };
  });

// ── Admin (com auth) ───────────────────────────────────────────────────────

export const adminListPostsFn = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => postListQuerySchema.parse(d ?? {}))
  .handler(async ({ data }) => {
    try {
      requireAdmin();
      const { items, total } = listPosts({
        q: data.q,
        status: data.status,
        sortBy: data.sortBy,
        sortDir: data.sortDir,
        page: data.page,
        limit: data.limit,
      });
      return { items, total, page: data.page, limit: data.limit, totalPages: Math.max(1, Math.ceil(total / data.limit)) };
    } catch (e) {
      if (e instanceof Response) throw e;
      toClientError(e);
    }
  });

export const adminGetPostFn = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => {
    const o = d as { id?: unknown; slug?: unknown };
    const id = typeof o?.id === "string" ? o.id.trim() : "";
    const slug = typeof o?.slug === "string" ? o.slug.trim() : "";
    if (id) return { id, slug: "" as string };
    if (slug) return { id: "" as string, slug };
    throw new Error("VALIDATION:Informe id ou slug");
  })
  .handler(async ({ data }) => {
    try {
      requireAdmin();
      const post = data.id ? findPostById(data.id, true) : findPostBySlug(data.slug);
      if (!post) throw new Error("NOT_FOUND:Artigo não encontrado");
      return { post };
    } catch (e) {
      if (e instanceof Response) throw e;
      toClientError(e);
    }
  });

export const adminCreatePostFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => postCreateSchema.parse(d))
  .handler(async ({ data }) => {
    try {
      requireAdmin();
      const rawSlug = data.slug?.trim() ? data.slug.trim() : slugify(data.title);
      const slug = ensureUniquePostSlug(slugify(rawSlug));
      const status = postStatusSchema.parse(data.status ?? "draft");
      const now = nowIso();
      const doc: PostDoc = {
        id: newId(),
        title: data.title.trim(),
        slug,
        coverImage: normalizeCoverImage(data.coverImage as string | null),
        excerpt: data.excerpt.trim(),
        content: data.content.trim(),
        status,
        createdAt: now,
        updatedAt: now,
        publishedAt: status === "published" ? now : null,
        deletedAt: null,
      };
      upsertPost(doc);
      return { post: doc };
    } catch (e) {
      if (e instanceof Response) throw e;
      if (e instanceof Error && e.name === "ZodError") throw new Response(JSON.stringify({ error: "Dados inválidos" }), { status: 400 });
      toClientError(e);
    }
  });

export const adminUpdatePostFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => postUpdateSchema.parse(d))
  .handler(async ({ data }) => {
    try {
      requireAdmin();
      const existing = findPostById(data.id, true);
      if (!existing || existing.deletedAt) throw new Error("NOT_FOUND:Artigo não encontrado");
      const patch: Partial<PostDoc> = {};
      if (data.title !== undefined) patch.title = data.title.trim();
      if (data.excerpt !== undefined) patch.excerpt = data.excerpt.trim();
      if (data.content !== undefined) patch.content = data.content.trim();
      if (data.coverImage !== undefined) patch.coverImage = normalizeCoverImage(data.coverImage as string | null);
      if (data.slug !== undefined) {
        const raw = (data.slug ?? "").trim();
        const base = raw ? slugify(raw) : existing.slug;
        patch.slug = ensureUniquePostSlug(base, existing.id);
      } else if (data.title !== undefined) {
        // Se trocou título sem slug explícito, não muda slug automaticamente (evita quebrar link)
      }
      if (data.status !== undefined) {
        const next = postStatusSchema.parse(data.status);
        patch.status = next;
        if (next === "published" && existing.status !== "published") patch.publishedAt = nowIso();
        if (next === "draft") patch.publishedAt = null;
      }
      const updated: PostDoc = { ...existing, ...patch, updatedAt: nowIso() } as PostDoc;
      // Se publicou pela primeira vez e ainda não tem publishedAt, define agora
      if (updated.status === "published" && !updated.publishedAt) updated.publishedAt = nowIso();
      upsertPost(updated);
      return { post: updated };
    } catch (e) {
      if (e instanceof Response) throw e;
      toClientError(e);
    }
  });

export const adminDeletePostFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const o = d as { id?: unknown };
    if (!o || typeof o.id !== "string" || !o.id.trim()) throw new Error("VALIDATION:ID inválido");
    return { id: o.id.trim() };
  })
  .handler(async ({ data }) => {
    try {
      requireAdmin();
      const p = findPostById(data.id);
      if (!p) throw new Error("NOT_FOUND:Artigo não encontrado");
      p.deletedAt = nowIso();
      p.updatedAt = p.deletedAt;
      upsertPost(p);
      return { ok: true as const };
    } catch (e) {
      if (e instanceof Response) throw e;
      toClientError(e);
    }
  });

export const adminPublishPostFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const o = d as { id?: unknown; status?: unknown };
    if (!o || typeof o.id !== "string" || !o.id.trim()) throw new Error("VALIDATION:ID inválido");
    const status = postStatusSchema.parse((o.status as string) ?? "published");
    return { id: o.id.trim(), status };
  })
  .handler(async ({ data }) => {
    try {
      requireAdmin();
      const p = findPostById(data.id, true);
      if (!p || p.deletedAt) throw new Error("NOT_FOUND:Artigo não encontrado");
      p.status = data.status;
      if (data.status === "published") p.publishedAt = p.publishedAt ?? nowIso();
      else p.publishedAt = null;
      p.updatedAt = nowIso();
      upsertPost(p);
      return { post: p };
    } catch (e) {
      if (e instanceof Response) throw e;
      toClientError(e);
    }
  });
