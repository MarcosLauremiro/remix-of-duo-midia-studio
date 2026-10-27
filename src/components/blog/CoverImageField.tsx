import { useEffect, useState } from "react";
import { COVER_INPUT_TYPES, validateCoverFile } from "@/lib/cover";

type Props = {
  /** Capa já salva no post (URL ou data URL antiga). */
  savedUrl: string | null;
  /** Arquivo escolhido e ainda não enviado. */
  pendingFile: File | null;
  disabled?: boolean;
  onChange: (file: File | null) => void;
};

/** Escolha de capa: valida o arquivo, mostra a pré-visualização e permite remover. */
export function CoverImageField({ savedUrl, pendingFile, disabled, onChange }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingFile) return;
    const url = URL.createObjectURL(pendingFile);
    setPendingPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingFile]);

  const preview = pendingFile ? pendingPreview : savedUrl;

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const problem = validateCoverFile(file);
    setError(problem);
    if (!problem) onChange(file);
  };

  return (
    <div className="block text-sm">
      <span className="text-ink">
        Imagem de capa{" "}
        <span className="font-normal text-ink-muted">
          (JPG, PNG ou WebP, até 8 MB; a imagem original é preservada)
        </span>
      </span>
      <input
        type="file"
        accept={COVER_INPUT_TYPES.join(",")}
        disabled={disabled}
        onChange={onPick}
        className="mt-1 block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-terracotta/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-terracotta hover:file:brightness-95 disabled:opacity-60"
      />
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
      {pendingFile && (
        <span className="mt-1 block text-xs text-ink-muted">
          Nova capa selecionada. Ela será enviada ao salvar.
        </span>
      )}
      {preview && (
        <span className="mt-3 flex items-start gap-3">
          <img
            src={preview}
            alt="Pré-visualização da capa"
            className="h-28 w-48 rounded-xl object-cover ring-1 ring-ink/10"
          />
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              setError(null);
              onChange(null);
            }}
            className="text-xs text-ink-muted underline hover:text-ink disabled:opacity-60"
          >
            Remover capa
          </button>
        </span>
      )}
    </div>
  );
}
