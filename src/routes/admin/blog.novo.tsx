import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { adminCreatePostFn } from "@/lib/admin/blog.server";
import { uploadCoverFile } from "@/lib/admin/cover-upload";
import { CoverImageField } from "@/components/blog/CoverImageField";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/blog/novo")({
  component: NovoPostPage,
});

function formatZodError(ex: unknown): string {
  // TanStack serializa ZodError como array JSON ou objeto com issues
  if (ex instanceof Response) {
    // Tenta ler como JSON síncrono não é possível, então retorna genérico
    // O caller fará await ex.json() quando for Response - aqui tratamos string cases
    return "Erro ao criar";
  }
  if (ex instanceof Error) {
    try {
      const parsed = JSON.parse(ex.message) as Array<{ path?: string[]; message?: string }>;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((e) => `${e.path?.join(".") ?? "campo"}: ${e.message}`).join(" | ");
      }
    } catch {}
    return ex.message;
  }
  const raw = String(ex);
  try {
    const parsed = JSON.parse(raw) as Array<{ path?: string[]; message?: string }>;
    if (Array.isArray(parsed))
      return parsed.map((e) => `${e.path?.join(".")}: ${e.message}`).join(" | ");
  } catch {}
  return raw;
}

async function extractError(ex: unknown): Promise<string> {
  if (ex instanceof Response) {
    const body = (await ex.json().catch(() => null)) as { error?: unknown } | null;
    if (body?.error) {
      if (typeof body.error === "string") return body.error;
      // Zod array serializado em error
      if (Array.isArray(body.error)) {
        return (body.error as Array<{ path?: string[]; message?: string }>)
          .map((e) => `${e.path?.join(".") ?? "campo"}: ${e.message}`)
          .join(" | ");
      }
      return JSON.stringify(body.error);
    }
    return `Erro ${ex.status}`;
  }
  return formatZodError(ex);
}

const fieldClass = (hasError: boolean) =>
  `mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 ${
    hasError
      ? "border-destructive focus:border-destructive focus:ring-destructive/20"
      : "border-ink/10 focus:border-terracotta/40 focus:ring-terracotta/20"
  }`;

function NovoPostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  // Trava síncrona contra cliques repetidos (o estado React atualiza só no próximo render).
  const submitting = useRef(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [fieldErrs, setFieldErrs] = useState<{
    excerpt?: string;
    content?: string;
    title?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const close = () => {
    if (!loading) navigate({ to: "/admin/blog" });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    setErr(null);
    // Validação client-side igual ao schema (evita roundtrip com mensagem crua do Zod)
    const fe: typeof fieldErrs = {};
    if (!title.trim() || title.trim().length < 3)
      fe.title = "Título deve ter pelo menos 3 caracteres.";
    if (excerpt.trim().length < 10) fe.excerpt = "Resumo deve ter pelo menos 10 caracteres.";
    if (content.trim().length < 20) fe.content = "Conteúdo deve ter pelo menos 20 caracteres.";
    setFieldErrs(fe);
    if (Object.keys(fe).length > 0) return;

    submitting.current = true;
    setLoading(true);
    // Diagnóstico: tamanhos e flags, nunca o conteúdo nem a imagem.
    console.log("[blog.novo] enviando", {
      titleLen: title.length,
      excerptLen: excerpt.length,
      contentLen: content.length,
      temCapa: Boolean(coverFile),
    });
    try {
      // A capa vai ao Cloudinary primeiro. O post só é criado se o upload tiver sucesso.
      let coverImage: string | undefined;
      if (coverFile) {
        setUploading(true);
        // DIAGNÓSTICO TEMPORÁRIO
        console.log("[capa] enviando arquivo", { type: coverFile.type, bytes: coverFile.size });
        coverImage = await uploadCoverFile(coverFile);
        setUploading(false);
      }
      // Sem status na criação: o servidor salva como rascunho e o slug é gerado do título.
      const res = await adminCreatePostFn({ data: { title, coverImage, excerpt, content } });
      console.log("[blog.novo] resposta", { temPost: Boolean(res?.post), slug: res?.post?.slug });
      // O cliente pode resolver mesmo quando o servidor respondeu erro (ex.: 503): valida antes de usar.
      if (!res?.post) {
        console.log("[blog.novo] resposta sem post (provável erro do servidor)", res);
        setErr("Não foi possível salvar o artigo. Veja o console para detalhes.");
        return;
      }
      navigate({ to: "/admin/blog" });
    } catch (ex) {
      if (ex instanceof Response) {
        const body = await ex
          .clone()
          .json()
          .catch(() => null);
        console.log("[blog.novo] falhou (HTTP)", { status: ex.status, body });
      } else {
        console.log("[blog.novo] erro inesperado", ex);
      }
      const msg = await extractError(ex);
      console.log("[blog.novo] mensagem mostrada", msg);
      // Mapeia para campos se for erro de tamanho
      if (msg.includes("excerpt"))
        setFieldErrs((s) => ({ ...s, excerpt: "Resumo deve ter pelo menos 10 caracteres." }));
      if (msg.includes("content"))
        setFieldErrs((s) => ({ ...s, content: "Conteúdo deve ter pelo menos 20 caracteres." }));
      if (msg.includes("title"))
        setFieldErrs((s) => ({ ...s, title: "Título deve ter pelo menos 3 caracteres." }));
      if (msg.includes("String must contain") || msg.includes("too_small")) {
        // Antes esta linha limpava o erro e escondia a falha. Agora a mensagem aparece.
        console.log("[blog.novo] erro de validação do schema", msg);
        setErr(msg);
        return;
      }
      setErr(msg);
    } finally {
      submitting.current = false;
      setUploading(false);
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-2xl flex-col gap-3 overflow-hidden rounded-2xl bg-surface p-5">
        <div className="space-y-1">
          <DialogTitle className="font-display text-xl text-ink">Novo artigo</DialogTitle>
          <DialogDescription className="sr-only">
            Preencha os campos e salve o artigo.
          </DialogDescription>
        </div>

        <form id="novo-artigo" onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col gap-3">
          <label className="block text-sm">
            <span className="text-ink">Título *</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={160}
              placeholder="Ex: Como planejar conteúdo sem sufoco"
              className={fieldClass(Boolean(fieldErrs.title))}
            />
            {fieldErrs.title && (
              <span className="mt-1 block text-xs text-destructive">{fieldErrs.title}</span>
            )}
          </label>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <CoverImageField
              savedUrl={null}
              pendingFile={coverFile}
              disabled={loading}
              onChange={setCoverFile}
            />
            <label className="block text-sm">
              <span className="text-ink">
                Resumo * <span className="font-normal text-ink-muted">(mín. 10)</span>
              </span>
              <textarea
                value={excerpt}
                onChange={(e) => {
                  setExcerpt(e.target.value);
                  if (fieldErrs.excerpt) setFieldErrs((s) => ({ ...s, excerpt: undefined }));
                }}
                required
                maxLength={320}
                rows={3}
                placeholder="Aparece no card e na página do artigo."
                className={`${fieldClass(Boolean(fieldErrs.excerpt))} resize-none`}
              />
              <span
                className={`text-xs ${fieldErrs.excerpt ? "text-destructive" : "text-ink-muted"}`}
              >
                {fieldErrs.excerpt ?? `${excerpt.length}/320`}
              </span>
            </label>
          </div>

          <label className="flex min-h-0 flex-1 flex-col text-sm">
            <span className="text-ink">
              Conteúdo * <span className="font-normal text-ink-muted">(mín. 20 caracteres)</span>
            </span>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (fieldErrs.content) setFieldErrs((s) => ({ ...s, content: undefined }));
              }}
              required
              placeholder={
                "Parágrafos separados por linha em branco.\n\nUse # Título, ## Subtítulo e - itens de lista."
              }
              className={`${fieldClass(Boolean(fieldErrs.content))} min-h-[8rem] flex-1 resize-none font-mono`}
            />
            <span
              className={`text-xs ${fieldErrs.content ? "text-destructive" : "text-ink-muted"}`}
            >
              {fieldErrs.content ?? `${content.length} caracteres`}
            </span>
          </label>
        </form>

        {err && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{err}</p>}

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={close}
            disabled={loading}
            className="rounded-full px-4 py-2 text-sm font-semibold text-ink-muted hover:text-ink disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="novo-artigo"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60"
          >
            {uploading ? "Enviando capa…" : loading ? "Salvando…" : "Salvar artigo"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
