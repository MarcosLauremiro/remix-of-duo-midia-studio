#!/usr/bin/env node
// Cria os índices do banco. Seguro de executar várias vezes.
// Uso: npm run db:setup
import { ensureIndexes } from "./lib/indexes.mjs";
import { withScriptDb } from "./lib/mongo-connect.mjs";

await withScriptDb(async (db) => {
  await ensureIndexes(db);
  console.log("Índices criados/verificados: admins, clients, posts, login_attempts.");
});
