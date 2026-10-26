import type { Db } from "mongodb";
import type { AdminDoc } from "../admin/db";
import { normalizeEmail, nowIso } from "../admin/db";
import { WITHOUT_ID } from "./mongo";

const COLLECTION = "admins";

export async function findAdminByEmail(db: Db, email: string): Promise<AdminDoc | null> {
  return db
    .collection<AdminDoc>(COLLECTION)
    .findOne({ email: normalizeEmail(email) }, WITHOUT_ID) as Promise<AdminDoc | null>;
}

export async function findAdminById(db: Db, id: string): Promise<AdminDoc | null> {
  return db
    .collection<AdminDoc>(COLLECTION)
    .findOne({ id }, WITHOUT_ID) as Promise<AdminDoc | null>;
}

/** Invalida todas as sessões existentes do admin (logout). */
export async function bumpAdminTokenVersion(db: Db, id: string): Promise<void> {
  await db
    .collection<AdminDoc>(COLLECTION)
    .updateOne({ id }, { $inc: { tokenVersion: 1 }, $set: { updatedAt: nowIso() } });
}

/** Cria ou atualiza um admin pelo e-mail (usado pelo script de criação). */
export async function upsertAdminByEmail(
  db: Db,
  doc: Pick<AdminDoc, "id" | "name" | "email" | "passwordHash" | "createdAt">,
): Promise<AdminDoc> {
  const now = nowIso();
  const email = normalizeEmail(doc.email);
  const result = await db.collection<AdminDoc>(COLLECTION).findOneAndUpdate(
    { email },
    {
      $set: {
        name: doc.name,
        passwordHash: doc.passwordHash,
        status: "active",
        role: "admin",
        updatedAt: now,
      },
      $inc: { tokenVersion: 1 },
      $setOnInsert: { id: doc.id, email, createdAt: doc.createdAt },
    },
    { upsert: true, returnDocument: "after", projection: { _id: 0 } },
  );
  if (!result) throw new Error("upsertAdminByEmail: resultado vazio");
  return result as AdminDoc;
}
