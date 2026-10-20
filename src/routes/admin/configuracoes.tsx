import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/configuracoes")({
  component: ConfigPage,
});

function ConfigPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="font-display text-2xl text-ink">Configurações</h1>
      <div className="rounded-2xl bg-surface p-4 text-sm leading-relaxed text-ink-muted ring-1 ring-ink/10">
        <p>Área preparada para futuras configurações (perfil, troca de senha, integrações).</p>
        <ul className="mt-2 list-disc pl-5">
          <li>Senha com hash scrypt, nunca em texto puro.</li>
          <li>Sessão em cookie httpOnly, secure em produção, sameSite=lax.</li>
          <li>Primeiro admin via <code>ADMIN_EMAIL</code>/<code>ADMIN_PASSWORD</code> + <code>npm run admin:create</code> (sem rota pública).</li>
        </ul>
      </div>
    </div>
  );
}
