import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  Play,
  Youtube,
  Quote,
  Calendar,
  Newspaper,
  ExternalLink,
  ArrowRight,
  Mic,
  Headphones,
  Images,
} from "lucide-react";

import postImg from "@/assets/service-post.jpg";
import storyImg from "@/assets/service-story.jpg";
import carrosselImg from "@/assets/service-carrossel.jpg";
import reelImg from "@/assets/service-reel.jpg";
import bannerImg from "@/assets/service-banner.jpg";
import emailImg from "@/assets/service-email.jpg";
import crachaImg from "@/assets/service-cracha.jpg";
import figurinhaImg from "@/assets/service-figurinha.jpg";

import testimonial1Img from "@/assets/testimonial-1.jpg";
import testimonial2Img from "@/assets/testimonial-2.jpg";
import testimonial3Img from "@/assets/testimonial-3.jpg";
import testimonial4Img from "@/assets/testimonial-4.jpg";

import event1Img from "@/assets/event-1.jpg";
import event2Img from "@/assets/event-2.jpg";
import event3Img from "@/assets/event-3.jpg";
import event4Img from "@/assets/event-4.jpg";

import blog1Img from "@/assets/blog-1.jpg";
import blog2Img from "@/assets/blog-2.jpg";
import blog3Img from "@/assets/blog-3.jpg";
import blog4Img from "@/assets/blog-4.jpg";

import media1Img from "@/assets/media-1.jpg";
import media2Img from "@/assets/media-2.jpg";
import media3Img from "@/assets/media-3.jpg";
import media4Img from "@/assets/media-4.jpg";

import podcast1Img from "@/assets/podcast-1.jpg";
import podcast2Img from "@/assets/podcast-2.jpg";
import podcast3Img from "@/assets/podcast-3.jpg";
import podcast4Img from "@/assets/podcast-4.jpg";
import podcastGallery1 from "@/assets/podcast-gallery-1.jpg";
import podcastGallery2 from "@/assets/podcast-gallery-2.jpg";
import podcastGallery3 from "@/assets/podcast-gallery-3.jpg";

import founder1Img from "@/assets/founder-1.jpg";
import founder2Img from "@/assets/founder-2.jpg";

import clientLogo1 from "@/assets/client-logo-1.png";
import clientLogo2 from "@/assets/client-logo-2.png";
import clientLogo3 from "@/assets/client-logo-3.png";
import clientLogo4 from "@/assets/client-logo-4.png";
import clientLogo5 from "@/assets/client-logo-5.png";
import clientLogo6 from "@/assets/client-logo-6.png";
import clientLogo7 from "@/assets/client-logo-7.png";
import clientLogo8 from "@/assets/client-logo-8.png";
import clientLogo9 from "@/assets/client-logo-9.png";

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
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-surface ring-1 ring-ink/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20">
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
          <span className="eyebrow rounded-full bg-surface/85 px-2.5 py-1 text-ink/80 backdrop-blur">
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
            <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-terracotta px-3 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-terracotta/20 transition-all hover:brightness-110">
              Solicitar
              <ArrowUpRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Rotating uniform services grid (2 cols × 3 rows)                    */
/* ------------------------------------------------------------------ */

function RotatingServicesGrid({ services, visible = 6, intervalMs = 5000 }: { services: Service[]; visible?: number; intervalMs?: number }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (services.length <= visible) return;
    const id = setInterval(() => {
      setOffset((o) => (o + 2) % services.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [services.length, visible, intervalMs]);

  const window = Array.from({ length: Math.min(visible, services.length) }, (_, i) => services[(offset + i) % services.length]);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {window.map((s, i) => (
        <div key={`${s.name}-${offset}-${i}`} className="animate-fade-in">
          <ServiceCard service={s} />
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* About section — as duas fundadoras                                  */
/* ------------------------------------------------------------------ */

type Founder = {
  name: string;
  role: string;
  bio: string;
  image: string;
  accent: "terracotta" | "ochre";
};

const founders: Founder[] = [
  {
    name: "Camila Duarte",
    role: "Cofundadora · Diretora de Mídia",
    bio: "Estrategista com mais de 15 anos em campanhas de marca. Lidera a área de Mídia com um olhar afiado para audiência, veículo e resultado.",
    image: founder1Img,
    accent: "terracotta",
  },
  {
    name: "Beatriz Duarte",
    role: "Cofundadora · Diretora de Studio",
    bio: "Diretora de arte à frente do Studio. Une design, audiovisual e narrativa para dar identidade a marcas que querem ser lembradas.",
    image: founder2Img,
    accent: "ochre",
  },
];

function AboutSection() {
  return (
    <section id="quem-somos" className="mt-16 lg:mt-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <div>
          <p className="eyebrow mb-3">Quem somos</p>
          <h2 className="font-display text-3xl leading-[1.1] text-ink text-balance sm:text-4xl lg:text-5xl">
            Duas irmãs, uma agência <span className="text-terracotta">com alma</span> e um{" "}
            <span className="text-ochre">Studio</span> que respira criação.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-muted text-pretty">
            A DUO nasceu da união entre estratégia e sensibilidade. Cuidamos de cada marca como
            se fosse a nossa: com escuta, curiosidade e mão na massa. Aqui, cliente vira parceiro
            e ideia vira resultado.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 ring-1 ring-ink/10">
              <span className="size-1.5 rounded-full bg-terracotta" />
              Fundada em 2014
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 ring-1 ring-ink/10">
              <span className="size-1.5 rounded-full bg-ochre" />
              +120 marcas atendidas
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {founders.map((f) => {
            const accentText = f.accent === "terracotta" ? "text-terracotta" : "text-ochre";
            const accentBg = f.accent === "terracotta" ? "from-terracotta/30" : "from-ochre/30";
            return (
              <article
                key={f.name}
                className="group relative overflow-hidden rounded-[2rem] bg-surface ring-1 ring-ink/10 shadow-lg shadow-black/10 transition-transform hover:-translate-y-1"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-surface-strong">
                  <div className={`absolute -inset-6 -z-0 bg-gradient-to-br ${accentBg} via-transparent to-transparent blur-2xl`} />
                  <img
                    src={f.image}
                    alt={f.name}
                    loading="lazy"
                    className="relative h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                  <div className="absolute inset-x-4 bottom-4">
                    <p className={`text-[10px] font-mono uppercase tracking-[0.2em] ${accentText}`}>
                      {f.role}
                    </p>
                    <h3 className="mt-1 font-display text-xl text-ink sm:text-2xl">{f.name}</h3>
                  </div>
                </div>
                <p className="p-5 text-sm leading-relaxed text-ink-muted text-pretty">{f.bio}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Client logos — faixa rotativa 3 a 3, aplicação branca              */
/* ------------------------------------------------------------------ */

const clientLogos = [
  { name: "Aurora", src: clientLogo1 },
  { name: "Verano", src: clientLogo2 },
  { name: "Nortex", src: clientLogo3 },
  { name: "Solvia", src: clientLogo4 },
  { name: "Kova", src: clientLogo5 },
  { name: "Marévia", src: clientLogo6 },
  { name: "Fértil", src: clientLogo7 },
  { name: "Orbe", src: clientLogo8 },
  { name: "Lumen", src: clientLogo9 },
];

function ClientLogosStrip() {
  const [offset, setOffset] = useState(0);
  const step = 3;

  useEffect(() => {
    const id = setInterval(() => {
      setOffset((o) => (o + step) % clientLogos.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const visible = Array.from({ length: step }, (_, i) => clientLogos[(offset + i) % clientLogos.length]);

  return (
    <section className="mt-16 lg:mt-20">
      <div className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-gradient-to-r from-surface via-surface-strong to-surface px-6 py-8 sm:px-10 sm:py-10">
        <div className="absolute -left-16 top-1/2 size-40 -translate-y-1/2 rounded-full bg-terracotta/15 blur-3xl" />
        <div className="absolute -right-16 top-1/2 size-40 -translate-y-1/2 rounded-full bg-ochre/15 blur-3xl" />

        <div className="relative grid gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] md:items-center">
          <div>
            <p className="eyebrow mb-2">Marcas que confiam na DUO</p>
            <h2 className="font-display text-xl leading-tight text-ink sm:text-2xl">
              Uma seleção rotativa dos <span className="text-terracotta">nossos clientes</span>.
            </h2>
          </div>

          <div
            key={offset}
            className="grid animate-fade-in grid-cols-3 items-center gap-6 sm:gap-10"
          >
            {visible.map((logo) => (
              <div key={`${logo.name}-${offset}`} className="flex items-center justify-center">
                <img
                  src={logo.src}
                  alt={logo.name}
                  loading="lazy"
                  className="h-10 w-auto max-w-full object-contain opacity-80 transition-opacity hover:opacity-100 sm:h-12"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-6 flex items-center justify-center gap-1.5">
          {Array.from({ length: Math.ceil(clientLogos.length / step) }).map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === Math.floor(offset / step) ? "w-8 bg-terracotta" : "w-3 bg-ink/15"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ID da playlist pública do YouTube da DuoMídia — troque aqui quando quiser.
const YOUTUBE_PLAYLIST_ID = "PLrEnWoR732-DE0Nyx-6JIC-oow0nyPQmR";

function VideoHero() {
  const embedSrc = `https://www.youtube-nocookie.com/embed/videoseries?list=${YOUTUBE_PLAYLIST_ID}&rel=0&modestbranding=1`;
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-ochre/20 via-terracotta/10 to-transparent blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] bg-surface ring-1 ring-ink/10 shadow-2xl shadow-black/20">
        <div className="flex items-center justify-between gap-3 px-5 py-3 text-ink/90">
          <div className="flex items-center gap-2">
            <Youtube className="size-4 text-terracotta" />
            <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-ink-muted">
              DuoMídia · Playlist
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta/10 px-2.5 py-1 text-[10px] font-medium text-terracotta">
            <span className="size-1.5 rounded-full bg-terracotta animate-pulse" />
            Ao vivo no canal
          </span>
        </div>
        <div className="relative aspect-video w-full bg-background">
          <iframe
            src={embedSrc}
            title="Playlist DuoMídia no YouTube"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <p className="text-sm text-ink-muted">
            Cases, bastidores e novidades da DuoMídia &amp; Studio.
          </p>
          <a
            href={`https://www.youtube.com/playlist?list=${YOUTUBE_PLAYLIST_ID}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-sm shadow-terracotta/30 transition-transform hover:-translate-y-0.5"
          >
            <Play className="size-3.5 fill-current" />
            Ver playlist
          </a>
        </div>
      </div>
    </div>
  );
}

function useRotator<T>(items: T[], interval = 4500) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (items.length <= 1 || paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, interval);
    return () => clearInterval(id);
  }, [items.length, paused, interval]);

  useEffect(() => {
    setIndex(0);
  }, [items]);

  const featured = items[Math.min(index, items.length - 1)];
  const others = items.filter((_, i) => i !== index);

  return {
    index,
    setIndex,
    featured,
    others,
    pause: () => setPaused(true),
    resume: () => setPaused(false),
  };
}

function ProgressDots({ count, index }: { count: number; index: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`h-1 rounded-full transition-all ${
            i === index ? "w-8 bg-terracotta" : "w-3 bg-ink/15"
          }`}
        />
      ))}
    </div>
  );
}

function FeaturedRotator({ services }: { services: Service[] }) {
  const { index, setIndex, featured, others, pause, resume } = useRotator(services);

  return (
    <div
      className="grid gap-5 lg:grid-cols-[1.35fr_1fr]"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* Featured card */}
      <article
        key={featured.name}
        className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-surface ring-1 ring-ink/10 shadow-lg shadow-black/10 animate-fade-in"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-strong sm:aspect-[16/9]">
          <img
            src={featured.image}
            alt={featured.name}
            className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          <div className="absolute left-5 top-5 flex items-center gap-2">
            <span className="eyebrow rounded-full bg-surface/90 px-2.5 py-1 text-ink/80 backdrop-blur">
              {featured.category}
            </span>
            <span className="rounded-full bg-terracotta px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
              Destaque
            </span>
          </div>
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-ink">
            <div>
              <h3 className="font-display text-2xl leading-tight sm:text-3xl">{featured.name}</h3>
              <p className="mt-2 max-w-md text-sm text-ink/85 text-pretty">{featured.description}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <BillingBadge billing={featured.billing} credits={featured.credits} />
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-xl border border-ink/10 bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-strong">
              <Eye className="size-4" />
              Ver exemplo
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-xl bg-terracotta px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-terracotta/20 transition-all hover:brightness-110">
              Solicitar
              <ArrowUpRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="px-5 pb-5">
          <ProgressDots count={services.length} index={index} />
        </div>
      </article>

      {/* Thumbnail rail */}
      <div className="flex flex-col gap-3">
        <p className="eyebrow">Também disponíveis</p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
          {others.map((s) => {
            const originalIndex = services.findIndex((x) => x.name === s.name);
            return (
              <li key={s.name}>
                <button
                  onClick={() => setIndex(originalIndex)}
                  className="group flex w-full flex-col gap-2 rounded-2xl bg-surface p-2 text-left ring-1 ring-ink/10 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/10 hover:ring-terracotta/30"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-strong">
                    <img
                      src={s.image}
                      alt={s.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {s.billing === "creditos" && (
                      <span className="absolute right-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-surface/90 px-1.5 py-0.5 text-[9px] font-semibold text-ink backdrop-blur">
                        <Coins className="size-2.5" />
                        {s.credits}
                      </span>
                    )}
                  </div>
                  <div className="px-1 pb-1">
                    <p className="line-clamp-1 text-sm font-medium text-ink">{s.name}</p>
                    <p className="text-[11px] text-ink-muted">{s.category}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                       */
/* ------------------------------------------------------------------ */

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  image: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "A DuoMídia transformou a forma como nos comunicamos. Em poucos dias nosso feed ganhou vida e os resultados apareceram.",
    name: "Mariana Ribeiro",
    role: "Diretora de Marketing, VivaBem",
    image: testimonial1Img,
  },
  {
    quote:
      "Profissionalismo, criatividade e pontualidade. É raro encontrar um time que entrega tudo isso junto.",
    name: "Ricardo Almeida",
    role: "CEO, Construtora Horizonte",
    image: testimonial2Img,
  },
  {
    quote:
      "O DuoHub facilitou demais nosso dia a dia. Peço uma arte, acompanho tudo e recebo prontinho para publicar.",
    name: "Juliana Costa",
    role: "Gestora de Redes, TechFlow",
    image: testimonial3Img,
  },
  {
    quote:
      "A cobertura do nosso evento ficou impecável. Fotos, vídeos e conteúdo para redes saíram no mesmo dia.",
    name: "Fernando Moura",
    role: "Fundador, Summit Brasil",
    image: testimonial4Img,
  },
];

function TestimonialRotator({ items }: { items: Testimonial[] }) {
  const { index, setIndex, featured, others, pause, resume } = useRotator(items);

  return (
    <div
      className="grid gap-5 lg:grid-cols-[1.35fr_1fr]"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <article
        key={featured.name}
        className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-surface p-6 ring-1 ring-ink/10 shadow-lg shadow-black/10 animate-fade-in sm:p-10"
      >
        <div className="absolute right-6 top-6 text-terracotta/20">
          <Quote className="size-16 fill-current" />
        </div>

        <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-center">
          <div className="shrink-0">
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-terracotta/30 to-ochre/20 blur-lg" />
              <img
                src={featured.image}
                alt={featured.name}
                width={160}
                height={160}
                className="relative size-28 rounded-full object-cover ring-4 ring-surface-strong sm:size-40"
              />
            </div>
          </div>
          <div>
            <p className="font-display text-xl leading-relaxed text-ink text-pretty sm:text-2xl">
              “{featured.quote}”
            </p>
            <div className="mt-6">
              <p className="font-semibold text-ink">{featured.name}</p>
              <p className="text-sm text-ink-muted">{featured.role}</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-8">
          <ProgressDots count={items.length} index={index} />
        </div>
      </article>

      <div className="flex flex-col gap-3">
        <p className="eyebrow">Mais depoimentos</p>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {others.map((t) => {
            const originalIndex = items.findIndex((x) => x.name === t.name);
            return (
              <li key={t.name}>
                <button
                  onClick={() => setIndex(originalIndex)}
                  className="group flex w-full items-center gap-4 rounded-2xl bg-surface p-3 text-left ring-1 ring-ink/10 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/10 hover:ring-terracotta/30"
                >
                  <img
                    src={t.image}
                    alt={t.name}
                    width={64}
                    height={64}
                    className="size-14 rounded-full object-cover ring-2 ring-surface-strong"
                  />
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-sm font-semibold text-ink">{t.name}</p>
                    <p className="line-clamp-1 text-xs text-ink-muted">{t.role}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Events gallery                                                     */
/* ------------------------------------------------------------------ */

type EventItem = {
  title: string;
  date: string;
  description: string;
  image: string;
};

const events: EventItem[] = [
  {
    title: "Conferência Anual de Inovação",
    date: "15 Mar 2026",
    description: "Palestras, painéis e networking com os principais líderes do setor.",
    image: event1Img,
  },
  {
    title: "Coquetel de Lançamento",
    date: "28 Fev 2026",
    description: "Noite de celebração com clientes e parceiros no rooftop da cidade.",
    image: event2Img,
  },
  {
    title: "Bastidores da Campanha",
    date: "10 Jan 2026",
    description: "Um olhar exclusivo sobre a produção do último filme da marca.",
    image: event3Img,
  },
  {
    title: "Workshop de Estratégia",
    date: "05 Dez 2025",
    description: "Dia imersivo de planejamento criativo com o time e clientes.",
    image: event4Img,
  },
];

function EventRotator({ items }: { items: EventItem[] }) {
  const { index, setIndex, featured, others, pause, resume } = useRotator(items);

  return (
    <div
      className="grid gap-5 lg:grid-cols-[1.35fr_1fr]"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <article
        key={featured.title}
        className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-surface ring-1 ring-ink/10 shadow-lg shadow-black/10 animate-fade-in"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-strong sm:aspect-[16/9]">
          <img
            src={featured.image}
            alt={featured.title}
            className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          <div className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-surface/90 px-3 py-1.5 text-xs font-medium text-ink backdrop-blur">
            <Calendar className="size-3.5 text-terracotta" />
            {featured.date}
          </div>
          <div className="absolute inset-x-5 bottom-5">
            <h3 className="font-display text-2xl leading-tight text-ink sm:text-3xl">
              {featured.title}
            </h3>
            <p className="mt-2 max-w-md text-sm text-ink/85 text-pretty">{featured.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <ProgressDots count={items.length} index={index} />
          <button className="inline-flex items-center gap-1.5 rounded-xl bg-terracotta px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-terracotta/20 transition-all hover:brightness-110">
            Ver galeria
            <ArrowUpRight className="size-4" />
          </button>
        </div>
      </article>

      <div className="flex flex-col gap-3">
        <p className="eyebrow">Próximos e recentes</p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
          {others.map((e) => {
            const originalIndex = items.findIndex((x) => x.title === e.title);
            return (
              <li key={e.title}>
                <button
                  onClick={() => setIndex(originalIndex)}
                  className="group flex w-full flex-col gap-2 rounded-2xl bg-surface p-2 text-left ring-1 ring-ink/10 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/10 hover:ring-terracotta/30"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-strong">
                    <img
                      src={e.image}
                      alt={e.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="px-1 pb-1">
                    <p className="line-clamp-1 text-sm font-medium text-ink">{e.title}</p>
                    <p className="text-[11px] text-ink-muted">{e.date}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Blog                                                               */
/* ------------------------------------------------------------------ */

type BlogPost = {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
};

const blogPosts: BlogPost[] = [
  {
    title: "5 tendências de conteúdo para 2026",
    excerpt:
      "O que está em alta nas redes sociais e como sua marca pode aproveitar cada formato sem perder a essência.",
    date: "08 Jul 2026",
    readTime: "4 min",
    image: blog1Img,
  },
  {
    title: "Como criar artes que convertem",
    excerpt:
      "Do primeiro rascunho à publicação: elementos visuais que realmente movem o público a agir.",
    date: "22 Jun 2026",
    readTime: "6 min",
    image: blog2Img,
  },
  {
    title: "Métricas que importam no digital",
    excerpt:
      "Engajamento, alcance, conversão: entenda quais números acompanhar e por quê.",
    date: "10 Jun 2026",
    readTime: "5 min",
    image: blog3Img,
  },
  {
    title: "O poder da cocriação com clientes",
    excerpt:
      "Por que os melhores resultados saem quando marca e agência caminham juntas desde o início.",
    date: "01 Jun 2026",
    readTime: "3 min",
    image: blog4Img,
  },
];

function BlogRotator({ items }: { items: BlogPost[] }) {
  const { index, setIndex, featured, others, pause, resume } = useRotator(items);

  return (
    <div
      className="grid gap-5 lg:grid-cols-[1.35fr_1fr]"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <article
        key={featured.title}
        className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-surface ring-1 ring-ink/10 shadow-lg shadow-black/10 animate-fade-in"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-strong sm:aspect-[16/9]">
          <img
            src={featured.image}
            alt={featured.title}
            className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          <div className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-surface/90 px-3 py-1.5 text-xs font-medium text-ink backdrop-blur">
            <Newspaper className="size-3.5 text-terracotta" />
            {featured.date} · {featured.readTime}
          </div>
          <div className="absolute inset-x-5 bottom-5">
            <h3 className="font-display text-2xl leading-tight text-ink sm:text-3xl">
              {featured.title}
            </h3>
            <p className="mt-2 max-w-lg text-sm text-ink/85 text-pretty">{featured.excerpt}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <ProgressDots count={items.length} index={index} />
          <button className="inline-flex items-center gap-1.5 rounded-xl bg-terracotta px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-terracotta/20 transition-all hover:brightness-110">
            Ler artigo
            <ArrowRight className="size-4" />
          </button>
        </div>
      </article>

      <div className="flex flex-col gap-3">
        <p className="eyebrow">Outras leituras</p>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {others.map((b) => {
            const originalIndex = items.findIndex((x) => x.title === b.title);
            return (
              <li key={b.title}>
                <button
                  onClick={() => setIndex(originalIndex)}
                  className="group flex w-full items-center gap-4 rounded-2xl bg-surface p-3 text-left ring-1 ring-ink/10 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/10 hover:ring-terracotta/30"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-surface-strong">
                    <img
                      src={b.image}
                      alt={b.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-semibold text-ink">{b.title}</p>
                    <p className="mt-1 text-[11px] text-ink-muted">{b.date}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Media / press clips                                                */
/* ------------------------------------------------------------------ */

type MediaClip = {
  title: string;
  outlet: string;
  type: string;
  image: string;
  url: string;
};

const mediaClips: MediaClip[] = [
  {
    title: "Como marcas pequenas conquistam grandes audiências",
    outlet: "Exame",
    type: "Reportagem",
    image: media1Img,
    url: "https://exame.com",
  },
  {
    title: "Campanha viral da DuoMídia alcança milhões nas redes",
    outlet: "Meio & Mensagem",
    type: "Mídia",
    image: media2Img,
    url: "https://meioemensagem.com.br",
  },
  {
    title: "A nova era da comunicação integrada",
    outlet: "Revista Propaganda",
    type: "Matéria",
    image: media3Img,
    url: "https://revistapropaganda.com.br",
  },
  {
    title: "Entrevista: o futuro do marketing no Brasil",
    outlet: "Band News",
    type: "TV",
    image: media4Img,
    url: "https://bandnews.com.br",
  },
];

function MediaRotator({ items }: { items: MediaClip[] }) {
  const { index, setIndex, featured, others, pause, resume } = useRotator(items);

  return (
    <div
      className="grid gap-5 lg:grid-cols-[1.35fr_1fr]"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <article
        key={featured.title}
        className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-surface ring-1 ring-ink/10 shadow-lg shadow-black/10 animate-fade-in"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-strong sm:aspect-[16/9]">
          <img
            src={featured.image}
            alt={featured.title}
            className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          <div className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-surface/90 px-3 py-1.5 text-xs font-medium text-ink backdrop-blur">
            <ExternalLink className="size-3.5 text-terracotta" />
            {featured.outlet} · {featured.type}
          </div>
          <div className="absolute inset-x-5 bottom-5">
            <h3 className="font-display text-2xl leading-tight text-ink sm:text-3xl">
              {featured.title}
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <ProgressDots count={items.length} index={index} />
          <a
            href={featured.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-terracotta px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-terracotta/20 transition-all hover:brightness-110"
          >
            Abrir matéria
            <ExternalLink className="size-4" />
          </a>
        </div>
      </article>

      <div className="flex flex-col gap-3">
        <p className="eyebrow">Na mídia</p>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {others.map((m) => {
            const originalIndex = items.findIndex((x) => x.title === m.title);
            return (
              <li key={m.title}>
                <button
                  onClick={() => setIndex(originalIndex)}
                  className="group flex w-full items-center gap-4 rounded-2xl bg-surface p-3 text-left ring-1 ring-ink/10 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/10 hover:ring-terracotta/30"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-surface-strong">
                    <img
                      src={m.image}
                      alt={m.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-semibold text-ink">{m.title}</p>
                    <p className="mt-1 text-[11px] text-ink-muted">{m.outlet}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Podcasts                                                           */
/* ------------------------------------------------------------------ */

type Podcast = {
  title: string;
  guest: string;
  episode: string;
  duration: string;
  description: string;
  cover: string;
  reelId: string; // YouTube video ID (Shorts-friendly)
  gallery: string[];
};

const podcasts: Podcast[] = [
  {
    title: "Criatividade que vende sem gritar",
    guest: "com Marina Bastos",
    episode: "EP 24",
    duration: "38 min",
    description:
      "Um bate-papo sobre como marcas conquistam atenção com sutileza, storytelling e consistência — sem depender de fórmulas prontas.",
    cover: podcast1Img,
    reelId: "dQw4w9WgXcQ",
    gallery: [podcastGallery1, podcastGallery2, podcastGallery3],
  },
  {
    title: "Bastidores de uma campanha nacional",
    guest: "com Rafael Prado",
    episode: "EP 23",
    duration: "42 min",
    description:
      "Do briefing ao ar: como nasce uma campanha que roda em TV, redes e ponto de venda ao mesmo tempo.",
    cover: podcast2Img,
    reelId: "M7lc1UVf-VE",
    gallery: [podcastGallery2, podcastGallery3, podcastGallery1],
  },
  {
    title: "O novo consumidor brasileiro",
    guest: "com Ana e Léo Duarte",
    episode: "EP 22",
    duration: "35 min",
    description:
      "Pesquisas, comportamentos e tendências que estão mudando a forma de comprar e se relacionar com marcas.",
    cover: podcast3Img,
    reelId: "ScMzIvxBSi4",
    gallery: [podcastGallery3, podcastGallery1, podcastGallery2],
  },
  {
    title: "Rir também é estratégia",
    guest: "com Diego Nunes",
    episode: "EP 21",
    duration: "29 min",
    description:
      "Humor bem usado gera memória e afeto. Conversamos sobre o limite entre a graça e a mensagem certa.",
    cover: podcast4Img,
    reelId: "aqz-KE-bpKQ",
    gallery: [podcastGallery1, podcastGallery3, podcastGallery2],
  },
];

function PodcastRotator({ items }: { items: Podcast[] }) {
  const { index, setIndex, featured, others, pause, resume } = useRotator(items, 6000);
  const reelSrc = `https://www.youtube-nocookie.com/embed/${featured.reelId}?rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${featured.reelId}`;

  return (
    <div
      className="grid gap-5 lg:grid-cols-[1.6fr_1fr]"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* Featured podcast — vertical reel + gallery + description */}
      <article
        key={featured.title}
        className="relative overflow-hidden rounded-[2rem] bg-surface ring-1 ring-ink/10 shadow-lg shadow-black/10 animate-fade-in"
      >
        <div className="grid gap-0 sm:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)]">
          {/* Vertical reel */}
          <div className="relative bg-background">
            <div className="absolute -inset-6 -z-0 rounded-[3rem] bg-gradient-to-br from-terracotta/20 via-ochre/10 to-transparent blur-3xl" />
            <div className="relative m-4 overflow-hidden rounded-2xl bg-black ring-1 ring-ink/10 sm:m-5">
              <div className="relative aspect-[9/16] w-full">
                <iframe
                  src={reelSrc}
                  title={featured.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 h-full w-full"
                />
                <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-terracotta px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                  <span className="size-1.5 rounded-full bg-white animate-pulse" />
                  Reel
                </div>
                <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/50 px-2 py-1 text-[10px] font-medium text-white backdrop-blur">
                  {featured.duration}
                </div>
              </div>
            </div>
          </div>

          {/* Description + gallery */}
          <div className="flex flex-col gap-5 p-5 sm:pl-2 sm:pr-6 sm:py-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ochre/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ochre">
                <Mic className="size-3" />
                Podcast DuoCast
              </span>
              <span className="eyebrow">{featured.episode}</span>
            </div>

            <div>
              <h3 className="font-display text-2xl leading-tight text-ink sm:text-[28px]">
                {featured.title}
              </h3>
              <p className="mt-1 text-sm text-ink-muted">{featured.guest}</p>
            </div>

            <p className="text-sm leading-relaxed text-ink-muted text-pretty">
              {featured.description}
            </p>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="eyebrow inline-flex items-center gap-1.5">
                  <Images className="size-3" />
                  Galeria do episódio
                </p>
                <span className="text-[11px] text-ink-muted">{featured.gallery.length} fotos</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {featured.gallery.map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-[4/5] overflow-hidden rounded-xl bg-surface-strong ring-1 ring-ink/10"
                  >
                    <img
                      src={src}
                      alt={`Foto ${i + 1} do episódio ${featured.title}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
              <ProgressDots count={items.length} index={index} />
              <button className="inline-flex items-center gap-1.5 rounded-xl bg-terracotta px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-terracotta/20 transition-all hover:brightness-110">
                <Play className="size-3.5 fill-current" />
                Ouvir episódio
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Side rail — 3 smaller podcasts */}
      <div className="flex flex-col gap-3">
        <p className="eyebrow inline-flex items-center gap-1.5">
          <Headphones className="size-3" />
          Outros episódios
        </p>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {others.map((p) => {
            const originalIndex = items.findIndex((x) => x.title === p.title);
            return (
              <li key={p.title}>
                <button
                  onClick={() => setIndex(originalIndex)}
                  className="group flex w-full items-stretch gap-3 rounded-2xl bg-surface p-2.5 text-left ring-1 ring-ink/10 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/10 hover:ring-terracotta/30"
                >
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface-strong sm:size-24 lg:size-20">
                    <img
                      src={p.cover}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="grid size-8 place-items-center rounded-full bg-terracotta text-primary-foreground">
                        <Play className="size-3.5 fill-current" />
                      </span>
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-ochre">
                          {p.episode}
                        </span>
                        <span className="text-[10px] text-ink-muted">· {p.duration}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-ink">
                        {p.title}
                      </p>
                    </div>
                    <p className="line-clamp-1 text-[11px] text-ink-muted">{p.guest}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, count }: { eyebrow: string; title: string; count?: number }) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <p className="eyebrow mb-2">{eyebrow}</p>
        <h2 className="font-display text-2xl text-ink sm:text-3xl">{title}</h2>
      </div>
      {typeof count === "number" && (
        <span className="hidden text-xs text-ink-muted sm:block">{count} itens</span>
      )}
    </div>
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
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-terracotta font-display text-sm font-bold text-primary-foreground">
              D
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-base font-bold text-ink">
                DUO <span className="text-terracotta">|</span> Mídia <span className="text-ink-muted font-normal">&</span>{" "}
                <span className="text-ochre">Studio</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-ink-muted">DuoHub · Dashboard</span>
            </div>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-surface-strong text-ink"
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
            <div className="grid size-9 place-items-center rounded-full bg-surface-strong text-ink text-xs font-semibold">
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
          <div className="border-t border-ink/10 bg-surface lg:hidden">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-1 px-5 py-3 sm:grid-cols-3">
              {nav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className={`inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${
                      item.active
                        ? "bg-surface-strong text-ink"
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
        {/* Hero + Video */}
        <section className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
          <div className="flex flex-col">
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
                  className="h-16 w-full rounded-2xl border border-ink/10 bg-surface pl-14 pr-6 text-base text-ink shadow-sm shadow-black/20 outline-none transition-all placeholder:text-ink-muted focus:border-terracotta/40 focus:ring-4 focus:ring-terracotta/10"
                />
                <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-lg border border-ink/10 bg-background px-2 py-1 text-[10px] font-mono text-ink-muted sm:inline-flex">
                  ⌘ K
                </span>
              </label>
            </div>
          </div>

          {/* Video hero — aligned to the right of the title on desktop */}
          <div className="lg:pt-2">
            <VideoHero />
          </div>
        </section>

        {/* Quem somos */}
        <AboutSection />

        {/* Client logos strip */}
        <ClientLogosStrip />

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
                      ? "bg-surface-strong text-ink"
                      : "border border-ink/10 bg-surface text-ink-muted hover:border-ink/20 hover:text-ink"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Services grid — uniform, rotating (2×3) */}
        <section className="mt-12">
          <SectionHeader
            eyebrow="Trabalhos mais recentes em rotação"
            title="Serviços mais solicitados"
            count={filtered.length}
          />

          {filtered.length > 0 ? (
            <RotatingServicesGrid services={filtered} />
          ) : (
            <div className="rounded-3xl border border-dashed border-ink/15 bg-surface p-10 text-center">
              <p className="text-ink">Nenhum serviço encontrado por aqui.</p>
              <p className="mt-1 text-sm text-ink-muted">
                Tente outra palavra ou fale com a gente logo abaixo.
              </p>
            </div>
          )}
        </section>

        {/* Testimonials */}
        <section className="mt-16">
          <SectionHeader
            eyebrow="O que dizem nossos clientes"
            title="Depoimentos"
            count={testimonials.length}
          />
          <TestimonialRotator items={testimonials} />
        </section>

        {/* Events gallery */}
        <section className="mt-16">
          <SectionHeader
            eyebrow="Momentos que construímos juntos"
            title="Galeria de eventos"
            count={events.length}
          />
          <EventRotator items={events} />
        </section>

        {/* Podcasts */}
        <section className="mt-16">
          <SectionHeader
            eyebrow="DuoCast · nossos episódios"
            title="Gravações de podcast"
            count={podcasts.length}
          />
          <PodcastRotator items={podcasts} />
        </section>

        {/* Blog */}
        <section className="mt-16">
          <SectionHeader
            eyebrow="Conteúdo da DuoMídia"
            title="Blog da empresa"
            count={blogPosts.length}
          />
          <BlogRotator items={blogPosts} />
        </section>

        {/* Media / press */}
        <section className="mt-16">
          <SectionHeader
            eyebrow="DuoMídia na imprensa"
            title="Mídia e links"
            count={mediaClips.length}
          />
          <MediaRotator items={mediaClips} />
        </section>

        {/* Featured "não encontrou" card */}
        <section className="mt-16">
          <div className="relative overflow-hidden rounded-[2rem] bg-surface-strong p-8 text-ink sm:p-14">
            <div className="absolute -right-16 -top-16 size-72 rounded-full bg-terracotta/25 blur-3xl" />
            <div className="absolute -bottom-24 -left-10 size-64 rounded-full bg-ochre/15 blur-3xl" />

            <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <p className="eyebrow mb-3 text-ink-muted">Projeto sob medida</p>
                <h3 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
                  Não encontrou o que precisa?
                </h3>
                <p className="mt-3 text-base leading-relaxed text-ink-muted">
                  Conte pra gente o que você imagina — nossa equipe monta uma proposta
                  personalizada para o seu momento, sem complicação.
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-terracotta/20 transition-transform hover:-translate-y-0.5">
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
