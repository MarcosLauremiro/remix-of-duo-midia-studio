import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { recentBlogPostsFn } from "@/lib/admin/blog.server";
import type { PostDoc } from "@/lib/admin/db";
import { BlogCard, BlogCardSkeleton } from "./BlogCard";

export function BlogSection() {
  const [posts, setPosts] = useState<PostDoc[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    recentBlogPostsFn({ data: { limit: 3 } })
      .then((r) => {
        if (alive) setPosts(r.items);
      })
      .catch(() => {
        if (alive) setPosts([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!loading && (!posts || posts.length === 0)) return null;

  return (
    <section className="mt-16">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow mb-2">Conteúdo da DUO</p>
          <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">Blog</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">Artigos recentes sobre marca, redes sociais e produção.</p>
        </div>
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-surface px-4 py-2 text-sm font-medium text-ink hover:bg-surface-strong"
        >
          Ver todos os artigos <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? [0, 1, 2].map((i) => <BlogCardSkeleton key={i} />)
          : posts!.map((p) => <BlogCard key={p.id} post={p} />)}
      </div>
    </section>
  );
}
