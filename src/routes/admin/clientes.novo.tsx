import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { createClientFn } from "@/lib/admin/admin.server";
import { ClienteFormFields, type ClienteFormValues } from "@/components/clientes/ClienteForm";

export const Route = createFileRoute("/admin/clientes/novo")({
  component: NovoClientePage,
});

function NovoClientePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<ClienteFormValues>({ nome: "", dataInicioContrato: "" });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await createClientFn({
        data: {
          nome: form.nome,
          dataInicioContrato: form.dataInicioContrato || null,
        },
      });
      navigate({ to: "/admin/clientes/$id", params: { id: res.client.id } });
    } catch (ex) {
      const msg =
        ex instanceof Response
          ? (((await ex.json().catch(() => null)) as { error?: string } | null)?.error ??
            "Erro ao criar")
          : String(ex);
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Novo cliente</h1>
        <Link to="/admin/clientes" className="text-sm text-ink-muted hover:text-ink">
          Voltar
        </Link>
      </div>

      {err && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{err}</p>}

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl bg-surface p-4 ring-1 ring-ink/10 sm:p-6"
      >
        <ClienteFormFields values={form} onChange={setForm} disabled={loading} />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-terracotta px-6 py-2.5 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Salvando…" : "Cadastrar"}
          </button>
          <Link
            to="/admin/clientes"
            className="rounded-full border border-ink/10 bg-background px-6 py-2.5 text-sm font-medium"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
