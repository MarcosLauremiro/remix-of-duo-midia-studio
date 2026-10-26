# CLAUDE.md

Instruções persistentes para o Claude Code neste projeto. Regras de documentação: `.claude/rules/documentation.md`. Convenções de rotas: `src/routes/README.md`. API e banco: `docs/API-AND-DATABASE.md`.

## Projeto

Site institucional e painel administrativo da **Duo Mídia / Duo Studio**, agência de marketing e comunicação. Interface em **pt-BR**.

- Conectado ao **Lovable**: leia `AGENTS.md` antes de mexer no git. Não reescreva histórico, não faça force push, não faça rebase/amend/squash de commits já publicados. Commits enviados à `main` sincronizam com o editor Lovable.
- `README.md` é o briefing original do protótipo (DuoHub) e está desatualizado. Não use como fonte de verdade.

## Stack

- TanStack Start (SSR) + TanStack Router (roteamento por arquivo) + TanStack Query (configurado, não usado)
- React 19, TypeScript (`strict`), Vite 8 via `@lovable.dev/vite-tanstack-config` com `nitro: false`
- Deploy: **Cloudflare Workers** via `@cloudflare/vite-plugin` + `wrangler.jsonc`
- Banco: **MongoDB** (driver oficial `mongodb`), um cliente por operação (`withDb`)
- Tailwind CSS 4, componentes Radix/shadcn em `src/components/ui/`, zod, react-hook-form, lucide-react
- Gerenciador: `bun.lock` (`bunfig.toml` com guarda de 24h para novas versões)

## Comandos

| Ação | Comando |
| --- | --- |
| Instalar | `bun install` |
| Dev | `npm run dev` |
| Build (remove `.dev.vars` gerado) | `npm run build` |
| Testes unitários | `npm test` (integração com MongoDB só se `MONGODB_URI_TEST` e `MONGODB_DB_TEST` forem definidas, com nome contendo "test") |
| Typecheck | `npm run typecheck` |
| Lint | `npm run lint` |
| Índices do banco | `npm run db:setup` (idempotente; rodar antes do primeiro deploy) |
| Importar `.data/store.json` | `npm run db:import` (dry-run); `npm run db:import -- --apply` grava |
| Criar/reativar admin | `ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run admin:create` |
| Deploy | `npm run deploy` (build + `wrangler deploy -c dist/server/wrangler.json`) |

Scripts `db:*` e `admin:create` leem o `.env` local via `--env-file-if-exists`. Nunca imprima valores de `.env`.

## Estrutura

| Caminho | Responsabilidade |
| --- | --- |
| `src/server.ts` | Entrada do Worker. Envolve o handler do TanStack Start e troca erros de SSR por uma página de erro. |
| `src/start.ts`, `src/router.tsx` | `createStart` com middleware de erro; router com `QueryClient`. |
| `src/routes/` | Rotas por arquivo (ver `src/routes/README.md`). `routeTree.gen.ts` é gerado: não editar. |
| `src/routes/admin/` | Painel admin. `route.tsx` tem guarda de sessão no cliente (só UX). |
| `src/lib/data/` | Persistência MongoDB: `mongo.ts` (conexão, `withDb`, `escapeRegex`), `admins.ts`, `clients.ts`, `posts.ts`, `login-attempts.ts`. |
| `src/lib/admin/` | Backend admin: `admin.server.ts`, `blog.server.ts` (server functions), `auth.ts` (cookie e guarda), `session.ts` (senha e token, puro), `http-errors.ts`, `validators.ts`, `db.ts` (tipos e helpers puros). |
| `src/lib/errors.ts` | `ConfigError` e `DataUnavailableError`. |
| `src/components/` | `SiteHeader`, `PageShell`, `blog/`. |
| `scripts/` | `db-setup.mjs`, `import-store-to-mongo.mjs`, `create-admin.mjs`, `remove-dev-vars.mjs`, e `lib/` (índices, conexão de script, planejamento da importação). |
| `tests/` | Vitest: sessão/senha, validação de capa, planejamento da importação e integração com banco de teste. |
| `.data/store.json` | Dados legados em JSON. **Só para a importação**. Nunca lido pela aplicação. Ignorado pelo git. |

## Arquitetura

```
Páginas (React)  ──xxxFn({ data })──▶  *.server.ts (server functions)
                                          │ 1. inputValidator (zod)
                                          │ 2. withAdmin(): cookie → verifySession → loadActiveAdmin (Mongo)
                                          │ 3. handleErrors(): erro → Response (sem stack, sem segredo)
                                          ▼
                                       withDb(): conexão por operação
                                          ▼
                                       src/lib/data/*  (admins, clients, posts, login-attempts)
```

- Todas as operações de dados são assíncronas e passam por `withDb`. Não existe mais armazenamento em arquivo ou memória em produção.
- Duplicidade de slug e e-mail é bloqueada por índice único (`npm run db:setup`). Erro E11000 vira 400 "Já existe um registro".
- Falha de conexão com o banco vira 503 `Serviço temporariamente indisponível`, sem a URI.

### Autenticação

- Senha: scrypt no formato `scrypt$N$r$p$salt$hash`. Hashes antigos continuam válidos.
- Sessão: JWT HS256 em cookie `duo_admin_session` (`HttpOnly`, `Secure` sempre, `SameSite=Lax`, 12h).
- Claims: `sub` (id do admin) e `v` (`tokenVersion`). Logout e troca de senha incrementam `tokenVersion` e invalidam sessões.
- `SESSION_SECRET` com 32+ caracteres é obrigatório. Sem ele, qualquer operação de sessão falha fechada. **Não existe fallback.**
- Rate limit de login persistido no MongoDB (`login_attempts`, TTL), 10 tentativas por minuto por IP + e-mail.
- Operações admin recusam requisições com `Origin` diferente do próprio host (CSRF).

### Fluxos principais

- **Login**: `loginFn` aplica o rate limit, busca o admin pelo e-mail, verifica a senha e grava o cookie. Resposta 400 com mensagem genérica em ambos os casos (e-mail inexistente ou senha errada). Só o caso de e-mail inexistente ou admin inativo recebe atraso de 400 ms.
- **Admin não é criado pelo login.** Use `npm run admin:create`.
- **Clientes**: exclusão lógica (`deletedAt`) com restauração. Busca usa regex escapada, sem diferenciar maiúsculas.
- **Blog**: `draft` ou `published`. Slug único entre posts não excluídos. Home e `/blog` leem só publicados.
- **Capa do post**: data URL (JPG, PNG ou WebP, até ~2 MB), validada no servidor pela assinatura binária. Fica dentro do documento do post.
- **Demo do cliente** (`entrar`, `pacotes`, `painel-cliente`): não usa backend, guarda estado no `localStorage`.

## Convenções

- Código só de servidor em `*.server.ts` ou em módulos importados apenas por eles. O ESLint bloqueia o pacote `server-only` do Next.js.
- Alias `@/*` aponta para `src/*`.
- Prettier: largura 100, aspas duplas, vírgula final.
- Textos da interface em pt-BR, sem jargão técnico na área do cliente.
- Regra de negócio fica em `src/lib/data/` e `src/lib/admin/`, não nas rotas nem nos componentes.
- Não criar `src/pages/`. Não usar `process.env` fora de `src/lib/` e dos scripts.

## Decisões de arquitetura

- **MongoDB com um cliente por operação.** Sockets não podem ser reutilizados entre requisições no Workers. Custo: cerca de 300 ms por operação, segundo a documentação da Cloudflare (não medido aqui). Alternativa recomendada: Durable Object mantendo o cliente. Não implementada.
- **Hyperdrive descartado**: não suporta MongoDB.
- **Plugin oficial da Cloudflare em vez de Nitro.** O driver `mongodb` é CJS, e o shim `__require` do Nitro falhava no workerd com `No such module "node:process"`. O `wrangler` empacota o driver corretamente. `nitro: false` no plugin Lovable.
- **Índices criados por script, não pelo runtime.** Evita round-trips a cada conexão e mantém a unicidade fora do caminho da requisição.
- **Importação idempotente com `$setOnInsert`.** Nunca sobrescreve documentos existentes. Conflitos são reportados.
- **Cover em data URL dentro do documento.** Simples, mas aumenta as listagens de posts. Migrar para armazenamento de objetos (R2) exige autorização e bucket.
- **Server functions em vez de API REST.** Tipagem compartilhada; endpoints são `/_serverFn/<hash>`, não caminhos REST.
- **`tokenVersion` no admin.** Permite invalidar sessões no logout sem tabela de sessões.

## Pontos de atenção

- O plugin da Cloudflare grava `dist/<env>/.dev.vars` com **todas as variáveis do `.env`** a cada build. `npm run build` e `npm run deploy` removem esse arquivo. Nunca publique a pasta `dist` inteira.
- `src/routes/admin/.fuse_hidden*`: arquivos órfãos, não rastreados, sem extensão `.tsx`. Não editar nem usar como referência.
- `src/routes/admin/_layout.tsx`: vazio (`export {}`). Pode ser removido após confirmação.
- `.codegraph/` não está no `.gitignore`.
- Contratos e serviços **não existem no código**. Não criar sem especificação.
- Uploads de arquivos de clientes **não existem**. Armazenamento de objetos aguarda autorização.
- Conexão real com o MongoDB de produção **não foi validada** nesta base (sem credenciais de teste no ambiente de desenvolvimento).
