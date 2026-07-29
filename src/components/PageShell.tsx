import type { ReactNode } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">{intro}</p>
        {children}
        <SiteFooter />
      </main>
    </div>
  );
}

export function CardGrid({ children }: { children: ReactNode }) {
  return <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export function InfoCard({
  image,
  title,
  text,
  tag,
  href,
}: {
  image?: string;
  title: string;
  text: string;
  tag?: string;
  href?: string;
}) {
  const inner = (
    <>
      {image && (
        <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-strong">
          <img src={image} alt={title} loading="lazy" className="size-full object-cover" />
        </div>
      )}
      <div className={image ? "mt-4" : ""}>
        {tag && (
          <span className="inline-flex rounded-full bg-terracotta-soft px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-terracotta">
            {tag}
          </span>
        )}
        <p className="mt-2 text-base font-semibold text-ink">{title}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{text}</p>
      </div>
    </>
  );

  const cls =
    "block rounded-2xl border border-ink/10 bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-ink/20";

  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
