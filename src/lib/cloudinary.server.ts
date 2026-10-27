// Upload de capas para o Cloudinary via API REST (fetch), com assinatura feita no servidor.
// A API Secret nunca sai deste módulo: não é enviada ao navegador, não entra em logs nem em erros.
import { createHash } from "node:crypto";
import { ConfigError } from "./errors";
import { newId } from "./admin/db";

export const COVER_FOLDER = "duo-midia/blog/capas";

type CloudinaryConfig = { cloudName: string; apiKey: string; apiSecret: string };

function readConfig(): CloudinaryConfig {
  const names = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"] as const;
  const missing = names.filter((n) => !process.env[n]);
  if (missing.length > 0) {
    // Só os nomes das variáveis, nunca os valores.
    throw new ConfigError(`Variáveis do Cloudinary não configuradas: ${missing.join(", ")}`);
  }
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
    apiKey: process.env.CLOUDINARY_API_KEY as string,
    apiSecret: process.env.CLOUDINARY_API_SECRET as string,
  };
}

/**
 * Assinatura do Cloudinary: parâmetros em ordem alfabética como `chave=valor&...`,
 * seguidos da API Secret, com SHA-1 em hexadecimal. `file`, `api_key` e `signature` ficam de fora.
 */
export function buildSignature(params: Record<string, string | number>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1")
    .update(toSign + apiSecret)
    .digest("hex");
}

export type UploadedCover = { url: string; publicId: string };

/**
 * Envia uma imagem (data URL já validada pelo chamador) para `duo-midia/blog/capas`.
 * O public_id é um UUID novo: nunca depende do título e não colide com outras imagens.
 */
export async function uploadCover(dataUrl: string): Promise<UploadedCover> {
  const config = readConfig();
  const publicId = newId();
  const timestamp = Math.floor(Date.now() / 1000);
  const signed = { folder: COVER_FOLDER, public_id: publicId, timestamp };
  const signature = buildSignature(signed, config.apiSecret);
  // DIAGNÓSTICO TEMPORÁRIO: sem segredo, assinatura nem conteúdo do arquivo.
  console.log("[cloudinary] enviando capa", { cloud: config.cloudName, folder: COVER_FOLDER, publicId, dataUrlChars: dataUrl.length });

  const body = new FormData();
  body.set("file", dataUrl);
  body.set("api_key", config.apiKey);
  body.set("signature", signature);
  for (const [k, v] of Object.entries(signed)) body.set(k, String(v));

  let res: Response;
  try {
    res = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
      method: "POST",
      body,
    });
  } catch {
    console.error("[cloudinary] falha de rede no upload");
    throw new Error("UPSTREAM:Não foi possível enviar a imagem. Tente novamente.");
  }

  if (!res.ok) {
    // Status e código HTTP apenas: o corpo do erro não é repassado.
    console.error("[cloudinary] upload recusado", { status: res.status });
    throw new Error("UPSTREAM:Não foi possível enviar a imagem. Tente novamente.");
  }

  const json = (await res.json().catch(() => null)) as {
    secure_url?: unknown;
    public_id?: unknown;
  } | null;
  if (typeof json?.secure_url !== "string" || typeof json?.public_id !== "string") {
    console.error("[cloudinary] resposta sem secure_url");
    throw new Error("UPSTREAM:Não foi possível enviar a imagem. Tente novamente.");
  }
  // DIAGNÓSTICO TEMPORÁRIO
  console.log("[cloudinary] upload concluído", { status: res.status, publicId: json.public_id, url: json.secure_url });
  return { url: json.secure_url, publicId: json.public_id };
}
