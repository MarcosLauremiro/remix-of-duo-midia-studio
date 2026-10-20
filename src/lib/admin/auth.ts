import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getCookie, setCookie } from "@tanstack/react-start/server";

const COOKIE_NAME = "duo_admin_session";
const JWT_ALG = "HS256";
const SESSION_TTL_SEC = 60 * 60 * 12; // 12h

// ── Password: scrypt (Node nativo, sem deps nativas) ──────────────────────────
// Formato: scrypt$N$r$p$salt$hash  (hex)

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const N = 16384,
    r = 8,
    p = 1,
    keyLen = 32;
  const hash = scryptSync(password, salt, keyLen, { N, r, p, maxmem: 64 * 1024 * 1024 }).toString("hex");
  return `scrypt$${N}$${r}$${p}$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const parts = stored.split("$");
    if (parts[0] !== "scrypt" || parts.length !== 6) return false;
    const N = parseInt(parts[1], 10);
    const r = parseInt(parts[2], 10);
    const p = parseInt(parts[3], 10);
    const salt = parts[4];
    const expectedHex = parts[5];
    const keyLen = Buffer.from(expectedHex, "hex").length;
    const hash = scryptSync(password, salt, keyLen, { N, r, p, maxmem: 64 * 1024 * 1024 });
    const expected = Buffer.from(expectedHex, "hex");
    if (hash.length !== expected.length) return false;
    return timingSafeEqual(hash, expected);
  } catch {
    return false;
  }
}

// ── JWT mínimo (HS256, sem libs) ─────────────────────────────────────────────

function b64urlEncode(buf: Buffer | string) {
  const b = typeof buf === "string" ? Buffer.from(buf) : buf;
  return b.toString("base64url");
}
function b64urlDecode(s: string): Buffer {
  return Buffer.from(s, "base64url");
}

function signJwt(payload: Record<string, unknown>, secret: string, ttlSec: number): string {
  const header = { alg: JWT_ALG, typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + ttlSec };
  const h = b64urlEncode(JSON.stringify(header));
  const p = b64urlEncode(JSON.stringify(body));
  const sig = createHmac("sha256", secret).update(`${h}.${p}`).digest("base64url");
  return `${h}.${p}.${sig}`;
}

function verifyJwt(token: string, secret: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, p, sig] = parts;
  const expected = createHmac("sha256", secret).update(`${h}.${p}`).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(b64urlDecode(p).toString("utf-8")) as Record<string, unknown>;
    const exp = payload.exp as number | undefined;
    if (typeof exp === "number" && Math.floor(Date.now() / 1000) > exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) {
    // Em dev sem env, usa fallback mas avisa — nunca em produção
    if (process.env.NODE_ENV === "production") throw new Error("SESSION_SECRET ausente ou fraco");
    return "dev-only-session-secret-trocar-em-producao-32chars";
  }
  return s;
}

export function createSessionToken(adminId: string): string {
  return signJwt({ sub: adminId }, getSecret(), SESSION_TTL_SEC);
}

export function verifySessionToken(token: string): string | null {
  const payload = verifyJwt(token, getSecret());
  if (!payload || typeof payload.sub !== "string") return null;
  return payload.sub;
}

// ── Cookie ───────────────────────────────────────────────────────────────────

export function setSessionCookie(token: string) {
  const isProd = process.env.NODE_ENV === "production";
  setCookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SEC,
  });
}

export function clearSessionCookie() {
  setCookie(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function getSessionAdminIdFromCookie(): string | null {
  const token = getCookie(COOKIE_NAME);
  if (!token) return null;
  return verifySessionToken(token);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;

// ── Rate limit em memória (por IP/email) ─────────────────────────────────────

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function checkRateLimit(key: string, max = 8, windowMs = 60_000): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (b.count >= max) return false;
  b.count += 1;
  return true;
}
