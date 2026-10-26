import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { toErrorResponse } from "../src/lib/admin/http-errors";
import { withReason } from "../src/lib/admin/diagnostics";
import { DataUnavailableError } from "../src/lib/errors";

async function bodyOf(res: Response) {
  return { status: res.status, body: (await res.json()) as Record<string, unknown> };
}

describe("toErrorResponse", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });
  afterEach(() => {
    delete process.env.AUTH_DEBUG;
    vi.restoreAllMocks();
  });

  it("não expõe debug quando AUTH_DEBUG não está ligado", async () => {
    const r = await bodyOf(toErrorResponse(withReason(new Error("UNAUTHORIZED"), "no_cookie")));
    expect(r.status).toBe(401);
    expect(r.body).toEqual({ error: "Não autenticado" });
  });

  it("com AUTH_DEBUG=1, expõe o motivo técnico da sessão recusada", async () => {
    process.env.AUTH_DEBUG = "1";
    const r = await bodyOf(toErrorResponse(withReason(new Error("UNAUTHORIZED"), "token_revoked")));
    expect(r.status).toBe(401);
    expect(r.body.error).toBe("Não autenticado");
    expect((r.body.debug as { reason: string }).reason).toBe("token_revoked");
  });

  it("com AUTH_DEBUG=1, expõe o código do MongoDB quando o banco falha, sem mensagem do driver", async () => {
    process.env.AUTH_DEBUG = "1";
    const r = await bodyOf(toErrorResponse(new DataUnavailableError(18)));
    expect(r.status).toBe(503);
    expect(r.body.error).toBe("Serviço temporariamente indisponível");
    expect((r.body.debug as { dbCode: number }).dbCode).toBe(18);
    expect(JSON.stringify(r.body)).not.toMatch(/mongodb:\/\//);
  });

  it("mantém o motivo de login (no_admin) só no debug, a mensagem continua genérica", async () => {
    process.env.AUTH_DEBUG = "1";
    const r = await bodyOf(
      toErrorResponse(withReason(new Error("VALIDATION:E-mail ou senha inválidos."), "no_admin")),
    );
    expect(r.status).toBe(400);
    expect(r.body.error).toBe("E-mail ou senha inválidos.");
    expect((r.body.debug as { reason: string }).reason).toBe("no_admin");
  });
});
