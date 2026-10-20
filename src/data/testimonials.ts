/**
 * ─────────────────────────────────────────────────────────────────────
 *  DEPOIMENTOS, GOOGLE REVIEWS (curadoria manual)
 * ─────────────────────────────────────────────────────────────────────
 *
 *  Avaliações reais coletadas em 2026-10-16 via link do perfil Google
 *  enviado pelo cliente: https://share.google/TrMVE6h4WuzA8ViHh
 *  Fotos salvas localmente em src/assets/testimonials/ com import
 *  estático, vínculo 1:1 nome ↔ foto ↔ texto verificado.
 *
 *  Como adicionar novas avaliações:
 *  1. Acesse o perfil no Google Maps → aba "Avaliações".
 *  2. Copie nome, texto, nota e data. Salve a foto do avatar em
 *     src/assets/testimonials/<nome>.png
 *  3. Adicione: import novoImg from "@/assets/testimonials/novo.png";
 *     e um novo objeto no array abaixo com image: novoImg.
 * ─────────────────────────────────────────────────────────────────────
 */

import camilaMagalhaesImg from "@/assets/testimonials/camila-magalhaes.png";
import eltonSalesImg from "@/assets/testimonials/elton-sales.png";
import lianaMeloImg from "@/assets/testimonials/liana-melo.png";
import nadyaJacobImg from "@/assets/testimonials/nadya-jacob.png";

export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  /** URL da foto real do avaliador ou null para avatar neutro com iniciais. */
  image: string | null;
  googleUrl?: string;
};

/** Link do perfil da empresa no Google, exibido em "Ver todas no Google". */
export const GOOGLE_REVIEWS_URL = "https://share.google/TrMVE6h4WuzA8ViHh";

export const testimonials: Testimonial[] = [
  {
    quote:
      "Fiquei extremamente satisfeita com o atendimento e o profissionalismo da equipe da DuoMídia. Foram super atenciosos, entenderam exatamente o que eu precisava e entregaram um trabalho de altíssima qualidade, dentro do prazo. Comunicação rápida, resultado impecável e total comprometimento. Recomendo de olhos fechados! 👏🔥",
    name: "Nadya Jacob",
    rating: 5,
    date: "há 11 meses",
    image: nadyaJacobImg,
  },
  {
    quote:
      "Atendimento excelente! As meninas são super atenciosas, entendem do assunto e entregam resultados de verdade. Recomendo demais!",
    name: "Elton Sales",
    rating: 5,
    date: "há 11 meses",
    image: eltonSalesImg,
  },
  {
    quote: "Atendimento e serviço de qualidade. Obrigada!",
    name: "Liana Melo",
    rating: 5,
    date: "há 10 meses",
    image: lianaMeloImg,
  },
  {
    quote: "Profissionais de altíssima qualidade. Entregam o que propõem, recomendo!",
    name: "Camila Magalhães",
    rating: 5,
    date: "há 6 anos",
    image: camilaMagalhaesImg,
  },
];
