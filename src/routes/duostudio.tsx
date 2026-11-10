import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Headphones, Instagram } from "lucide-react";
import { PageShell, CardGrid, InfoCard } from "@/components/PageShell";
import { WHATSAPP_URL, WhatsAppCta } from "@/components/SiteHeader";
import reelImg from "@/assets/service-reel.jpg";
import podcast1Img from "@/assets/podcast-1.webp";
import podcast2Img from "@/assets/podcast-2.webp";
import podcastGallery1 from "@/assets/podcast-gallery-1.jpg";
import eventPhotoBandImg from "@/assets/coberturas/zappelin-ao-vivo.webp";
import eventPhotoLadyImg from "@/assets/coberturas/lady-velvet.webp";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/duostudio")({
  head: () =>
    pageSeo({
      title: "DUOSTUDIO | Audiovisual, foto e podcast",
      description:
        "O estúdio da DUO: vídeos, fotografia, gravação de podcast e coberturas de eventos com produção completa.",
      path: "/duostudio",
    }),
  component: DuoStudioPage,
});

const frentes = [
  {
    image: reelImg,
    title: "Vídeos curtos",
    text: "Gravação e edição de vídeos verticais para redes, com trilha e legendas.",
    tag: "Vídeo",
  },
  {
    image: podcast1Img,
    title: "Gravação de podcast",
    text: "Estúdio equipado, direção de cena e cortes prontos para publicar.",
    tag: "Podcast",
  },
  {
    image: eventPhotoLadyImg,
    title: "Cobertura de eventos",
    text: "Fotos e vídeos do seu evento, do começo ao fim, com entrega rápida.",
    tag: "Coberturas",
  },
  {
    image: podcastGallery1,
    title: "Fotografia",
    text: "Ensaios de equipe, produtos e ambientes para usar em todos os canais.",
    tag: "Foto",
  },
  {
    image: podcast2Img,
    title: "Produção completa",
    text: "Roteiro, captação, edição e finalização em um único lugar.",
    tag: "Produção",
  },
  {
    image: eventPhotoBandImg,
    title: "Transmissões ao vivo",
    text: "Sua marca no ar com imagem e som cuidados por quem entende de palco.",
    tag: "Ao vivo",
  },
];

// Conteúdo da seção de podcasts e reels (links enviados pela equipe).
const INSTAGRAM_REELS = [{ id: "C4dxWhZuJIg" }, { id: "Csd3YxPg9_Q" }, { id: "Cppz-TWg_r6" }];

const YOUTUBE_PODCASTS = [
  { name: "Bari Talks", url: "https://www.youtube.com/@baritalks" },
  { name: "Papo de Briefing", url: "https://www.youtube.com/@papodebriefing" },
  { name: "PodCOM ELAS", url: "https://www.youtube.com/@PodcomELAS/featured" },
];

const SPOTIFY_SHOW_EMBED = "https://open.spotify.com/embed/show/5heui1gJgTZfcjUiUHtRGy";

// Vídeos do DuoStudio por categoria (ID do YouTube).
const VIDEO_CATEGORIES = [
  { label: "Vídeos comerciais", id: "AEQlDy3DJU8" },
  { label: "Vídeos institucionais", id: "W7JCkPeZOvg" },
  { label: "Vídeos cartelados", id: "QIlGKyZ-6as" },
  { label: "Vídeo after de eventos", id: "AMuAb87K-xE" },
  { label: "Vídeos políticos", id: "OYuWg4_diws" },
  { label: "Vídeos promocionais", id: "hT9KAI8gY64" },
  { label: "Clipes musicais", id: "x_gtQ_RRPeY" },
];

function InstagramReelsRow() {
  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:justify-center lg:px-0">
      {INSTAGRAM_REELS.map((reel, i) => (
        <div
          key={reel.id}
          className="w-[328px] shrink-0 snap-start overflow-hidden rounded-2xl bg-black ring-1 ring-ink/10"
        >
          <iframe
            src={`https://www.instagram.com/reel/${reel.id}/embed`}
            title={`Reel do Instagram ${i + 1}`}
            width="328"
            height="569"
            loading="lazy"
            allowFullScreen
            className="block"
          />
        </div>
      ))}
    </div>
  );
}

function PodcastsAndReels() {
  return (
    <section className="mt-14">
      <p className="eyebrow inline-flex items-center gap-1.5">Podcasts e reels</p>
      <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">Ouça, assista e acompanhe</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
        Os reels mais recentes no Instagram e os episódios dos nossos podcasts.
      </p>

      <div className="mt-8">
        <h3 className="mb-4 inline-flex items-center gap-2 font-display text-lg text-ink">
          <Instagram className="size-4 text-ochre" /> Reels no Instagram
        </h3>
        <InstagramReelsRow />
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <div className="rounded-[1.75rem] bg-surface p-5 ring-1 ring-ink/10 sm:p-6">
          <p className="eyebrow inline-flex items-center gap-1.5">Spotify</p>
          <h3 className="mt-2 font-display text-xl text-ink">Papo de Briefing</h3>
          <iframe
            src={SPOTIFY_SHOW_EMBED}
            title="Papo de Briefing no Spotify"
            width="100%"
            height="352"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            className="mt-5 rounded-2xl"
          />
        </div>

        <div className="rounded-[1.75rem] bg-surface p-5 ring-1 ring-ink/10 sm:p-6">
          <p className="eyebrow inline-flex items-center gap-1.5">YouTube</p>
          <h3 className="mt-2 font-display text-xl text-ink">Canais de podcast</h3>
          <ul className="mt-5 flex flex-col gap-3">
            {YOUTUBE_PODCASTS.map((p) => (
              <li key={p.name}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-ink/10 bg-background p-4 transition-colors hover:border-ochre/40 hover:bg-ochre/5"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-ochre/15 text-ochre">
                    <Headphones className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-ink">{p.name}</span>
                    <span className="block text-xs text-ink-muted">Assistir no YouTube</span>
                  </span>
                  <ExternalLink className="size-4 text-ink-muted transition-transform group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function VideosSection() {
  return (
    <section className="mt-14">
      <p className="eyebrow inline-flex items-center gap-1.5">Portfólio</p>
      <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">Vídeos do DuoStudio</h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {VIDEO_CATEGORIES.map((v) => (
          <figure key={v.id} className="rounded-2xl bg-surface p-3 ring-1 ring-ink/10">
            <div className="aspect-video overflow-hidden rounded-xl bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${v.id}?rel=0&modestbranding=1`}
                title={v.label}
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            <figcaption className="mt-3 text-xs font-mono uppercase tracking-wider text-ochre">
              {v.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function DuoStudioPage() {
  return (
    <PageShell
      eyebrow="  · Uma Agência. Várias soluções."
      title={
        <>
          DUO <span className="font-light text-ink-muted">|</span>{" "}
          <span className="text-ochre">Studio</span>
        </>
      }
      intro="Uma solução integrada para marcas que precisam de estratégia + criação + produção. No DuoStudio entregamos imagem, som e movimento com qualidade de estúdio, do roteiro à entrega final."
    >
      <div className="mt-8 flex flex-wrap gap-3">
        <WhatsAppCta label="Falar com o DuoStudio no WhatsApp" tone="ochre" />
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-ochre/40 bg-ochre/10 px-5 py-2.5 text-sm font-semibold text-ochre transition-colors hover:bg-ochre/20"
        >
          Voltar ao início
        </Link>
      </div>
      {!WHATSAPP_URL && (
        <p className="mt-3 text-xs text-ink-muted">
          WhatsApp será ativado assim que o número for informado.
        </p>
      )}

      <CardGrid>
        {frentes.map((f) => (
          <InfoCard key={f.title} {...f} tagTone="ochre" />
        ))}
      </CardGrid>

      <PodcastsAndReels />

      <VideosSection />

      <section className="mt-12 rounded-[1.75rem] border border-ochre/20 bg-ochre/10 p-6 sm:p-8">
        <h2 className="font-display text-xl text-ink sm:text-2xl">Quer gravar com o DuoStudio?</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
          Estúdio equipado, direção de cena e cortes prontos para suas redes. Fale com a equipe e
          agende sua gravação.
        </p>
        <div className="mt-6">
          <WhatsAppCta label="Falar com o DuoStudio" tone="ochre" />
        </div>
      </section>
    </PageShell>
  );
}
