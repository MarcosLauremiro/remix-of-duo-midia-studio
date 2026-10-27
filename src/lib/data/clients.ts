import type { Db, Filter, Sort } from "mongodb";
import type { ClientDoc, ClientListParams } from "../admin/db";
import { escapeRegex, WITHOUT_ID } from "./mongo";

const COLLECTION = "clients";
const PT_BR = { locale: "pt", strength: 2 } as const;

function col(db: Db) {
  return db.collection<ClientDoc>(COLLECTION);
}

export async function findClientById(
  db: Db,
  id: string,
  includeDeleted = false,
): Promise<ClientDoc | null> {
  const filter: Filter<ClientDoc> = includeDeleted ? { id } : { id, deletedAt: null };
  return col(db).findOne(filter, WITHOUT_ID) as Promise<ClientDoc | null>;
}

export async function insertClient(db: Db, doc: ClientDoc): Promise<void> {
  // Cópia: o driver acrescenta _id (ObjectId) ao objeto inserido (ver insertPost).
  await col(db).insertOne({ ...doc });
}

/** Substitui o documento inteiro pelo id (usado em edição, exclusão lógica e restauração). */
export async function saveClient(db: Db, doc: ClientDoc): Promise<void> {
  await col(db).replaceOne({ id: doc.id }, doc);
}

export async function listClients(
  db: Db,
  params: ClientListParams,
): Promise<{ items: ClientDoc[]; total: number }> {
  const filter: Filter<ClientDoc> = {};
  if (!params.includeDeleted) filter.deletedAt = null;

  const q = params.q?.trim();
  if (q) {
    const rx = new RegExp(escapeRegex(q), "i");
    filter.$or = [{ nome: rx }, { empresa: rx }, { email: rx }];
  }
  if (params.status && params.status !== "todos") {
    filter.status = params.status as ClientDoc["status"];
  }

  const dir = params.sortDir === "asc" ? 1 : -1;
  const sort: Sort = params.sortBy === "nome" ? { nome: dir, id: 1 } : { createdAt: dir, id: 1 };
  const collation = params.sortBy === "nome" ? PT_BR : undefined;

  const [items, total] = await Promise.all([
    col(db)
      .find(filter, { ...WITHOUT_ID, sort, collation })
      .skip((params.page - 1) * params.limit)
      .limit(params.limit)
      .toArray(),
    col(db).countDocuments(filter),
  ]);
  return { items: items as ClientDoc[], total };
}

export async function dashboardStats(db: Db) {
  const base: Filter<ClientDoc> = { deletedAt: null };
  const countBy = (status: ClientDoc["status"]) => col(db).countDocuments({ ...base, status });

  const [total, ativos, inativos, leads, emNegociacao, recentes] = await Promise.all([
    col(db).countDocuments(base),
    countBy("ativo"),
    countBy("inativo"),
    countBy("lead"),
    countBy("em_negociacao"),
    col(db)
      .find(base, { ...WITHOUT_ID, sort: { createdAt: -1, id: 1 }, limit: 5 })
      .toArray(),
  ]);
  return { total, ativos, inativos, leads, emNegociacao, recentes: recentes as ClientDoc[] };
}
