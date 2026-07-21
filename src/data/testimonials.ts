/**
 * ─────────────────────────────────────────────────────────────────────
 *  DEPOIMENTOS — GOOGLE REVIEWS (curadoria manual)
 * ─────────────────────────────────────────────────────────────────────
 *
 *  Como migrar as avaliações do Google para cá (passo a passo):
 *
 *  1. Acesse o perfil da empresa no Google:
 *     https://www.google.com/maps  →  busque "DUO | Mídia & Studio"
 *     → aba "Avaliações".
 *
 *  2. Para cada avaliação que quiser destacar, copie:
 *       • O texto (quote)
 *       • O nome da pessoa (name)
 *       • A nota (rating: 1 a 5)
 *       • A data (date: ex. "há 2 meses" ou "Mar 2025")
 *       • A foto do perfil — clique com o botão direito → "Salvar imagem como"
 *         e coloque em src/assets/testimonials/  (ou use uma URL pública)
 *
 *  3. Edite o array abaixo. Basta duplicar um bloco e trocar os dados.
 *     O carrossel se ajusta automaticamente à quantidade de itens.
 *
 *  4. Se quiser um botão "Ver todas no Google", ajuste GOOGLE_REVIEWS_URL
 *     abaixo com o link do perfil da empresa.
 *
 *  Observação: por ora as fotos usam as imagens já geradas. Substitua
 *  o campo `image` pelo import da foto real assim que tiver.
 * ─────────────────────────────────────────────────────────────────────
 */

import biaHomobonoImg from "@/assets/bia-homobono.png.asset.json";
import camilaMagalhaesImg from "@/assets/testimonials/camila-magalhaes.png.asset.json";
import eltonSalesImg from "@/assets/testimonials/elton-sales.png.asset.json";
import nadyaJacobImg from "@/assets/testimonial-nadya.png.asset.json";
import testimonial1Img from "@/assets/testimonial-1.jpg";
import testimonial2Img from "@/assets/testimonial-2.jpg";
import testimonial3Img from "@/assets/testimonial-3.jpg";
import testimonial4Img from "@/assets/testimonial-4.jpg";

export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  image: string;
  googleUrl?: string; // link direto para a review no Google (opcional)
};

/** Link do perfil da empresa no Google — troque pela URL real. */
export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?q=DUO+M%C3%ADdia+%26+Studio+avalia%C3%A7%C3%B5es";

export const testimonials: Testimonial[] = [
  {
    quote:
      "Agência super dedicada ao profissional e no bem estar do atendimento. Super recomendo.",
    name: "Bia Homobono Sales (Bia)",
    rating: 5,
    date: "há 8 meses",
    image: biaHomobonoImg.url,
  },
  {
    quote:
      "Fiquei extremamente satisfeita com o atendimento e o profissionalismo da equipe da DuoMídia. Foram super atenciosos, entenderam exatamente o que eu precisava e entregaram um trabalho de altíssima qualidade, dentro do prazo. Comunicação rápida, resultado impecável e total comprometimento. Recomendo de olhos fechados!",
    name: "Nadya Jacob",
    role: "8 avaliações no Google",
    rating: 5,
    date: "há 1 dia",
    image: nadyaJacobImg.url,
  },
  {
    quote:
      "Atendimento excelente! As meninas são super atenciosas, entendem do assunto e entregam resultados de verdade. Recomendo demais!",
    name: "Elton Sales",
    rating: 5,
    date: "hoje",
    image: eltonSalesImg.url,
  },
  {
    quote:
      "Profissionais de altíssima qualidade. Entregam o que propõem, recomendo!",
    name: "Camila Magalhães",
    rating: 5,
    date: "hoje",
    image: camilaMagalhaesImg.url,
  },
  {
    quote:
      "A DUO transformou a forma como nos comunicamos. Em poucos dias nosso feed ganhou vida e os resultados apareceram.",
    name: "Mariana Ribeiro",
    role: "Diretora de Marketing, VivaBem",
    rating: 5,
    date: "há 1 mês",
    image: testimonial1Img,
  },
  {
    quote:
      "Profissionalismo, criatividade e pontualidade. É raro encontrar um time que entrega tudo isso junto.",
    name: "Ricardo Almeida",
    role: "CEO, Construtora Horizonte",
    rating: 5,
    date: "há 3 meses",
    image: testimonial2Img,
  },
  {
    quote:
      "A DUO facilitou demais nosso dia a dia. Peço uma arte, acompanho tudo e recebo prontinho para publicar.",
    name: "Juliana Costa",
    role: "Gestora de Redes, TechFlow",
    rating: 5,
    date: "há 4 meses",
    image: testimonial3Img,
  },
  {
    quote:
      "A cobertura do nosso evento ficou impecável. Fotos, vídeos e conteúdo para redes saíram no mesmo dia.",
    name: "Fernando Moura",
    role: "Fundador, Summit Brasil",
    rating: 5,
    date: "há 6 meses",
    image: testimonial4Img,
  },
];
