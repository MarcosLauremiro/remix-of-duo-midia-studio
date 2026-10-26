# CLAUDE.md

Instruções persistentes para o Claude Code neste projeto. Detalhes de regras de documentação em `.claude/rules/documentation.md`. Convenções de rotas em `src/routes/README.md`.

## Projeto

Site institucional e painel administrativo da **Duo Mídia / Duo Studio**, agência de marketing e comunicação. Interface em **pt-BR**.

- Conectado ao **Lovable**: leia `AGENTS.md` antes de mexer no git. Não reescreva histórico, não faça force push, não faça rebase/amend/squash de commits já publicados. Commits enviados à `main` sincronizam com o editor Lovable.
- `README.md` é o briefing original do protótipo (DuoHub). Está desatualizado: hoje existe login admin e persistência. Não use como fonte de verdade.

## Stack

- TanStack Start (SSR) + TanStack Router (roteamento por arquivo) + TanStack Query (configurado, ainda não usado)
- React 19, TypeScript (`strict`), Vite via `@lovable.dev/vite-tanstack-config`, build com Nitro
- Tailwind CSS 4, componentes Radix/shadcn em `src/components/ui/`
- zod (validação), react-hook-form, lucide-react
- Gerenciador: lockfile `bun.lock` (`bunfig.toml` com guarda de 24h para novas versões)
- Deploy: `vercel.json` presente; `.lovable/project.json` para o editor

## Comandos

| Ação | Comando |
| --- | --- |
| Instalar | `npm i` (ou `bun install`) |
| Dev | `npm run dev` |
| Build | `npm run build` (dev: `npm run build:dev`) |
| Preview do build | `npm run preview` |
| Lint | `npm run lint` |
| Formatar | `npm run format` |
| Criar admin inicial | `ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run admin:create` (`ADMIN_NAME` opcional, senha com 8+ caracteres) |

**Testes: não existem.** Não há framework nem script de teste.

Variáveis de ambiente estão em `.env.example`. `SESSION_SECRET` é obrigatório em produção. `MONGODB_URI` aparece no exemplo mas **não é lida por nenhum código**.

## Estrutura

| Caminho | Responsabilidade |
| --- | --- |
| `src/server.ts` | Entrada do servidor. Envolve o handler do TanStack Start e troca erros de SSR por uma página de erro. |
| `src/start.ts` | `createStart` com middleware global de erro. |
| `src/router.tsx` | Cria o router e o `QueryClient` no contexto. |
| `src/routes/` | Rotas por arquivo. Ver `src/routes/README.md`. `routeTree.gen.ts` é gerado: não editar. |
| `src/routes/__root.tsx` | Shell HTML, CSS global, `QueryClientProvider`, reporte de erros ao Lovable. |
| `src/routes/admin/` | Painel admin. `route.tsx` é o layout com guarda de sessão no cliente. |
| `src/components/` | `SiteHeader` (cabeçalho, rodapé, CTA do WhatsApp), `PageShell` (layout e cards), `blog/` (cards do blog). |
| `src/components/ui/` | Kit shadcn gerado. Hoje nenhuma página o usa diretamente. |
| `src/lib/admin/` | Todo o backend. Ver a seção de arquitetura. |
| `src/lib/error-*.ts`, `lovable-error-reporting.ts` | Páginas de erro e integração de erros com o Lovable. |
| `src/data/testimonials.ts` | Depoimentos estáticos. |
| `src/assets/` | Imagens importadas direto nas páginas. Alguns `*.asset.json` são metadados do Lovable. |
| `scripts/create-admin.mjs` | Cria ou reativa o admin direto em `.data/store.json`. |
| `.data/store.json` | Banco local em JSON. Ignorado pelo git. |

## Arquitetura

O projeto não tem API REST própria. As páginas chamam **server functions** (`createServerFn`) como se fossem funções comuns. O TanStack Start transforma isso em chamadas HTTP.

```
Páginas / componentes (React)
   │  chamam  xxxFn({ data })
   ▼
src/lib/admin/*.server.ts   (server functions)
   │  1. inputValidator (zod, validators.ts)
   │  2. requireAdmin() nas rotas de admin (cookie → findAdminById)
   ▼
src/lib/admin/db.ts         (getStore / saveStore)
   ▼
.data/store.json            (JSON inteiro, lido e gravado a cada operação)
```

- **`db.ts`**: tipos `AdminDoc`, `ClientDoc`, `PostDoc`. Se o disco não puder ser gravado, cai para memória. O comentário no arquivo indica que a intenção é migrar para Mongo mantendo a mesma interface.
- **`auth.ts`**: scrypt para senhas, token HMAC (`SESSION_SECRET`) no cookie `duo_admin_session`, rate limit em memória.
- **`admin.server.ts`**: login, logout, `meFn`, dashboard e CRUD de clientes.
- **`blog.server.ts`**: leitura pública (`listPublishedPostsFn`, `recentBlogPostsFn`, `getPublishedPostBySlugFn`) e operações admin (`admin*PostFn`).
- **`validators.ts`**: esquemas zod de entrada.

### Fluxos principais

- **Login**: `loginFn` aplica rate limit por IP + e-mail (10 por minuto), confere a senha e grava o cookie. Se não houver nenhum admin, cria um a partir de `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
- **Proteção do `/admin`**: `routes/admin/route.tsx` chama `meFn()` no navegador e redireciona para `/admin/login` sem sessão. Isso é só experiência de usuário. A segurança fica no `requireAdmin()` de cada server function.
- **Clientes**: exclusão é lógica (`deletedAt`), com opção de restaurar. Listagem tem busca, filtro de status, ordenação e paginação em `listClients`.
- **Blog**: post tem status `draft` ou `published`. O slug é gerado com `ensureUniquePostSlug`. A home (`BlogSection`) e `/blog` leem só posts publicados.
- **Demo do cliente**: `entrar.tsx`, `pacotes.tsx` e `painel-cliente.tsx` não falam com o backend. Guardam estado no `localStorage` (`duo-demo-user`, `duo-demo-creditos`).

## Convenções

- Módulos que só rodam no servidor ficam em arquivos `*.server.ts`. O ESLint bloqueia o pacote `server-only` do Next.js.
- Alias `@/*` aponta para `src/*`.
- Prettier: largura 100, aspas duplas, vírgula final (`.prettierrc`).
- Textos da interface em pt-BR, sem jargão técnico na área do cliente.
- Arquivos de rota seguem `src/routes/README.md`. Não criar `src/pages/`.

## Decisões de arquitetura

- **Persistência em JSON**: escolhida por simplicidade e para rodar sem banco. Consequências: sem garantia de escrita concorrente, `store.json` não persiste em ambientes serverless e cada operação relê o arquivo inteiro. Migrar para Mongo significa trocar `getStore`/`saveStore`.
- **Server functions em vez de API REST**: a tipagem é compartilhada entre cliente e servidor.
- **Sem testes automatizados** até o momento.

## Pontos de atenção

- `src/routes/admin/.fuse_hidden*`: arquivos locais órfãos do sistema de arquivos (ignorados pelo git). Não têm extensão `.tsx`, então não viram rotas. Importam `@/server/admin.server`, que não existe. Não editar nem usar como referência.
- `src/routes/admin/_layout.tsx`: rastreado, mas vazio (`export {}`). Pode ser removido após confirmação.
- `.codegraph/` não está no `.gitignore`.
