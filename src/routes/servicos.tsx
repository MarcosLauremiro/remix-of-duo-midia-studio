import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, CardGrid, InfoCard } from "@/components/PageShell";
import postImg from "@/assets/service-post.jpg";
import storyImg from "@/assets/service-story.jpg";
import carrosselImg from "@/assets/service-carrossel.jpg";
import reelImg from "@/assets/service-reel.jpg";
import bannerImg from "@/assets/service-banner.jpg";
import emailImg from "@/assets/service-email.jpg";
import crachaImg from "@/assets/service-cracha.jpg";
import figurinhaImg from "@/assets/service-figurinha.jpg";

export const Route = createFileRoute("/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços — DUO | Mídia & Studio" },
      {
        name: "description",
        content:
          "Conheça os serviços mais solicitados da DUO: posts, stories, carrosséis, reels, banners, crachás e mais.",
      },
      { property: "og:title", content: "Serviços — DUO | Mídia & Studio" },
      {
        property: "og:description",
        content:
          "Conheça os serviços mais solicitados da DUO: posts, stories, carrosséis, reels, banners, crachás e mais.",
      },
    ],
  }),
  component: ServicosPage,
});

const servicos = [
  {
    image: postImg,
    title: "Post para redes sociais",
    text: "Uma arte estática pensada para o seu feed engajar mais.",
    tag: "Incluído no plano",
  },
  {
    image: storyImg,
    title: "Story",
    text: "Conteúdo vertical rápido para avisos, novidades e interação.",
    tag: "Incluído no plano",
  },
  {
    image: carrosselImg,
    title: "Carrossel",
    text: "Sequência de artes para explicar, ensinar ou apresentar.",
    tag: "2 créditos",
  },
  {
    image: reelImg,
    title: "Reel",
    text: "Vídeo curto editado com trilha e legendas dinâmicas.",
    tag: "5 créditos",
  },
  {
    image: bannerImg,
    title: "Banner",
    text: "Peça horizontal para sites, e-mails e portais parceiros.",
    tag: "Incluído no plano",
  },
  {
    image: emailImg,
    title: "Assinatura de e-mail",
    text: "Comunicação padronizada e elegante para o seu time.",
    tag: "Incluído no plano",
  },
  {
    image: crachaImg,
    title: "Crachá",
    text: "Identificação impressa para equipe, eventos e visitas.",
    tag: "Incluído no plano",
  },
  {
    image: figurinhaImg,
    title: "Figurinha para WhatsApp",
    text: "Pacote de adesivos com a personalidade da sua marca.",
    tag: "1 crédito",
  },
];

function ServicosPage() {
  return (
    <PageShell
      eyebrow="Escolha, veja exemplos e solicite"
      title="Serviços"
      intro="Tudo o que a DUO faz, em linguagem simples. Escolha o que você precisa e envie sua solicitação em poucos passos."
    >
      <CardGrid>
        {servicos.map((s) => (
          <InfoCard key={s.title} {...s} />
        ))}
      </CardGrid>
      <div className="mt-10">
        <Link
          to="/painel-cliente"
          className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-primary-foreground"
        >
          Solicitar pelo painel do cliente
        </Link>
      </div>
    </PageShell>
  );
}
