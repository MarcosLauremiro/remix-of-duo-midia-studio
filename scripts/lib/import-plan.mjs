// Planejamento puro da importação store.json -> MongoDB (sem I/O, testável).
// Regras:
// - Nunca sobrescreve documentos existentes. Divergências são reportadas como conflitos.
// - Documentos inválidos ou ids duplicados no arquivo bloqueiam a aplicação.

export const COLLECTIONS = ["admins", "clients", "posts"];

// Valores padrão que o runtime assume para campos ausentes. Comparação considera o padrão.
const DEFAULTS = {
  admins: { tokenVersion: 0 },
  clients: { deletedAt: null },
  posts: { deletedAt: null },
};

const CLIENT_STATUS = ["lead", "ativo", "inativo", "em_negociacao"];
const POST_STATUS = ["draft", "published"];

export function validateDoc(collection, doc) {
  if (!doc || typeof doc !== "object" || Array.isArray(doc)) return "não é um objeto";
  if (typeof doc.id !== "string" || doc.id.length === 0) return "id ausente";
  if (typeof doc.createdAt !== "string" || typeof doc.updatedAt !== "string")
    return "datas ausentes";

  if (collection === "admins") {
    if (typeof doc.name !== "string") return "nome inválido";
    if (typeof doc.email !== "string" || doc.email.length === 0) return "e-mail inválido";
    if (typeof doc.passwordHash !== "string" || !doc.passwordHash.startsWith("scrypt$")) {
      return "hash de senha em formato desconhecido";
    }
    if (doc.status !== "active" && doc.status !== "disabled") return "status inválido";
    return null;
  }
  if (collection === "clients") {
    if (typeof doc.nome !== "string" || doc.nome.length === 0) return "nome inválido";
    if (!CLIENT_STATUS.includes(doc.status)) return "status inválido";
    if (doc.servicos !== undefined && !Array.isArray(doc.servicos)) return "servicos inválido";
    return null;
  }
  if (collection === "posts") {
    for (const field of ["title", "slug", "excerpt", "content"]) {
      if (typeof doc[field] !== "string") return `${field} inválido`;
    }
    if (!POST_STATUS.includes(doc.status)) return "status inválido";
    if (doc.coverImage != null && typeof doc.coverImage !== "string") return "coverImage inválido";
    return null;
  }
  return "coleção desconhecida";
}

/** Forma canônica para comparar documentos: chaves ordenadas, sem _id, undefined tratado como null. */
export function canonicalize(collection, doc) {
  const merged = { ...DEFAULTS[collection], ...doc };
  const out = {};
  for (const key of Object.keys(merged).sort()) {
    if (key === "_id") continue;
    const value = merged[key];
    out[key] = value === undefined ? null : value;
  }
  return JSON.stringify(out);
}

/**
 * @param {object} store conteúdo de .data/store.json
 * @param {Record<string, Map<string, object>>} existing documentos já presentes no banco, por coleção e id
 */
export function planImport(store, existing) {
  if (!store || typeof store !== "object") {
    throw new Error("store.json inválido: conteúdo não é um objeto");
  }

  const report = { ok: true, collections: {} };

  for (const collection of COLLECTIONS) {
    const source = Array.isArray(store[collection]) ? store[collection] : [];
    const dbDocs = existing[collection] ?? new Map();
    const result = {
      total: source.length,
      insert: [],
      unchanged: 0,
      conflicts: [],
      invalid: [],
      duplicates: [],
    };

    const seen = new Set();
    for (const doc of source) {
      const reason = validateDoc(collection, doc);
      if (reason) {
        result.invalid.push({ id: doc?.id ?? null, reason });
        continue;
      }
      if (seen.has(doc.id)) {
        result.duplicates.push(doc.id);
        continue;
      }
      seen.add(doc.id);

      const current = dbDocs.get(doc.id);
      if (!current) {
        result.insert.push(doc);
      } else if (canonicalize(collection, current) === canonicalize(collection, doc)) {
        result.unchanged += 1;
      } else {
        result.conflicts.push(doc.id);
      }
    }

    if (result.invalid.length || result.duplicates.length) report.ok = false;
    report.collections[collection] = result;
  }

  return report;
}
