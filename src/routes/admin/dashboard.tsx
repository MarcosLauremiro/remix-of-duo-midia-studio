import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, UserCheck, UserX, Target, ShoppingBag, Plus, ArrowRight } from "lucide-react";
import { dashboardFn } from "@/lib/admin/admin.server";

export const Route = createFileRoute("/admin/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof dashboardFn>> | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    dashboardFn()
      .then(setData)
      .catch((e) => setErr(e instanceof Response ? "Não autenticado" : String(e)));
  }, []);

  if (err) return <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{err}</p>;
  if (!data) return <p className="text-sm text-ink-muted">Carregando…</p>;

  const cards = [
    { label: "Total", value: data.total, icon: Users, tone: "bg-surface" },
    { label: "Ativos", value: data.ativos, icon: UserCheck, tone: "bg-emerald-500/10 text-emerald-600" },
    { label: "Inativos", value: data.inativos, icon: UserX, tone: "bg-zinc-500/10 text-zinc-600" },
    { label: "Leads", value: data.leads, icon: Target, tone: "bg-amber-500/10 text-amber-600" },
    { label: "Em negociação", value: data.emNegociacao, icon: ShoppingBag, tone: "bg-sky-500/10 text-sky-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-ink">Dashboard</h1>
          <p className="text-sm text-ink-muted">Indicadores calculados a partir do banco, sem valores fixos.</p>
        </div>
        <Link
          to="/admin/clientes/novo"
          className="inline-flex items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110"
        >
          <Plus className="size-4" />
          Novo cliente
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-surface p-4 ring-1 ring-ink/10">
            <div className="flex items-center justify-between">
              <span className={`grid size-8 place-items-center rounded-xl ${c.tone}`}>
                <c.icon className="size-4" />
              </span>
              <span className="text-2xl font-bold text-ink">{c.value}</span>
            </div>
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-ink-muted">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-surface p-4 ring-1 ring-ink/10 sm:p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-ink">Cadastrados recentemente</h2>
          <Link to="/admin/clientes" className="inline-flex items-center gap-1 text-sm text-terracotta hover:underline">
            Ver todos <ArrowRight className="size-4" />
          </Link>
        </div>
        {data.recentes.length === 0 ? (
          <p className="mt-3 text-sm text-ink-muted">Nenhum cliente ainda. Cadastre o primeiro.</p>
        ) : (
          <ul className="mt-3 divide-y divide-ink/10">
            {data.recentes.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{c.nome}</p>
                  <p className="truncate text-xs text-ink-muted">
                    {[c.empresa, c.email].filter(Boolean).join(" · ") || "-"}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-background px-2.5 py-1 text-xs ring-1 ring-ink/10">{c.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
