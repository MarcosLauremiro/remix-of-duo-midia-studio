// Conexão para scripts (fora do Worker). Não imprime a URI nem credenciais.
import { MongoClient } from "mongodb";

export function readScriptConfig() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;
  if (!uri || !dbName) {
    throw new Error("Defina MONGODB_URI e MONGODB_DB no ambiente (ou no .env local).");
  }
  return { uri, dbName };
}

/** Executa `fn(db)` com uma conexão que é sempre fechada. */
export async function withScriptDb(fn) {
  const { uri, dbName } = readScriptConfig();
  const client = new MongoClient(uri, {
    maxPoolSize: 2,
    serverSelectionTimeoutMS: 10000,
    appName: "duomidia-scripts",
  });
  try {
    await client.connect();
    return await fn(client.db(dbName));
  } finally {
    await client.close();
  }
}
