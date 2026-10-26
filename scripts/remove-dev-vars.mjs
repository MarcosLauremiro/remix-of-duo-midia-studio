#!/usr/bin/env node
// O @cloudflare/vite-plugin grava dist/<env>/.dev.vars com TODAS as variáveis do .env local durante o build.
// Esses valores são segredos reais: este script remove o arquivo logo após o build.
// Deploy não usa .dev.vars; o `wrangler dev` local continua lendo o arquivo se você recriá-lo.
import { existsSync, readdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
if (!existsSync(dist)) process.exit(0);

let removed = 0;
for (const entry of readdirSync(dist, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const file = join(dist, entry.name, ".dev.vars");
  if (existsSync(file)) {
    rmSync(file);
    removed += 1;
  }
}
if (removed > 0) console.log(`Removido(s) ${removed} arquivo(s) .dev.vars do build.`);
