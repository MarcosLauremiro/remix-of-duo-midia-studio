// Diagnóstico temporário de autenticação. Ativo só com AUTH_DEBUG=1 (variável no Cloudflare).
// Nunca registra valores de segredos: só nomes de variáveis, booleanos, códigos e motivos.
// ATENÇÃO: com AUTH_DEBUG=1 o login revela se o e-mail existe (motivo "no_admin").
// Remova a variável depois do teste.

export function debugEnabled(): boolean {
  return process.env.AUTH_DEBUG === "1";
}

/** Log de etapa (aparece no `wrangler tail` / logs do Cloudflare). */
export function trace(stage: string, data: Record<string, unknown> = {}): void {
  console.log(`[auth] ${stage}`, data);
}

/** Presença de configuração, só como booleanos. */
export function configPresence(): Record<string, boolean> {
  return {
    MONGODB_URI: Boolean(process.env.MONGODB_URI),
    MONGODB_DB: Boolean(process.env.MONGODB_DB),
    SESSION_SECRET_32_OR_MORE: (process.env.SESSION_SECRET ?? "").length >= 32,
    AUTH_DEBUG: debugEnabled(),
  };
}

/** Anota o erro com um motivo técnico, exposto na resposta somente com AUTH_DEBUG=1. */
export function withReason(error: Error, reason: string): Error {
  return Object.assign(error, { reason });
}
