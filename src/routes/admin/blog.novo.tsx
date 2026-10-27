import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { adminCreatePostFn } from "@/lib/admin/blog.server";
import { uploadCoverFile } from "@/lib/admin/cover-upload";
import { CoverImageField } from "@/components/blog/CoverImageField";

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
    if (Array.isArray(parsed)) return parsed.map((e) => `${e.path?.join(".")}: ${e.message}`).join(" | ");
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
  const [fieldErrs, setFieldErrs] = useState<{ excerpt?: string; content?: string; title?: string }>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    setErr(null);
    // Validação client-side igual ao schema (evita roundtrip com mensagem crua do Zod)
    const fe: typeof fieldErrs = {};
    if (!title.trim() || title.trim().length < 3) fe.title = "Título deve ter pelo menos 3 caracteres.";
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
      // Artigo novo sai publicado; o slug é gerado do título pelo servidor.
      const res = await adminCreatePostFn({ data: { title, coverImage, excerpt, content, status: "published" } });
      console.log("[blog.novo] resposta", { temPost: Boolean(res?.post), slug: res?.post?.slug });
      // O cliente pode resolver mesmo quando o servidor respondeu erro (ex.: 503): valida antes de usar.
      if (!res?.post) {
        console.log("[blog.novo] resposta sem post (provável erro do servidor)", res);
        setErr("Não foi possível salvar o artigo. Veja o console para detalhes.");
        return;
      }
      navigate({ to: "/admin/blog", search: { status: "published" } });
    } catch (ex) {
      if (ex instanceof Response) {
        const body = await ex.clone().json().catch(() => null);
        console.log("[blog.novo] falhou (HTTP)", { status: ex.status, body });
      } else {
        console.log("[blog.novo] erro inesperado", ex);
      }
      const msg = await extractError(ex);
      console.log("[blog.novo] mensagem mostrada", msg);
      // Mapeia para campos se for erro de tamanho
      if (msg.includes("excerpt")) setFieldErrs((s) => ({ ...s, excerpt: "Resumo deve ter pelo menos 10 caracteres." }));
      if (msg.includes("content")) setFieldErrs((s) => ({ ...s, content: "Conteúdo deve ter pelo menos 20 caracteres." }));
      if (msg.includes("title")) setFieldErrs((s) => ({ ...s, title: "Título deve ter pelo menos 3 caracteres." }));
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
    <div className="mx-auto flex max-w-6xl flex-col gap-3 lg:h-[calc(100dvh-7.5rem)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-ink">Novo artigo</h1>
        <div className="flex items-center gap-3">
          <Link to="/admin/blog" className="text-sm text-ink-muted hover:text-ink">Voltar</Link>
          <button type="submit" form="novo-artigo" disabled={loading} className="inline-flex items-center justify-center rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60">
            {uploading ? "Enviando capa…" : loading ? "Salvando…" : "Publicar artigo"}
          </button>
        </div>
      </div>
      {err && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{err}</p>}
      <form id="novo-artigo" onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col gap-4 rounded-2xl bg-surface p-4 ring-1 ring-ink/10 lg:flex-row lg:p-5">
        <div className="space-y-3 lg:w-[22rem] lg:shrink-0">
        <label className="block text-sm">
          <span className="text-ink">Título *</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={160} placeholder="Ex: Como planejar conteúdo sem sufoco" className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm outline-none focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20" />
          {fieldErrs.title && <span className="mt-1 block text-xs text-destructive">{fieldErrs.title}</span>}
        </label>
        <CoverImageField savedUrl={null} pendingFile={coverFile} disabled={loading} onChange={setCoverFile} />
        <label className="block text-sm">
          <span className="text-ink">Resumo * <span className="font-normal text-ink-muted">(mín. 10 caracteres)</span></span>
          <textarea value={excerpt} onChange={(e) => { setExcerpt(e.target.value); if (fieldErrs.excerpt) setFieldErrs((s) => ({ ...s, excerpt: undefined })); }} required maxLength={320} rows={3} placeholder="Resumo curto que aparece no card e na página do artigo." className={`mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 ${fieldErrs.excerpt ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "border-ink/10 focus:border-terracotta/40 focus:ring-terracotta/20"}`} />
          <span className={`text-xs ${fieldErrs.excerpt ? "text-destructive" : "text-ink-muted"}`}>{fieldErrs.excerpt ?? `${excerpt.length}/320`}</span>
        </label>
        </div>
        <label className="flex min-h-[12rem] min-w-0 flex-1 flex-col text-sm">
          <span className="text-ink">Conteúdo * <span className="font-normal text-ink-muted">(mín. 20 caracteres)</span></span>
          <textarea value={content} onChange={(e) => { setContent(e.target.value); if (fieldErrs.content) setFieldErrs((s) => ({ ...s, content: undefined })); }} required rows={8} placeholder={"Parágrafos separados por linha em branco.\n\nUse # Título, ## Subtítulo e - itens de lista."} className={`mt-1 min-h-0 w-full flex-1 resize-none rounded-xl border bg-background px-3 py-2.5 font-mono text-sm outline-none focus:ring-2 ${fieldErrs.content ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "border-ink/10 focus:border-terracotta/40 focus:ring-terracotta/20"}`} />
          <span className={`text-xs ${fieldErrs.content ? "text-destructive" : "text-ink-muted"}`}>{fieldErrs.content ?? `${content.length} caracteres`}</span>
        </label>
      </form>
    </div>
  );
}
