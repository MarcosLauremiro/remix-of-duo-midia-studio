// Senhas e sessões do painel admin. Funções puras (sem API do TanStack) para serem testáveis.
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { ConfigError } from "../errors";

export const SESSION_TTL_SEC = 60 * 60 * 12; // 12h
const MIN_SECRET_LENGTH = 32;

// ── Segredo de sessão ────────────────────────────────────────────────────────
// Sem fallback: se o segredo estiver ausente ou fraco, a sessão não pode ser criada nem validada.

export function readSessionSecret(env: Record<string, string | undefined> = process.env): string {
  const secret = env.SESSION_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new ConfigError(`SESSION_SECRET ausente ou com menos de ${MIN_SECRET_LENGTH} caracteres`);
  }
  return secret;
}

// ── Senhas: scrypt com formato scrypt$N$r$p$salt$hash (hex) ──────────────────
// O formato é o mesmo já gravado nos registros existentes; hashes antigos continuam válidos.

const SCRYPT_KEYLEN = 32;
const SCRYPT_MAXMEM = 64 * 1024 * 1024;
const SCRYPT_MAX_N = 2 ** 17;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const N = 16384;
  const r = 8;
  const p = 1;
  const hash = scryptSync(password, salt, SCRYPT_KEYLEN, {
    N,
    r,
    p,
    maxmem: SCRYPT_MAXMEM,
  }).toString("hex");
  return `scrypt$${N}$${r}$${p}$${salt}$${hash}`;
}

/**
 * Retorna false para senha incorreta ou hash malformado.
 * Erros inesperados do scrypt NÃO são engolidos: propagam para virar erro interno, não "senha inválida".
 */
export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const N = Number.parseInt(parts[1], 10);
  const r = Number.parseInt(parts[2], 10);
  const p = Number.parseInt(parts[3], 10);
  const expected = Buffer.from(parts[5], "hex");
  if (!isValidScryptParams(N, r, p) || expected.length === 0) return false;
  const actual = scryptSync(password, parts[4], expected.length, {
    N,
    r,
    p,
    maxmem: SCRYPT_MAXMEM,
  });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function isValidScryptParams(N: number, r: number, p: number): boolean {
  return (
    Number.isInteger(N) &&
    N > 1 &&
    N <= SCRYPT_MAX_N &&
    (N & (N - 1)) === 0 &&
    Number.isInteger(r) &&
    r >= 1 &&
    r <= 16 &&
    Number.isInteger(p) &&
    p >= 1 &&
    p <= 16
  );
}

// ── Token de sessão: JWT HS256 mínimo ────────────────────────────────────────
// `v` é a versão de sessão do admin: logout ou troca de senha incrementam a versão
// no banco e invalidam todos os tokens emitidos antes.

export type SessionClaims = { adminId: string; tokenVersion: number };

const HEADER = { alg: "HS256", typ: "JWT" };

function b64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

export function signSession(
  claims: SessionClaims,
  secret: string,
  nowSec = Math.floor(Date.now() / 1000),
): string {
  const header = b64url(JSON.stringify(HEADER));
  const payload = b64url(
    JSON.stringify({
      sub: claims.adminId,
      v: claims.tokenVersion,
      iat: nowSec,
      exp: nowSec + SESSION_TTL_SEC,
    }),
  );
  const sig = createHmac("sha256", secret).update(`${header}.${payload}`).digest("base64url");
  return `${header}.${payload}.${sig}`;
}

/** Retorna as claims só se a assinatura, o algoritmo, a expiração e o formato forem válidos. */
export function verifySession(
  token: string,
  secret: string,
  nowSec = Math.floor(Date.now() / 1000),
): SessionClaims | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, payload, sig] = parts;

  const expectedSig = createHmac("sha256", secret).update(`${header}.${payload}`).digest();
  const givenSig = Buffer.from(sig, "base64url");
  if (givenSig.length !== expectedSig.length || !timingSafeEqual(givenSig, expectedSig))
    return null;

  try {
    const h = JSON.parse(Buffer.from(header, "base64url").toString("utf-8")) as { alg?: unknown };
    if (h.alg !== HEADER.alg) return null;
    const body = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")) as {
      sub?: unknown;
      v?: unknown;
      exp?: unknown;
    };
    if (typeof body.sub !== "string" || body.sub.length === 0) return null;
    if (typeof body.v !== "number" || !Number.isInteger(body.v)) return null;
    if (typeof body.exp !== "number" || nowSec >= body.exp) return null;
    return { adminId: body.sub, tokenVersion: body.v };
  } catch {
    return null;
  }
}
