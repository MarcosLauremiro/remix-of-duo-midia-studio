import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Home,
  Layers,
  Radio,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";

import logoImg from "@/assets/logo/DUO.png";

export const WHATSAPP_URL = "https://wa.me/559982094540";
export const WHATSAPP_PHONE_DISPLAY = "+55 99 8209-4540";

export const siteNav = [
  { label: "Início", to: "/", icon: Home },
  { label: "DuoMídia", to: "/duomidia", icon: Layers, accent: "terracotta" as const },
  { label: "DuoStudio", to: "/duostudio", icon: Radio, accent: "ochre" as const },
] as const;


export function WhatsAppCta({
  label = "Falar no WhatsApp",
  variant = "primary",
  className = "",
}: {
  label?: string;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all";
  const primary =
    "bg-terracotta px-5 py-2.5 text-primary-foreground shadow-sm shadow-terracotta/20 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed";
  const ghost =
    "border border-ink/10 bg-surface px-5 py-2.5 text-ink hover:bg-surface-strong disabled:opacity-50 disabled:cursor-not-allowed";
  const cls = `${base} ${variant === "primary" ? primary : ghost} ${className}`;
  if (!WHATSAPP_URL) {
    return (
      <button type="button" disabled title="WhatsApp ainda não configurado" className={cls}>
        <MessageCircle className="size-4" />
        {label}
      </button>
    );
  }
  return (
    <a href={WHATSAPP_URL} target="_blank" rel="noreferrer noopener" className={cls}>
      <MessageCircle className="size-4" />
      {label}
    </a>
  );
}

export function SiteHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 shrink-0 items-center">
            <img src={logoImg} alt="DUO Mídia & Studio" className="h-9 w-auto object-contain" />
          </span>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="font-display text-[15px] font-bold leading-none text-ink">
              DUO <span className="font-normal text-ink-muted">|</span>{" "}
              <span className="text-terracotta">Mídia</span>{" "}
              <span className="font-normal text-ink-muted">&</span>{" "}
              <span className="text-ochre">Studio</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-ink-muted">
              Uma Agência. Várias soluções. · 2026
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {siteNav.map((item) => {
            const isTerracotta = (item as { accent?: string }).accent === "terracotta";
            const isOchre = (item as { accent?: string }).accent === "ochre";
            return (
              <Link
                key={item.label}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors data-[status=active]:bg-surface-strong data-[status=active]:text-ink ${isTerracotta ? "text-terracotta hover:bg-terracotta-soft hover:text-terracotta data-[status=active]:bg-terracotta-soft data-[status=active]:text-terracotta" : isOchre ? "text-ochre hover:bg-ochre/10 hover:text-ochre data-[status=active]:bg-ochre/15 data-[status=active]:text-ochre" : "text-ink-muted hover:bg-surface-strong hover:text-ink"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex">
            <WhatsAppCta label="Falar com a Duo" className="hidden lg:inline-flex" />
          </div>
          <button
            onClick={() => setMobileNavOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-full border border-ink/10 lg:hidden"
            aria-label={mobileNavOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileNavOpen}
          >
            {mobileNavOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {mobileNavOpen && (
        <div className="border-t border-ink/10 bg-surface lg:hidden">
          <div className="mx-auto max-w-7xl px-5 py-3">
            <nav className="grid grid-cols-1 gap-1" aria-label="Principal mobile">
              {siteNav.map((item) => {
                const Icon = item.icon;
                const isTerracotta = (item as { accent?: string }).accent === "terracotta";
                const isOchre = (item as { accent?: string }).accent === "ochre";
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    activeOptions={{ exact: item.to === "/" }}
                    onClick={() => setMobileNavOpen(false)}
                    className={`inline-flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium data-[status=active]:bg-surface-strong data-[status=active]:text-ink ${isTerracotta ? "text-terracotta hover:bg-terracotta-soft data-[status=active]:bg-terracotta-soft data-[status=active]:text-terracotta" : isOchre ? "text-ochre hover:bg-ochre/10 data-[status=active]:bg-ochre/15 data-[status=active]:text-ochre" : "text-ink-muted hover:bg-surface-strong"}`}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-3">
              <WhatsAppCta label="Falar com a Duo no WhatsApp" className="w-full" />
              {!WHATSAPP_URL && (
                <p className="mt-2 text-center text-xs text-ink-muted">
                  WhatsApp será ativado assim que o número for informado.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-ink/10 pt-8 text-sm text-ink-muted sm:flex-row sm:items-center">
      <p>© {new Date().getFullYear()} DUO | Mídia & Studio · Todos os direitos reservados.</p>
      <div className="flex flex-wrap gap-6">
        <Link to="/duomidia" className="hover:text-ink">
          DUOMÍDIA
        </Link>
        <Link to="/duostudio" className="hover:text-ink">
          DUOSTUDIO
        </Link>
        <Link to="/painel-cliente" className="hover:text-ink">
          Painel do cliente
        </Link>
      </div>
    </footer>
  );
}
