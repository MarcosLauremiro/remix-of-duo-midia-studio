import { createHash } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  coverDeliveryUrl,
  isCloudinaryCoverUrl,
  validateCoverFile,
  COVER_UPLOAD_MAX_BYTES,
} from "../src/lib/cover";
import { coverUploadSchema } from "../src/lib/admin/validators";
import { buildSignature, uploadCover, COVER_FOLDER } from "../src/lib/cloudinary.server";

const PNG_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAAAAA";

describe("assinatura do Cloudinary", () => {
  it("ordena os parâmetros e anexa a secret antes do SHA-1", () => {
    const expected = createHash("sha1").update("folder=a&public_id=b&timestamp=1s").digest("hex");
    expect(buildSignature({ timestamp: 1, public_id: "b", folder: "a" }, "s")).toBe(expected);
  });
});

describe("validação de arquivo de capa", () => {
  it("aceita JPG, PNG e WebP até o limite", () => {
    expect(validateCoverFile({ type: "image/jpeg", size: 1000 })).toBeNull();
    expect(validateCoverFile({ type: "image/webp", size: COVER_UPLOAD_MAX_BYTES })).toBeNull();
  });

  it("rejeita tipo não permitido e arquivo acima do limite", () => {
    expect(validateCoverFile({ type: "image/gif", size: 1000 })).not.toBeNull();
    expect(validateCoverFile({ type: "image/png", size: COVER_UPLOAD_MAX_BYTES + 1 })).not.toBeNull();
  });
});

describe("coverUploadSchema (servidor)", () => {
  it("aceita imagem com assinatura correta", () => {
    expect(coverUploadSchema.safeParse({ dataUrl: PNG_DATA_URL }).success).toBe(true);
  });

  it("rejeita SVG, HTML e assinatura que não bate com o tipo", () => {
    expect(
      coverUploadSchema.safeParse({ dataUrl: "data:image/svg+xml;base64,PHN2Zz4=" }).success,
    ).toBe(false);
    expect(
      coverUploadSchema.safeParse({ dataUrl: "data:text/html;base64,PGgxPg==" }).success,
    ).toBe(false);
    expect(
      coverUploadSchema.safeParse({ dataUrl: "data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAAAAA" })
        .success,
    ).toBe(false);
  });

  it("rejeita payload acima do limite de tamanho decodificado", () => {
    const bytes = COVER_UPLOAD_MAX_BYTES + 3000;
    const body = "A".repeat(Math.ceil((bytes * 4) / 3));
    expect(
      coverUploadSchema.safeParse({ dataUrl: `data:image/png;base64,iVBORw0KGgo${body}` }).success,
    ).toBe(false);
  });
});

describe("coverDeliveryUrl", () => {
  it("aplica formato, qualidade e largura automáticos em capas do Cloudinary", () => {
    expect(
      coverDeliveryUrl("https://res.cloudinary.com/duomidea/image/upload/v1/duo-midia/blog/capas/x.png"),
    ).toBe(
      "https://res.cloudinary.com/duomidea/image/upload/f_auto,q_auto,c_limit,w_1280/v1/duo-midia/blog/capas/x.png",
    );
  });

  it("mantém data URL antiga, URL externa e ausência de capa como estão", () => {
    expect(coverDeliveryUrl(PNG_DATA_URL)).toBe(PNG_DATA_URL);
    expect(coverDeliveryUrl("https://exemplo.com/capa.jpg")).toBe("https://exemplo.com/capa.jpg");
    expect(coverDeliveryUrl(null)).toBeNull();
  });
});

describe("uploadCover (fetch simulado)", () => {
  const env = { CLOUDINARY_CLOUD_NAME: "nuvem", CLOUDINARY_API_KEY: "chave", CLOUDINARY_API_SECRET: "segredo" };
  const saved: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const k of Object.keys(env)) saved[k] = process.env[k];
    Object.assign(process.env, env);
  });
  afterEach(() => {
    for (const k of Object.keys(env)) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
    vi.unstubAllGlobals();
  });

  it("envia arquivo assinado para a pasta de capas e devolve a URL segura", async () => {
    const fetchMock = vi.fn(async () =>
      Response.json({ secure_url: "https://res.cloudinary.com/nuvem/image/upload/v1/x.png", public_id: "x" }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await uploadCover(PNG_DATA_URL);
    expect(result.url).toBe("https://res.cloudinary.com/nuvem/image/upload/v1/x.png");

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.cloudinary.com/v1_1/nuvem/image/upload");
    const form = init.body as FormData;
    expect(form.get("folder")).toBe(COVER_FOLDER);
    expect(form.get("api_key")).toBe("chave");
    const signed = Object.fromEntries(
      ["folder", "public_id", "timestamp"].map((k) => [k, form.get(k) as string]),
    );
    expect(form.get("signature")).toBe(buildSignature(signed, "segredo"));
  });

  it("falha com erro de upstream quando o Cloudinary recusa, sem repassar o corpo", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response('{"error":{"message":"Invalid Signature segredo"}}', { status: 401 })),
    );
    const err = await uploadCover(PNG_DATA_URL).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(Error);
    expect((err as Error).message.startsWith("UPSTREAM:")).toBe(true);
    expect((err as Error).message).not.toContain("segredo");
  });

  it("nomeia só as variáveis ausentes quando a configuração está incompleta", async () => {
    delete process.env.CLOUDINARY_API_SECRET;
    const err = await uploadCover(PNG_DATA_URL).catch((e: unknown) => e);
    expect((err as Error).message).toContain("CLOUDINARY_API_SECRET");
    expect((err as Error).message).not.toContain("chave");
  });
});

describe("isCloudinaryCoverUrl", () => {
  it("aceita só URL de imagem entregue pelo Cloudinary", () => {
    expect(
      isCloudinaryCoverUrl("https://res.cloudinary.com/duomidea/image/upload/v1/x.png"),
    ).toBe(true);
    expect(isCloudinaryCoverUrl("https://www.duomidia.net/_serverFn/abc")).toBe(false);
    expect(isCloudinaryCoverUrl(undefined)).toBe(false);
    expect(isCloudinaryCoverUrl({ url: "x" })).toBe(false);
  });
});
