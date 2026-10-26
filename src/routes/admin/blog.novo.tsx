import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { adminCreatePostFn } from "@/lib/admin/blog.server";

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
  const [slug, setSlug] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [err, setErr] = useState<string | null>(null);
  const [fieldErrs, setFieldErrs] = useState<{ excerpt?: string; content?: string; title?: string }>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    // Validação client-side igual ao schema (evita roundtrip com mensagem crua do Zod)
    const fe: typeof fieldErrs = {};
    if (!title.trim() || title.trim().length < 3) fe.title = "Título deve ter pelo menos 3 caracteres.";
    if (excerpt.trim().length < 10) fe.excerpt = "Resumo deve ter pelo menos 10 caracteres.";
    if (content.trim().length < 20) fe.content = "Conteúdo deve ter pelo menos 20 caracteres.";
    setFieldErrs(fe);
    if (Object.keys(fe).length > 0) return;

    setLoading(true);
    try {
      const res = await adminCreatePostFn({ data: { title, slug: slug || undefined, coverImage: coverImage || undefined, excerpt, content, status } });
      navigate({ to: "/admin/blog/$slug", params: { slug: (res.post as { slug: string }).slug } });
    } catch (ex) {
      const msg = await extractError(ex);
      // Mapeia para campos se for erro de tamanho
      if (msg.includes("excerpt")) setFieldErrs((s) => ({ ...s, excerpt: "Resumo deve ter pelo menos 10 caracteres." }));
      if (msg.includes("content")) setFieldErrs((s) => ({ ...s, content: "Conteúdo deve ter pelo menos 20 caracteres." }));
      if (msg.includes("title")) setFieldErrs((s) => ({ ...s, title: "Título deve ter pelo menos 3 caracteres." }));
      if (msg.includes("String must contain") || msg.includes("too_small")) {
        // fallback: se ainda for Zod cru, já mapeamos acima
        setErr(null);
        return;
      }
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Novo artigo</h1>
        <Link to="/admin/blog" className="text-sm text-ink-muted hover:text-ink">Voltar</Link>
      </div>
      {err && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{err}</p>}
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-surface p-6 ring-1 ring-ink/10">
        <label className="block text-sm">
          <span className="text-ink">Título *</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={160} placeholder="Ex: Como planejar conteúdo sem sufoco" className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm outline-none focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20" />
          {fieldErrs.title && <span className="mt-1 block text-xs text-destructive">{fieldErrs.title}</span>}
        </label>
        <label className="block text-sm">
          <span className="text-ink">Slug (opcional, gerado do título se vazio)</span>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="ex: como-planejar-conteudo" className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm outline-none focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20" />
          <span className="text-xs text-ink-muted">Apenas letras, números e hífen. Usado em /blog/slug.</span>
        </label>
        <label className="block text-sm">
          <span className="text-ink">Imagem de capa (URL)</span>
          <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://... ou /assets/..." className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm outline-none focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20" />
        </label>
        <label className="block text-sm">
          <span className="text-ink">Resumo * <span className="font-normal text-ink-muted">(mín. 10 caracteres)</span></span>
          <textarea value={excerpt} onChange={(e) => { setExcerpt(e.target.value); if (fieldErrs.excerpt) setFieldErrs((s) => ({ ...s, excerpt: undefined })); }} required maxLength={320} rows={3} placeholder="Resumo curto que aparece no card e na página do artigo." className={`mt-1 w-full rounded-xl border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 ${fieldErrs.excerpt ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "border-ink/10 focus:border-terracotta/40 focus:ring-terracotta/20"}`} />
          <span className={`text-xs ${fieldErrs.excerpt ? "text-destructive" : "text-ink-muted"}`}>{fieldErrs.excerpt ?? `${excerpt.length}/320`}</span>
        </label>
        <label className="block text-sm">
          <span className="text-ink">Conteúdo * <span className="font-normal text-ink-muted">(mín. 20 caracteres)</span></span>
          <textarea value={content} onChange={(e) => { setContent(e.target.value); if (fieldErrs.content) setFieldErrs((s) => ({ ...s, content: undefined })); }} required rows={14} placeholder={"Parágrafos separados por linha em branco.\n\nUse # Título, ## Subtítulo e - itens de lista."} className={`mt-1 w-full rounded-xl border bg-background px-3 py-2.5 font-mono text-sm outline-none focus:ring-2 ${fieldErrs.content ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "border-ink/10 focus:border-terracotta/40 focus:ring-terracotta/20"}`} />
          <span className={`text-xs ${fieldErrs.content ? "text-destructive" : "text-ink-muted"}`}>{fieldErrs.content ?? `${content.length} caracteres`}</span>
        </label>
        <label className="block text-sm">
          <span className="text-ink">Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="mt-1 rounded-xl border border-ink/10 bg-background px-3 py-2 text-sm">
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </label>
        <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60">
          {loading ? "Salvando…" : "Criar artigo"}
        </button>
      </form>
    </div>
  );
}
