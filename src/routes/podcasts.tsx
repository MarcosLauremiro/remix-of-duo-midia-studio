import { createFileRoute } from "@tanstack/react-router";
import { PageShell, CardGrid, InfoCard } from "@/components/PageShell";
import podcast1Img from "@/assets/podcast-1.jpg";
import podcast2Img from "@/assets/podcast-2.jpg";
import podcast3Img from "@/assets/podcast-3.jpg";
import podcast4Img from "@/assets/podcast-4.jpg";
import podcastGallery1 from "@/assets/podcast-gallery-1.jpg";
import podcastGallery2 from "@/assets/podcast-gallery-2.jpg";

const INSTAGRAM_REELS_URL = "https://www.instagram.com/duomidia/reels/";

export const Route = createFileRoute("/podcasts")({
  head: () => ({
    meta: [
      { title: "Podcasts — DUO | Mídia & Studio" },
      {
        name: "description",
        content:
          "Gravações de podcast produzidas no estúdio da DUO: episódios, bastidores e cortes verticais.",
      },
      { property: "og:title", content: "Podcasts — DUO | Mídia & Studio" },
      {
        property: "og:description",
        content:
          "Gravações de podcast produzidas no estúdio da DUO: episódios, bastidores e cortes verticais.",
      },
    ],
  }),
  component: PodcastsPage,
});

const episodios = [
  {
    image: podcast1Img,
    title: "Apresentação Bia HS",
    text: "Bate-papo de apresentação gravado no estúdio da DUO.",
    tag: "Episódio",
  },
  {
    image: podcast2Img,
    title: "Doce Sedução — Black Friday",
    text: "Série de conteúdos verticais para a campanha da marca.",
    tag: "Série",
  },
  {
    image: podcast3Img,
    title: "Bastidores da gravação",
    text: "Como montamos luz, som e cenário para cada episódio.",
    tag: "Bastidores",
  },
  {
    image: podcast4Img,
    title: "Cortes para redes",
    text: "Trechos curtos prontos para publicar em Reels e Shorts.",
    tag: "Cortes",
  },
  {
    image: podcastGallery1,
    title: "Estúdio DUO",
    text: "Espaço equipado para receber convidados e marcas parceiras.",
    tag: "Estúdio",
  },
  {
    image: podcastGallery2,
    title: "Convidados",
    text: "Empresários e criadores contando histórias que inspiram.",
    tag: "Convidados",
  },
];

function PodcastsPage() {
  return (
    <PageShell
      eyebrow="DuoCast · nossos episódios"
      title="Podcasts"
      intro="Gravações, bastidores e cortes produzidos no nosso estúdio, prontos para viver nas redes."
    >
      <CardGrid>
        {episodios.map((e) => (
          <InfoCard key={e.title} {...e} />
        ))}
      </CardGrid>
      <div className="mt-10">
        <a
          href={INSTAGRAM_REELS_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-primary-foreground"
        >
          Ver Reels no Instagram
        </a>
      </div>
    </PageShell>
  );
}
