#!/usr/bin/env node
// Importa .data/store.json para o MongoDB de forma idempotente.
//
//   npm run db:import              dry-run: mostra o plano, não grava nada
//   npm run db:import -- --apply   grava (cria backup antes, nunca apaga o arquivo original)
//
// Reexecutar não duplica registros: o upsert usa $setOnInsert, então documentos já existentes
// nunca são sobrescritos. Divergências entre o arquivo e o banco aparecem como conflitos.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { COLLECTIONS, canonicalize, planImport, validateDoc } from "./lib/import-plan.mjs";
import { ensureIndexes } from "./lib/indexes.mjs";
import { withScriptDb } from "./lib/mongo-connect.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const storePath = join(root, ".data", "store.json");
const apply = process.argv.includes("--apply");

if (!existsSync(storePath)) {
  console.log("Nada a importar: .data/store.json não existe.");
  process.exit(0);
}

const store = JSON.parse(readFileSync(storePath, "utf-8"));

function printPlan(report) {
  console.log(apply ? "Modo: APLICAR" : "Modo: dry-run (nada será gravado)");
  for (const [name, r] of Object.entries(report.collections)) {
    console.log(
      `${name}: total=${r.total} inserir=${r.insert.length} iguais=${r.unchanged} ` +
        `conflitos=${r.conflicts.length} inválidos=${r.invalid.length} duplicados=${r.duplicates.length}`,
    );
    for (const bad of r.invalid) console.log(`  inválido ${bad.id ?? "(sem id)"}: ${bad.reason}`);
    for (const id of r.conflicts) console.log(`  conflito (não será sobrescrito): ${id}`);
    for (const id of r.duplicates) console.log(`  id duplicado no arquivo: ${id}`);
  }
}

await withScriptDb(async (db) => {
  const existing = {};
  for (const name of COLLECTIONS) {
    const docs = await db
      .collection(name)
      .find({}, { projection: { _id: 0 } })
      .toArray();
    existing[name] = new Map(docs.map((d) => [d.id, d]));
  }

  const report = planImport(store, existing);
  printPlan(report);

  if (!report.ok) {
    console.error("Importação bloqueada: corrija os documentos inválidos ou duplicados.");
    process.exitCode = 1;
    return;
  }
  if (!apply) {
    console.log("Dry-run concluído. Rode com --apply para importar.");
    return;
  }

  // Backup antes de qualquer escrita. Cópia, nunca movimentação do original.
  const backupDir = join(root, ".data", "backup");
  mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = join(backupDir, `store-${stamp}.json`);
  copyFileSync(storePath, backupPath);
  console.log(`Backup criado em .data/backup/ (${backupPath.split("/").pop()}).`);

  await ensureIndexes(db);

  let writeErrors = 0;
  for (const name of COLLECTIONS) {
    const ops = report.collections[name].insert.map((doc) => {
      const { id, ...rest } = doc;
      return { updateOne: { filter: { id }, update: { $setOnInsert: rest }, upsert: true } };
    });
    if (ops.length === 0) continue;
    try {
      await db.collection(name).bulkWrite(ops, { ordered: false });
    } catch (e) {
      // Erro de chave única (ex.: e-mail já usado por outro admin) e similares. Reporta sem o conteúdo.
      writeErrors += e?.writeErrors?.length ?? 1;
      console.error(
        `${name}: erros de escrita=${e?.writeErrors?.length ?? 1} (${e?.code ?? e?.name})`,
      );
    }
  }

  // Verificação: cada documento válido do arquivo deve estar no banco e igual (exceto conflitos).
  let mismatches = 0;
  let verified = 0;
  for (const name of COLLECTIONS) {
    const conflictIds = new Set(report.collections[name].conflicts);
    for (const doc of store[name] ?? []) {
      if (validateDoc(name, doc)) continue;
      const expected = conflictIds.has(doc.id) ? existing[name].get(doc.id) : doc;
      const saved = await db.collection(name).findOne({ id: doc.id }, { projection: { _id: 0 } });
      if (saved && expected && canonicalize(name, saved) === canonicalize(name, expected)) {
        verified += 1;
      } else {
        mismatches += 1;
      }
    }
  }

  console.log(`Verificação: conferidos=${verified} divergentes/ausentes=${mismatches}`);
  if (writeErrors > 0 || mismatches > 0) {
    process.exitCode = 1;
  } else if (
    report.collections &&
    Object.values(report.collections).some((r) => r.conflicts.length)
  ) {
    process.exitCode = 2; // importação concluída, mas há conflitos para revisão manual
  }
});
