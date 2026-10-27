import type { Db, Filter, Sort } from "mongodb";
import type { PostDoc, PostListParams } from "../admin/db";
import { escapeRegex, WITHOUT_ID } from "./mongo";

const COLLECTION = "posts";
const PT_BR = { locale: "pt", strength: 2 } as const;

function col(db: Db) {
  return db.collection<PostDoc>(COLLECTION);
}

export async function findPostById(
  db: Db,
  id: string,
  includeDeleted = false,
): Promise<PostDoc | null> {
  const filter: Filter<PostDoc> = includeDeleted ? { id } : { id, deletedAt: null };
  return col(db).findOne(filter, WITHOUT_ID) as Promise<PostDoc | null>;
}

export async function findPostBySlug(db: Db, slug: string): Promise<PostDoc | null> {
  return col(db).findOne({ slug, deletedAt: null }, WITHOUT_ID) as Promise<PostDoc | null>;
}

export async function findPublishedPostBySlug(db: Db, slug: string): Promise<PostDoc | null> {
  return col(db).findOne(
    { slug, status: "published", deletedAt: null },
    WITHOUT_ID,
  ) as Promise<PostDoc | null>;
}

export async function insertPost(db: Db, doc: PostDoc): Promise<void> {
  // Cópia: o driver acrescenta _id (ObjectId) ao objeto inserido, e esse objeto volta ao navegador
  // pela server function, onde o ObjectId não serializa ("Seroval Error").
  await col(db).insertOne({ ...doc });
}

/** Substitui o documento inteiro pelo id. */
export async function savePost(db: Db, doc: PostDoc): Promise<void> {
  await col(db).replaceOne({ id: doc.id }, doc);
}

/**
 * Gera um slug livre entre os posts não excluídos, acrescentando -2, -3, ...
 * Mesmo critério de antes; a garantia final é o índice único parcial criado pelo db:setup.
 */
export async function ensureUniquePostSlug(
  db: Db,
  base: string,
  excludeId?: string,
): Promise<string> {
  const taken = await col(db)
    .find(
      {
        deletedAt: null,
        slug: new RegExp(`^${escapeRegex(base)}(-\\d+)?$`),
        ...(excludeId ? { id: { $ne: excludeId } } : {}),
      },
      { projection: { _id: 0, slug: 1 } },
    )
    .toArray();
  const existing = new Set(taken.map((p) => p.slug));
  if (!existing.has(base)) return base;
  let i = 2;
  while (existing.has(`${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}

export async function listPosts(
  db: Db,
  params: PostListParams,
): Promise<{ items: PostDoc[]; total: number }> {
  const filter: Filter<PostDoc> = {};
  if (!params.includeDeleted) filter.deletedAt = null;

  const q = params.q?.trim();
  if (q) {
    const rx = new RegExp(escapeRegex(q), "i");
    filter.$or = [{ title: rx }, { excerpt: rx }, { slug: rx }];
  }
  if (params.status && params.status !== "todos") {
    filter.status = params.status as PostDoc["status"];
  }

  const dir = params.sortDir === "asc" ? 1 : -1;
  const sortBy = params.sortBy ?? "createdAt";
  let sort: Sort;
  let collation: typeof PT_BR | undefined;
  if (sortBy === "title") {
    sort = { title: dir, id: 1 };
    collation = PT_BR;
  } else if (sortBy === "publishedAt") {
    // Nulos vêm primeiro em ordem crescente, como no critério anterior (tratados como 0).
    sort = { publishedAt: dir, createdAt: dir, id: 1 };
  } else {
    sort = { createdAt: dir, id: 1 };
  }

  const [items, total] = await Promise.all([
    col(db)
      .find(filter, { ...WITHOUT_ID, sort, collation })
      .skip((params.page - 1) * params.limit)
      .limit(params.limit)
      .toArray(),
    col(db).countDocuments(filter),
  ]);
  return { items: items as PostDoc[], total };
}

export async function listPublishedPosts(
  db: Db,
  params: { q?: string; page: number; limit: number },
): Promise<{ items: PostDoc[]; total: number }> {
  const filter: Filter<PostDoc> = { status: "published", deletedAt: null };
  const q = params.q?.trim();
  if (q) {
    const rx = new RegExp(escapeRegex(q), "i");
    filter.$or = [{ title: rx }, { excerpt: rx }];
  }
  // Publicados sempre recebem publishedAt ao serem publicados; createdAt é só desempate.
  const sort: Sort = { publishedAt: -1, createdAt: -1, id: 1 };

  const [items, total] = await Promise.all([
    col(db)
      .find(filter, { ...WITHOUT_ID, sort })
      .skip((params.page - 1) * params.limit)
      .limit(params.limit)
      .toArray(),
    col(db).countDocuments(filter),
  ]);
  return { items: items as PostDoc[], total };
}

export async function recentPublishedPosts(db: Db, limit = 6): Promise<PostDoc[]> {
  return (await listPublishedPosts(db, { page: 1, limit })).items;
}
