import { Link } from "@tanstack/react-router";
import { Calendar, ArrowUpRight } from "lucide-react";
import type { PostDoc } from "@/lib/admin/db";
import { coverDeliveryUrl, coverLoadLogger } from "@/lib/cover";

function formatDate(iso: string | null) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return null;
  }
}

export function BlogCard({ post }: { post: PostDoc }) {
  const href = `/blog/${post.slug}`;
  const date = formatDate(post.publishedAt ?? post.createdAt);
  const cover = coverDeliveryUrl(post.coverImage);
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-surface transition-all hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-lg"
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-surface-strong">
        {cover ? (
          <img src={cover} {...coverLoadLogger("card", cover)} alt={post.title} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-terracotta/20 to-ochre/20 p-6">
            <span className="text-center text-sm font-medium text-ink-muted">{post.title.slice(0, 80)}</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {date && (
          <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
            <Calendar className="size-3" /> {date}
          </span>
        )}
        <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-tight text-ink group-hover:text-terracotta">{post.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-muted">{post.excerpt}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-terracotta">
          Ler artigo <ArrowUpRight className="size-3" />
        </span>
      </div>
    </Link>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-surface">
      <div className="aspect-[16/10] animate-pulse bg-surface-strong" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-20 animate-pulse rounded bg-surface-strong" />
        <div className="h-4 w-full animate-pulse rounded bg-surface-strong" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-surface-strong" />
      </div>
    </div>
  );
}
