// Blocos em edição no formulário do blog (criação e edição). Só navegador: o upload usa a server function.
import { uploadCoverFile } from "@/lib/admin/cover-upload";
import type { PostBlock } from "@/lib/blog";

/** Bloco em edição no formulário. A imagem é enviada só ao salvar. */
export type BlockDraft = {
  key: string;
  subtitle: string;
  text: string;
  /** URL já salva (null se o bloco não tem imagem). */
  image: string | null;
  /** Imagem escolhida e ainda não enviada. */
  imageFile: File | null;
};

let keySeq = 0;

export function newBlockDraft(init?: Partial<Omit<BlockDraft, "key">>): BlockDraft {
  keySeq += 1;
  return { key: `bloco-${keySeq}`, subtitle: "", text: "", image: null, imageFile: null, ...init };
}

export function draftsFromBlocks(blocks: PostBlock[]): BlockDraft[] {
  return blocks.map((b) => newBlockDraft({ subtitle: b.subtitle, text: b.text, image: b.image }));
}

/** Subtítulo e texto de todos os blocos preenchidos (mesmo mínimo do servidor). */
export function blocksAreComplete(drafts: BlockDraft[]): boolean {
  return drafts.every((d) => d.subtitle.trim().length >= 2 && d.text.trim().length >= 2);
}

/** Envia as imagens pendentes (uma por vez) e devolve os blocos prontos para salvar. */
export async function resolveBlocks(drafts: BlockDraft[]): Promise<PostBlock[]> {
  const out: PostBlock[] = [];
  for (const d of drafts) {
    const image = d.imageFile ? await uploadCoverFile(d.imageFile) : d.image;
    out.push({ subtitle: d.subtitle, text: d.text, image });
  }
  return out;
}
