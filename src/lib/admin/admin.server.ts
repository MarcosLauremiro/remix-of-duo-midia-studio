// Server-only: handlers administrativos expostos como serverFns
import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { bumpAdminTokenVersion, findAdminByEmail } from "../data/admins";
import { consumeLoginAttempt } from "../data/login-attempts";
import { withDb } from "../data/mongo";
import {
  dashboardStats,
  insertClient,
  findClientById,
  listClients,
  saveClient,
} from "../data/clients";
import { newId, nowIso, normalizeEmail } from "./db";
import { verifyPassword } from "./session";
import { clearSessionCookie, readSessionClaims, setSessionCookie, withAdmin } from "./auth";
import { handleErrors } from "./http-errors";
import { configPresence, trace, withReason } from "./diagnostics";
import {
  loginSchema,
  clientCreateSchema,
  clientUpdateSchema,
  clientListQuerySchema,
} from "./validators";

const LOGIN_GENERIC_ERROR = "E-mail ou senha inválidos.";
const LOGIN_MAX_ATTEMPTS = 10;
const LOGIN_WINDOW_MS = 60_000;
const UNKNOWN_USER_DELAY_MS = 400;

// ── Auth ─────────────────────────────────────────────────────────────────────

export const loginFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => loginSchema.parse(d))
  .handler(async ({ data }) =>
    handleErrors(async () => {
      trace("login: início", configPresence());
      const ip = (await getRequestIP()) ?? "unknown";
      const limitKey = `login:${ip}:${normalizeEmail(data.email)}`;

      return withDb(async (db) => {
        const allowed = await consumeLoginAttempt(
          db,
          limitKey,
          LOGIN_MAX_ATTEMPTS,
          LOGIN_WINDOW_MS,
        );
        if (!allowed) throw new Error("RATE_LIMIT");

        const admin = await findAdminByEmail(db, data.email);
        trace("login: busca do admin", {
          emailDomain: data.email.split("@")[1] ?? "(inválido)",
          encontrado: Boolean(admin),
          status: admin?.status ?? null,
        });
        if (!admin) {
          // Atraso para não revelar se o e-mail existe.
          await new Promise((r) => setTimeout(r, UNKNOWN_USER_DELAY_MS));
          throw withReason(new Error(`VALIDATION:${LOGIN_GENERIC_ERROR}`), "no_admin");
        }
        if (admin.status !== "active") {
          await new Promise((r) => setTimeout(r, UNKNOWN_USER_DELAY_MS));
          throw withReason(new Error(`VALIDATION:${LOGIN_GENERIC_ERROR}`), "admin_inactive");
        }
        const senhaOk = verifyPassword(data.password, admin.passwordHash);
        trace("login: senha conferida", { senhaOk });
        if (!senhaOk) {
          throw withReason(new Error(`VALIDATION:${LOGIN_GENERIC_ERROR}`), "bad_password");
        }

        setSessionCookie(admin.id, admin.tokenVersion ?? 0);
        trace("login: sucesso, cookie emitido", { tokenVersion: admin.tokenVersion ?? 0 });
        return { ok: true as const, admin: { id: admin.id, name: admin.name, email: admin.email } };
      });
    }),
  );

export const logoutFn = createServerFn({ method: "POST" }).handler(async () =>
  handleErrors(async () => {
    // Invalida todas as sessões do admin. Se a sessão já estiver inválida, só remove o cookie.
    const claims = readSessionClaims();
    if (claims) {
      await withDb((db) => bumpAdminTokenVersion(db, claims.adminId));
    }
    clearSessionCookie();
    return { ok: true as const };
  }),
);

export const meFn = createServerFn({ method: "GET" }).handler(async () =>
  handleErrors(async () => {
    const claims = readSessionClaims();
    if (!claims) return { admin: null as { id: string; name: string; email: string } | null };
    try {
      return await withAdmin(async (_db, admin) => ({
        admin: { id: admin.id, name: admin.name, email: admin.email },
      }));
    } catch (e) {
      // Sessão inválida ou expirada: a UI trata como "não logado". Erros de configuração/banco continuam.
      if (e instanceof Error && e.message === "UNAUTHORIZED") {
        return { admin: null as { id: string; name: string; email: string } | null };
      }
      throw e;
    }
  }),
);

// ── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardFn = createServerFn({ method: "GET" }).handler(async () =>
  handleErrors(() => withAdmin((db) => dashboardStats(db))),
);

// ── Clientes ─────────────────────────────────────────────────────────────────

export const listClientsFn = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => clientListQuerySchema.parse(d ?? {}))
  .handler(async ({ data }) =>
    handleErrors(() =>
      withAdmin(async (db) => {
        const { items, total } = await listClients(db, {
          q: data.q,
          status: data.status,
          sortBy: data.sortBy,
          sortDir: data.sortDir,
          page: data.page,
          limit: data.limit,
        });
        return {
          items,
          total,
          page: data.page,
          limit: data.limit,
          totalPages: Math.max(1, Math.ceil(total / data.limit)),
        };
      }),
    ),
  );

export const getClientFn = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => {
    const o = d as { id?: unknown };
    if (!o || typeof o.id !== "string" || !o.id.trim()) throw new Error("VALIDATION:ID inválido");
    return { id: o.id.trim() };
  })
  .handler(async ({ data }) =>
    handleErrors(() =>
      withAdmin(async (db) => {
        const client = await findClientById(db, data.id);
        if (!client) throw new Error("NOT_FOUND:Cliente não encontrado");
        return { client };
      }),
    ),
  );

export const createClientFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => clientCreateSchema.parse(d))
  .handler(async ({ data }) =>
    handleErrors(() =>
      withAdmin(async (db) => {
        const now = nowIso();
        const doc = {
          id: newId(),
          nome: data.nome.trim(),
          contato: data.contato?.trim() || null,
          email: data.email?.trim() || null,
          telefone: data.telefone?.trim() || null,
          empresa: data.empresa?.trim() || null,
          documento: data.documento?.trim() || null,
          tipo: data.tipo?.trim() || null,
          status: data.status ?? "lead",
          servicos: Array.isArray(data.servicos)
            ? data.servicos.map((s) => s.trim()).filter(Boolean)
            : [],
          observacoes: data.observacoes?.trim() || null,
          createdAt: now,
          updatedAt: now,
          deletedAt: null as string | null,
        };
        await insertClient(db, doc);
        return { client: doc };
      }),
    ),
  );

export const updateClientFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => clientUpdateSchema.parse(d))
  .handler(async ({ data }) =>
    handleErrors(() =>
      withAdmin(async (db) => {
        const existing = await findClientById(db, data.id);
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
        if (data.servicos !== undefined)
          patch.servicos = data.servicos!.map((s) => s.trim()).filter(Boolean);
        if (data.observacoes !== undefined) patch.observacoes = data.observacoes?.trim() || null;
        const updated = { ...existing, ...patch, updatedAt: nowIso() };
        await saveClient(db, updated);
        return { client: updated };
      }),
    ),
  );

export const deleteClientFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const o = d as { id?: unknown };
    if (!o || typeof o.id !== "string" || !o.id.trim()) throw new Error("VALIDATION:ID inválido");
    return { id: o.id.trim() };
  })
  .handler(async ({ data }) =>
    handleErrors(() =>
      withAdmin(async (db) => {
        const c = await findClientById(db, data.id);
        if (!c) throw new Error("NOT_FOUND:Cliente não encontrado");
        c.deletedAt = nowIso();
        c.updatedAt = c.deletedAt;
        await saveClient(db, c);
        return { ok: true as const };
      }),
    ),
  );

export const restoreClientFn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const o = d as { id?: unknown };
    if (!o || typeof o.id !== "string" || !o.id.trim()) throw new Error("VALIDATION:ID inválido");
    return { id: o.id.trim() };
  })
  .handler(async ({ data }) =>
    handleErrors(() =>
      withAdmin(async (db) => {
        const c = await findClientById(db, data.id, true);
        if (!c) throw new Error("NOT_FOUND:Cliente não encontrado");
        c.deletedAt = null;
        c.updatedAt = nowIso();
        await saveClient(db, c);
        return { ok: true as const };
      }),
    ),
  );
