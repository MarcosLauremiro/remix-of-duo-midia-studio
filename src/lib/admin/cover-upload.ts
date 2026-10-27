// Envio da capa pelo navegador. Só entrega a URL se ela for de fato uma URL do Cloudinary.
import { adminUploadCoverFn } from "@/lib/admin/blog.server";
import { isCloudinaryCoverUrl, readFileAsDataUrl } from "@/lib/cover";

export async function uploadCoverFile(file: File): Promise<string> {
  const result: unknown = await adminUploadCoverFn({
    data: { dataUrl: await readFileAsDataUrl(file) },
  });
  const url = (result as { url?: unknown } | null)?.url;
  if (!isCloudinaryCoverUrl(url)) {
    // DIAGNÓSTICO TEMPORÁRIO: tipo da resposta e status HTTP, sem conteúdo.
    console.error("[capa] resposta do upload sem URL do Cloudinary", {
      tipo: result instanceof Response ? "Response" : typeof result,
      status: result instanceof Response ? result.status : undefined,
      contentType: result instanceof Response ? result.headers.get("content-type") : undefined,
    });
    throw new Error("Não foi possível enviar a imagem. Tente novamente.");
  }
  // DIAGNÓSTICO TEMPORÁRIO
  console.log("[capa] upload concluído, URL recebida", { url });
  return url;
}
