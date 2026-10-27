// Página de TESTE (temporária): cadastra um cliente só com o nome, para isolar a falha de escrita.
// Usa a mesma server function do cadastro de clientes (createClientFn). Remover depois do diagnóstico.
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { createClientFn } from "@/lib/admin/admin.server";

export const Route = createFileRoute("/admin/teste-cliente")({
  component: TesteClientePage,
});

function TesteClientePage() {
  const [nome, setNome] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setLoading(true);
    console.log("[teste-cliente] enviando", { nomeLen: nome.length });
    try {
      const res = await createClientFn({ data: { nome } });
      console.log("[teste-cliente] resposta", {
        temClient: Boolean(res?.client),
        id: res?.client?.id,
      });
      if (!res?.client) {
        console.log("[teste-cliente] resposta sem client (provável erro do servidor)", res);
        setErr("Resposta inesperada do servidor (veja o console).");
        return;
      }
      setMsg(`Cliente criado (id ${res.client.id}).`);
      setNome("");
    } catch (ex) {
      if (ex instanceof Response) {
        const body = await ex
          .clone()
          .json()
          .catch(() => null);
        console.log("[teste-cliente] falhou (HTTP)", { status: ex.status, body });
        setErr((body as { error?: string } | null)?.error ?? `Erro ${ex.status}`);
      } else {
        console.log("[teste-cliente] erro inesperado", ex);
        setErr(String(ex));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-4 p-6">
      <h1 className="font-display text-2xl text-ink">Teste: novo cliente (só nome)</h1>
      {msg && <p className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-700">{msg}</p>}
      {err && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{err}</p>}
      <form onSubmit={onSubmit} className="space-y-3 rounded-2xl bg-surface p-4 ring-1 ring-ink/10">
        <label className="block text-sm">
          <span className="text-ink">Nome *</span>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            minLength={2}
            maxLength={120}
            className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-terracotta px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Enviando…" : "Criar cliente de teste"}
        </button>
      </form>
    </div>
  );
}
