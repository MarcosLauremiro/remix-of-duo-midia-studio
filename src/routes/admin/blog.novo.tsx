import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { adminCreatePostFn } from "@/lib/admin/blog.server";

export const Route = createFileRoute("/admin/blog/novo")({
  component: NovoPostPage,
});

function NovoPostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await adminCreatePostFn({ data: { title, slug: slug || undefined, coverImage: coverImage || undefined, excerpt, content, status } });
      navigate({ to: "/admin/blog/$slug", params: { slug: (res.post as { slug: string }).slug } });
    } catch (ex) {
      const msg = ex instanceof Response ? ((await ex.json().catch(() => null)) as { error?: string } | null)?.error ?? "Erro" : ex instanceof Error ? ex.message : String(ex);
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
          <span className="text-ink">Resumo *</span>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required maxLength={320} rows={3} placeholder="Resumo curto que aparece no card e na página do artigo." className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm outline-none focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20" />
          <span className="text-xs text-ink-muted">{excerpt.length}/320</span>
        </label>
        <label className="block text-sm">
          <span className="text-ink">Conteúdo *</span>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={14} placeholder={"Parágrafos separados por linha em branco.\n\nUse # Título, ## Subtítulo e - itens de lista."} className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 font-mono text-sm outline-none focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20" />
          <span className="text-xs text-ink-muted">{content.length} caracteres</span>
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
