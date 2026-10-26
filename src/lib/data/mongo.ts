// Conexão única com o MongoDB. Toda operação de banco passa por withDb().
//
// Por que um cliente por operação: no Cloudflare Workers, sockets não podem ser reutilizados
// entre requisições. Manter um MongoClient no escopo do módulo pode falhar em requisições seguintes.
// A alternativa recomendada pela Cloudflare é um Durable Object (ainda não implementado).
//
// Os índices NÃO são criados aqui: são criados pelo script `npm run db:setup`, antes do deploy.
import { MongoClient, MongoError, type Db } from "mongodb";
import { ConfigError, DataUnavailableError } from "../errors";

const MONGO_CODE_DUPLICATE_KEY = 11000;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new ConfigError(`${name} não configurada`);
  return value;
}

export function isDuplicateKeyError(e: unknown): boolean {
  return e instanceof MongoError && (e as { code?: unknown }).code === MONGO_CODE_DUPLICATE_KEY;
}

export async function withDb<T>(fn: (db: Db) => Promise<T>): Promise<T> {
  const uri = requireEnv("MONGODB_URI");
  const dbName = requireEnv("MONGODB_DB");

  const client = new MongoClient(uri, {
    maxPoolSize: 1,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 10000,
    appName: "duomidia-web",
  });

  try {
    await client.connect();
    return await fn(client.db(dbName));
  } catch (e) {
    if (e instanceof ConfigError || e instanceof DataUnavailableError) throw e;
    if (isDuplicateKeyError(e)) throw e;
    if (e instanceof MongoError) {
      // Só o tipo e o código numérico: 18 = AuthenticationFailed; a mensagem pode citar o host.
      console.error(
        "[db] falha de conexão ou consulta:",
        e.name,
        (e as { code?: unknown }).code ?? "",
      );
      throw new DataUnavailableError((e as { code?: unknown }).code);
    }
    throw e;
  } finally {
    await client.close().catch(() => undefined);
  }
}

/** Remove o _id interno do MongoDB dos documentos retornados. */
export const WITHOUT_ID = { projection: { _id: 0 } } as const;

/** Escapa caracteres especiais de regex para buscas com texto digitado pelo usuário. */
export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
