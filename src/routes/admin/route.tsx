import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, Users, Settings, LogOut, Menu, X, Building2 } from "lucide-react";
import { meFn, logoutFn } from "@/lib/admin/admin.server";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [me, setMe] = useState<{ name: string; email: string } | null>(null);
  const [checked, setChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) {
      setChecked(true);
      return;
    }
    meFn()
      .then((r) => {
        if (!r.admin) {
          navigate({ to: "/admin/login" });
          return;
        }
        setMe({ name: r.admin.name, email: r.admin.email });
        setChecked(true);
      })
      .catch(() => navigate({ to: "/admin/login" }));
  }, [navigate, isLogin]);

  if (isLogin) return <Outlet />;

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <p className="text-sm text-ink-muted">Verificando sessão…</p>
      </div>
    );
  }

  const nav = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/clientes", label: "Clientes", icon: Users },
    { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
  ] as const;

  const onLogout = async () => {
    await logoutFn();
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-background text-ink">
      {/* Topbar */}
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              className="grid size-9 place-items-center rounded-xl border border-ink/10 lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            >
              {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
            <Link to="/admin/dashboard" className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-xl bg-terracotta text-white">
                <Building2 className="size-4" />
              </span>
              <span className="font-display text-sm font-bold">DUO, Admin</span>
            </Link>
            <span className="hidden text-xs text-ink-muted lg:inline">Gerenciamento de clientes</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right leading-tight sm:block">
              <p className="text-sm font-medium">{me?.name}</p>
              <p className="text-xs text-ink-muted">{me?.email}</p>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-surface px-3 py-1.5 text-xs font-medium hover:bg-surface-strong"
            >
              <LogOut className="size-3.5" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        {/* Sidebar desktop */}
        <aside className="hidden w-64 shrink-0 border-r border-ink/10 bg-surface/40 p-4 lg:block">
          <nav className="space-y-1">
            {nav.map((n) => {
              const active = pathname === n.to || pathname.startsWith(n.to + "/");
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-terracotta text-white" : "text-ink-muted hover:bg-surface hover:text-ink"}`}
                >
                  <n.icon className="size-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-6 rounded-xl bg-surface p-3 text-xs leading-relaxed text-ink-muted ring-1 ring-ink/10">
            Dados reais do banco. Exclusão é lógica, registros não aparecem nas listagens.
          </div>
        </aside>

        {/* Sidebar mobile */}
        {mobileOpen && (
          <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)}>
            <div className="h-full w-72 bg-surface p-4" onClick={(e) => e.stopPropagation()}>
              <nav className="space-y-1">
                {nav.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-3 text-sm font-medium text-ink hover:bg-background"
                  >
                    <n.icon className="size-4" />
                    {n.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
