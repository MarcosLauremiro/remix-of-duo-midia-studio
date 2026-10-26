# API e banco de dados

Documento de referência da camada de servidor: API, persistência, autenticação, configuração e deploy.

## 1. Arquitetura implementada

```
Páginas React ──(server function)──▶ src/lib/admin/*.server.ts
                                       │ inputValidator (zod)
                                       │ withAdmin()  → sessão → admin ativo (MongoDB)
                                       │ handleErrors() → Response sem stack nem segredos
                                       ▼
                                    withDb()  → 1 MongoClient por operação, sempre fechado
                                       ▼
                                    src/lib/data/{admins,clients,posts,login-attempts}.ts
                                       ▼
                                    MongoDB (Railway)
```

- Runtime: Cloudflare Workers com `nodejs_compat`, build com `@cloudflare/vite-plugin` (sem Nitro).
- Não há API REST própria. As chamadas são server functions do TanStack Start, endpoints `POST|GET /_serverFn/<hash>`. O hash é gerado pelo build; use sempre o cliente tipado (`fnName({ data })`).

## 2. Banco escolhido e justificativa

- **MongoDB** já provisionado no Railway. Mantido por ser o banco existente.
- **Driver oficial `mongodb` (v7)**. Documentação da Cloudflare: funciona com `nodejs_compat` (data de compatibilidade ≥ 2025-03-20 para `node:net`/`node:tls`).
- **Hyperdrive não é usado**: não suporta MongoDB (só Postgres e MySQL).
- **Um cliente por operação** (`withDb`): sockets não podem ser reutilizados entre requisições no Workers. Custo de latência: cerca de 300 ms por operação, segundo a documentação da Cloudflare (não medido aqui). A alternativa recomendada é um Durable Object que mantém o cliente. **Não implementada; depende de decisão.**

## 3. Modelos e relacionamentos

| Coleção | Campos principais | Índices (`npm run db:setup`) |
|---|---|---|
| `admins` | `id`, `name`, `email` (normalizado), `passwordHash` (scrypt), `role` (`admin`), `status` (`active`/`disabled`), `tokenVersion`, `createdAt`, `updatedAt` | `id` único; `email` único |
| `clients` | `id`, `nome`, `contato`, `email`, `telefone`, `empresa`, `documento`, `tipo`, `status` (`lead`/`ativo`/`inativo`/`em_negociacao`), `servicos[]`, `observacoes`, `createdAt`, `updatedAt`, `deletedAt` | `id` único; `(deletedAt, createdAt)`; `status` |
| `posts` | `id`, `title`, `slug`, `coverImage` (URL ou data URL), `excerpt`, `content`, `status` (`draft`/`published`), `publishedAt`, `createdAt`, `updatedAt`, `deletedAt` | `id` único; `slug` único **parcial** (`deletedAt: null`); `(status, publishedAt)` |
| `login_attempts` | `_id` (SHA-256 da chave), `count`, `expiresAt` | TTL em `expiresAt` |

- Não há relacionamento formal entre coleções. `clients.servicos` é uma lista de textos.
- `id` é UUID gerado pela aplicação e é o identificador público (usado nas URLs). O `_id` do MongoDB é ocultado (`projection: { _id: 0 }`).
- Datas são strings ISO 8601, como no JSON anterior.
- **Não existem contratos, serviços como entidade nem arquivos de clientes no código.** Não foram criados. Ver seção 11.

## 4. Endpoints (server functions)

Autenticação: "admin" = cookie `duo_admin_session` válido + admin ativo + `tokenVersion` atual. Sem isso: `401 {"error":"Não autenticado"}`.

### Públicos

| Função | Método | Entrada | Saída |
|---|---|---|---|
| `listPublishedPostsFn` | GET | `{ q?, page?, limit? }` | `{ items, total, page, limit, totalPages }` |
| `recentBlogPostsFn` | GET | `{ limit? }` (1–12, padrão 6) | `{ items }` |
| `getPublishedPostBySlugFn` | GET | `{ slug }` | `{ post }` ou 404 |

### Sessão

| Função | Método | Entrada | Saída |
|---|---|---|---|
| `loginFn` | POST | `{ email, password }` | `{ ok, admin: { id, name, email } }` e cookie |
| `logoutFn` | POST | — | `{ ok }`. Invalida todas as sessões do admin e remove o cookie |
| `meFn` | GET | — | `{ admin }` ou `{ admin: null }` (sem erro quando não há sessão) |

### Admin: dashboard e clientes

| Função | Método | Entrada | Saída |
|---|---|---|---|
| `dashboardFn` | GET | — | `{ total, ativos, inativos, leads, emNegociacao, recentes[] }` |
| `listClientsFn` | GET | `{ q?, status?, sortBy?, sortDir?, page?, limit? (1–50) }` | `{ items, total, page, limit, totalPages }` |
| `getClientFn` | GET | `{ id }` | `{ client }` |
| `createClientFn` | POST | campos de cliente (ver `clientCreateSchema`) | `{ client }` |
| `updateClientFn` | POST | `{ id, ...campos parciais }` | `{ client }` |
| `deleteClientFn` | POST | `{ id }` | `{ ok }` (exclusão lógica) |
| `restoreClientFn` | POST | `{ id }` | `{ ok }` |

### Admin: blog

| Função | Método | Entrada | Saída |
|---|---|---|---|
| `adminListPostsFn` | GET | `{ q?, status?, sortBy?, sortDir?, page?, limit? }` | `{ items, total, page, limit, totalPages }` |
| `adminGetPostFn` | GET | `{ id }` ou `{ slug }` | `{ post }` |
| `adminCreatePostFn` | POST | `{ title, excerpt, content, slug?, coverImage?, status? }` | `{ post }` |
| `adminUpdatePostFn` | POST | `{ id, ...campos parciais }` | `{ post }` |
| `adminDeletePostFn` | POST | `{ id }` | `{ ok }` (exclusão lógica) |
| `adminPublishPostFn` | POST | `{ id, status }` | `{ post }` |

### Códigos de erro

| HTTP | Quando | Corpo |
|---|---|---|
| 400 | validação de regra (ex.: slug/e-mail já existente, ID inválido, credenciais) | `{ "error": "<mensagem>" }` |
| 401 | sem sessão, sessão inválida/expirada, admin inativo, sessão invalidada | `{ "error": "Não autenticado" }` |
| 403 | `Origin` diferente do host (CSRF) | `{ "error": "Requisição não permitida" }` |
| 404 | registro não encontrado | `{ "error": "..." }` |
| 429 | mais de 10 tentativas de login por minuto (IP + e-mail) | `{ "error": "Muitas tentativas..." }` |
| 500 | erro interno ou configuração ausente (ex.: `SESSION_SECRET`) | `{ "error": "Erro interno" }` |
| 503 | banco inacessível | `{ "error": "Serviço temporariamente indisponível" }` |

Erros de validação do zod (formato de entrada) são tratados pelo TanStack antes do handler. Nenhuma resposta inclui stack, mensagem do driver ou valor de segredo.

## 5. Autenticação e autorização

- **Senha**: scrypt (`N=16384, r=8, p=1`), formato `scrypt$N$r$p$salt$hash`. Parâmetros fora de faixa ou formato inválido são recusados. Hashes já gravados continuam válidos.
- **Sessão**: JWT HS256 assinado com `SESSION_SECRET`. Claims: `sub` (id do admin), `v` (`tokenVersion`), `iat`, `exp` (12 h). Algoritmo diferente de HS256 é recusado.
- **Cookie**: `duo_admin_session`, `HttpOnly`, `Secure` sempre, `SameSite=Lax`, `Path=/`.
- **Validação em cada requisição admin**: assinatura → expiração → admin existe e está `active` → `tokenVersion` igual ao da sessão.
- **Logout** e **troca de senha** (`npm run admin:create`) incrementam `tokenVersion`, invalidando todas as sessões do admin.
- **Segredo**: `SESSION_SECRET` com 32 caracteres ou mais é obrigatório. Sem ele, a aplicação falha fechada. Não há fallback.
- **Rate limit de login**: contador em `login_attempts` (MongoDB), válido entre instâncias do Worker.
- **CSRF**: operações admin recusam `Origin` diferente do host. Sem `Origin` (clientes não navegadores), a proteção é o cookie `SameSite=Lax` e a autenticação.
- **Autorização**: há um único papel (`admin`). Não há permissões por recurso porque o projeto não define outros papéis.
- **Login sem admin**: o login não cria admin. Use `npm run admin:create`.

## 6. Variáveis e segredos

| Nome | Tipo no Cloudflare | Obrigatória | Uso |
|---|---|---|---|
| `MONGODB_URI` | secret | sim | conexão com o MongoDB (`mongodb+srv://` ou `mongodb://` com TLS) |
| `MONGODB_DB` | var | sim | nome do banco da aplicação |
| `SESSION_SECRET` | secret | sim | assinatura das sessões (32+ caracteres) |
| `ADMIN_EMAIL` | secret | só para `admin:create` | e-mail do admin |
| `ADMIN_PASSWORD` | secret | só para `admin:create` | senha inicial (8+ caracteres). Pode ser removida depois |
| `ADMIN_NAME` | var | não | nome do admin (padrão "Admin") |

`APP_URL`, `PORT` e `NODE_ENV` não são mais lidas pelo código.

Configuração no Cloudflare (nunca no repositório):
```
npx wrangler secret put MONGODB_URI
npx wrangler secret put SESSION_SECRET
npx wrangler secret put MONGODB_DB        # ou defina como var no painel
```
Requisitos de runtime: `nodejs_compat` e data de compatibilidade ≥ 2025-04-01 (já definidos em `wrangler.jsonc`). Com isso, `process.env` expõe variáveis e segredos.

Para desenvolvimento local, use `.env` (copie de `.env.example`). Não commite `.env`.

## 7. Banco: configuração e índices

1. Crie um usuário no MongoDB com privilégio mínimo: `readWrite` **apenas** no banco da aplicação.
2. Defina `MONGODB_URI` e `MONGODB_DB` no ambiente.
3. Crie os índices (idempotente):
   ```
   npm run db:setup
   ```
   Índices de unicidade só existem depois deste passo. Rode antes de qualquer escrita em produção.

## 8. Migração de `.data/store.json`

O arquivo local **não é apagado nem alterado** pelo processo.

1. **Dry-run** (não grava nada):
   ```
   npm run db:import
   ```
   Mostra, por coleção: total, inseridos, iguais, conflitos, inválidos e duplicados.
2. **Aplicar** (cria backup em `.data/backup/store-<timestamp>.json` antes de escrever):
   ```
   npm run db:import -- --apply
   ```
3. **Verificação** (automática ao final): cada documento válido do arquivo deve estar no banco com o mesmo conteúdo. Divergências e ausências geram código de saída 1.

Regras:
- **Idempotente**: `$setOnInsert` com filtro por `id`. Reexecutar não duplica nem sobrescreve.
- **Conflitos** (mesmo `id`, conteúdo diferente no banco): não são sobrescritos e geram código de saída 2 para revisão manual.
- **Inválidos e ids duplicados** bloqueiam a aplicação.
- Hashes de senha são copiados como estão.

Em caso de falha: o backup em `.data/backup/` é a cópia de segurança. Os documentos inseridos podem ser removidos pelo `id` se necessário.

Dados atuais no arquivo: 1 admin, 0 clientes, 0 posts (verificado por contagem, sem exibir conteúdo).

## 9. Como executar localmente

```
bun install
cp .env.example .env        # preencha com valores reais de desenvolvimento
npm run db:setup
npm run admin:create        # com ADMIN_EMAIL e ADMIN_PASSWORD no ambiente
npm run dev
```

## 10. Testes

| Comando | O que cobre | Estado |
|---|---|---|
| `npm test` | sessão, senha, token, validação de capa, slug, planejamento da importação | 28 testes passando |
| `npm test` (integração) | CRUD de clientes, busca com regex literal, slug único, contador de login | **ignorado** sem `MONGODB_URI_TEST` e `MONGODB_DB_TEST` (nome do banco deve conter "test") |
| `npm run typecheck` | TypeScript | passa |
| `npm run lint` | ESLint nos módulos de servidor | passa em `src/lib` |
| `npm run build` | build de produção com o plugin Cloudflare | passa; gera `dist/server/wrangler.json` |
| `wrangler dev` sobre o build | runtime do Workers (smoke test) | ver seção 12 |

Os testes de integração apagam o banco de teste (`dropDatabase`). Só rode com um banco de teste dedicado.

## 11. Deploy no Cloudflare Workers

Pré-requisitos (não executados nesta etapa):
1. Secrets e variáveis da seção 6 configurados no Cloudflare.
2. Índices criados (`npm run db:setup`) no banco de produção.
3. Importação de `.data/store.json` revisada (`npm run db:import`), se houver dados.
4. Usuário admin criado (`npm run admin:create`).

Deploy:
```
npm run deploy
```
O script faz o build, remove o `dist/<env>/.dev.vars` gerado pelo plugin (ele contém o `.env` local) e executa `wrangler deploy -c dist/server/wrangler.json`.

Nome do Worker: `duo-midia-studio` (em `wrangler.jsonc`). Altere se preferir outro nome.

**Domínio e DNS: não alterados.** Domínio personalizado exige decisão sobre a zona DNS; os e-mails na ZenHost dependem dos registros MX/SPF/DKIM atuais.

## 12. Verificação do build no runtime

Executado localmente com `wrangler dev` sobre o artefato de deploy (`dist/server/wrangler.json`), **sem banco e sem segredos reais**:

| Caso | Resultado |
|---|---|
| `GET /api/health` | 200 `{"ok":true}` |
| `meFn` sem cookie | 200 `{ admin: null }` |
| `listClientsFn` sem cookie | 401 `Não autenticado` (sem consultar o banco) |
| cookie válido sem `SESSION_SECRET` | 500 `Erro interno`; log `SESSION_SECRET ausente...`, sem valor |
| cookie válido com segredo de teste e banco inacessível | 503 `Serviço temporariamente indisponível`; log sem URI |
| cookie assinado com outro segredo | 401 `Não autenticado` |

**Não validado**: conexão real com o MongoDB de produção e login completo com credenciais. Isso exige credenciais de teste, que não foram usadas nesta etapa.

## 13. Limitações e pendências

Decisões pendentes (dependem de você):
- **Contratos e serviços**: não existem no código. Não criei entidades. Informe o modelo esperado.
- **Uploads de arquivos de clientes**: não existem. Para imagens de capa, o armazenamento de objetos (Cloudflare R2) exige criar um bucket, que é um recurso pago/externo. Não criei.
- **Durable Object** para manter a conexão do MongoDB (reduz latência). Não implementado.
- **Validação de conexão real** com o banco de produção.
- **Lovable**: a troca do Nitro pelo plugin da Cloudflare altera o build usado pelo editor. Verifique se o editor continua funcionando após o push.

Limitações conhecidas:
- Capas em data URL ficam dentro do documento do post (até ~2 MB). Listagens de posts ficam mais pesadas com capas grandes.
- A busca de clientes filtra por campo: uma busca com dois termos em campos diferentes não casa como antes.
- `ensureUniquePostSlug` tem uma janela de corrida entre a checagem e a gravação; o índice único é a garantia final, e o erro vira 400.
- Rate limit por janela fixa, chaveado por IP + e-mail. Quem varia o IP contorna o limite, então ele protege contra força bruta a partir de um mesmo endereço, não contra ataques distribuídos. Considere um limite por e-mail sem IP se isso for relevante.
- Dependência de `process.env`: depende da configuração `nodejs_compat` e da data de compatibilidade. Trocar a data pode desativar essa leitura.
