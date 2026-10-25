import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(6).max(200),
});

export const clientStatusSchema = z.enum(["lead", "ativo", "inativo", "em_negociacao"]);

export const clientCreateSchema = z.object({
  nome: z.string().trim().min(2).max(120),
  contato: z.string().trim().max(120).optional().nullable(),
  email: z.string().trim().email().max(254).optional().nullable().or(z.literal("")),
  telefone: z.string().trim().max(40).optional().nullable(),
  empresa: z.string().trim().max(120).optional().nullable(),
  documento: z.string().trim().max(20).optional().nullable(),
  tipo: z.string().trim().max(60).optional().nullable(),
  status: clientStatusSchema.default("lead"),
  servicos: z.array(z.string().trim().max(80)).max(30).default([]),
  observacoes: z.string().trim().max(4000).optional().nullable(),
});

export const clientUpdateSchema = clientCreateSchema.partial().extend({
  id: z.string().min(1),
});

export const clientListQuerySchema = z.object({
  q: z.string().max(120).optional(),
  status: z.string().max(30).optional(),
  sortBy: z.enum(["createdAt", "nome"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export function sanitizeString(s: unknown, max = 4000): string {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, max);
}

// ── Blog ───────────────────────────────────────────────────────────────────

export const postStatusSchema = z.enum(["draft", "published"]);

export const postCreateSchema = z.object({
  title: z.string().trim().min(3).max(160),
  slug: z
    .string()
    .trim()
    .max(80)
    .optional()
    .nullable()
    .or(z.literal("")),
  coverImage: z.string().trim().max(2048).optional().nullable().or(z.literal("")),
  excerpt: z.string().trim().min(10).max(320),
  content: z.string().trim().min(20).max(60_000),
  status: postStatusSchema.default("draft"),
});

export const postUpdateSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(3).max(160).optional(),
  slug: z.string().trim().max(80).optional().nullable().or(z.literal("")),
  coverImage: z.string().trim().max(2048).optional().nullable().or(z.literal("")),
  excerpt: z.string().trim().min(10).max(320).optional(),
  content: z.string().trim().min(20).max(60_000).optional(),
  status: postStatusSchema.optional(),
});

export const postListQuerySchema = z.object({
  q: z.string().max(120).optional(),
  status: z.string().max(30).optional(),
  sortBy: z.enum(["publishedAt", "createdAt", "title"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const publishedPostListQuerySchema = z.object({
  q: z.string().max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});
