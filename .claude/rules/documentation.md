# Regras de documentação

Estas regras valem para todas as tarefas neste projeto. A referência principal é o `CLAUDE.md` na raiz, com caminho relativo.

## Antes de começar

- Leia o `CLAUDE.md` para entender o contexto, os comandos e a arquitetura.
- Antes de mudanças arquiteturais ou alterações que afetem vários módulos, investigue as dependências com o CodeGraph (`.codegraph/`), se disponível na sessão. Sem ele, use leitura direta do código e busca por imports.

## Depois de implementar

- Verifique se o `CLAUDE.md` ficou desatualizado. Atualize quando mudar:
  - arquitetura ou fluxo de comunicação entre módulos;
  - módulos, rotas ou diretórios;
  - dependências principais;
  - comandos de execução, build ou lint;
  - fluxos importantes (login, CRUD, blog, etc.).
- Registre decisões arquiteturais importantes na seção "Decisões de arquitetura", com a justificativa.
- Corrija informações obsoletas. Remova o que não existe mais.
- Não documente funcionalidades que não foram implementadas.

## Como escrever

- Mantenha o `CLAUDE.md` conciso. Explicações longas vão para arquivos separados dentro do projeto, referenciados por caminho relativo.
- Confirme no código qualquer informação antes de escrever. Não invente nomes de arquivos, comandos ou variáveis.
- Não reescreva seções que estão corretas só para mudar o estilo.
- Não altere a documentação sem necessidade. Se a tarefa não mudou nada relevante, não toque nos arquivos de documentação.
- Não altere `README.md` nem `AGENTS.md` sem pedido explícito do usuário. Se estiverem desatualizados, sinalize ao usuário.
