import { createFileRoute } from "@tanstack/react-router";
import { PageShell, CardGrid, InfoCard } from "@/components/PageShell";
import postImg from "@/assets/service-post.jpg";
import storyImg from "@/assets/service-story.jpg";
import carrosselImg from "@/assets/service-carrossel.jpg";
import bannerImg from "@/assets/service-banner.jpg";
import emailImg from "@/assets/service-email.jpg";
import media1Img from "@/assets/media-1.jpg";

export const Route = createFileRoute("/duomidia")({
  head: () => ({
    meta: [
      { title: "DUOMÍDIA — Estratégia, conteúdo e campanhas" },
      {
        name: "description",
        content:
          "A frente de mídia da DUO: planejamento, redes sociais, campanhas e comunicação que aproxima marcas e pessoas.",
      },
      { property: "og:title", content: "DUOMÍDIA — Estratégia, conteúdo e campanhas" },
      {
        property: "og:description",
        content:
          "A frente de mídia da DUO: planejamento, redes sociais, campanhas e comunicação que aproxima marcas e pessoas.",
      },
    ],
  }),
  component: DuoMidiaPage,
});

const frentes = [
  {
    image: postImg,
    title: "Redes sociais",
    text: "Planejamento, criação e publicação de conteúdo com a cara da sua marca.",
    tag: "Conteúdo",
  },
  {
    image: carrosselImg,
    title: "Campanhas",
    text: "Ideias que saem do papel: conceito, peças e divulgação em vários canais.",
    tag: "Campanhas",
  },
  {
    image: storyImg,
    title: "Gestão de perfis",
    text: "Rotina de postagens, respostas e acompanhamento de resultados.",
    tag: "Rotina",
  },
  {
    image: bannerImg,
    title: "Publicidade",
    text: "Anúncios pensados para alcançar as pessoas certas, no momento certo.",
    tag: "Anúncios",
  },
  {
    image: emailImg,
    title: "Comunicação interna",
    text: "Materiais que organizam a comunicação do seu time no dia a dia.",
    tag: "Comunicação",
  },
  {
    image: media1Img,
    title: "Assessoria e imprensa",
    text: "Presença da sua marca em portais, veículos e parcerias.",
    tag: "Imprensa",
  },
];

function DuoMidiaPage() {
  return (
    <PageShell
      eyebrow="Uma agência, várias soluções."
      title={
        <>
          DUO <span className="font-light text-ink-muted">|</span>{" "}
          <span className="text-terracotta">Mídia</span>
        </>
      }
      intro="A frente estratégica da agência: cuidamos da presença da sua marca no dia a dia, do planejamento à publicação, com linguagem clara e resultados que dá para acompanhar."
    >
      <CardGrid>
        {frentes.map((f) => (
          <InfoCard key={f.title} {...f} />
        ))}
      </CardGrid>
    </PageShell>
  );
}
