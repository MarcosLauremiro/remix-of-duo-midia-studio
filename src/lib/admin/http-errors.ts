// Converte erros internos em respostas HTTP. Nunca expõe stack, mensagem do driver ou segredos.
import { ConfigError, DataUnavailableError } from "../errors";
import { isDuplicateKeyError } from "../data/mongo";

function json(status: number, error: string): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export function toErrorResponse(e: unknown): Response {
  if (e instanceof Response) return e;
  const msg = e instanceof Error ? e.message : "";

  if (msg === "UNAUTHORIZED") return json(401, "Não autenticado");
  if (msg === "FORBIDDEN") return json(403, "Requisição não permitida");
  if (msg.startsWith("VALIDATION:")) return json(400, msg.slice("VALIDATION:".length));
  if (msg.startsWith("NOT_FOUND:")) return json(404, msg.slice("NOT_FOUND:".length));
  if (msg.startsWith("RATE_LIMIT"))
    return json(429, "Muitas tentativas. Tente novamente em instantes.");
  if (e instanceof DataUnavailableError) return json(503, "Serviço temporariamente indisponível");
  if (isDuplicateKeyError(e)) return json(400, "Já existe um registro com esses dados.");

  if (e instanceof ConfigError) {
    console.error("[config] ", e.message);
  } else {
    console.error("[admin] erro interno:", e instanceof Error ? e.name : "desconhecido");
  }
  return json(500, "Erro interno");
}

/** Executa `fn` e converte qualquer falha em Response, para ser lançada pela server function. */
export async function handleErrors<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    throw toErrorResponse(e);
  }
}
