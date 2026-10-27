// Blog: serverFns públicas (leitura) e administrativas (CRUD protegido por sessão)
import { createServerFn } from "@tanstack/react-start";
import {
  ensureUniquePostSlug,
  findPostById,
  findPostBySlug,
  findPublishedPostBySlug,
  insertPost,
  listPosts,
  listPublishedPosts,
  recentPublishedPosts,
  savePost,
} from "../data/posts";
import { withDb } from "../data/mongo";
import { newId, nowIso, slugify, type PostDoc } from "./db";
import { withAdmin } from "./auth";
import { handleErrors } from "./http-errors";
import {
  COVER_IMAGE_DATA_URL_PATTERN,
  postCreateSchema,
  postUpdateSchema,
  postListQuerySchema,
  publishedPostListQuerySchema,
  postStatusSchema,
  validateOr400,
} from "./validators";

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
  .handler(async ({ data }) =>
    handleErrors(() =>
      withDb(async (db) => {
        const { items, total } = await listPublishedPosts(db, {
          q: data.q,
          page: data.page,
          limit: data.limit,
        });
        return {
          items,
          total,
          page: data.page,
          limit: data.limit,
          totalPages: Math.max(1, Math.ceil(total / data.limit)),
        };
      }),
    ),
  );

export const recentBlogPostsFn = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => {
    const o = (d ?? {}) as { limit?: unknown };
    const limit = typeof o.limit === "number" ? Math.min(12, Math.max(1, Math.floor(o.limit))) : 6;
    return { limit };
  })
  .handler(async ({ data }) =>
    handleErrors(() =>
      withDb(async (db) => ({ items: await recentPublishedPosts(db, data.limit) })),
    ),
  );

export const getPublishedPostBySlugFn = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => {
    const o = d as { slug?: unknown };
    if (!o || typeof o.slug !== "string" || !o.slug.trim())
      throw new Error("VALIDATION:Slug inválido");
    const slug = o.slug.trim().toLowerCase();
    if (!/^[a-z0-9-]+$/.test(slug) || slug.length > 80) throw new Error("VALIDATION:Slug inválido");
    return { slug };
  })
  .handler(async ({ data }) =>
    handleErrors(async () => {
      const post = await withDb((db) => findPublishedPostBySlug(db, data.slug));
      if (!post)
        throw new Response(JSON.stringify({ error: "Artigo não encontrado" }), { status: 404 });
      return { post };
    }),
  );

// ── Admin (com auth) ───────────────────────────────────────────────────────

export const adminListPostsFn = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => postListQuerySchema.parse(d ?? {}))
  .handler(async ({ data }) =>
    handleErrors(() =>
      withAdmin(async (db) => {
        const { items, total } = await listPosts(db, {
          q: data.q,
          status: data.status,
          sortBy: data.sortBy,
          sortDir: data.sortDir,
          page: data.page,
          limit: data.limit,
        });
        return {
          items,
          total,
          page: data.page,
          limit: data.limit,
          totalPages: Math.max(1, Math.ceil(total / data.limit)),
        };
      }),
    ),
  );

export const adminGetPostFn = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => {
    const o = d as { id?: unknown; slug?: unknown };
    const id = typeof o?.id === "string" ? o.id.trim() : "";
    const slug = typeof o?.slug === "string" ? o.slug.trim() : "";
    if (id) return { id, slug: "" as string };
    if (slug) return { id: "" as string, slug };
    throw new Error("VALIDATION:Informe id ou slug");
  })
  .handler(async ({ data }) =>
    handleErrors(() =>
      withAdmin(async (db) => {
        const post = data.id
          ? await findPostById(db, data.id, true)
          : await findPostBySlug(db, data.slug);
        if (!post) throw new Error("NOT_FOUND:Artigo não encontrado");
        return { post };
      }),
    ),
  );

export const adminCreatePostFn = createServerFn({ method: "POST" })
  .inputValidator(validateOr400(postCreateSchema))
  .handler(async ({ data }) =>
    handleErrors(() =>
      withAdmin(async (db) => {
        const rawSlug = data.slug?.trim() ? data.slug.trim() : slugify(data.title);
        const slug = await ensureUniquePostSlug(db, slugify(rawSlug));
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
        await insertPost(db, doc);
        return { post: doc };
      }),
    ),
  );

export const adminUpdatePostFn = createServerFn({ method: "POST" })
  .inputValidator(validateOr400(postUpdateSchema))
  .handler(async ({ data }) =>
    handleErrors(() =>
      withAdmin(async (db) => {
        const existing = await findPostById(db, data.id, true);
        if (!existing || existing.deletedAt) throw new Error("NOT_FOUND:Artigo não encontrado");
        const patch: Partial<PostDoc> = {};
        if (data.title !== undefined) patch.title = data.title.trim();
        if (data.excerpt !== undefined) patch.excerpt = data.excerpt.trim();
        if (data.content !== undefined) patch.content = data.content.trim();
        if (data.coverImage !== undefined)
          patch.coverImage = normalizeCoverImage(data.coverImage as string | null);
        if (data.slug !== undefined) {
          const raw = (data.slug ?? "").trim();
          const base = raw ? slugify(raw) : existing.slug;
          patch.slug = await ensureUniquePostSlug(db, base, existing.id);
        }
        // Trocar o título sem slug explícito não muda o slug (evita quebrar links).
        if (data.status !== undefined) {
          const next = postStatusSchema.parse(data.status);
          patch.status = next;
          if (next === "published" && existing.status !== "published") patch.publishedAt = nowIso();
          if (next === "draft") patch.publishedAt = null;
        }
        const updated: PostDoc = { ...existing, ...patch, updatedAt: nowIso() } as PostDoc;
        // Se publicou pela primeira vez e ainda não tem publishedAt, define agora
        if (updated.status === "published" && !updated.publishedAt) updated.publishedAt = nowIso();
        await savePost(db, updated);
        return { post: updated };
      }),
    ),
  );

export const adminDeletePostFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const o = d as { id?: unknown };
    if (!o || typeof o.id !== "string" || !o.id.trim()) throw new Error("VALIDATION:ID inválido");
    return { id: o.id.trim() };
  })
  .handler(async ({ data }) =>
    handleErrors(() =>
      withAdmin(async (db) => {
        const p = await findPostById(db, data.id);
        if (!p) throw new Error("NOT_FOUND:Artigo não encontrado");
        p.deletedAt = nowIso();
        p.updatedAt = p.deletedAt;
        await savePost(db, p);
        return { ok: true as const };
      }),
    ),
  );

export const adminPublishPostFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const o = d as { id?: unknown; status?: unknown };
    if (!o || typeof o.id !== "string" || !o.id.trim()) throw new Error("VALIDATION:ID inválido");
    const status = postStatusSchema.parse((o.status as string) ?? "published");
    return { id: o.id.trim(), status };
  })
  .handler(async ({ data }) =>
    handleErrors(() =>
      withAdmin(async (db) => {
        const p = await findPostById(db, data.id, true);
        if (!p || p.deletedAt) throw new Error("NOT_FOUND:Artigo não encontrado");
        p.status = data.status;
        if (data.status === "published") p.publishedAt = p.publishedAt ?? nowIso();
        else p.publishedAt = null;
        p.updatedAt = nowIso();
        await savePost(db, p);
        return { post: p };
      }),
    ),
  );
