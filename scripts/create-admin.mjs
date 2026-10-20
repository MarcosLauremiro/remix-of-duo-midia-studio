#!/usr/bin/env node
// Uso: ADMIN_EMAIL=... ADMIN_PASSWORD=... SESSION_SECRET=... node scripts/create-admin.mjs
// Cria ou reativa o admin inicial sem expor rota em produção.
import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

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

function hashPassword(pwd) {
  const salt = randomBytes(16).toString("hex");
  const N = 16384, r = 8, p = 1, keyLen = 32;
  const hash = scryptSync(pwd, salt, keyLen, { N, r, p, maxmem: 64 * 1024 * 1024 }).toString("hex");
  return `scrypt$${N}$${r}$${p}$${salt}$${hash}`;
}

const dataFile = join(process.cwd(), ".data", "store.json");
let store = { admins: [], clients: [] };
if (existsSync(dataFile)) {
  try { store = JSON.parse(readFileSync(dataFile, "utf-8")); } catch {}
  if (!Array.isArray(store.admins)) store.admins = [];
  if (!Array.isArray(store.clients)) store.clients = [];
}

const existing = store.admins.find((a) => String(a.email).toLowerCase() === email);
if (existing) {
  existing.passwordHash = hashPassword(password);
  existing.name = name;
  existing.status = "active";
  existing.updatedAt = new Date().toISOString();
  console.log(`Admin atualizado: ${email} (${existing.id})`);
} else {
  const id = (await import("node:crypto")).randomUUID();
  store.admins.push({
    id,
    name,
    email,
    passwordHash: hashPassword(password),
    role: "admin",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  console.log(`Admin criado: ${email} (${id})`);
}

mkdirSync(join(process.cwd(), ".data"), { recursive: true });
writeFileSync(dataFile, JSON.stringify(store, null, 2), "utf-8");
console.log(`Store salvo em ${dataFile}`);
console.log("Para Mongo futuro: este script será substituído por inserção direta no banco.");
