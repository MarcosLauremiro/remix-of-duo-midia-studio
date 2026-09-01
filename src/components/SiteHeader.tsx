import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Home,
  Megaphone,
  Clapperboard,
  Layers,
  Newspaper,
  Radio,
  LayoutDashboard,
  Menu,
  Sparkles,
} from "lucide-react";

import logoAsset from "@/assets/logo-duo-midia.png.asset.json";

export const siteNav = [
  { label: "Início", to: "/", icon: Home },
  { label: "DUOMÍDIA", to: "/duomidia", icon: Megaphone },
  { label: "DUOSTUDIO", to: "/duostudio", icon: Clapperboard },
  { label: "Serviços", to: "/servicos", icon: Layers },
  { label: "Blog", to: "/blog", icon: Newspaper },
  { label: "Imprensa", to: "/imprensa", icon: Radio },
] as const;


export function SiteHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1">
            <img
              src={logoAsset.url}
              alt="DUO Mídia"
              className="h-full w-full object-contain"
            />
          </span>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="font-display text-base font-bold text-ink">
              DUO <span className="font-normal text-ink-muted">|</span>{" "}
              <span className="text-terracotta">Mídia</span>{" "}
              <span className="font-normal text-ink-muted">&</span>{" "}
              <span className="text-ochre">Studio</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-ink-muted">
              Uma agência, várias soluções.
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {siteNav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-strong hover:text-ink data-[status=active]:bg-surface-strong data-[status=active]:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-terracotta-soft px-3 py-1.5 text-xs font-medium text-terracotta md:inline-flex">
            <Sparkles className="size-3.5" />
            12 créditos
          </div>
          <div className="grid size-9 place-items-center rounded-full bg-surface-strong text-xs font-semibold text-ink">
            MB
          </div>
          <button
            onClick={() => setMobileNavOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-full border border-ink/10 xl:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="size-4" />
          </button>
        </div>
      </div>

      {mobileNavOpen && (
        <div className="border-t border-ink/10 bg-surface xl:hidden">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-1 px-5 py-3 sm:grid-cols-3">
            {siteNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  onClick={() => setMobileNavOpen(false)}
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-surface-strong data-[status=active]:bg-surface-strong data-[status=active]:text-ink"
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
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
