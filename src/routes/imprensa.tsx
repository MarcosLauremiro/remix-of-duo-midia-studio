import { createFileRoute } from "@tanstack/react-router";
import { PageShell, CardGrid, InfoCard } from "@/components/PageShell";
import media1Img from "@/assets/media-1.jpg";
import media2Img from "@/assets/media-2.jpg";
import media3Img from "@/assets/media-3.jpg";
import media4Img from "@/assets/media-4.jpg";

const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@DuoMidia";
const INSTAGRAM_URL = "https://www.instagram.com/duomidia/";

export const Route = createFileRoute("/imprensa")({
  head: () => ({
    meta: [
      { title: "Imprensa | DUO | Mídia & Studio" },
      {
        name: "description",
        content:
          "Materiais publicados sobre a DUO em veículos, portais e redes: links, entrevistas e participações.",
      },
      { property: "og:title", content: "Imprensa | DUO | Mídia & Studio" },
      {
        property: "og:description",
        content:
          "Materiais publicados sobre a DUO em veículos, portais e redes: links, entrevistas e participações.",
      },
    ],
  }),
  component: ImprensaPage,
});

const clips = [
  {
    image: media1Img,
    title: "Entrevista sobre comunicação regional",
    text: "Participação das sócias falando sobre o mercado local.",
    tag: "Entrevista",
    href: YOUTUBE_CHANNEL_URL,
  },
  {
    image: media2Img,
    title: "Bastidores no canal do YouTube",
    text: "Séries e episódios publicados no canal oficial da agência.",
    tag: "YouTube",
    href: YOUTUBE_CHANNEL_URL,
  },
  {
    image: media3Img,
    title: "Cobertura de eventos nas redes",
    text: "Registros e repercussões publicadas nos perfis parceiros.",
    tag: "Redes",
    href: INSTAGRAM_URL,
  },
  {
    image: media4Img,
    title: "Cases e parcerias",
    text: "Projetos da DUO citados por clientes e veículos da região.",
    tag: "Cases",
    href: INSTAGRAM_URL,
  },
];

function ImprensaPage() {
  return (
    <PageShell
      eyebrow="DUO na imprensa"
      title="Mídia e links"
      intro="Onde a agência apareceu: entrevistas, publicações e materiais divulgados por veículos e parceiros."
    >
      <CardGrid>
        {clips.map((c) => (
          <InfoCard key={c.title} {...c} />
        ))}
      </CardGrid>
    </PageShell>
  );
}
