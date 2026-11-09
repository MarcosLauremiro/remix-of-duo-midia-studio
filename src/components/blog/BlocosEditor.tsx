import { Plus } from "lucide-react";
import { CoverImageField } from "@/components/blog/CoverImageField";
import { newBlockDraft, type BlockDraft } from "@/lib/admin/block-drafts";
import { MAX_POST_BLOCKS } from "@/lib/blog";

const inputClass =
  "mt-1 w-full rounded-xl border border-ink/10 bg-background px-3 py-2 text-sm outline-none focus:border-terracotta/40 focus:ring-2 focus:ring-terracotta/20 disabled:opacity-60";

type Props = {
  blocks: BlockDraft[];
  onChange: (blocks: BlockDraft[]) => void;
  disabled?: boolean;
};

/** Lista de blocos (subtítulo, texto e imagem opcional), com adicionar e remover. */
export function BlocosEditor({ blocks, onChange, disabled }: Props) {
  const update = (key: string, patch: Partial<BlockDraft>) =>
    onChange(blocks.map((b) => (b.key === key ? { ...b, ...patch } : b)));

  return (
    <div className="space-y-3">
      {blocks.map((b, i) => (
        <section key={b.key} className="space-y-3 rounded-2xl bg-background p-4 ring-1 ring-ink/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Bloco {i + 1}
            </span>
            {blocks.length > 1 && (
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(blocks.filter((x) => x.key !== b.key))}
                className="text-xs text-destructive underline hover:brightness-110 disabled:opacity-60"
              >
                Remover bloco
              </button>
            )}
          </div>

          <label className="block text-sm">
            <span className="text-ink">Subtítulo *</span>
            <input
              value={b.subtitle}
              onChange={(e) => update(b.key, { subtitle: e.target.value })}
              disabled={disabled}
              required
              maxLength={160}
              className={inputClass}
            />
          </label>

          <label className="block text-sm">
            <span className="text-ink">Texto *</span>
            <textarea
              value={b.text}
              onChange={(e) => update(b.key, { text: e.target.value })}
              disabled={disabled}
              required
              rows={5}
              placeholder="Parágrafos separados por linha em branco. Use - para itens de lista."
              className={`${inputClass} resize-y`}
            />
          </label>

          <CoverImageField
            label="Imagem do bloco (opcional)"
            removeLabel="Remover imagem"
            savedUrl={b.image}
            pendingFile={b.imageFile}
            disabled={disabled}
            onChange={(file) =>
              update(b.key, file ? { imageFile: file } : { imageFile: null, image: null })
            }
          />
        </section>
      ))}

      <button
        type="button"
        onClick={() => onChange([...blocks, newBlockDraft()])}
        disabled={disabled || blocks.length >= MAX_POST_BLOCKS}
        className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-terracotta/50 px-4 py-2 text-sm font-semibold text-terracotta hover:bg-terracotta/5 disabled:opacity-60"
      >
        <Plus className="size-4" /> Adicionar bloco
      </button>
    </div>
  );
}
