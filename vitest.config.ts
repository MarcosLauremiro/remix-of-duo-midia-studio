// Config própria dos testes. Não herda vite.config.ts: o plugin da Cloudflare e o plugin Lovable
// sobem servidores de desenvolvimento que conflitam com o Vitest.
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
