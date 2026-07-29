import { createFileRoute } from "@tanstack/react-router";
import { PageShell, CardGrid, InfoCard } from "@/components/PageShell";
import eventPhotoTeamAsset from "@/assets/events/rt9a3548.jpg.asset.json";
import eventPhotoLadyAsset from "@/assets/events/rt9a3556.jpg.asset.json";
import eventPhotoCrowdAsset from "@/assets/events/duo00598.jpg.asset.json";
import eventPhotoBandAsset from "@/assets/events/dsc04023.jpg.asset.json";

export const Route = createFileRoute("/coberturas")({
  head: () => ({
    meta: [
      { title: "Coberturas — DUO | Mídia & Studio" },
      {
        name: "description",
        content:
          "Galeria de coberturas de eventos da DUO: shows, palcos, bastidores e registros com a equipe.",
      },
      { property: "og:title", content: "Coberturas — DUO | Mídia & Studio" },
      {
        property: "og:description",
        content:
          "Galeria de coberturas de eventos da DUO: shows, palcos, bastidores e registros com a equipe.",
      },
    ],
  }),
  component: CoberturasPage,
});

const fotos = [
  {
    image: eventPhotoLadyAsset.url,
    title: "Lady Velvet no palco principal",
    text: "Registro do show com iluminação e telão em destaque.",
    tag: "Motoshow",
  },
  {
    image: eventPhotoCrowdAsset.url,
    title: "Público lotado ao anoitecer",
    text: "Vista do palco para a multidão durante a apresentação.",
    tag: "Motoshow",
  },
  {
    image: eventPhotoBandAsset.url,
    title: "Zappelin ao vivo",
    text: "Captação da banda com fumaça, luzes e muito som.",
    tag: "Motoshow",
  },
  {
    image: eventPhotoTeamAsset.url,
    title: "Bastidores com a equipe DUO",
    text: "O time reunido antes da abertura dos portões.",
    tag: "Bastidores",
  },
];

function CoberturasPage() {
  return (
    <PageShell
      eyebrow="Momentos que construímos juntos"
      title="Coberturas"
      intro="Fotos e vídeos dos eventos que a DUO acompanhou de perto — do palco aos bastidores."
    >
      <CardGrid>
        {fotos.map((f) => (
          <InfoCard key={f.title} {...f} />
        ))}
      </CardGrid>
    </PageShell>
  );
}
