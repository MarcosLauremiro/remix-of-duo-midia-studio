import { createHmac, scryptSync } from "node:crypto";
import { describe, expect, it } from "vitest";
import { ConfigError } from "../src/lib/errors";
import {
  hashPassword,
  readSessionSecret,
  signSession,
  verifyPassword,
  verifySession,
  SESSION_TTL_SEC,
} from "../src/lib/admin/session";

const SECRET = "x".repeat(40);

describe("readSessionSecret (falha fechada)", () => {
  it("recusa ausente e curto demais, sem fallback", () => {
    expect(() => readSessionSecret({})).toThrow(ConfigError);
    expect(() => readSessionSecret({ SESSION_SECRET: "curto" })).toThrow(ConfigError);
    expect(() => readSessionSecret({ SESSION_SECRET: "y".repeat(31) })).toThrow(ConfigError);
  });

  it("aceita segredo com 32 caracteres ou mais", () => {
    expect(readSessionSecret({ SESSION_SECRET: "z".repeat(32) })).toBe("z".repeat(32));
  });

  it("não depende de NODE_ENV", () => {
    expect(() => readSessionSecret({ NODE_ENV: "development" })).toThrow(ConfigError);
  });
});

describe("senhas", () => {
  it("valida a senha correta e rejeita a errada", () => {
    const stored = hashPassword("senha-correta-123");
    expect(verifyPassword("senha-correta-123", stored)).toBe(true);
    expect(verifyPassword("outra-senha", stored)).toBe(false);
  });

  it("aceita hash no formato já gravado pela versão anterior", () => {
    const salt = "a".repeat(32);
    const hash = scryptSync("legado-123", salt, 32, {
      N: 16384,
      r: 8,
      p: 1,
      maxmem: 64 * 1024 * 1024,
    });
    const stored = `scrypt$16384$8$1$${salt}$${hash.toString("hex")}`;
    expect(verifyPassword("legado-123", stored)).toBe(true);
  });

  it("rejeita formatos malformados e parâmetros fora de faixa", () => {
    expect(verifyPassword("x", "texto-puro")).toBe(false);
    expect(verifyPassword("x", "scrypt$3$8$1$aa$bb")).toBe(false); // N não é potência de 2
    expect(verifyPassword("x", "scrypt$16384$8$1$aa$")).toBe(false); // hash vazio
  });
});

describe("token de sessão", () => {
  const now = 1_800_000_000;

  it("round-trip preserva adminId e tokenVersion", () => {
    const token = signSession({ adminId: "adm-1", tokenVersion: 3 }, SECRET, now);
    expect(verifySession(token, SECRET, now + 10)).toEqual({ adminId: "adm-1", tokenVersion: 3 });
  });

  it("rejeita token expirado", () => {
    const token = signSession({ adminId: "adm-1", tokenVersion: 0 }, SECRET, now);
    expect(verifySession(token, SECRET, now + SESSION_TTL_SEC)).toBeNull();
  });

  it("rejeita assinatura com outro segredo", () => {
    const token = signSession({ adminId: "adm-1", tokenVersion: 0 }, SECRET, now);
    expect(verifySession(token, "w".repeat(40), now)).toBeNull();
  });

  it("rejeita payload adulterado", () => {
    const [h, , s] = signSession({ adminId: "adm-1", tokenVersion: 0 }, SECRET, now).split(".");
    const forged = Buffer.from(
      JSON.stringify({ sub: "adm-2", v: 0, iat: now, exp: now + 999 }),
    ).toString("base64url");
    expect(verifySession(`${h}.${forged}.${s}`, SECRET, now)).toBeNull();
  });

  it("rejeita algoritmo diferente de HS256 mesmo com assinatura válida", () => {
    const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString("base64url");
    const payload = Buffer.from(
      JSON.stringify({ sub: "adm-1", v: 0, iat: now, exp: now + 999 }),
    ).toString("base64url");
    const sig = createHmac("sha256", SECRET).update(`${header}.${payload}`).digest("base64url");
    expect(verifySession(`${header}.${payload}.${sig}`, SECRET, now)).toBeNull();
  });

  it("rejeita token com formato inválido", () => {
    expect(verifySession("abc", SECRET, now)).toBeNull();
    expect(verifySession("a.b.c", SECRET, now)).toBeNull();
  });
});
