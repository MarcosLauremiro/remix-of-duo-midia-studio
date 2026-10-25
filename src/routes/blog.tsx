import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Search } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { listPublishedPostsFn } from "@/lib/admin/blog.server";
import type { PostDoc } from "@/lib/admin/db";
import { BlogCard, BlogCardSkeleton } from "@/components/blog/BlogCard";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog | DUO | Mídia & Studio" },
      {
        name: "description",
        content: "Conteúdos da DUO sobre marca, redes sociais, produção de vídeo e comunicação em linguagem simples.",
      },
      { property: "og:title", content: "Blog | DUO | Mídia & Studio" },
      {
        property: "og:description",
        content: "Conteúdos da DUO sobre marca, redes sociais, produção de vídeo e comunicação em linguagem simples.",
      },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ items: PostDoc[]; total: number; totalPages: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listPublishedPostsFn({ data: { q: q || undefined, page, limit: 12 } });
      setData({ items: res.items as PostDoc[], total: res.total, totalPages: res.totalPages });
    } catch {
      setData({ items: [], total: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [q, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [q]);

  return (
    <PageShell eyebrow="Conteúdo da DUO" title="Blog" intro="Ideias, bastidores e dicas práticas de comunicação para quem quer ver a marca crescer.">
      <div className="mt-8 flex flex-col gap-3 rounded-2xl bg-surface p-3 ring-1 ring-ink/10 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar artigos por título ou resumo"
            className="w-full rounded-xl border border-ink/10 bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          [0, 1, 2, 3, 4, 5].map((i) => <BlogCardSkeleton key={i} />)
        ) : !data || data.items.length === 0 ? (
          <p className="col-span-full rounded-2xl bg-surface p-8 text-center text-sm text-ink-muted ring-1 ring-ink/10">
            Nenhum artigo publicado ainda.
          </p>
        ) : (
          data.items.map((p) => <BlogCard key={p.id} post={p} />)
        )}
      </div>

      {data && data.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between text-sm">
          <span className="text-ink-muted">
            {data.total} artigo(s) · página {page} de {data.totalPages}
          </span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-full border border-ink/10 px-3 py-1.5 disabled:opacity-40">
              Anterior
            </button>
            <button disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-full border border-ink/10 px-3 py-1.5 disabled:opacity-40">
              Próxima
            </button>
          </div>
        </div>
      )}
    </PageShell>
  );
}
