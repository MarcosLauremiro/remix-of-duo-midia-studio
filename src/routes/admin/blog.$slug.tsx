import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { adminGetPostFn, adminUpdatePostFn, adminDeletePostFn, adminPublishPostFn } from "@/lib/admin/blog.server";
import { uploadCoverFile } from "@/lib/admin/cover-upload";
import type { PostDoc } from "@/lib/admin/db";
import { CoverImageField } from "@/components/blog/CoverImageField";

export const Route = createFileRoute("/admin/blog/$slug")({
  component: EditPostPage,
});

function EditPostPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDoc | null>(null);
  const [title, setTitle] = useState("");
  const [slugEdit, setSlugEdit] = useState("");
  // Capa: arquivo novo escolhido, ou remoção pedida. Sem nenhum dos dois, a capa atual é mantida.
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverRemoved, setCoverRemoved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const submitting = useRef(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    adminGetPostFn({ data: { slug } })
      .then((r) => {
        if (!alive) return;
        const p = r.post as PostDoc;
        setPost(p);
        setTitle(p.title);
        setSlugEdit(p.slug);
        setExcerpt(p.excerpt);
        setContent(p.content);
      })
      .catch((e) => {
        if (!alive) return;
        setErr(e instanceof Response ? "Artigo não encontrado" : String(e));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || submitting.current) return;
    setErr(null);
    submitting.current = true;
    setSaving(true);
    try {
      // undefined não vai na requisição: o servidor mantém a capa atual.
      let coverImage: string | null | undefined;
      if (coverFile) {
        setUploading(true);
        // DIAGNÓSTICO TEMPORÁRIO
        console.log("[capa] enviando arquivo", { type: coverFile.type, bytes: coverFile.size });
        coverImage = await uploadCoverFile(coverFile);
        console.log("[capa] upload concluído, URL recebida", { url: coverImage });
        setUploading(false);
      } else if (coverRemoved) {
        coverImage = null;
      }
      await adminUpdatePostFn({ data: { id: post.id, title, slug: slugEdit, coverImage, excerpt, content } });
      setCoverFile(null);
      setCoverRemoved(false);
      const updated = await adminGetPostFn({ data: { id: post.id } });
      const p = (updated as { post: PostDoc }).post;
      setPost(p);
      // Se slug mudou, navega para nova URL
      if (p.slug !== slug) navigate({ to: "/admin/blog/$slug", params: { slug: p.slug } });
    } catch (ex) {
      const msg = ex instanceof Response ? ((await ex.json().catch(() => null)) as { error?: string } | null)?.error ?? "Erro" : ex instanceof Error ? ex.message : String(ex);
      setErr(msg);
    } finally {
      submitting.current = false;
      setUploading(false);
      setSaving(false);
    }
  };

  const onTogglePublish = async () => {
    if (!post) return;
    const next = post.status === "published" ? "draft" : "published";
    try {
      const r = await adminPublishPostFn({ data: { id: post.id, status: next } });
      setPost((r as { post: PostDoc }).post);
    } catch (ex) {
      alert(ex instanceof Response ? ((await ex.json().catch(() => null)) as { error?: string } | null)?.error ?? "Erro" : String(ex));
    }
  };

  const onDelete = async () => {
    if (!post || !confirm(`Excluir "${post.title}"?`)) return;
    try {
      await adminDeletePostFn({ data: { id: post.id } });
      navigate({ to: "/admin/blog" });
    } catch (ex) {
      alert(ex instanceof Response ? ((await ex.json().catch(() => null)) as { error?: string } | null)?.error ?? "Erro" : String(ex));
    }
  };

  if (loading) return <p className="text-sm text-ink-muted">Carregando…</p>;
  if (err && !post) return <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{err}</p>;
  if (!post) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin/blog" className="text-sm text-ink-muted hover:text-ink">← Voltar</Link>
        <div className="flex flex-wrap gap-2">
          <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="rounded-full border border-ink/10 bg-surface px-3 py-1.5 text-xs font-medium">Ver no site</a>
          <button onClick={onTogglePublish} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${post.status === "published" ? "bg-amber-100 text-amber-800 ring-1 ring-amber-200" : "bg-emerald-600 text-white"}`}>
            {post.status === "published" ? "Despublicar" : "Publicar"}
          </button>
          <button onClick={onDelete} className="rounded-full border border-destructive/20 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive">Excluir</button>
        </div>
      </div>

      <p className="text-xs text-ink-muted">
        Status: <span className="font-medium text-ink">{post.status === "published" ? "Publicado" : "Rascunho"}</span>
        {post.publishedAt ? ` · publicado em ${new Date(post.publishedAt).toLocaleDateString("pt-BR")}` : ""} · criado em {new Date(post.createdAt).toLocaleDateString("pt-BR")}
      </p>

      {err && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{err}</p>}

      <form onSubmit={onSave} className="space-y-4 rounded-2xl bg-surface p-6 ring-1 ring-ink/10">
        <label className="block text-sm">
          <span className="text-ink">Título</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={160} className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm outline-none focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20" />
        </label>
        <label className="block text-sm">
          <span className="text-ink">Slug</span>
          <input value={slugEdit} onChange={(e) => setSlugEdit(e.target.value)} placeholder="slug-do-artigo" className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm outline-none focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20" />
        </label>
        <CoverImageField
          savedUrl={coverRemoved ? null : post.coverImage}
          pendingFile={coverFile}
          disabled={saving}
          onChange={(file) => {
            if (file) {
              setCoverFile(file);
              setCoverRemoved(false);
            } else if (coverFile) {
              // Só cancela a escolha: a capa salva continua.
              setCoverFile(null);
            } else {
              setCoverRemoved(true);
            }
          }}
        />
        <label className="block text-sm">
          <span className="text-ink">Resumo</span>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required maxLength={320} rows={3} className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm outline-none focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20" />
        </label>
        <label className="block text-sm">
          <span className="text-ink">Conteúdo</span>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={14} className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 font-mono text-sm outline-none focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20" />
        </label>
        <button type="submit" disabled={saving} className="inline-flex w-full items-center justify-center rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60">
          {uploading ? "Enviando capa…" : saving ? "Salvando…" : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
}
