import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  Home,
  PlusCircle,
  ListChecks,
  Layers,
  Coins,
  FolderOpen,
  LifeBuoy,
  Sparkles,
  Menu,
  ArrowUpRight,
  Eye,
} from "lucide-react";

import postImg from "@/assets/service-post.jpg";
import storyImg from "@/assets/service-story.jpg";
import carrosselImg from "@/assets/service-carrossel.jpg";
import reelImg from "@/assets/service-reel.jpg";
import bannerImg from "@/assets/service-banner.jpg";
import emailImg from "@/assets/service-email.jpg";
import crachaImg from "@/assets/service-cracha.jpg";
import figurinhaImg from "@/assets/service-figurinha.jpg";

export const Route = createFileRoute("/")({
  component: Home_,
});

type Billing = "plano" | "creditos";

type Service = {
  name: string;
  description: string;
  category: string;
  image: string;
  billing: Billing;
  credits?: number;
};

const services: Service[] = [
  {
    name: "Post para redes sociais",
    description: "Uma arte estática pensada para o seu feed engajar mais.",
    category: "Redes Sociais",
    image: postImg,
    billing: "plano",
  },
  {
    name: "Story",
    description: "Conteúdo vertical rápido para avisos, novidades e interação.",
    category: "Redes Sociais",
    image: storyImg,
    billing: "plano",
  },
  {
    name: "Carrossel",
    description: "Sequência de artes para explicar, ensinar ou apresentar.",
    category: "Redes Sociais",
    image: carrosselImg,
    billing: "creditos",
    credits: 2,
  },
  {
    name: "Reel",
    description: "Vídeo curto editado com trilha e legendas dinâmicas.",
    category: "Audiovisual",
    image: reelImg,
    billing: "creditos",
    credits: 5,
  },
  {
    name: "Banner",
    description: "Peça horizontal para sites, e-mails e portais parceiros.",
    category: "Design e Materiais",
    image: bannerImg,
    billing: "plano",
  },
  {
    name: "Assinatura de e-mail",
    description: "Comunicação padronizada e elegante para o seu time.",
    category: "Comunicação",
    image: emailImg,
    billing: "plano",
  },
  {
    name: "Crachá",
    description: "Identificação impressa para equipe, eventos e visitas.",
    category: "Design e Materiais",
    image: crachaImg,
    billing: "plano",
  },
  {
    name: "Figurinha para WhatsApp",
    description: "Pacote de adesivos com a personalidade da sua marca.",
    category: "Comunicação",
    image: figurinhaImg,
    billing: "creditos",
    credits: 1,
  },
];

const categories = [
  "Todos",
  "Redes Sociais",
  "Design e Materiais",
  "Audiovisual",
  "Campanhas",
  "Comunicação",
  "Sites e Digital",
  "Coberturas",
  "Outros",
];

const nav = [
  { label: "Início", icon: Home, active: true },
  { label: "Nova solicitação", icon: PlusCircle },
  { label: "Minhas solicitações", icon: ListChecks },
  { label: "Meus serviços", icon: Layers },
  { label: "Créditos", icon: Coins },
  { label: "Arquivos", icon: FolderOpen },
  { label: "Ajuda", icon: LifeBuoy },
];

function BillingBadge({ billing, credits }: { billing: Billing; credits?: number }) {
  if (billing === "plano") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta-soft px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-terracotta">
        <span className="size-1.5 rounded-full bg-terracotta" />
        Incluído no plano
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-ink">
      <Coins className="size-3" />
      {credits} {credits === 1 ? "crédito" : "créditos"}
    </span>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-surface ring-1 ring-ink/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/[0.04]">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-strong">
        <img
          src={service.image}
          alt={service.name}
          loading="lazy"
          width={800}
          height={600}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <span className="eyebrow rounded-full bg-background/85 px-2.5 py-1 text-ink/70 backdrop-blur">
            {service.category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-tight text-ink">{service.name}</h3>
        </div>
        <p className="text-sm leading-relaxed text-ink-muted text-pretty">{service.description}</p>

        <div className="mt-auto flex flex-col gap-3">
          <BillingBadge billing={service.billing} credits={service.credits} />
          <div className="flex gap-2">
            <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-ink/10 bg-surface px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-strong">
              <Eye className="size-4" />
              Ver exemplo
            </button>
            <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-terracotta px-3 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm shadow-terracotta/20 transition-all hover:brightness-110">
              Solicitar
              <ArrowUpRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Home_() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const filtered = services.filter((s) => {
    const matchCat = activeCategory === "Todos" || s.category === activeCategory;
    const matchQuery = !query || s.name.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="min-h-screen bg-background text-ink">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 border-b border-ink/5 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold text-terracotta">DuoHub</span>
            <span className="hidden text-xs text-ink-muted sm:inline">by DuoMídia</span>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-ink text-background"
                      : "text-ink-muted hover:bg-surface-strong hover:text-ink"
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-terracotta-soft px-3 py-1.5 text-xs font-medium text-terracotta md:inline-flex">
              <Sparkles className="size-3.5" />
              12 créditos
            </div>
            <div className="grid size-9 place-items-center rounded-full bg-ink text-background text-xs font-semibold">
              MB
            </div>
            <button
              onClick={() => setMobileNavOpen((v) => !v)}
              className="grid size-9 place-items-center rounded-full border border-ink/10 lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="border-t border-ink/5 bg-surface lg:hidden">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-1 px-5 py-3 sm:grid-cols-3">
              {nav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className={`inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${
                      item.active
                        ? "bg-ink text-background"
                        : "text-ink-muted hover:bg-surface-strong"
                    }`}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-16">
        {/* Hero */}
        <section className="max-w-3xl">
          <p className="eyebrow mb-4">Olá, Marina</p>
          <h1 className="font-display text-4xl leading-[1.05] text-ink text-balance sm:text-5xl lg:text-6xl">
            Olá, seja bem-vindo <br className="hidden sm:block" />
            ao <span className="text-terracotta">DuoHub</span>.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted text-pretty">
            Encontre uma solução, veja exemplos e envie sua solicitação em poucos passos.
          </p>

          <div className="mt-8 max-w-2xl">
            <label className="relative block">
              <span className="sr-only">Buscar serviço</span>
              <Search className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-ink-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Do que você precisa?"
                className="h-16 w-full rounded-2xl border border-ink/10 bg-surface pl-14 pr-6 text-base text-ink shadow-sm shadow-ink/[0.03] outline-none transition-all placeholder:text-ink-muted focus:border-terracotta/40 focus:ring-4 focus:ring-terracotta/10"
              />
              <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-lg border border-ink/10 bg-background px-2 py-1 text-[10px] font-mono text-ink-muted sm:inline-flex">
                ⌘ K
              </span>
            </label>
          </div>
        </section>

        {/* Categories */}
        <section className="mt-14">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="eyebrow">Categorias</h2>
            <span className="text-xs text-ink-muted">{filtered.length} serviços</span>
          </div>
          <div className="-mx-5 overflow-x-auto px-5 lg:mx-0 lg:px-0">
            <div className="flex gap-2 pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-ink text-background"
                      : "border border-ink/10 bg-surface text-ink-muted hover:border-ink/20 hover:text-ink"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Services grid */}
        <section className="mt-10">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl text-ink sm:text-3xl">
              Serviços mais solicitados
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((service) => (
              <ServiceCard key={service.name} service={service} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-3xl border border-dashed border-ink/15 bg-surface p-10 text-center">
              <p className="text-ink">Nenhum serviço encontrado por aqui.</p>
              <p className="mt-1 text-sm text-ink-muted">
                Tente outra palavra ou fale com a gente logo abaixo.
              </p>
            </div>
          )}
        </section>

        {/* Featured "não encontrou" card */}
        <section className="mt-16">
          <div className="relative overflow-hidden rounded-[2rem] bg-ink p-8 text-background sm:p-14">
            <div className="absolute -right-16 -top-16 size-72 rounded-full bg-terracotta/40 blur-3xl" />
            <div className="absolute -bottom-24 -left-10 size-64 rounded-full bg-ochre/20 blur-3xl" />

            <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <p className="eyebrow mb-3 text-background/60">Projeto sob medida</p>
                <h3 className="font-display text-3xl leading-tight text-background sm:text-4xl">
                  Não encontrou o que precisa?
                </h3>
                <p className="mt-3 text-base leading-relaxed text-background/70">
                  Conte pra gente o que você imagina — nossa equipe monta uma proposta
                  personalizada para o seu momento, sem complicação.
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-4 text-sm font-semibold text-accent-foreground shadow-lg shadow-terracotta/20 transition-transform hover:-translate-y-0.5">
                Conte para a gente
                <ArrowUpRight className="size-4" />
              </button>
            </div>
          </div>
        </section>

        <footer className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-ink/10 pt-8 text-sm text-ink-muted sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} DuoMídia · Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-ink">
              Sobre
            </a>
            <a href="#" className="hover:text-ink">
              Privacidade
            </a>
            <a href="#" className="hover:text-ink">
              Contato
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
