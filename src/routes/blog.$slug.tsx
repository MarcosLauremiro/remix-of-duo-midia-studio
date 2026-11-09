import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { getPublishedPostBySlugFn } from "@/lib/admin/blog.server";
import type { PostDoc } from "@/lib/admin/db";
import { postBlocks, type PostBlock } from "@/lib/blog";
import { coverDeliveryUrl, coverLoadLogger } from "@/lib/cover";
import { jsonLd, pageSeo, SITE_NAME, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  // Busca no servidor: o HTML inicial já traz o artigo, o título e a descrição (SEO).
  loader: async ({ params }) => {
    try {
      const { post } = await getPublishedPostBySlugFn({ data: { slug: params.slug } });
      return { post: post as PostDoc };
    } catch (e) {
      if (e instanceof Response && e.status === 404) throw notFound();
      throw e;
    }
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return {};
    const url = `/blog/${post.slug}`;
    const image = coverDeliveryUrl(post.coverImage);
    const seo = pageSeo({
      title: `${post.title} | DUO | Mídia & Studio`,
      description: post.excerpt,
      path: url,
      image,
      type: "article",
    });
    const published = post.publishedAt ?? post.createdAt;
    return {
      ...seo,
      scripts: [
        {
          type: "application/ld+json",
          children: jsonLd({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: image ? [image] : undefined,
            datePublished: published,
            dateModified: post.updatedAt,
            mainEntityOfPage: `${SITE_URL}${url}`,
            author: { "@type": "Organization", name: SITE_NAME },
            publisher: { "@type": "Organization", name: SITE_NAME },
          }),
        },
      ],
    };
  },
  component: BlogPostPage,
});

function formatDate(iso: string | null) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return null;
  }
}

function renderText(text: string) {
  // Texto puro com quebras; preserva parágrafos e headings simples (# , ## )
  const blocks = text.split(/\n{2,}/);
  return blocks.map((block, i) => {
    const t = block.trim();
    if (!t) return null;
    if (t.startsWith("### "))
      return (
        <h3 key={i} className="mt-8 text-xl font-semibold text-ink">
          {t.slice(4).trim()}
        </h3>
      );
    if (t.startsWith("## "))
      return (
        <h2 key={i} className="mt-10 text-2xl font-semibold text-ink">
          {t.slice(3).trim()}
        </h2>
      );
    if (t.startsWith("# "))
      return (
        <h2 key={i} className="mt-10 text-2xl font-bold text-ink">
          {t.slice(2).trim()}
        </h2>
      );
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

function BlockView({ block, index }: { block: PostBlock; index: number }) {
  const image = coverDeliveryUrl(block.image);
  return (
    <section className="mt-10">
      {block.subtitle && (
        <h2 className="font-display text-2xl leading-snug text-ink sm:text-3xl">
          {block.subtitle}
        </h2>
      )}
      <div>{renderText(block.text)}</div>
      {image && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10">
          <img
            src={image}
            alt={block.subtitle || `Imagem ${index + 1}`}
            loading="lazy"
            className="w-full object-cover"
          />
        </div>
      )}
    </section>
  );
}

function BlogPostPage() {
  const { post } = Route.useLoaderData();

  const date = formatDate(post.publishedAt ?? post.createdAt);

  return (
    <div className="min-h-screen bg-background text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-8 lg:px-8 lg:py-12">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="size-4" /> Blog
        </Link>

        {coverDeliveryUrl(post.coverImage) && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-ink/10">
            <img
              src={coverDeliveryUrl(post.coverImage) ?? undefined}
              {...coverLoadLogger("publico", coverDeliveryUrl(post.coverImage) ?? "")}
              alt={post.title}
              className="w-full object-cover"
            />
          </div>
        )}

        <h1 className="mt-6 font-display text-3xl leading-tight text-ink sm:text-4xl">
          {post.title}
        </h1>
        {date && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-muted">
            <Calendar className="size-3.5" /> {date}
          </p>
        )}

        <p className="mt-6 text-base leading-relaxed text-ink-muted">{post.excerpt}</p>

        <article className="mt-2 border-t border-ink/10 pt-2">
          {postBlocks(post).map((block, i) => (
            <BlockView key={i} block={block} index={i} />
          ))}
        </article>

        <div className="mt-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-strong"
          >
            <ArrowLeft className="size-4" /> Ver todos os artigos
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
