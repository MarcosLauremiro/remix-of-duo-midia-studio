// @lovable.dev/vite-tanstack-config already includes the following, do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
//
// Deploy: o build usa o plugin oficial da Cloudflare (sem Nitro). Motivo: o driver do MongoDB
// é CJS e o shim de require do Nitro falha no runtime do Workers ("No such module node:process").
// Com o plugin oficial, o Wrangler empacota o driver e ele carrega no workerd.
// `nitro: false` desativa o adaptador do Nitro dentro do plugin Lovable.
import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: false,
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  vite: {
    plugins: [cloudflare({ viteEnvironment: { name: "ssr" } })],
  },
});
