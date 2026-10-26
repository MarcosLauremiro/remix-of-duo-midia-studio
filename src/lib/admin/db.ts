// Tipos de domínio e helpers puros. A persistência fica em src/lib/data/ (MongoDB).
import { randomUUID } from "node:crypto";

export type AdminDoc = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin";
  status: "active" | "disabled";
  /** Incrementado no logout e na troca de senha; tokens com versão menor são rejeitados. */
  tokenVersion?: number;
  createdAt: string;
  updatedAt: string;
};

export type ClientDoc = {
  id: string;
  nome: string;
  contato?: string | null;
  email?: string | null;
  telefone?: string | null;
  empresa?: string | null;
  documento?: string | null;
  tipo?: string | null;
  status: "lead" | "ativo" | "inativo" | "em_negociacao";
  servicos: string[];
  observacoes?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type PostDoc = {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  excerpt: string;
  content: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  deletedAt?: string | null;
};

export type ClientListParams = {
  q?: string;
  status?: string;
  sortBy: "createdAt" | "nome";
  sortDir: "asc" | "desc";
  page: number;
  limit: number;
  includeDeleted?: boolean;
};

export type PostListParams = {
  q?: string;
  status?: string;
  sortBy?: "publishedAt" | "createdAt" | "title";
  sortDir?: "asc" | "desc";
  page: number;
  limit: number;
  includeDeleted?: boolean;
};

export function normalizeEmail(e: string) {
  return e.trim().toLowerCase();
}

export function newId() {
  return randomUUID();
}

export function nowIso() {
  return new Date().toISOString();
}

export function slugify(input: string): string {
  return (
    input
      .trim()
      .toLowerCase()
      .normalize("NFD")
      // Remove diacríticos
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "artigo"
  );
}
