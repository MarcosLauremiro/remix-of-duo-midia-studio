// Converte erros internos em respostas HTTP. Nunca expõe stack, mensagem do driver ou segredos.
import { ConfigError, DataUnavailableError } from "../errors";
import { isDuplicateKeyError } from "../data/mongo";
import { debugEnabled } from "./diagnostics";

type Debug = {
  kind: string;
  code: string;
  reason?: string;
  dbCode?: unknown;
  configMessage?: string;
};

function json(status: number, error: string, debug?: Debug): Response {
  const body = debug ? { error, debug } : { error };
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

/** Detalhes técnicos sem dados de usuário. Só é chamado com AUTH_DEBUG=1. */
function buildDebug(e: unknown, msg: string): Debug {
  const reason = (e as { reason?: unknown }).reason;
  return {
    kind: e instanceof Error ? e.name : typeof e,
    code: msg.split(":")[0] || "(vazio)",
    reason: typeof reason === "string" ? reason : undefined,
    dbCode: e instanceof DataUnavailableError ? e.code : undefined,
    configMessage: e instanceof ConfigError ? e.message : undefined,
  };
}

export function toErrorResponse(e: unknown): Response {
  if (e instanceof Response) return e;
  const msg = e instanceof Error ? e.message : "";
  const debug = debugEnabled() ? buildDebug(e, msg) : undefined;

  if (msg === "UNAUTHORIZED") return json(401, "Não autenticado", debug);
  if (msg === "FORBIDDEN") return json(403, "Requisição não permitida", debug);
  if (msg.startsWith("VALIDATION:")) {
    return json(400, msg.slice("VALIDATION:".length), debug);
  }
  if (msg.startsWith("NOT_FOUND:")) return json(404, msg.slice("NOT_FOUND:".length), debug);
  if (msg.startsWith("RATE_LIMIT")) {
    return json(429, "Muitas tentativas. Tente novamente em instantes.", debug);
  }
  if (e instanceof DataUnavailableError) {
    return json(503, "Serviço temporariamente indisponível", debug);
  }
  if (isDuplicateKeyError(e)) return json(400, "Já existe um registro com esses dados.", debug);

  if (e instanceof ConfigError) {
    console.error("[config] ", e.message);
  } else {
    console.error("[admin] erro interno:", e instanceof Error ? e.name : "desconhecido");
  }
  return json(500, "Erro interno", debug);
}

/** Executa `fn` e converte qualquer falha em Response, para ser lançada pela server function. */
export async function handleErrors<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    throw toErrorResponse(e);
  }
}
