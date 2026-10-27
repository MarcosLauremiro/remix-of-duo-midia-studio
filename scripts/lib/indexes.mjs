// Índices do banco. Criados por `npm run db:setup` (idempotente). O runtime da aplicação não cria índices.
// Unicidade de e-mail/slug é garantida aqui: o código de aplicação só verifica antes de inserir.

export const INDEXES = {
  admins: [
    { key: { id: 1 }, options: { name: "admins_id", unique: true } },
    { key: { email: 1 }, options: { name: "admins_email", unique: true } },
  ],
  clients: [
    { key: { id: 1 }, options: { name: "clients_id", unique: true } },
    { key: { deletedAt: 1, createdAt: -1 }, options: { name: "clients_list" } },
    { key: { status: 1 }, options: { name: "clients_status" } },
  ],
  posts: [
    { key: { id: 1 }, options: { name: "posts_id", unique: true } },
    // Slug único só entre posts não excluídos (espelha ensureUniquePostSlug)
    {
      key: { slug: 1 },
      options: {
        name: "posts_slug_active",
        unique: true,
        partialFilterExpression: { deletedAt: null },
      },
    },
    { key: { status: 1, publishedAt: -1 }, options: { name: "posts_published" } },
  ],
  // Contadores de tentativas de login; documentos expiram sozinhos no campo expiresAt
  login_attempts: [
    { key: { expiresAt: 1 }, options: { name: "login_attempts_ttl", expireAfterSeconds: 0 } },
  ],
};

export async function ensureIndexes(db) {
  // O driver espera { key, name, unique, ... } no mesmo nível. Opções aninhadas em `options`
  // são ignoradas e viram índices sem unicidade com nome padrão.
  for (const [collection, specs] of Object.entries(INDEXES)) {
    const flat = specs.map(({ key, options }) => ({ key, ...options }));
    await db.collection(collection).createIndexes(flat);
  }
}
