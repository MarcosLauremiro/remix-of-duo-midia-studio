import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { getPublishedPostBySlugFn } from "@/lib/admin/blog.server";
import type { PostDoc } from "@/lib/admin/db";
import { coverDeliveryUrl } from "@/lib/cover";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPage,
});

function formatDate(iso: string | null) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return null;
  }
}

function renderContent(content: string) {
  // Conteúdo puro em texto com quebras; preserva parágrafos e headings simples (# , ## )
  const blocks = content.split(/\n{2,}/);
  return blocks.map((block, i) => {
    const t = block.trim();
    if (!t) return null;
    if (t.startsWith("### ")) return <h3 key={i} className="mt-8 text-xl font-semibold text-ink">{t.slice(4).trim()}</h3>;
    if (t.startsWith("## ")) return <h2 key={i} className="mt-10 text-2xl font-semibold text-ink">{t.slice(3).trim()}</h2>;
    if (t.startsWith("# ")) return <h2 key={i} className="mt-10 text-2xl font-bold text-ink">{t.slice(2).trim()}</h2>;
    // Lista simples com "- "
    if (t.split("\n").every((l) => l.trim().startsWith("- "))) {
      const items = t.split("\n").map((l) => l.trim().slice(2));
      return (
        <ul key={i} className="mt-4 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-ink">
          {items.map((it, j) => (
            <li key={j}>{it}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="mt-4 text-[15px] leading-relaxed text-ink">
        {t}
      </p>
    );
  });
}

function BlogPostPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<PostDoc | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setErr(null);
    getPublishedPostBySlugFn({ data: { slug } })
      .then((r) => setPost(r.post as PostDoc))
      .catch((e) => {
        const msg = e instanceof Response ? "Artigo não encontrado" : String(e);
        setErr(msg);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-ink">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-5 py-10 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-3/4 rounded bg-surface-strong" />
            <div className="aspect-[16/9] rounded-2xl bg-surface-strong" />
            <div className="h-4 w-full rounded bg-surface-strong" />
          </div>
        </main>
      </div>
    );
  }

  if (err || !post) {
    return (
      <div className="min-h-screen bg-background text-ink">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-5 py-10 lg:px-8">
          <p className="rounded-2xl bg-surface p-6 text-center text-sm text-ink-muted ring-1 ring-ink/10">{err ?? "Artigo não encontrado."}</p>
          <div className="mt-6 text-center">
            <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-terracotta hover:underline">
              <ArrowLeft className="size-4" /> Voltar ao blog
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const date = formatDate(post.publishedAt ?? post.createdAt);

  return (
    <div className="min-h-screen bg-background text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-8 lg:px-8 lg:py-12">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink">
          <ArrowLeft className="size-4" /> Blog
        </Link>

        <h1 className="mt-4 font-display text-3xl leading-tight text-ink sm:text-4xl">{post.title}</h1>
        {date && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-muted">
            <Calendar className="size-3.5" /> {date}
          </p>
        )}

        {coverDeliveryUrl(post.coverImage) && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10">
            <img src={coverDeliveryUrl(post.coverImage) ?? undefined} alt={post.title} className="w-full object-cover" />
          </div>
        )}

        <p className="mt-6 text-base leading-relaxed text-ink-muted">{post.excerpt}</p>

        <article className="mt-2 border-t border-ink/10 pt-2">{renderContent(post.content)}</article>

        <div className="mt-10">
          <Link to="/blog" className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-strong">
            <ArrowLeft className="size-4" /> Ver todos os artigos
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
