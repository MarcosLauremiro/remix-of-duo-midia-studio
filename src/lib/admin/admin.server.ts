// Server-only: handlers administrativos expostos como serverFns
import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import {
  findAdminByEmail,
  findAdminById,
  findClientById,
  upsertClient,
  listClients,
  dashboardStats,
  listAdmins,
  upsertAdmin,
  newId,
  nowIso,
  normalizeEmail,
} from "./db";
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  getSessionAdminIdFromCookie,
  checkRateLimit,
} from "./auth";
import {
  loginSchema,
  clientCreateSchema,
  clientUpdateSchema,
  clientListQuerySchema,
  clientStatusSchema,
} from "./validators";

// ── Helpers de auth ──────────────────────────────────────────────────────────

function requireAdmin() {
  const adminId = getSessionAdminIdFromCookie();
  if (!adminId) throw new Error("UNAUTHORIZED");
  const admin = findAdminById(adminId);
  if (!admin || admin.status !== "active") throw new Error("UNAUTHORIZED");
  return admin;
}

function toClientError(e: unknown): never {
  const msg = e instanceof Error ? e.message : "Erro interno";
  if (msg === "UNAUTHORIZED") throw new Response(JSON.stringify({ error: "Não autenticado" }), { status: 401 });
  if (msg.startsWith("VALIDATION:")) throw new Response(JSON.stringify({ error: msg.slice(11) }), { status: 400 });
  if (msg.startsWith("NOT_FOUND:")) throw new Response(JSON.stringify({ error: msg.slice(10) }), { status: 404 });
  if (msg.startsWith("RATE_LIMIT")) throw new Response(JSON.stringify({ error: "Muitas tentativas. Tente novamente em instantes." }), { status: 429 });
  throw new Response(JSON.stringify({ error: "Erro interno" }), { status: 500 });
}

// Seed opcional do primeiro admin via env (só se ainda não houver nenhum admin)
function ensureSeedAdminIfNeeded() {
  if (listAdmins().length > 0) return;
  const email = process.env.ADMIN_EMAIL;
  const pwd = process.env.ADMIN_PASSWORD;
  if (!email || !pwd) return;
  const id = newId();
  upsertAdmin({
    id,
    name: "Admin",
    email: normalizeEmail(email),
    passwordHash: hashPassword(pwd),
    role: "admin",
    status: "active",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export const loginFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => loginSchema.parse(d))
  .handler(async ({ data }) => {
    try {
      ensureSeedAdminIfNeeded();
      const ip = (await getRequestIP()) ?? "unknown";
      const key = `login:${ip}:${normalizeEmail(data.email)}`;
      if (!checkRateLimit(key, 10, 60_000)) throw new Error("RATE_LIMIT");

      const admin = findAdminByEmail(data.email);
      // mensagem genérica para não revelar se e-mail existe
      const genericError = "E-mail ou senha inválidos.";
      if (!admin || admin.status !== "active") {
        // delay anti-enumeração
        await new Promise((r) => setTimeout(r, 400));
        throw new Error(`VALIDATION:${genericError}`);
      }
      if (!verifyPassword(data.password, admin.passwordHash)) {
        throw new Error(`VALIDATION:${genericError}`);
      }
      const token = createSessionToken(admin.id);
      setSessionCookie(token);
      return { ok: true as const, admin: { id: admin.id, name: admin.name, email: admin.email } };
    } catch (e) {
      if (e instanceof Response) throw e;
      toClientError(e);
    }
  });

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  clearSessionCookie();
  return { ok: true as const };
});

export const meFn = createServerFn({ method: "GET" }).handler(async () => {
  const adminId = getSessionAdminIdFromCookie();
  if (!adminId) return { admin: null as { id: string; name: string; email: string } | null };
  const admin = findAdminById(adminId);
  if (!admin || admin.status !== "active") return { admin: null as { id: string; name: string; email: string } | null };
  return { admin: { id: admin.id, name: admin.name, email: admin.email } };
});

// ── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    requireAdmin();
    return dashboardStats();
  } catch (e) {
    if (e instanceof Response) throw e;
    toClientError(e);
  }
});

// ── Clientes ─────────────────────────────────────────────────────────────────

export const listClientsFn = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => clientListQuerySchema.parse(d ?? {}))
  .handler(async ({ data }) => {
    try {
      requireAdmin();
      const { items, total } = listClients({
        q: data.q,
        status: data.status,
        sortBy: data.sortBy,
        sortDir: data.sortDir,
        page: data.page,
        limit: data.limit,
      });
      return { items, total, page: data.page, limit: data.limit, totalPages: Math.max(1, Math.ceil(total / data.limit)) };
    } catch (e) {
      if (e instanceof Response) throw e;
      toClientError(e);
    }
  });

export const getClientFn = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => {
    const o = d as { id?: unknown };
    if (!o || typeof o.id !== "string" || !o.id.trim()) throw new Error("VALIDATION:ID inválido");
    return { id: o.id.trim() };
  })
  .handler(async ({ data }) => {
    try {
      requireAdmin();
      const c = findClientById(data.id);
      if (!c) throw new Error("NOT_FOUND:Cliente não encontrado");
      return { client: c };
    } catch (e) {
      if (e instanceof Response) throw e;
      toClientError(e);
    }
  });

export const createClientFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => clientCreateSchema.parse(d))
  .handler(async ({ data }) => {
    try {
      requireAdmin();
      const id = newId();
      const now = nowIso();
      const doc = {
        id,
        nome: data.nome.trim(),
        contato: data.contato?.trim() || null,
        email: data.email?.trim() || null,
        telefone: data.telefone?.trim() || null,
        empresa: data.empresa?.trim() || null,
        documento: data.documento?.trim() || null,
        tipo: data.tipo?.trim() || null,
        status: (data.status ?? "lead") as ReturnType<typeof clientStatusSchema.parse>,
        servicos: Array.isArray(data.servicos) ? data.servicos.map((s) => s.trim()).filter(Boolean) : [],
        observacoes: data.observacoes?.trim() || null,
        createdAt: now,
        updatedAt: now,
        deletedAt: null as string | null,
      };
      upsertClient(doc);
      return { client: doc };
    } catch (e) {
      if (e instanceof Response) throw e;
      if (e instanceof Error && e.name === "ZodError") throw new Response(JSON.stringify({ error: "Dados inválidos" }), { status: 400 });
      toClientError(e);
    }
  });

export const updateClientFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => clientUpdateSchema.parse(d))
  .handler(async ({ data }) => {
    try {
      requireAdmin();
      const existing = findClientById(data.id);
      if (!existing) throw new Error("NOT_FOUND:Cliente não encontrado");
      const patch: Partial<typeof existing> = {};
      if (data.nome !== undefined) patch.nome = data.nome!.trim();
      if (data.contato !== undefined) patch.contato = data.contato?.trim() || null;
      if (data.email !== undefined) patch.email = data.email?.trim() || null;
      if (data.telefone !== undefined) patch.telefone = data.telefone?.trim() || null;
      if (data.empresa !== undefined) patch.empresa = data.empresa?.trim() || null;
      if (data.documento !== undefined) patch.documento = data.documento?.trim() || null;
      if (data.tipo !== undefined) patch.tipo = data.tipo?.trim() || null;
      if (data.status !== undefined) patch.status = data.status as typeof existing.status;
      if (data.servicos !== undefined) patch.servicos = data.servicos!.map((s) => s.trim()).filter(Boolean);
      if (data.observacoes !== undefined) patch.observacoes = data.observacoes?.trim() || null;
      const updated = { ...existing, ...patch, updatedAt: nowIso() };
      upsertClient(updated);
      return { client: updated };
    } catch (e) {
      if (e instanceof Response) throw e;
      toClientError(e);
    }
  });

export const deleteClientFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const o = d as { id?: unknown };
    if (!o || typeof o.id !== "string" || !o.id.trim()) throw new Error("VALIDATION:ID inválido");
    return { id: o.id.trim() };
  })
  .handler(async ({ data }) => {
    try {
      requireAdmin();
      const c = findClientById(data.id);
      if (!c) throw new Error("NOT_FOUND:Cliente não encontrado");
      c.deletedAt = nowIso();
      c.updatedAt = c.deletedAt;
      upsertClient(c);
      return { ok: true as const };
    } catch (e) {
      if (e instanceof Response) throw e;
      toClientError(e);
    }
  });

export const restoreClientFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const o = d as { id?: unknown };
    if (!o || typeof o.id !== "string" || !o.id.trim()) throw new Error("VALIDATION:ID inválido");
    return { id: o.id.trim() };
  })
  .handler(async ({ data }) => {
    try {
      requireAdmin();
      const c = findClientById(data.id, true);
      if (!c) throw new Error("NOT_FOUND:Cliente não encontrado");
      c.deletedAt = null;
      c.updatedAt = nowIso();
      upsertClient(c);
      return { ok: true as const };
    } catch (e) {
      if (e instanceof Response) throw e;
      toClientError(e);
    }
  });
