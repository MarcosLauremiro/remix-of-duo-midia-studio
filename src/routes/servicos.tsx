import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, CardGrid, InfoCard } from "@/components/PageShell";
import gestaoRedesImg from "@/assets/duomidea/gestao-redes-sociais.webp";
import trafegoImg from "@/assets/duomidea/trafego-pago.webp";
import artesImpressoesImg from "@/assets/duomidea/artes-impressoes.webp";
import papelariaImg from "@/assets/duomidea/papelaria-timbrados.webp";
import podcast1Img from "@/assets/podcast-1.webp";
import podcast2Img from "@/assets/podcast-2.webp";
import podcast3Img from "@/assets/podcast-3.webp";
import podcast4Img from "@/assets/podcast-4.webp";
import podcastGallery1 from "@/assets/podcast-gallery-1.jpg";
import podcastGallery2 from "@/assets/podcast-gallery-2.jpg";
import eventPhotoTeamImg from "@/assets/coberturas/bastidores-equipe.webp";
import eventPhotoLadyImg from "@/assets/coberturas/lady-velvet.webp";
import eventPhotoCrowdImg from "@/assets/coberturas/publico-lotado.webp";
import eventPhotoBandImg from "@/assets/coberturas/zappelin-ao-vivo.webp";
import { pageSeo } from "@/lib/seo";

const INSTAGRAM_REELS_URL = "https://www.instagram.com/duomidia/reels/";

export const Route = createFileRoute("/servicos")({
  head: () =>
    pageSeo({
      title: "Serviços | DUO | Mídia & Studio",
      description:
        "Serviços da DUO: posts, stories, carrosséis, reels, banners, coberturas de eventos e podcasts.",
      path: "/servicos",
    }),
  component: ServicosPage,
});

const servicos = [
  {
    image: gestaoRedesImg,
    title: "Post para redes sociais",
    text: "Uma arte estática pensada para o seu feed engajar mais.",
    tag: "Incluído no plano",
  },
  {
    image: trafegoImg,
    title: "Story",
    text: "Conteúdo vertical rápido para avisos, novidades e interação.",
    tag: "Incluído no plano",
  },
  {
    image: gestaoRedesImg,
    title: "Carrossel",
    text: "Sequência de artes para explicar, ensinar ou apresentar.",
    tag: "2 créditos",
  },
  {
    image: gestaoRedesImg,
    title: "Reel",
    text: "Vídeo curto editado com trilha e legendas dinâmicas.",
    tag: "5 créditos",
  },
  {
    image: artesImpressoesImg,
    title: "Banner",
    text: "Peça horizontal para sites, e-mails e portais parceiros.",
    tag: "Incluído no plano",
  },
  {
    image: papelariaImg,
    title: "Assinatura de e-mail",
    text: "Comunicação padronizada e elegante para o seu time.",
    tag: "Incluído no plano",
  },
];

const coberturas = [
  {
    image: eventPhotoLadyImg,
    title: "Lady Velvet no palco principal",
    text: "Registro do show com iluminação e telão em destaque.",
    tag: "Motoshow",
  },
  {
    image: eventPhotoCrowdImg,
    title: "Público lotado ao anoitecer",
    text: "Vista do palco para a multidão durante a apresentação.",
    tag: "Motoshow",
  },
  {
    image: eventPhotoBandImg,
    title: "Zappelin ao vivo",
    text: "Captação da banda com fumaça, luzes e muito som.",
    tag: "Motoshow",
  },
  {
    image: eventPhotoTeamImg,
    title: "Bastidores com a equipe DUO",
    text: "O time reunido antes da abertura dos portões.",
    tag: "Bastidores",
  },
];

const episodios = [
  {
    image: podcast1Img,
    title: "Apresentação Bia HS",
    text: "Bate-papo de apresentação gravado no estúdio da DUO.",
    tag: "Episódio",
  },
  {
    image: podcast2Img,
    title: "Doce Sedução: Black Friday",
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

function SectionTitle({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <div className="mt-20">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">{intro}</p>
    </div>
  );
}

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

      <SectionTitle
        eyebrow="Momentos que construímos juntos"
        title="Coberturas"
        intro="Fotos e vídeos dos eventos que a DUO acompanhou de perto, do palco aos bastidores."
      />
      <CardGrid>
        {coberturas.map((c) => (
          <InfoCard key={c.title} {...c} />
        ))}
      </CardGrid>

      <SectionTitle
        eyebrow="DuoCast · nossos episódios"
        title="Podcasts"
        intro="Gravações, bastidores e cortes produzidos no nosso estúdio, prontos para viver nas redes."
      />
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
