import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { createClientFn } from "@/lib/admin/admin.server";

export const Route = createFileRoute("/admin/clientes/novo")({
  component: NovoClientePage,
});

const statusOpts = ["lead", "ativo", "inativo", "em_negociacao"] as const;

function NovoClientePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    contato: "",
    email: "",
    telefone: "",
    empresa: "",
    documento: "",
    tipo: "",
    status: "lead" as (typeof statusOpts)[number],
    servicosText: "",
    observacoes: "",
  });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const servicos = form.servicosText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await createClientFn({
        data: {
          nome: form.nome,
          contato: form.contato || null,
          email: form.email || null,
          telefone: form.telefone || null,
          empresa: form.empresa || null,
          documento: form.documento || null,
          tipo: form.tipo || null,
          status: form.status,
          servicos,
          observacoes: form.observacoes || null,
        },
      });
      navigate({ to: "/admin/clientes/$id", params: { id: res.client.id } });
    } catch (ex) {
      const msg =
        ex instanceof Response
          ? ((await ex.json().catch(() => null)) as { error?: string } | null)?.error ?? "Erro ao criar"
          : String(ex);
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  const set = (k: keyof typeof form, v: string) => setForm((s) => ({ ...s, [k]: v }));

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Novo cliente</h1>
        <Link to="/admin/clientes" className="text-sm text-ink-muted hover:text-ink">
          Voltar
        </Link>
      </div>

      {err && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{err}</p>}

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-surface p-4 ring-1 ring-ink/10 sm:p-6">
        <label className="block text-sm">
          <span className="font-medium text-ink">Nome / Empresa *</span>
          <input value={form.nome} onChange={(e) => set("nome", e.target.value)} required maxLength={120} className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-terracotta/20" />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-ink">Contato</span>
            <input value={form.contato} onChange={(e) => set("contato", e.target.value)} placeholder="Nome do responsável" className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-sm">
            <span className="text-ink">Status</span>
            <select value={form.status} onChange={(e) => set("status", e.target.value as typeof form.status)} className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm">
              {statusOpts.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-ink">E-mail</span>
            <input value={form.email} onChange={(e) => set("email", e.target.value)} type="email" className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-sm">
            <span className="text-ink">Telefone</span>
            <input value={form.telefone} onChange={(e) => set("telefone", e.target.value)} className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm" />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-ink">Empresa</span>
            <input value={form.empresa} onChange={(e) => set("empresa", e.target.value)} className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-sm">
            <span className="text-ink">CPF/CNPJ (opcional)</span>
            <input value={form.documento} onChange={(e) => set("documento", e.target.value)} className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm" />
          </label>
        </div>

        <label className="block text-sm">
          <span className="text-ink">Tipo</span>
          <input value={form.tipo} onChange={(e) => set("tipo", e.target.value)} placeholder="Ex.: recorrente, pontual" className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm" />
        </label>

        <label className="block text-sm">
          <span className="text-ink">Serviços contratados (separe por vírgula)</span>
          <input value={form.servicosText} onChange={(e) => set("servicosText", e.target.value)} placeholder="Social Media, Tráfego Pago" className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm" />
        </label>

        <label className="block text-sm">
          <span className="text-ink">Observações internas</span>
          <textarea value={form.observacoes} onChange={(e) => set("observacoes", e.target.value)} rows={4} className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm" />
        </label>

        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="rounded-full bg-terracotta px-6 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60">
            {loading ? "Salvando…" : "Cadastrar"}
          </button>
          <Link to="/admin/clientes" className="rounded-full border border-ink/10 bg-background px-6 py-2.5 text-sm font-medium">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
