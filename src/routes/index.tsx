import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  Play,
  Youtube,
  Instagram,
  Quote,
  Calendar,
  ExternalLink,
  Mic,
  Headphones,
  Images,
  Star,
  MessageCircle,
  MonitorSmartphone,
  TrendingUp,
  BarChart3,
  Palette,
  Mail,
  User,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Links oficiais da DUO | Mídia & Studio                             */
/* ------------------------------------------------------------------ */

const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@DuoMidia";
const INSTAGRAM_REELS_URL = "https://www.instagram.com/duomidia/reels/";


import { testimonials, GOOGLE_REVIEWS_URL, type Testimonial } from "@/data/testimonials";
import { SiteHeader, SiteFooter, WHATSAPP_URL, WhatsAppCta } from "@/components/SiteHeader";

import balsas1 from "@/assets/events/balsas-motofest/1.jpg";
import balsas2 from "@/assets/events/balsas-motofest/2.jpg";
import balsas3 from "@/assets/events/balsas-motofest/3.jpg";
import fecoimp1 from "@/assets/events/fecoimp-2026/1.jpg";
import fecoimp2 from "@/assets/events/fecoimp-2026/2.jpg";
import fecoimp3 from "@/assets/events/fecoimp-2026/3.jpg";
import motoimp1 from "@/assets/events/motoimp/1.jpg";
import motoimp2 from "@/assets/events/motoimp/2.jpg";
import motoimp3 from "@/assets/events/motoimp/3.jpg";


import podcast1Img from "@/assets/podcast-1.jpg";
import podcast2Img from "@/assets/podcast-2.jpg";
import podcast3Img from "@/assets/podcast-3.jpg";
import podcast4Img from "@/assets/podcast-4.jpg";
import podcastGallery1 from "@/assets/podcast-gallery-1.jpg";
import podcastGallery2 from "@/assets/podcast-gallery-2.jpg";
import podcastGallery3 from "@/assets/podcast-gallery-3.jpg";

import founderFabiaImg from "@/assets/founders/fabia.jpg";
import founderAnnaImg from "@/assets/founders/anna.jpg";

import aciiLogo from "@/assets/clients/ACII.png";
import bengessoLogo from "@/assets/clients/BENGESSO.png";
import cdaLogo from "@/assets/clients/CDA Distribuidora.png";
import dismarolLogo from "@/assets/clients/Dismarol.png";
import imperialShoppingLogo from "@/assets/clients/imperial shopping.png";
import kasaNossaLogo from "@/assets/clients/KASA NOSSA.png";
import maraisaSampaioLogo from "@/assets/clients/Maraisa Sampaio.png";

export const Route = createFileRoute("/")({
  component: Home_,
});

type DuoServiceGroup = {
  title: string;
  subtitle: string;
  accent: "terracotta" | "ochre";
  icon: typeof MonitorSmartphone;
  items: string[];
  description: string;
  href: string;
};

const duoServiceGroups: DuoServiceGroup[] = [
  {
    title: "DUOMÍDIA",
    subtitle: "Estratégia, conteúdo e mídia",
    accent: "terracotta",
    icon: TrendingUp,
    description: "Planejamento, criação e divulgação para sua marca crescer com consistência.",
    href: "/duomidia",
    items: [
      "Estratégia & Branding",
      "Assessoria de Comunicação",
      "Social Media",
      "Criação & Comunicação Visual",
      "Tráfego Pago",
      "Campanhas & Mídia",
    ],
  },
  {
    title: "DUOSTUDIO",
    subtitle: "Imagem, som e movimento",
    accent: "ochre",
    icon: MonitorSmartphone,
    description: "Produção audiovisual completa: do roteiro à entrega final.",
    href: "/duostudio",
    items: [
      "Produção de Vídeo",
      "Conteúdo para Redes",
      "Cobertura de Eventos",
      "Fotografia",
      "Estúdio & Podcast",
      "Motion & Pós-produção",
    ],
  },
];

const duoServiceMeta: Record<string, { icon: typeof MonitorSmartphone; hint: string }> = {
  "Estratégia & Branding": { icon: Palette, hint: "Branding" },
  "Assessoria de Comunicação": { icon: Mail, hint: "Comunicação" },
  "Social Media": { icon: Images, hint: "Social" },
  "Criação & Comunicação Visual": { icon: Palette, hint: "Criação" },
  "Tráfego Pago": { icon: TrendingUp, hint: "Mídia paga" },
  "Campanhas & Mídia": { icon: BarChart3, hint: "Campanhas" },
  "Produção de Vídeo": { icon: Play, hint: "Vídeo" },
  "Conteúdo para Redes": { icon: Images, hint: "Conteúdo" },
  "Cobertura de Eventos": { icon: Calendar, hint: "Coberturas" },
  Fotografia: { icon: Images, hint: "Foto" },
  "Estúdio & Podcast": { icon: Mic, hint: "Podcast" },
  "Motion & Pós-produção": { icon: MonitorSmartphone, hint: "Motion" },
};

function DuoServiceCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {duoServiceGroups.map((group) => {
        const GroupIcon = group.icon;
        const isTerracotta = group.accent === "terracotta";
        return (
          <Link
            key={group.title}
            to={group.href}
            className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-ink/10 bg-surface p-6 text-left shadow-sm shadow-black/10 transition-all hover:-translate-y-1 hover:border-ink/20 hover:shadow-xl hover:shadow-black/20 sm:p-7"
          >
            <div
              className={`pointer-events-none absolute -right-10 -top-10 size-40 rounded-full blur-3xl ${isTerracotta ? "bg-terracotta/15" : "bg-ochre/15"}`}
            />
            <div className="relative flex items-start justify-between gap-4">
              <span
                className={`grid size-10 place-items-center rounded-xl ${isTerracotta ? "bg-terracotta/15 text-terracotta" : "bg-ochre/15 text-ochre"}`}
              >
                <GroupIcon className="size-5" />
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-background px-3 py-1 text-[11px] font-medium text-ink-muted ring-1 ring-ink/10">
                {group.subtitle}
              </span>
            </div>
            <h3 className="relative mt-5 font-display text-2xl leading-tight text-ink sm:text-[1.7rem]">
              {group.title}
            </h3>
            <p className="relative mt-2 text-sm leading-relaxed text-ink-muted text-pretty">
              {group.description}
            </p>
            <ul className="relative mt-6 flex flex-wrap gap-2">
              {group.items.map((item) => {
                const meta = duoServiceMeta[item];
                const ItemIcon = meta?.icon ?? Sparkles;
                return (
                  <li
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1.5 text-xs font-medium text-ink ring-1 ring-ink/10"
                  >
                    <ItemIcon className="size-3.5 text-ink-muted" />
                    {item}
                  </li>
                );
              })}
            </ul>
            <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta">
              Conhecer {group.title}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        );
      })}
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
    name: "Fabia Homobono",
    role: "Sócia · CEO",
    bio: "Publicitária e estrategista de marketing com mais de 20 anos de experiência. Especialista em Comunicação e Marketing Digital, cria estratégias que fortalecem marcas e impulsionam negócios com visão, criatividade e foco em resultado.",
    image: founderFabiaImg,
    accent: "terracotta",
  },
  {
    name: "Anna Valeria Oliveira",
    role: "Sócia · Gestora de Contas",
    bio: "Publicitária com mais de 15 anos de experiência em publicidade e gestão de contas. Cuida do relacionamento com clientes, do planejamento e da execução de projetos que conectam marcas e públicos com organização e sensibilidade criativa.",
    image: founderAnnaImg,
    accent: "ochre",
  },
];

function AboutSection() {
  return (
    <section id="quem-somos" className="scroll-mt-24 mt-16 lg:mt-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <p className="eyebrow mb-3">Quem somos</p>
          <h2 className="font-display text-3xl leading-[1.05] text-ink text-balance sm:text-4xl lg:text-[2.75rem]">
            Duas sócias, uma agência <span className="text-terracotta">com alma</span> e um{" "}
            <span className="text-ochre">Studio</span> que respira criação.
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink-muted text-pretty">
            A DUO nasceu do encontro entre estratégia e sensibilidade. Cuidamos de cada marca como se
            fosse a nossa: com escuta, curiosidade e mão na massa. Aqui, cliente vira parceiro e ideia
            vira resultado.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2.5 text-xs text-ink-muted">
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
                className="group relative overflow-hidden rounded-[2rem] bg-surface ring-1 ring-ink/10 shadow-lg shadow-black/10 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-surface-strong">
                  <div
                    className={`absolute -inset-6 -z-0 bg-gradient-to-br ${accentBg} via-transparent to-transparent blur-2xl`}
                  />
                  <img
                    src={f.image}
                    alt={f.name}
                    loading="lazy"
                    width={600}
                    height={750}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                    className="relative h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                  <div className="absolute inset-x-4 bottom-4">
                    <p className={`text-[10px] font-mono uppercase tracking-[0.2em] ${accentText}`}>
                      {f.role}
                    </p>
                    <h3 className="mt-1 font-display text-xl leading-tight text-white sm:text-2xl">
                      {f.name}
                    </h3>
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

const clientLogos: Array<{ name: string; src: string; tone: "light" | "dark" }> = [
  { name: "ACII", src: aciiLogo, tone: "light" },
  { name: "BENGESSO", src: bengessoLogo, tone: "light" },
  { name: "CDA Distribuidora", src: cdaLogo, tone: "light" },
  { name: "Dismarol", src: dismarolLogo, tone: "dark" },
  { name: "Imperial Shopping", src: imperialShoppingLogo, tone: "light" },
  { name: "KASA NOSSA", src: kasaNossaLogo, tone: "dark" },
  { name: "Maraisa Sampaio", src: maraisaSampaioLogo, tone: "dark" },
];

function ClientLogosStrip() {
  const stepDesktop = 4;
  const stepMobile = 2;
  const [offset, setOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const step = isMobile ? stepMobile : stepDesktop;

  useEffect(() => {
    const id = setInterval(() => {
      setOffset((o) => (o + step) % clientLogos.length);
    }, 4000);
    return () => clearInterval(id);
  }, [step]);

  const visible = Array.from({ length: step }, (_, i) => clientLogos[(offset + i) % clientLogos.length]);

  return (
    <section className="mt-16 lg:mt-20">
      <div className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-surface px-6 py-8 sm:px-8 sm:py-9">
        <div className="absolute -left-10 top-1/2 hidden size-40 -translate-y-1/2 rounded-full bg-terracotta/10 blur-3xl sm:block" />
        <div className="absolute -right-10 top-1/2 hidden size-40 -translate-y-1/2 rounded-full bg-ochre/10 blur-3xl sm:block" />

        <div className="relative grid gap-6 md:grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)] md:items-center">
          <div>
            <p className="eyebrow mb-2">Marcas que confiam na DUO</p>
            <h2 className="font-display text-xl leading-tight text-ink sm:text-2xl">
              Uma seleção dos <span className="text-terracotta">nossos clientes</span>.
            </h2>
            <p className="mt-2 text-sm text-ink-muted">Logotipos em proporção original, sem distorção.</p>
          </div>

          <div
            key={`${offset}-${step}`}
            className="grid animate-fade-in grid-cols-2 items-center gap-3 sm:gap-4 sm:grid-cols-4"
          >
            {visible.map((logo) => (
              <div
                key={`${logo.name}-${offset}`}
                className={`flex h-20 items-center justify-center rounded-2xl p-3 ring-1 ring-ink/10 sm:h-24 sm:p-4 ${logo.tone === "light" ? "bg-white" : "bg-background"}`}
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  loading="lazy"
                  width={220}
                  height={96}
                  decoding="async"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                  className="max-h-full max-w-full object-contain"
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

// Playlist específica enviada pelo cliente: sempre mostra apenas os
// vídeos dessa playlist, sem misturar outros conteúdos do canal.
const YOUTUBE_PLAYLIST_ID = "PLOhe-XthqQMA";

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
              DuoMídia · Canal no YouTube
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
            title="Canal DuoMídia no YouTube"
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
            href={YOUTUBE_CHANNEL_URL}
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


/* ------------------------------------------------------------------ */
/* Testimonials                                                       */
/* ------------------------------------------------------------------ */

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < rating
              ? "size-4 fill-amber-400 text-amber-400"
              : "size-4 text-ink/20"
          }
        />
      ))}
    </div>
  );
}

function getInitials(name: string) {
  const parts = name.replace(/\(.*?\)/g, "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function ReviewerAvatar({
  name,
  image,
  size,
}: {
  name: string;
  image: string | null;
  size: "featured" | "list";
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(image) && !failed;
  const cls =
    size === "featured"
      ? "relative grid size-24 place-items-center rounded-full ring-4 ring-surface-strong sm:size-28"
      : "grid size-12 shrink-0 place-items-center rounded-full ring-2 ring-surface-strong sm:size-14";
  const fallbackCls =
    size === "featured"
      ? "bg-surface-strong text-ink-muted"
      : "bg-surface-strong text-ink-muted";
  if (showImage) {
    return (
      <img
        src={image!}
        alt={name}
        width={size === "featured" ? 160 : 64}
        height={size === "featured" ? 160 : 64}
        onError={() => setFailed(true)}
        className={
          size === "featured"
            ? "relative size-24 rounded-full object-cover ring-4 ring-surface-strong sm:size-28"
            : "size-12 shrink-0 rounded-full object-cover ring-2 ring-surface-strong sm:size-14"
        }
      />
    );
  }
  return (
    <span aria-hidden className={`${cls} ${fallbackCls}`}>
      {getInitials(name).length <= 2 && getInitials(name) !== "?" ? (
        <span className={size === "featured" ? "text-lg font-semibold tracking-wide" : "text-xs font-semibold tracking-wide"}>
          {getInitials(name)}
        </span>
      ) : (
        <User className={size === "featured" ? "size-8" : "size-5"} />
      )}
    </span>
  );
}

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
        className="group relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[2rem] bg-surface p-6 ring-1 ring-ink/10 shadow-lg shadow-black/10 animate-fade-in sm:min-h-[360px] sm:p-8"
      >
        <div className="absolute right-6 top-6 text-terracotta/15">
          <Quote className="size-14 fill-current sm:size-16" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col gap-6 sm:flex-row sm:items-start sm:gap-7">
          <div className="shrink-0 self-center sm:self-start">
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-terracotta/25 to-ochre/15 blur-lg" />
              <div className="relative">
                <ReviewerAvatar name={featured.name} image={featured.image} size="featured" />
              </div>
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <Stars rating={featured.rating} />
              <span className="text-xs text-ink-muted">{featured.date}</span>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-medium text-ink-muted ring-1 ring-ink/10">
                <svg viewBox="0 0 24 24" className="size-3" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.12A6.6 6.6 0 0 1 5.5 12c0-.74.13-1.45.34-2.12V7.04H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.96l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
                </svg>
                Google
              </span>
            </div>
            <p className="mt-4 line-clamp-4 font-display text-lg leading-relaxed text-ink text-pretty sm:text-xl">
              “{featured.quote}”
            </p>
            <div className="mt-4">
              <p className="line-clamp-1 text-sm font-semibold text-ink">{featured.name}</p>
              {featured.role ? (
                <p className="line-clamp-1 text-xs text-ink-muted">{featured.role}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-6 flex items-center justify-between gap-4 border-t border-ink/10 pt-4">
          <ProgressDots count={items.length} index={index} />
          <a
            href={featured.googleUrl ?? GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-terracotta"
          >
            Ver todas no Google <ExternalLink className="size-3.5" />
          </a>
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
                  className="group flex w-full items-center gap-3 rounded-2xl bg-surface p-3 text-left ring-1 ring-ink/10 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/10 hover:ring-terracotta/30"
                >
                  <ReviewerAvatar name={t.name} image={t.image} size="list" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold leading-tight text-ink">{t.name}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Stars rating={t.rating} />
                      <span className="text-[10px] text-ink-muted">{t.date}</span>
                    </div>
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
  photos: string[];
};

const events: EventItem[] = [
  {
    title: "Balsas Motofest",
    date: "Balsas · MA",
    description:
      "Reconhecida pela excelência na comunicação de eventos do segmento motociclístico, a DuoMídia chega ao Balsas Motofest pela primeira vez, levando sua experiência em planejamento, cobertura e comunicação de grandes eventos.",
    photos: [balsas1, balsas2, balsas3],
  },
  {
    title: "Fecoimp 2026",
    date: "Imperatriz · MA",
    description:
      "Há 3 anos, a DuoMídia planeja, organiza e executa a comunicação da Fecoimp, consolidada como uma das maiores feiras de negócios do Maranhão. Estratégia e comunicação conectando marcas, negócios e oportunidades.",
    photos: [fecoimp1, fecoimp2, fecoimp3],
  },
  {
    title: "MotoImp",
    date: "Imperatriz · MA",
    description:
      "Há 3 anos, a DuoMídia integra a realização do MotoImp, o maior evento de Moto Rock do Maranhão, com planejamento, comunicação e assessoria estratégica para transformar cada edição em uma grande experiência.",
    photos: [motoimp1, motoimp2, motoimp3],
  },
];

function EventRotator({ items, intervalMs = 5500 }: { items: EventItem[]; intervalMs?: number }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), intervalMs);
    return () => clearInterval(id);
  }, [items.length, intervalMs, paused]);

  const current = items[index];

  return (
    <div
      className="flex flex-col gap-5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Cabeçalho do evento em destaque */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-ink ring-1 ring-ink/10">
            <Calendar className="size-3.5 text-terracotta" />
            {current.date}
          </div>
          <h3 key={current.title} className="mt-3 font-display text-2xl leading-tight text-ink animate-fade-in sm:text-3xl">
            {current.title}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-ink-muted text-pretty">{current.description}</p>
        </div>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1.5 rounded-xl bg-terracotta px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-terracotta/20 transition-all hover:brightness-110"
        >
          Organizar meu próprio evento
          <ArrowUpRight className="size-4" />
        </a>
      </div>

      {/* Faixa com 3 fotos do mesmo evento */}
      <div key={`strip-${index}`} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {current.photos.slice(0, 3).map((src, i) => (
          <figure
            key={`${current.title}-${i}`}
            className="group relative overflow-hidden rounded-2xl bg-surface-strong ring-1 ring-ink/10 shadow-md shadow-black/10 animate-fade-in"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={src}
                alt={`${current.title} — foto ${i + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
              />
            </div>
          </figure>
        ))}
      </div>

      {/* Controles: pontinhos + próximos eventos */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ProgressDots count={items.length} index={index} />
        <ul className="flex flex-wrap items-center gap-2">
          {items.map((e, i) => (
            <li key={e.title}>
              <button
                onClick={() => setIndex(i)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition-all ${
                  i === index
                    ? "bg-terracotta text-primary-foreground ring-terracotta/40"
                    : "bg-surface text-ink-muted ring-ink/10 hover:ring-terracotta/30 hover:text-ink"
                }`}
              >
                {e.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* Blog removido da home nesta etapa; o conteúdo segue disponível em /blog */
/* Mídia removida da home; segue em /imprensa */

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
    title: "Reels — Apresentação Bia HS",
    guest: "Produção DUO | Mídia & Studio",
    episode: "Reels",
    duration: "",
    description:
      "Vídeo vertical de apresentação produzido pela equipe: roteiro, gravação e edição feitos do começo ao fim pela DUO.",
    cover: podcast1Img,
    reelId: "vc94rLmtrb8",
    gallery: [podcastGallery1, podcastGallery2, podcastGallery3],
  },
  {
    title: "Doce Sedução — Black Friday 01",
    guest: "Cliente Doce Sedução",
    episode: "Reels",
    duration: "",
    description:
      "Primeiro vídeo da série de Black Friday: mensagem direta, ritmo rápido e identidade da marca em destaque.",
    cover: podcast2Img,
    reelId: "GFhRTBmctSw",
    gallery: [podcastGallery2, podcastGallery3, podcastGallery1],
  },
  {
    title: "Doce Sedução — Black Friday 02",
    guest: "Cliente Doce Sedução",
    episode: "Reels",
    duration: "",
    description:
      "Sequência da campanha, com foco nos produtos e nas ofertas do período.",
    cover: podcast3Img,
    reelId: "KawVmw7s0J8",
    gallery: [podcastGallery3, podcastGallery1, podcastGallery2],
  },
  {
    title: "Doce Sedução — Black Friday 03",
    guest: "Cliente Doce Sedução",
    episode: "Reels",
    duration: "",
    description:
      "Fechamento da série, reforçando a chamada para ação e o prazo da promoção.",
    cover: podcast4Img,
    reelId: "6C9UK-d9g-A",
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
      <article
        key={featured.title}
        className="relative overflow-hidden rounded-[2rem] bg-surface ring-1 ring-ink/10 shadow-lg shadow-black/10 animate-fade-in"
      >
        <div className="grid gap-0 sm:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)]">
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
                {featured.duration ? (
                  <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/50 px-2 py-1 text-[10px] font-medium text-white backdrop-blur">
                    {featured.duration}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-5 sm:pl-2 sm:pr-6 sm:py-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ochre/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ochre">
                <Mic className="size-3" />
                DuoCast
              </span>
              <span className="eyebrow">{featured.episode}</span>
            </div>

            <div>
              <h3 className="font-display text-2xl leading-tight text-ink sm:text-[26px]">{featured.title}</h3>
              <p className="mt-1 text-sm text-ink-muted">{featured.guest}</p>
            </div>

            <p className="text-sm leading-relaxed text-ink-muted text-pretty">{featured.description}</p>

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
                      width={200}
                      height={250}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
              <ProgressDots count={items.length} index={index} />
              <div className="flex gap-2">
                <WhatsAppCta label="Quero gravar meu episódio" />
              </div>
            </div>
          </div>
        </div>
      </article>

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
                      width={160}
                      height={160}
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
                        {p.duration ? (
                          <span className="text-[10px] text-ink-muted">· {p.duration}</span>
                        ) : null}
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-ink">{p.title}</p>
                    </div>
                    <p className="line-clamp-1 text-[11px] text-ink-muted">{p.guest}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
        <a
          href={INSTAGRAM_REELS_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-ink/10 bg-surface px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface-strong"
        >
          <Instagram className="size-4" />
          Ver Reels no Instagram
          <ExternalLink className="size-3.5" />
        </a>
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  count,
  action,
}: {
  eyebrow: string;
  title: string;
  count?: number;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow mb-2">{eyebrow}</p>
        <h2 className="font-display text-2xl text-ink sm:text-3xl">{title}</h2>
      </div>
      <div className="flex items-center gap-3">
        {typeof count === "number" && (
          <span className="hidden text-xs text-ink-muted sm:block">{count} itens</span>
        )}
        {action}
      </div>
    </div>
  );
}

function Home_() {
  return (
    <div className="min-h-screen bg-background text-ink">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-16">
        {/* Hero — apresentação + vídeo + CTAs */}
        <section className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
          <div className="flex flex-col">
            <p className="eyebrow mb-4">Bem-vindo à DUO | Mídia & Studio</p>
            <h1 className="font-display text-4xl leading-[1.05] text-ink text-balance sm:text-5xl lg:text-6xl">
              DUO <span className="text-ink-muted font-light">|</span> <span className="text-terracotta">Mídia</span>{" "}
              <span className="text-ink-muted font-light">&</span> <span className="text-ochre">Studio</span>
            </h1>
            <p className="eyebrow">Campanha 2026 · Uma Agência. Várias soluções.</p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-muted text-pretty">
              Uma solução integrada para marcas que precisam de estratégia + criação + produção.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <WhatsAppCta label="Solicitar um orçamento" />
              <Link
                to="/servicos"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/10 bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface-strong"
              >
                Quero conhecer os serviços
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <p className="mt-3 text-xs text-ink-muted">
              Sem jargão técnico. Você conta o que precisa e a DUO cuida do resto.
            </p>
          </div>

          <div className="lg:pt-2 lg:sticky lg:top-24">
            <VideoHero />
          </div>
        </section>

        {/* Serviços — DUOMÍDIA e DUOSTUDIO no estilo da referência */}
        <section className="mt-16 lg:mt-20">
          <SectionHeader
            eyebrow="Uma Agência. Várias soluções. — Campanha 2026"
            title="Duas frentes, uma entrega completa"
            count={duoServiceGroups.reduce((n, g) => n + g.items.length, 0)}
          />
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-ink-muted text-pretty">
            Uma solução integrada para marcas que precisam de estratégia + criação + produção. Escolha a
            frente que mais combina com o seu momento — ou combine as duas.
          </p>
          <DuoServiceCards />
        </section>

        {/* Quem somos */}
        <AboutSection />

        {/* Client logos strip */}
        <ClientLogosStrip />


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
            action={
              <a
                href={INSTAGRAM_REELS_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-ink ring-1 ring-ink/10 transition-colors hover:bg-surface-strong hover:text-terracotta"
              >
                <Instagram className="size-3.5" />
                Ver Reels
                <ExternalLink className="size-3" />
              </a>
            }
          />
          <PodcastRotator items={podcasts} />
        </section>

        {/* Featured "não encontrou" + WhatsApp */}
        <section className="mt-16">
          <div className="relative overflow-hidden rounded-[2rem] bg-surface-strong p-8 text-ink sm:p-10 lg:p-12">
            <div className="absolute -right-16 -top-16 size-72 rounded-full bg-terracotta/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-10 size-64 rounded-full bg-ochre/15 blur-3xl" />

            <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <p className="eyebrow mb-3 text-ink-muted">Projeto sob medida</p>
                <h3 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
                  Não encontrou o que precisa?
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-muted text-pretty">
                  Conte pra gente o que você imagina — nossa equipe monta uma proposta personalizada
                  para o seu momento, sem complicação.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <WhatsAppCta label="Falar com a Duo" />
                <Link
                  to="/servicos"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/10 bg-surface px-6 py-4 text-sm font-semibold text-ink hover:bg-background"
                >
                  Ver serviços
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
            {!WHATSAPP_URL && (
              <p className="relative mt-6 text-xs text-ink-muted">
                WhatsApp pendente: informe o número para ativar os botões.
              </p>
            )}
          </div>
        </section>

        <SiteFooter />
      </main>
    </div>
  );
}
