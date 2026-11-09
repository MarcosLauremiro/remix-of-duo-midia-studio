import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { adminCreatePostFn } from "@/lib/admin/blog.server";
import { uploadCoverFile } from "@/lib/admin/cover-upload";
import { CoverImageField } from "@/components/blog/CoverImageField";
import { BlocosEditor } from "@/components/blog/BlocosEditor";
import {
  blocksAreComplete,
  newBlockDraft,
  resolveBlocks,
  type BlockDraft,
} from "@/lib/admin/block-drafts";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/blog/novo")({
  component: NovoPostPage,
});

async function extractError(ex: unknown): Promise<string> {
  if (ex instanceof Response) {
    const body = (await ex.json().catch(() => null)) as { error?: unknown } | null;
    if (typeof body?.error === "string") return body.error;
    return `Erro ${ex.status}`;
  }
  if (ex instanceof Error) {
    // Erro de validação do servidor chega como JSON (lista de issues); outros erros, como texto.
    const issues = parseIssues(ex.message);
    return issues ?? ex.message;
  }
  return String(ex);
}

function parseIssues(raw: string): string | null {
  try {
    const parsed = JSON.parse(raw) as Array<{ path?: string[]; message?: string }>;
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed.map((e) => `${e.path?.join(".") ?? "campo"}: ${e.message}`).join(" | ");
  } catch {
    return null;
  }
}

const fieldClass = (hasError: boolean) =>
  `mt-1 w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 ${
    hasError
      ? "border-destructive focus:border-destructive focus:ring-destructive/20"
      : "border-ink/10 focus:border-terracotta/40 focus:ring-terracotta/20"
  }`;

function NovoPostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  // Trava síncrona contra cliques repetidos (o estado React atualiza só no próximo render).
  const submitting = useRef(false);
  const [excerpt, setExcerpt] = useState("");
  const [blocks, setBlocks] = useState<BlockDraft[]>(() => [newBlockDraft()]);
  const [err, setErr] = useState<string | null>(null);
  const [fieldErrs, setFieldErrs] = useState<{ excerpt?: string; title?: string }>({});
  const [loading, setLoading] = useState(false);

  const close = () => {
    if (!loading) navigate({ to: "/admin/blog" });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    setErr(null);
    // Validação client-side igual ao schema (evita roundtrip com mensagem crua do Zod)
    const fe: typeof fieldErrs = {};
    if (!title.trim() || title.trim().length < 3)
      fe.title = "Título deve ter pelo menos 3 caracteres.";
    if (excerpt.trim().length < 10) fe.excerpt = "Descrição deve ter pelo menos 10 caracteres.";
    setFieldErrs(fe);
    if (Object.keys(fe).length > 0) return;
    if (!blocksAreComplete(blocks)) {
      setErr("Cada bloco precisa de subtítulo e texto.");
      return;
    }

    submitting.current = true;
    setLoading(true);
    try {
      // As imagens vão ao Cloudinary primeiro. O post só é criado se todos os uploads tiverem sucesso.
      setUploading(true);
      const coverImage = coverFile ? await uploadCoverFile(coverFile) : undefined;
      const blocksPayload = await resolveBlocks(blocks);
      setUploading(false);
      // Sem status na criação: o servidor salva como rascunho e o slug é gerado do título.
      const res = await adminCreatePostFn({
        data: { title, coverImage, excerpt, blocks: blocksPayload },
      });
      // O cliente pode resolver mesmo quando o servidor respondeu erro (ex.: 503): valida antes de usar.
      if (!res?.post) {
        setErr("Não foi possível salvar o artigo. Tente novamente.");
        return;
      }
      navigate({ to: "/admin/blog" });
    } catch (ex) {
      const msg = await extractError(ex);
      if (msg.startsWith("excerpt:"))
        setFieldErrs((s) => ({ ...s, excerpt: "Descrição deve ter pelo menos 10 caracteres." }));
      if (msg.startsWith("title:"))
        setFieldErrs((s) => ({ ...s, title: "Título deve ter pelo menos 3 caracteres." }));
      setErr(msg);
    } finally {
      submitting.current = false;
      setUploading(false);
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-2xl flex-col gap-3 overflow-hidden rounded-2xl bg-surface p-5">
        <div className="space-y-1">
          <DialogTitle className="font-display text-xl text-ink">Novo artigo</DialogTitle>
          <DialogDescription className="sr-only">
            Preencha a capa, o título, a descrição e os blocos do artigo, depois salve.
          </DialogDescription>
        </div>

        <form id="novo-artigo" onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col gap-3">
          <CoverImageField
            savedUrl={null}
            pendingFile={coverFile}
            disabled={loading}
            onChange={setCoverFile}
          />

          <label className="block text-sm">
            <span className="text-ink">Título *</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={160}
              placeholder="Ex: Como planejar conteúdo sem sufoco"
              className={fieldClass(Boolean(fieldErrs.title))}
            />
            {fieldErrs.title && (
              <span className="mt-1 block text-xs text-destructive">{fieldErrs.title}</span>
            )}
          </label>

          <label className="block text-sm">
            <span className="text-ink">
              Descrição * <span className="font-normal text-ink-muted">(mín. 10)</span>
            </span>
            <textarea
              value={excerpt}
              onChange={(e) => {
                setExcerpt(e.target.value);
                if (fieldErrs.excerpt) setFieldErrs((s) => ({ ...s, excerpt: undefined }));
              }}
              required
              maxLength={320}
              rows={2}
              placeholder="Aparece no card e no topo do artigo."
              className={`${fieldClass(Boolean(fieldErrs.excerpt))} resize-none`}
            />
            <span
              className={`text-xs ${fieldErrs.excerpt ? "text-destructive" : "text-ink-muted"}`}
            >
              {fieldErrs.excerpt ?? `${excerpt.length}/320`}
            </span>
          </label>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            <span className="block text-sm text-ink">Blocos do artigo *</span>
            <BlocosEditor blocks={blocks} onChange={setBlocks} disabled={loading} />
          </div>
        </form>

        {err && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{err}</p>}

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={close}
            disabled={loading}
            className="rounded-full px-4 py-2 text-sm font-semibold text-ink-muted hover:text-ink disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="novo-artigo"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60"
          >
            {uploading ? "Enviando imagens…" : loading ? "Salvando…" : "Salvar artigo"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
