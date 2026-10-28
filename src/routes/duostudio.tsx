import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, CardGrid, InfoCard } from "@/components/PageShell";
import { WHATSAPP_URL, WhatsAppCta } from "@/components/SiteHeader";
import reelImg from "@/assets/service-reel.jpg";
import podcast1Img from "@/assets/podcast-1.jpg";
import podcast2Img from "@/assets/podcast-2.jpg";
import podcastGallery1 from "@/assets/podcast-gallery-1.jpg";
import eventPhotoBandAsset from "@/assets/events/dsc04023.jpg.asset.json";
import eventPhotoLadyAsset from "@/assets/events/rt9a3556.jpg.asset.json";

export const Route = createFileRoute("/duostudio")({
  head: () => ({
    meta: [
      { title: "DUOSTUDIO | Audiovisual, foto e podcast" },
      {
        name: "description",
        content:
          "O estúdio da DUO: vídeos, fotografia, gravação de podcast e coberturas de eventos com produção completa.",
      },
      { property: "og:title", content: "DUOSTUDIO | Audiovisual, foto e podcast" },
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
        <WhatsAppCta label="Falar com o DuoStudio no WhatsApp" />
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/10 bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface-strong"
        >
          Voltar ao início
        </Link>
      </div>
      {!WHATSAPP_URL && (
        <p className="mt-3 text-xs text-ink-muted">WhatsApp será ativado assim que o número for informado.</p>
      )}

      <CardGrid>
        {frentes.map((f) => (
          <InfoCard key={f.title} {...f} tagTone="ochre" />
        ))}
      </CardGrid>

      <section className="mt-12 rounded-[1.75rem] border border-ochre/20 bg-ochre/10 p-6 sm:p-8">
        <h2 className="font-display text-xl text-ink sm:text-2xl">Quer gravar com o DuoStudio?</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
          Estúdio equipado, direção de cena e cortes prontos para suas redes. Fale com a equipe e agende sua
          gravação.
        </p>
        <div className="mt-6">
          <WhatsAppCta label="Falar com o DuoStudio" />
        </div>
      </section>
    </PageShell>
  );
}
