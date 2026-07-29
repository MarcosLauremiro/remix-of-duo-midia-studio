import { createFileRoute } from "@tanstack/react-router";
import { PageShell, CardGrid, InfoCard } from "@/components/PageShell";
import reelImg from "@/assets/service-reel.jpg";
import podcast1Img from "@/assets/podcast-1.jpg";
import podcast2Img from "@/assets/podcast-2.jpg";
import podcastGallery1 from "@/assets/podcast-gallery-1.jpg";
import eventPhotoBandAsset from "@/assets/events/dsc04023.jpg.asset.json";
import eventPhotoLadyAsset from "@/assets/events/rt9a3556.jpg.asset.json";

export const Route = createFileRoute("/duostudio")({
  head: () => ({
    meta: [
      { title: "DUOSTUDIO — Audiovisual, foto e podcast" },
      {
        name: "description",
        content:
          "O estúdio da DUO: vídeos, fotografia, gravação de podcast e coberturas de eventos com produção completa.",
      },
      { property: "og:title", content: "DUOSTUDIO — Audiovisual, foto e podcast" },
      {
        property: "og:description",
        content:
          "O estúdio da DUO: vídeos, fotografia, gravação de podcast e coberturas de eventos com produção completa.",
      },
    ],
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
    image: eventPhotoLadyAsset.url,
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
    image: eventPhotoBandAsset.url,
    title: "Transmissões ao vivo",
    text: "Sua marca no ar com imagem e som cuidados por quem entende de palco.",
    tag: "Ao vivo",
  },
];

function DuoStudioPage() {
  return (
    <PageShell
      eyebrow="Uma agência, várias soluções."
      title={
        <>
          DUO <span className="font-light text-ink-muted">|</span>{" "}
          <span className="text-ochre">Studio</span>
        </>
      }
      intro="A frente de produção da agência: imagem, som e movimento para contar a história da sua marca com qualidade de estúdio."
    >
      <CardGrid>
        {frentes.map((f) => (
          <InfoCard key={f.title} {...f} />
        ))}
      </CardGrid>
    </PageShell>
  );
}
