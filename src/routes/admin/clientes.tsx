import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Search, Plus, Trash2, Pencil } from "lucide-react";
import { listClientsFn, deleteClientFn } from "@/lib/admin/admin.server";

export const Route = createFileRoute("/admin/clientes")({
  component: ClientesPage,
});

const statusOptions = [
  { value: "todos", label: "Todos" },
  { value: "lead", label: "Lead" },
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
  { value: "em_negociacao", label: "Em negociação" },
] as const;

function ClientesPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("todos");
  const [sortBy, setSortBy] = useState<"createdAt" | "nome">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ items: { id: string; nome: string; empresa?: string | null; email?: string | null; status: string; createdAt: string }[]; total: number; totalPages: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await listClientsFn({ data: { q: q || undefined, status: status === "todos" ? undefined : status, sortBy, sortDir, page, limit: 10 } });
      setData({ items: res.items, total: res.total, totalPages: res.totalPages });
    } catch (e) {
      setErr(e instanceof Response ? "Não autenticado ou erro" : String(e));
    } finally {
      setLoading(false);
    }
  }, [q, status, sortBy, sortDir, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [q, status, sortBy, sortDir]);

  const onDelete = async (id: string, nome: string) => {
    if (!confirm(`Excluir "${nome}"? O registro será arquivado (exclusão lógica) e não aparecerá nas listagens.`)) return;
    try {
      await deleteClientFn({ data: { id } });
      await fetchData();
    } catch (e) {
      alert(e instanceof Response ? ((await e.json().catch(() => null)) as { error?: string } | null)?.error ?? "Erro" : String(e));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-ink">Clientes</h1>
          <p className="text-sm text-ink-muted">Busca por nome, empresa ou e-mail. Filtros e paginação no servidor.</p>
        </div>
        <Link
          to="/admin/clientes/novo"
          className="inline-flex items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110"
        >
          <Plus className="size-4" /> Novo cliente
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl bg-surface p-3 ring-1 ring-ink/10 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome, empresa ou e-mail"
            className="w-full rounded-xl border border-ink/10 bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-ink/10 bg-background px-3 py-2 text-sm"
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={`${sortBy}:${sortDir}`}
          onChange={(e) => {
            const [a, b] = e.target.value.split(":") as [typeof sortBy, typeof sortDir];
            setSortBy(a);
            setSortDir(b);
          }}
          className="rounded-xl border border-ink/10 bg-background px-3 py-2 text-sm"
        >
          <option value="createdAt:desc">Mais recentes</option>
          <option value="createdAt:asc">Mais antigos</option>
          <option value="nome:asc">Nome A–Z</option>
          <option value="nome:desc">Nome Z–A</option>
        </select>
      </div>

      {err && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{err}</p>}

      <div className="overflow-hidden rounded-2xl bg-surface ring-1 ring-ink/10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background/60 text-left text-xs uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Empresa</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Cadastro</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                    Carregando…
                  </td>
                </tr>
              ) : !data || data.items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              ) : (
                data.items.map((c) => (
                  <tr key={c.id} className="hover:bg-background/40">
                    <td className="px-4 py-3">
                      <Link to="/admin/clientes/$id" params={{ id: c.id }} className="font-medium text-ink hover:text-terracotta">
                        {c.nome}
                      </Link>
                      {c.email ? <p className="text-xs text-ink-muted">{c.email}</p> : null}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{c.empresa ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-background px-2.5 py-1 text-xs ring-1 ring-ink/10">{c.status}</span>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{new Date(c.createdAt).toLocaleDateString("pt-BR")}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          to="/admin/clientes/$id"
                          params={{ id: c.id }}
                          className="inline-flex size-8 place-items-center justify-center rounded-xl border border-ink/10 hover:bg-background"
                          aria-label="Editar"
                        >
                          <Pencil className="size-3.5" />
                        </Link>
                        <button
                          onClick={() => onDelete(c.id, c.nome)}
                          className="inline-flex size-8 place-items-center justify-center rounded-xl border border-ink/10 text-destructive hover:bg-destructive/10"
                          aria-label="Excluir"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-ink/10 px-4 py-3 text-sm">
            <span className="text-ink-muted">
              {data.total} cliente(s) · página {page} de {data.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-full border border-ink/10 px-3 py-1.5 disabled:opacity-40"
              >
                Anterior
              </button>
              <button
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-full border border-ink/10 px-3 py-1.5 disabled:opacity-40"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
