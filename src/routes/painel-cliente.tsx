import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  PlusCircle,
  ListChecks,
  Layers,
  Coins,
  FolderOpen,
  LifeBuoy,
  Search,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Loader2,
  FileText,
  Image as ImageIcon,
  Video,
  Download,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";

export const Route = createFileRoute("/painel-cliente")({
  head: () => ({
    meta: [
      { title: "Painel do cliente — DUO | Mídia & Studio" },
      {
        name: "description",
        content:
          "Solicite serviços, acompanhe pedidos, veja seus créditos e baixe seus arquivos em um só lugar.",
      },
      { property: "og:title", content: "Painel do cliente — DUO | Mídia & Studio" },
      {
        property: "og:description",
        content:
          "Solicite serviços, acompanhe pedidos, veja seus créditos e baixe seus arquivos em um só lugar.",
      },
    ],
  }),
  component: PainelCliente,
});

const acoes = [
  {
    id: "nova",
    label: "Nova solicitação",
    icon: PlusCircle,
    desc: "Peça uma arte, vídeo ou material em poucos passos.",
  },
  {
    id: "solicitacoes",
    label: "Minhas solicitações",
    icon: ListChecks,
    desc: "Acompanhe o andamento de tudo o que você pediu.",
  },
  {
    id: "servicos",
    label: "Meus serviços",
    icon: Layers,
    desc: "Veja o que está incluído no seu plano atual.",
  },
  { id: "creditos", label: "Créditos", icon: Coins, desc: "Consulte e use o seu saldo do mês." },
  {
    id: "arquivos",
    label: "Arquivos",
    icon: FolderOpen,
    desc: "Baixe as entregas finalizadas quando quiser.",
  },
  { id: "ajuda", label: "Ajuda", icon: LifeBuoy, desc: "Fale com a equipe e tire suas dúvidas." },
] as const;

type AcaoId = (typeof acoes)[number]["id"];

const pedidos = [
  { titulo: "Post de aniversário da loja", status: "Em produção", prazo: "Entrega em 2 dias" },
  { titulo: "Reel dos bastidores do evento", status: "Em revisão", prazo: "Entrega amanhã" },
  { titulo: "Banner da campanha de verão", status: "Concluído", prazo: "Entregue ontem" },
  { titulo: "Assinatura de e-mail do time", status: "Concluído", prazo: "Entregue há 4 dias" },
];

const meusServicos = [
  { nome: "Post para redes sociais", info: "8 de 12 usados no mês", plano: true },
  { nome: "Story", info: "5 de 10 usados no mês", plano: true },
  { nome: "Carrossel", info: "2 créditos por peça", plano: false },
  { nome: "Reel", info: "5 créditos por vídeo", plano: false },
  { nome: "Banner", info: "Incluído no plano", plano: true },
  { nome: "Cobertura de evento", info: "Sob consulta", plano: false },
];

const arquivos = [
  { nome: "Campanha de verão — artes finais", tipo: "Imagens", icon: ImageIcon, data: "12 jul" },
  { nome: "Reel bastidores Motoshow", tipo: "Vídeo", icon: Video, data: "04 jul" },
  { nome: "Manual da marca", tipo: "Documento", icon: FileText, data: "22 jun" },
  { nome: "Fotos do evento Lady Velvet", tipo: "Imagens", icon: ImageIcon, data: "15 jun" },
];

const perguntas = [
  {
    q: "Como faço um pedido?",
    a: "Clique em “Nova solicitação”, escolha o que você precisa e conte em poucas palavras o que imagina. A equipe cuida do resto.",
  },
  {
    q: "Quanto tempo leva?",
    a: "Peças simples ficam prontas em até 2 dias úteis. Vídeos e campanhas levam um pouco mais e o prazo aparece no seu pedido.",
  },
  {
    q: "O que são créditos?",
    a: "São as unidades usadas em serviços que não estão inclusos no seu plano. Você acompanha o saldo aqui mesmo, no painel.",
  },
  {
    q: "Posso pedir ajustes?",
    a: "Sim. Cada entrega tem uma rodada de ajustes inclusa — é só responder na própria solicitação.",
  },
];

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { cls: string; Icon: typeof Clock }> = {
    "Em produção": { cls: "bg-ochre/15 text-ochre", Icon: Loader2 },
    "Em revisão": { cls: "bg-terracotta-soft text-terracotta", Icon: Clock },
    Concluído: { cls: "bg-ink/10 text-ink", Icon: CheckCircle2 },
  };
  const { cls, Icon } = map[status] ?? map["Concluído"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${cls}`}
    >
      <Icon className="size-3" />
      {status}
    </span>
  );
}

function PainelCliente() {
  const [aba, setAba] = useState<AcaoId>("nova");
  const [busca, setBusca] = useState("");

  return (
    <div className="min-h-screen bg-background text-ink">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        <p className="eyebrow mb-3">Bem-vindo ao seu painel</p>
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
          Painel do cliente
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
          Tudo o que você precisa em um só lugar: peça um serviço, acompanhe o andamento e baixe
          seus arquivos.
        </p>

        {/* Resumo */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Créditos disponíveis", value: "12" },
            { label: "Pedidos em andamento", value: "2" },
            { label: "Entregas neste mês", value: "9" },
          ].map((c) => (
            <div key={c.label} className="rounded-2xl border border-ink/10 bg-surface p-5">
              <p className="text-xs uppercase tracking-wider text-ink-muted">{c.label}</p>
              <p className="mt-2 font-display text-3xl text-ink">{c.value}</p>
            </div>
          ))}
        </div>

        {/* Ações */}
        <section className="mt-10">
          <h2 className="eyebrow mb-4">O que você quer fazer agora?</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {acoes.map((a) => {
              const Icon = a.icon;
              const ativo = aba === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => setAba(a.id)}
                  className={`group flex items-start gap-3 rounded-2xl border p-5 text-left transition-all ${
                    ativo
                      ? "border-terracotta/50 bg-surface-strong"
                      : "border-ink/10 bg-surface hover:-translate-y-0.5 hover:border-ink/20"
                  }`}
                >
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                      ativo ? "bg-terracotta text-primary-foreground" : "bg-surface-strong text-ink"
                    }`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{a.label}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-ink-muted">
                      {a.desc}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Conteúdo da aba */}
        <section className="mt-10 rounded-3xl border border-ink/10 bg-surface p-6 sm:p-8">
          {aba === "nova" && (
            <div>
              <h3 className="font-display text-2xl text-ink">Nova solicitação</h3>
              <p className="mt-2 text-sm text-ink-muted">
                Escolha o que você precisa e conte em poucas palavras o que imagina.
              </p>
              <label className="relative mt-6 block max-w-xl">
                <span className="sr-only">Do que você precisa?</span>
                <Search className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-ink-muted" />
                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Do que você precisa?"
                  className="h-14 w-full rounded-2xl border border-ink/10 bg-background pl-14 pr-5 text-base text-ink outline-none transition-all placeholder:text-ink-muted focus:border-terracotta/40 focus:ring-4 focus:ring-terracotta/10"
                />
              </label>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {meusServicos
                  .filter((s) => s.nome.toLowerCase().includes(busca.toLowerCase()))
                  .map((s) => (
                    <div
                      key={s.nome}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-background p-4"
                    >
                      <div>
                        <p className="text-sm font-semibold text-ink">{s.nome}</p>
                        <p className="text-xs text-ink-muted">{s.info}</p>
                      </div>
                      <button className="inline-flex items-center gap-1 rounded-full bg-terracotta px-3.5 py-2 text-xs font-semibold text-primary-foreground">
                        Solicitar
                        <ArrowUpRight className="size-3.5" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {aba === "solicitacoes" && (
            <div>
              <h3 className="font-display text-2xl text-ink">Minhas solicitações</h3>
              <ul className="mt-6 divide-y divide-ink/10">
                {pedidos.map((p) => (
                  <li
                    key={p.titulo}
                    className="flex flex-wrap items-center justify-between gap-3 py-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink">{p.titulo}</p>
                      <p className="text-xs text-ink-muted">{p.prazo}</p>
                    </div>
                    <StatusPill status={p.status} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {aba === "servicos" && (
            <div>
              <h3 className="font-display text-2xl text-ink">Meus serviços</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {meusServicos.map((s) => (
                  <div key={s.nome} className="rounded-2xl border border-ink/10 bg-background p-5">
                    <p className="text-sm font-semibold text-ink">{s.nome}</p>
                    <p className="mt-1 text-xs text-ink-muted">{s.info}</p>
                    <span
                      className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${
                        s.plano ? "bg-terracotta-soft text-terracotta" : "bg-ink/10 text-ink"
                      }`}
                    >
                      {s.plano ? "Incluído no plano" : "Usa créditos"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {aba === "creditos" && (
            <div>
              <h3 className="font-display text-2xl text-ink">Créditos</h3>
              <p className="mt-2 text-sm text-ink-muted">
                Seu saldo é renovado todo dia 1º. Créditos não usados acumulam por 30 dias.
              </p>
              <div className="mt-6 rounded-2xl border border-ink/10 bg-background p-6">
                <p className="text-xs uppercase tracking-wider text-ink-muted">Saldo atual</p>
                <p className="font-display text-5xl text-terracotta">12</p>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-ink/10">
                  <div className="h-full w-[60%] rounded-full bg-terracotta" />
                </div>
                <p className="mt-2 text-xs text-ink-muted">8 de 20 créditos usados neste mês</p>
              </div>
              <ul className="mt-6 divide-y divide-ink/10 text-sm">
                {[
                  { t: "Reel dos bastidores", v: "-5" },
                  { t: "Carrossel institucional", v: "-2" },
                  { t: "Recarga mensal do plano", v: "+20" },
                ].map((m) => (
                  <li key={m.t} className="flex items-center justify-between py-3">
                    <span className="text-ink">{m.t}</span>
                    <span
                      className={m.v.startsWith("+") ? "text-ochre" : "text-ink-muted"}
                    >{`${m.v} créditos`}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {aba === "arquivos" && (
            <div>
              <h3 className="font-display text-2xl text-ink">Arquivos</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {arquivos.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={f.nome}
                      className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-background p-4"
                    >
                      <span className="grid size-10 place-items-center rounded-xl bg-surface-strong text-ink">
                        <Icon className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">{f.nome}</p>
                        <p className="text-xs text-ink-muted">
                          {f.tipo} · {f.data}
                        </p>
                      </div>
                      <button
                        className="grid size-9 place-items-center rounded-full border border-ink/10 text-ink-muted hover:text-ink"
                        aria-label={`Baixar ${f.nome}`}
                      >
                        <Download className="size-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {aba === "ajuda" && (
            <div>
              <h3 className="font-display text-2xl text-ink">Ajuda</h3>
              <div className="mt-6 grid gap-3 lg:grid-cols-2">
                {perguntas.map((p) => (
                  <div key={p.q} className="rounded-2xl border border-ink/10 bg-background p-5">
                    <p className="text-sm font-semibold text-ink">{p.q}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{p.a}</p>
                  </div>
                ))}
              </div>
              <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-primary-foreground">
                Falar com a equipe
                <ArrowUpRight className="size-4" />
              </button>
            </div>
          )}
        </section>

        {/* Não encontrou */}
        <section className="mt-12">
          <div className="relative overflow-hidden rounded-[2rem] bg-surface-strong p-8 sm:p-12">
            <div className="absolute -right-16 -top-16 size-72 rounded-full bg-terracotta/25 blur-3xl" />
            <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h3 className="font-display text-3xl text-ink">Não encontrou o que precisa?</h3>
                <p className="mt-3 text-ink-muted">
                  Conte pra gente o que você imagina — montamos uma proposta sob medida.
                </p>
              </div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-4 text-sm font-semibold text-primary-foreground"
              >
                Conte para a gente
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
