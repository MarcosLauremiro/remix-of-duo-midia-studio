// Redimensiona e recodifica a capa no navegador antes de enviá-la como data URL.
// Sem biblioteca: createImageBitmap + canvas são nativos. Só roda no cliente.

const COVER_MAX_SIDE = 1280;
const COVER_QUALITY = 0.82;
/** Entrada aceita antes da compressão (evita carregar arquivos enormes na memória). */
export const COVER_INPUT_MAX_BYTES = 15 * 1024 * 1024;
/** Limite do servidor para a data URL final (ver COVER_IMAGE_DATA_URL_MAX em validators.ts). */
const COVER_OUTPUT_MAX_CHARS = 3_000_000;

export const COVER_INPUT_TYPES = ["image/jpeg", "image/png", "image/webp"];

function encode(canvas: HTMLCanvasElement, type: string): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, COVER_QUALITY));
}

function readAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/**
 * Lê o arquivo, reduz o lado maior para COVER_MAX_SIDE e devolve data URL em WebP
 * (ou JPEG, quando o navegador não sabe codificar WebP, como alguns Safari antigos).
 * Lança Error com mensagem em pt-BR quando não for possível.
 */
export async function compressCoverImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) throw new Error("Não foi possível ler a imagem.");

  try {
    const scale = Math.min(1, COVER_MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Não foi possível processar a imagem.");
    // JPEG não tem transparência: PNG transparente vira fundo branco.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    let blob = await encode(canvas, "image/webp");
    if (!blob || blob.type !== "image/webp") blob = await encode(canvas, "image/jpeg");
    if (!blob) throw new Error("Não foi possível processar a imagem.");

    const dataUrl = await readAsDataUrl(blob);
    if (dataUrl.length > COVER_OUTPUT_MAX_CHARS) {
      throw new Error("A imagem continua grande demais. Use uma imagem menor.");
    }
    return dataUrl;
  } finally {
    bitmap.close();
  }
}
