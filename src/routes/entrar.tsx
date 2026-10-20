import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LogIn } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar | DUO | Mídia & Studio" },
      { name: "description", content: "Acesse sua área de cliente da DUO | Mídia & Studio." },
      { property: "og:title", content: "Entrar | DUO | Mídia & Studio" },
      { property: "og:description", content: "Acesse sua área de cliente da DUO | Mídia & Studio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Entrar,
});

function Entrar() {
  const nav = useNavigate();
  const [modo, setModo] = useState<"entrar" | "criar">("entrar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem(
      "duo-demo-user",
      JSON.stringify({ nome: nome || email.split("@")[0], email }),
    );
    nav({ to: "/painel-cliente" });
  }

  return (
    <div className="min-h-screen bg-background text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-md px-5 py-16">
        <p className="eyebrow mb-3">Área do cliente</p>
        <h1 className="font-display text-4xl">{modo === "entrar" ? "Entrar" : "Criar conta"}</h1>
        <p className="mt-3 text-ink-muted">
          Versão de demonstração: qualquer e-mail e senha funcionam.
        </p>
        <form onSubmit={enviar} className="mt-8 space-y-4 rounded-2xl border border-ink/10 bg-surface p-6">
          {modo === "criar" && (
            <input required placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-xl border border-ink/10 bg-background px-4 py-3 text-sm" />
          )}
          <input required type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-ink/10 bg-background px-4 py-3 text-sm" />
          <input required type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)}
            className="w-full rounded-xl border border-ink/10 bg-background px-4 py-3 text-sm" />
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-primary-foreground">
            <LogIn className="size-4" /> {modo === "entrar" ? "Entrar" : "Criar conta"}
          </button>
          <button type="button" onClick={() => setModo(modo === "entrar" ? "criar" : "entrar")}
            className="w-full text-sm text-ink-muted hover:text-ink">
            {modo === "entrar" ? "Ainda não tem conta? Criar agora" : "Já tem conta? Entrar"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-muted">
          <Link to="/pacotes" className="underline">Ver pacotes de créditos</Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
