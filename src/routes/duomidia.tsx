import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, CardGrid, InfoCard } from "@/components/PageShell";
import { WHATSAPP_URL, WhatsAppCta } from "@/components/SiteHeader";
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
      eyebrow="Campanha 2026 · Uma Agência. Várias soluções."
      title={
        <>
          DUO <span className="font-light text-ink-muted">|</span>{" "}
          <span className="text-terracotta">Mídia</span>
        </>
      }
      intro="Uma solução integrada para marcas que precisam de estratégia + criação + produção. Na DuoMídia cuidamos da presença da sua marca no dia a dia, do planejamento à publicação, em linguagem simples e com acompanhamento próximo."
    >
      <div className="mt-8 flex flex-wrap gap-3">
        <WhatsAppCta label="Falar com a DuoMídia no WhatsApp" />
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
          <InfoCard key={f.title} {...f} tagTone="terracotta" />
        ))}
      </CardGrid>

      <section className="mt-12 rounded-[1.75rem] border border-terracotta/20 bg-terracotta-soft p-6 sm:p-8">
        <h2 className="font-display text-xl text-ink sm:text-2xl">
          Quer levar a DuoMídia para a sua marca?
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
          Conte o que você precisa e a equipe monta um plano sob medida — sem jargão técnico.
        </p>
        <div className="mt-6">
          <WhatsAppCta label="Solicitar proposta da DuoMídia" />
        </div>
      </section>
    </PageShell>
  );
}
