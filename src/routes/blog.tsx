import { createFileRoute } from "@tanstack/react-router";
import { PageShell, CardGrid, InfoCard } from "@/components/PageShell";
import blog1Img from "@/assets/blog-1.jpg";
import blog2Img from "@/assets/blog-2.jpg";
import blog3Img from "@/assets/blog-3.jpg";
import blog4Img from "@/assets/blog-4.jpg";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — DUO | Mídia & Studio" },
      {
        name: "description",
        content:
          "Conteúdos da DUO sobre marca, redes sociais, produção de vídeo e comunicação em linguagem simples.",
      },
      { property: "og:title", content: "Blog — DUO | Mídia & Studio" },
      {
        property: "og:description",
        content:
          "Conteúdos da DUO sobre marca, redes sociais, produção de vídeo e comunicação em linguagem simples.",
      },
    ],
  }),
  component: BlogPage,
});

const posts = [
  {
    image: blog1Img,
    title: "Como planejar o conteúdo do mês sem sufoco",
    text: "Um passo a passo simples para organizar as publicações da sua marca.",
    tag: "Planejamento",
  },
  {
    image: blog2Img,
    title: "O que faz um vídeo curto dar certo",
    text: "Ritmo, primeira cena e clareza: o que realmente segura a atenção.",
    tag: "Vídeo",
  },
  {
    image: blog3Img,
    title: "Sua marca tem uma voz — e ela precisa ser reconhecível",
    text: "Como manter o mesmo jeito de falar em todos os canais.",
    tag: "Marca",
  },
  {
    image: blog4Img,
    title: "Eventos: o que registrar para render o ano inteiro",
    text: "Um roteiro de imagens que continua útil muito depois do evento.",
    tag: "Coberturas",
  },
];

function BlogPage() {
  return (
    <PageShell
      eyebrow="Conteúdo da DUO"
      title="Blog"
      intro="Ideias, bastidores e dicas práticas de comunicação para quem quer ver a marca crescer."
    >
      <CardGrid>
        {posts.map((p) => (
          <InfoCard key={p.title} {...p} />
        ))}
      </CardGrid>
    </PageShell>
  );
}
