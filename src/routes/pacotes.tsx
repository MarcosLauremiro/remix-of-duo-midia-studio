import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, CreditCard, QrCode, X } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";

export const Route = createFileRoute("/pacotes")({
  head: () => ({
    meta: [
      { title: "Pacotes de créditos — DUO | Mídia & Studio" },
      { name: "description", content: "Compre pacotes de créditos e serviços avulsos da DUO | Mídia & Studio." },
      { property: "og:title", content: "Pacotes de créditos — DUO | Mídia & Studio" },
      { property: "og:description", content: "Compre pacotes de créditos e serviços avulsos da DUO | Mídia & Studio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Pacotes,
});

type Item = { id: string; nome: string; preco: number; creditos: number; itens: string[]; destaque?: boolean };

const pacotes: Item[] = [
  { id: "start", nome: "Pacote Start", preco: 490, creditos: 10, itens: ["10 créditos", "Ideal para posts e stories", "Validade de 3 meses"] },
  { id: "pro", nome: "Pacote Presença", preco: 1190, creditos: 30, itens: ["30 créditos", "Posts, carrosséis e reels", "Validade de 6 meses"], destaque: true },
  { id: "max", nome: "Pacote Marca Forte", preco: 2890, creditos: 80, itens: ["80 créditos", "Campanhas completas", "Validade de 12 meses"] },
];

const avulsos: Item[] = [
  { id: "post", nome: "Post para redes sociais", preco: 60, creditos: 1, itens: [] },
  { id: "reel", nome: "Reel editado", preco: 250, creditos: 4, itens: [] },
  { id: "cracha", nome: "Crachás e credenciais", preco: 180, creditos: 3, itens: [] },
];

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function Pacotes() {
  const nav = useNavigate();
  const [sel, setSel] = useState<Item | null>(null);
  const [metodo, setMetodo] = useState<"pix" | "cartao">("pix");
  const [pago, setPago] = useState(false);

  function pagar() {
    if (!sel) return;
    const atual = Number(localStorage.getItem("duo-demo-creditos") ?? "12");
    localStorage.setItem("duo-demo-creditos", String(atual + sel.creditos));
    setPago(true);
  }

  return (
    <div className="min-h-screen bg-background text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-14">
        <p className="eyebrow mb-3">Demonstração</p>
        <h1 className="font-display text-4xl sm:text-5xl">Pacotes de créditos</h1>
        <p className="mt-4 max-w-2xl text-ink-muted">
          Escolha um pacote ou um serviço avulso. Cada serviço usa alguns créditos. Valores fictícios.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {pacotes.map((p) => (
            <div key={p.id} className={`rounded-2xl border p-6 ${p.destaque ? "border-terracotta/60 bg-surface-strong" : "border-ink/10 bg-surface"}`}>
              {p.destaque && <span className="mb-3 inline-block rounded-full bg-terracotta px-3 py-1 text-[11px] font-semibold text-primary-foreground">Mais escolhido</span>}
              <h2 className="text-lg font-semibold">{p.nome}</h2>
              <p className="mt-2 font-display text-3xl">{brl(p.preco)}</p>
              <ul className="mt-4 space-y-2 text-sm text-ink-muted">
                {p.itens.map((i) => <li key={i} className="flex gap-2"><Check className="size-4 text-terracotta" />{i}</li>)}
              </ul>
              <button onClick={() => { setSel(p); setPago(false); }} className="mt-6 w-full rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-primary-foreground">Comprar</button>
            </div>
          ))}
        </div>

        <h2 className="eyebrow mb-4 mt-14">Serviços avulsos</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {avulsos.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-2xl border border-ink/10 bg-surface p-5">
              <div>
                <p className="text-sm font-semibold">{a.nome}</p>
                <p className="text-sm text-ink-muted">{brl(a.preco)}</p>
              </div>
              <button onClick={() => { setSel(a); setPago(false); }} className="rounded-full border border-ink/20 px-4 py-2 text-sm hover:bg-surface-strong">Comprar</button>
            </div>
          ))}
        </div>
      </main>

      {sel && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-5 backdrop-blur">
          <div className="relative w-full max-w-md rounded-2xl border border-ink/10 bg-surface p-6">
            <button onClick={() => setSel(null)} className="absolute right-4 top-4 text-ink-muted"><X className="size-5" /></button>
            {!pago ? (
              <>
                <p className="eyebrow">Finalizar compra</p>
                <h3 className="mt-2 text-xl font-semibold">{sel.nome}</h3>
                <p className="mt-1 font-display text-3xl">{brl(sel.preco)}</p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {([["pix", "Pix", QrCode], ["cartao", "Cartão", CreditCard]] as const).map(([id, l, I]) => (
                    <button key={id} onClick={() => setMetodo(id)} className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm ${metodo === id ? "border-terracotta bg-surface-strong" : "border-ink/10"}`}>
                      <I className="size-4" />{l}
                    </button>
                  ))}
                </div>
                <button onClick={pagar} className="mt-6 w-full rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-primary-foreground">Pagar {brl(sel.preco)}</button>
                <p className="mt-3 text-center text-xs text-ink-muted">Demonstração — nenhum valor é cobrado.</p>
              </>
            ) : (
              <div className="text-center">
                <Check className="mx-auto size-12 text-terracotta" />
                <h3 className="mt-3 text-xl font-semibold">Pagamento aprovado!</h3>
                <p className="mt-2 text-ink-muted">{sel.creditos} créditos foram adicionados ao seu painel.</p>
                <button onClick={() => nav({ to: "/painel-cliente" })} className="mt-6 w-full rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-primary-foreground">Ir para o meu painel</button>
              </div>
            )}
          </div>
        </div>
      )}
      <SiteFooter />
    </div>
  );
}
