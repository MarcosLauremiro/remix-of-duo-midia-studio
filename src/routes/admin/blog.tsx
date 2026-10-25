import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Search, Plus, Trash2, Pencil, Eye, EyeOff } from "lucide-react";
import { adminListPostsFn, adminDeletePostFn, adminPublishPostFn } from "@/lib/admin/blog.server";
import type { PostDoc } from "@/lib/admin/db";

export const Route = createFileRoute("/admin/blog")({
  component: BlogAdminPage,
});

const statusOptions = [
  { value: "todos", label: "Todos" },
  { value: "published", label: "Publicados" },
  { value: "draft", label: "Rascunhos" },
] as const;

function BlogAdminPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("todos");
  const [sortBy, setSortBy] = useState<"publishedAt" | "createdAt" | "title">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ items: PostDoc[]; total: number; totalPages: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await adminListPostsFn({ data: { q: q || undefined, status: status === "todos" ? undefined : status, sortBy, sortDir, page, limit: 10 } });
      setData({ items: res.items as PostDoc[], total: res.total, totalPages: res.totalPages });
    } catch (e) {
      setErr(e instanceof Response ? "Não autenticado ou erro" : String(e));
    } finally {
      setLoading(false);
    }
  }, [q, status, sortBy, sortDir, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useEffect(() => {
    setPage(1);
  }, [q, status, sortBy, sortDir]);

  const onDelete = async (id: string, title: string) => {
    if (!confirm(`Excluir "${title}"?`)) return;
    try {
      await adminDeletePostFn({ data: { id } });
      await fetchData();
    } catch (e) {
      alert(e instanceof Response ? ((await e.json().catch(() => null)) as { error?: string } | null)?.error ?? "Erro" : String(e));
    }
  };
  const onTogglePublish = async (p: PostDoc) => {
    const next = p.status === "published" ? "draft" : "published";
    try {
      await adminPublishPostFn({ data: { id: p.id, status: next } });
      await fetchData();
    } catch (e) {
      alert(e instanceof Response ? ((await e.json().catch(() => null)) as { error?: string } | null)?.error ?? "Erro" : String(e));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-ink">Blog</h1>
          <p className="text-sm text-ink-muted">Gerencie artigos: criar, editar, publicar e excluir.</p>
        </div>
        <Link to="/admin/blog/novo" className="inline-flex items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110">
          <Plus className="size-4" /> Novo artigo
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl bg-surface p-3 ring-1 ring-ink/10 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por título ou resumo" className="w-full rounded-xl border border-ink/10 bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-ink/10 bg-background px-3 py-2 text-sm">
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={`${sortBy}:${sortDir}`}
          onChange={(e) => {
            const [a, b] = e.target.value.split(":") as [typeof sortBy, typeof sortDir];
            setSortBy(a);
            setSortDir(b);
          }}
          className="rounded-xl border border-ink/10 bg-background px-3 py-2 text-sm"
        >
          <option value="createdAt:desc">Mais recentes</option>
          <option value="createdAt:asc">Mais antigos</option>
          <option value="publishedAt:desc">Publicação recente</option>
          <option value="title:asc">Título A–Z</option>
        </select>
      </div>

      {err && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{err}</p>}

      <div className="overflow-hidden rounded-2xl bg-surface ring-1 ring-ink/10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background/60 text-left text-xs uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Artigo</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Publicação</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {loading ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-ink-muted">Carregando…</td></tr>
              ) : !data || data.items.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-ink-muted">Nenhum artigo encontrado.</td></tr>
              ) : (
                data.items.map((p) => (
                  <tr key={p.id} className="hover:bg-background/40">
                    <td className="px-4 py-3">
                      <Link to="/admin/blog/$slug" params={{ slug: p.slug }} className="font-medium text-ink hover:text-terracotta">{p.title}</Link>
                      <p className="max-w-[28ch] truncate text-xs text-ink-muted">/{p.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs ring-1 ${p.status === "published" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-amber-50 text-amber-700 ring-amber-200"}`}>{p.status === "published" ? "Publicado" : "Rascunho"}</span>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("pt-BR") : "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link to="/admin/blog/$slug" params={{ slug: p.slug }} className="inline-flex size-8 place-items-center justify-center rounded-xl border border-ink/10 hover:bg-background" aria-label="Editar"><Pencil className="size-3.5" /></Link>
                        <button onClick={() => onTogglePublish(p)} className="inline-flex size-8 place-items-center justify-center rounded-xl border border-ink/10 hover:bg-background" aria-label={p.status === "published" ? "Despublicar" : "Publicar"}>{p.status === "published" ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}</button>
                        <button onClick={() => onDelete(p.id, p.title)} className="inline-flex size-8 place-items-center justify-center rounded-xl border border-ink/10 text-destructive hover:bg-destructive/10" aria-label="Excluir"><Trash2 className="size-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-ink/10 px-4 py-3 text-sm">
            <span className="text-ink-muted">{data.total} artigo(s) · página {page} de {data.totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-full border border-ink/10 px-3 py-1.5 disabled:opacity-40">Anterior</button>
              <button disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-full border border-ink/10 px-3 py-1.5 disabled:opacity-40">Próxima</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
