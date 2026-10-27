// Regras puras da capa do blog, compartilhadas entre cliente e servidor. Sem efeitos colaterais.

export const COVER_INPUT_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Tamanho máximo do arquivo original enviado ao Cloudinary (plano gratuito aceita até 10 MB). */
export const COVER_UPLOAD_MAX_BYTES = 8 * 1024 * 1024;

/** Transformação de entrega: formato e qualidade automáticos, lado maior até 1280 px, sem ampliar. */
const COVER_DELIVERY_TRANSFORMATION = "f_auto,q_auto,c_limit,w_1280";
const CLOUDINARY_UPLOAD_SEGMENT = "/image/upload/";

/** Mensagem de erro para um arquivo que não pode ser enviado como capa, ou null se estiver ok. */
export function validateCoverFile(file: { type: string; size: number }): string | null {
  if (!COVER_INPUT_TYPES.includes(file.type)) return "Use uma imagem JPG, PNG ou WebP.";
  if (file.size > COVER_UPLOAD_MAX_BYTES) return "A imagem deve ter no máximo 8 MB.";
  return null;
}

/**
 * URL para exibir a capa. Capas do Cloudinary recebem a transformação de entrega; outras URLs
 * (inclusive data URL de posts antigos) são devolvidas como estão.
 */
export function coverDeliveryUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (!url.startsWith("https://res.cloudinary.com/") || !url.includes(CLOUDINARY_UPLOAD_SEGMENT)) {
    return url;
  }
  return url.replace(
    CLOUDINARY_UPLOAD_SEGMENT,
    `${CLOUDINARY_UPLOAD_SEGMENT}${COVER_DELIVERY_TRANSFORMATION}/`,
  );
}

/**
 * DIAGNÓSTICO TEMPORÁRIO: loga no console se a imagem da capa carregou ou falhou.
 * Remover depois de resolver o problema de renderização.
 */
export function coverLoadLogger(label: string, src: string) {
  return {
    onLoad: () => console.log(`[capa:${label}] imagem carregada`, { src }),
    onError: () => console.error(`[capa:${label}] falha ao carregar a imagem`, { src }),
  };
}

/** Lê o arquivo como data URL (base64) para enviá-lo à server function de upload. Só no navegador. */
export function readFileAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    reader.readAsDataURL(file);
  });
}
