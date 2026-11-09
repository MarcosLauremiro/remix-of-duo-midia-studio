// Regras puras do blog, compartilhadas entre cliente e servidor. Sem efeitos colaterais.

/** Bloco do artigo: subtítulo, texto e imagem opcional (URL do Cloudinary). */
export type PostBlock = {
  subtitle: string;
  text: string;
  image: string | null;
};

export const MAX_POST_BLOCKS = 20;

/**
 * Blocos a exibir. Posts antigos só têm `content` (texto único): viram um bloco sem subtítulo.
 */
export function postBlocks(post: {
  blocks?: PostBlock[] | null;
  content?: string | null;
}): PostBlock[] {
  if (post.blocks && post.blocks.length > 0) return post.blocks;
  const legacy = post.content?.trim();
  return legacy ? [{ subtitle: "", text: legacy, image: null }] : [];
}
