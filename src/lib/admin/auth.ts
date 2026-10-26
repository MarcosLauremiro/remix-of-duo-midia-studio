// Cookie de sessão e guarda de autorização das server functions administrativas.
import {
  getCookie,
  getRequestHeader,
  getRequestHost,
  setCookie,
} from "@tanstack/react-start/server";
import type { Db } from "mongodb";
import type { AdminDoc } from "./db";
import { findAdminById } from "../data/admins";
import { withDb } from "../data/mongo";
import { trace, withReason } from "./diagnostics";
import {
  readSessionSecret,
  SESSION_TTL_SEC,
  verifySession,
  type SessionClaims,
  signSession,
} from "./session";

const COOKIE_NAME = "duo_admin_session";

// Cookie sempre Secure: o painel só é servido por HTTPS (inclusive localhost em navegadores modernos).
const COOKIE_BASE = { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/" };

export function setSessionCookie(adminId: string, tokenVersion: number): void {
  const token = signSession({ adminId, tokenVersion }, readSessionSecret());
  setCookie(COOKIE_NAME, token, { ...COOKIE_BASE, maxAge: SESSION_TTL_SEC });
}

export function clearSessionCookie(): void {
  setCookie(COOKIE_NAME, "", { ...COOKIE_BASE, maxAge: 0 });
}

/** Claims da sessão atual, sem consultar o banco. Null se não houver cookie ou se ele for inválido. */
export function readSessionClaims(): SessionClaims | null {
  const token = getCookie(COOKIE_NAME);
  if (!token) return null;
  return verifySession(token, readSessionSecret());
}

/**
 * Proteção CSRF: quando o navegador envia Origin, ele precisa ser o próprio host.
 * Sem Origin (clientes não navegadores), o cookie SameSite=Lax continua exigido pela autenticação.
 */
function assertSameOrigin(): void {
  const origin = getRequestHeader("origin");
  if (!origin) return;
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    throw new Error("FORBIDDEN");
  }
  if (originHost !== getRequestHost()) throw new Error("FORBIDDEN");
}

function unauthorized(reason: string): Error {
  trace("sessão rejeitada", { reason });
  return withReason(new Error("UNAUTHORIZED"), reason);
}

/** Confere admin ativo e sessão não revogada. Cada falha tem um motivo próprio. */
async function requireActiveAdmin(db: Db, claims: SessionClaims): Promise<AdminDoc> {
  const admin = await findAdminById(db, claims.adminId);
  if (!admin) throw unauthorized("admin_not_found");
  if (admin.status !== "active") throw unauthorized("admin_inactive");
  if ((admin.tokenVersion ?? 0) !== claims.tokenVersion) throw unauthorized("token_revoked");
  return admin;
}

/**
 * Executa `fn` com o admin autenticado e uma conexão aberta.
 * Requisições sem sessão válida nem chegam a abrir conexão com o banco.
 */
export async function withAdmin<T>(fn: (db: Db, admin: AdminDoc) => Promise<T>): Promise<T> {
  assertSameOrigin();
  const token = getCookie(COOKIE_NAME);
  if (!token) throw unauthorized("no_cookie");

  const claims = verifySession(token, readSessionSecret());
  if (!claims) throw unauthorized("bad_or_expired_token");

  return withDb(async (db) => {
    const admin = await requireActiveAdmin(db, claims);
    return fn(db, admin);
  });
}
