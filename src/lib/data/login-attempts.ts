import { createHash } from "node:crypto";
import type { Db } from "mongodb";

const COLLECTION = "login_attempts";

type LoginAttempt = { _id: string; count: number; expiresAt: Date };

/**
 * Contador de tentativas em janela fixa, persistido no MongoDB para valer entre instâncias do Worker.
 * Retorna false quando a tentativa excede o limite. A chave é hasheada para não guardar e-mail/IP em claro.
 * Índice TTL em `expiresAt` é criado por `npm run db:setup`.
 */
export async function consumeLoginAttempt(
  db: Db,
  rawKey: string,
  max: number,
  windowMs: number,
): Promise<boolean> {
  const id = createHash("sha256").update(rawKey).digest("hex");
  const col = db.collection<LoginAttempt>(COLLECTION);
  const now = new Date();

  const current = await col.findOneAndUpdate(
    { _id: id, expiresAt: { $gt: now } },
    { $inc: { count: 1 } },
    { returnDocument: "after" },
  );
  if (current) return current.count <= max;

  // Primeira tentativa na janela (ou janela anterior expirada).
  await col.updateOne(
    { _id: id },
    { $set: { count: 1, expiresAt: new Date(now.getTime() + windowMs) } },
    { upsert: true },
  );
  return 1 <= max;
}
