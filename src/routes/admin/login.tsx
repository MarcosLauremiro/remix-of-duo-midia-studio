import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import { loginFn } from "@/lib/admin/admin.server";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await loginFn({ data: { email, password } });
      navigate({ to: "/admin/dashboard" });
    } catch (ex) {
      const msg =
        ex instanceof Response
          ? ((await ex.json().catch(() => null)) as { error?: string } | null)?.error ?? "Falha no login"
          : ex instanceof Error
            ? ex.message
            : "Falha no login";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-[1.5rem] bg-surface p-6 shadow-xl ring-1 ring-ink/10 sm:p-8">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-terracotta text-white">
            <Building2 className="size-4" />
          </span>
          <div>
            <p className="font-display text-sm font-bold leading-none text-ink">DUO, Admin</p>
            <p className="text-xs text-ink-muted">Acesso restrito</p>
          </div>
        </div>
        <h1 className="mt-6 font-display text-2xl text-ink">Entrar</h1>
        <p className="mt-1 text-sm text-ink-muted">Use o e-mail e senha do administrador.</p>

        {err && <p className="mt-4 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</p>}

        <label className="mt-6 block text-sm">
          <span className="text-ink">E-mail</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="username"
            required
            placeholder="admin@duomidea.com"
            className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm outline-none focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20"
          />
        </label>
        <label className="mt-3 block text-sm">
          <span className="text-ink">Senha</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2.5 text-sm outline-none focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-60"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          Entrar
        </button>

        <p className="mt-4 text-center text-xs text-ink-muted">
          Primeiro acesso? Defina <code>ADMIN_EMAIL</code>/<code>ADMIN_PASSWORD</code> e rode{" "}
          <code>npm run admin:create</code>.
        </p>
        <p className="mt-2 text-center text-xs">
          <Link to="/" className="text-terracotta hover:underline">
            Voltar ao site
          </Link>
        </p>
      </form>
    </div>
  );
}
