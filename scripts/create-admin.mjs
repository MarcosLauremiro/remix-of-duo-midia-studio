#!/usr/bin/env node
// Cria ou atualiza um admin no MongoDB. Idempotente pelo e-mail.
// Trocar a senha de um admin existente invalida as sessões dele.
//
// Uso (senha e e-mail vêm do ambiente, nunca de argumentos):
//   ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run admin:create
// ADMIN_NAME é opcional (padrão "Admin").
import { randomBytes, randomUUID, scryptSync } from "node:crypto";
import { withScriptDb } from "./lib/mongo-connect.mjs";

const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD || "";
const name = (process.env.ADMIN_NAME || "Admin").trim() || "Admin";

if (!email || !password) {
  console.error("Defina ADMIN_EMAIL e ADMIN_PASSWORD no ambiente.");
  process.exit(1);
}
if (password.length < 8) {
  console.error("ADMIN_PASSWORD deve ter pelo menos 8 caracteres.");
  process.exit(1);
}

// Mesmo formato de src/lib/admin/session.ts: scrypt$N$r$p$salt$hash
function hashPassword(pwd) {
  const salt = randomBytes(16).toString("hex");
  const N = 16384;
  const r = 8;
  const p = 1;
  const hash = scryptSync(pwd, salt, 32, { N, r, p, maxmem: 64 * 1024 * 1024 }).toString("hex");
  return `scrypt$${N}$${r}$${p}$${salt}$${hash}`;
}

await withScriptDb(async (db) => {
  const now = new Date().toISOString();
  const result = await db.collection("admins").findOneAndUpdate(
    { email },
    {
      $set: {
        name,
        passwordHash: hashPassword(password),
        status: "active",
        role: "admin",
        updatedAt: now,
      },
      $inc: { tokenVersion: 1 },
      $setOnInsert: { id: randomUUID(), email, createdAt: now },
    },
    { upsert: true, returnDocument: "after", projection: { _id: 0, id: 1 } },
  );
  console.log(`Admin pronto (id ${result.id}). Sessões anteriores deste admin foram invalidadas.`);
});
