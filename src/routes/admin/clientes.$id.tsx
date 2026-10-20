import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getClientFn, updateClientFn, deleteClientFn, restoreClientFn } from "@/lib/admin/admin.server";

export const Route = createFileRoute("/admin/clientes/$id")({
  component: ClienteDetalhePage,
});

const statusOpts = ["lead", "ativo", "inativo", "em_negociacao"] as const;

function ClienteDetalhePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<null | {
    id: string;
    nome: string;
    contato: string | null;
    email: string | null;
    telefone: string | null;
    empresa: string | null;
    documento: string | null;
    tipo: string | null;
    status: string;
    servicos: string[];
    observacoes: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }>(null);
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    getClientFn({ data: { id } })
      .then((r) => {
        setData(r.client as typeof data);
        setForm({
          nome: r.client.nome ?? "",
          contato: r.client.contato ?? "",
          email: r.client.email ?? "",
          telefone: r.client.telefone ?? "",
          empresa: r.client.empresa ?? "",
          documento: r.client.documento ?? "",
          tipo: r.client.tipo ?? "",
          status: r.client.status ?? "lead",
          servicosText: (r.client.servicos ?? []).join(", "),
          observacoes: r.client.observacoes ?? "",
        });
      })
      .catch((e) => setErr(e instanceof Response ? "Não encontrado ou não autenticado" : String(e)));
  }, [id]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    setOk(null);
    try {
      const servicos = form.servicosText
        ? form.servicosText
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      const res = await updateClientFn({
        data: {
          id,
          nome: form.nome,
          contato: form.contato || null,
          email: form.email || null,
          telefone: form.telefone || null,
          empresa: form.empresa || null,
          documento: form.documento || null,
          tipo: form.tipo || null,
          status: form.status as (typeof statusOpts)[number],
          servicos,
          observacoes: form.observacoes || null,
        },
      });
      setData(res.client as typeof data);
      setOk("Salvo com sucesso.");
    } catch (ex) {
      const msg =
        ex instanceof Response
          ? ((await ex.json().catch(() => null)) as { error?: string } | null)?.error ?? "Erro ao salvar"
          : String(ex);
      setErr(msg);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!confirm(`Excluir "${data?.nome}"? Exclusão lógica, poderá ser restaurado pelo admin.`)) return;
    try {
      await deleteClientFn({ data: { id } });
      navigate({ to: "/admin/clientes" });
    } catch (ex) {
      const msg = ex instanceof Response ? ((await ex.json().catch(() => null)) as { error?: string } | null)?.error ?? "Erro" : String(ex);
      setErr(msg);
    }
  };

  const onRestore = async () => {
    try {
      await restoreClientFn({ data: { id } });
      const r = await getClientFn({ data: { id } });
      setData(r.client as typeof data);
      setOk("Restaurado.");
    } catch (ex) {
      const msg = ex instanceof Response ? ((await ex.json().catch(() => null)) as { error?: string } | null)?.error ?? "Erro" : String(ex);
      setErr(msg);
    }
  };

  if (err && !data) return <p className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{err}</p>;
  if (!data) return <p className="text-sm text-ink-muted">Carregando…</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-ink">{data.nome}</h1>
        <Link to="/admin/clientes" className="text-sm text-ink-muted hover:text-ink">
          Voltar
        </Link>
      </div>

      <div className="rounded-2xl bg-surface p-4 ring-1 ring-ink/10">
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-ink-muted">Status</dt>
            <dd className="font-medium">{data.status}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Contato</dt>
            <dd>{data.contato ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">E-mail</dt>
            <dd>{data.email ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Telefone</dt>
            <dd>{data.telefone ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Empresa</dt>
            <dd>{data.empresa ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Serviços</dt>
            <dd>{data.servicos.length ? data.servicos.join(", ") : "-"}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Cadastro</dt>
            <dd>{new Date(data.createdAt).toLocaleString("pt-BR")}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Atualização</dt>
            <dd>{new Date(data.updatedAt).toLocaleString("pt-BR")}</dd>
          </div>
        </dl>
        {data.deletedAt && <p className="mt-3 rounded-xl bg-amber-500/10 p-2 text-sm text-amber-700">Arquivado em {new Date(data.deletedAt).toLocaleString("pt-BR")}</p>}
        <p className="mt-3 text-xs text-ink-muted">Área preparada para futuras abas: contratos, arquivos, histórico, projetos.</p>
      </div>

      {err && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{err}</p>}
      {ok && <p className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-700">{ok}</p>}

      <form onSubmit={onSave} className="space-y-3 rounded-2xl bg-surface p-4 ring-1 ring-ink/10 sm:p-6">
        <h2 className="font-display text-lg text-ink">Editar</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-ink">Nome *</span>
            <input value={form.nome ?? ""} onChange={(e) => setForm((s) => ({ ...s, nome: e.target.value }))} className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-sm">
            <span className="text-ink">Status</span>
            <select value={form.status ?? "lead"} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))} className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm">
              {statusOpts.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-ink">Contato</span>
            <input value={form.contato ?? ""} onChange={(e) => setForm((s) => ({ ...s, contato: e.target.value }))} className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-sm">
            <span className="text-ink">E-mail</span>
            <input value={form.email ?? ""} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-sm">
            <span className="text-ink">Telefone</span>
            <input value={form.telefone ?? ""} onChange={(e) => setForm((s) => ({ ...s, telefone: e.target.value }))} className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-sm">
            <span className="text-ink">Empresa</span>
            <input value={form.empresa ?? ""} onChange={(e) => setForm((s) => ({ ...s, empresa: e.target.value }))} className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-sm">
            <span className="text-ink">CPF/CNPJ</span>
            <input value={form.documento ?? ""} onChange={(e) => setForm((s) => ({ ...s, documento: e.target.value }))} className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-sm">
            <span className="text-ink">Tipo</span>
            <input value={form.tipo ?? ""} onChange={(e) => setForm((s) => ({ ...s, tipo: e.target.value }))} className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm" />
          </label>
        </div>
        <label className="block text-sm">
          <span className="text-ink">Serviços (vírgula)</span>
          <input value={form.servicosText ?? ""} onChange={(e) => setForm((s) => ({ ...s, servicosText: e.target.value }))} className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm" />
        </label>
        <label className="block text-sm">
          <span className="text-ink">Observações</span>
          <textarea value={form.observacoes ?? ""} onChange={(e) => setForm((s) => ({ ...s, observacoes: e.target.value }))} rows={3} className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm" />
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={saving} className="rounded-full bg-terracotta px-6 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60">
            {saving ? "Salvando…" : "Salvar alterações"}
          </button>
          {data.deletedAt ? (
            <button type="button" onClick={onRestore} className="rounded-full border border-ink/10 bg-background px-6 py-2.5 text-sm">
              Restaurar
            </button>
          ) : (
            <button type="button" onClick={onDelete} className="rounded-full border border-destructive/20 bg-background px-6 py-2.5 text-sm text-destructive hover:bg-destructive/10">
              Arquivar cliente
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
