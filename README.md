# NewsFlow — BDD com Cucumber.js

**Gabriel Fonseca Saliba**  
Exercício “do Gherkin ao Cucumber” — testes de software.

Quatro histórias completas, quatro arquivos Gherkin em português e implementação de domínio em memória.
O trabalho testa comportamento de negócio; não é uma aplicação web nem envia mensagens reais.

## Executar em até cinco linhas
Requisito: Node.js 22 ou 24 e npm.
```sh
npm ci
npm run test:dry
npm test
```
Abra `relatorios/cucumber-report.html` no navegador. `npm install && npm test` também funciona.
A dependência é fixada e o `package-lock.json` deve acompanhar o projeto.

## Conteúdo
- [Histórias e critérios de aceitação](docs/historias.md).
- `features/us01-aprovacao.feature` — RN02: revisão independente.
- `features/us02-agendamento.feature` — RN03: 15 minutos, 2 reagendamentos, 5 minutos e fuso.
- `features/us03-segmentacao.feature` — RN04: até 5 segmentos, segmento vazio e deduplicação.
- `features/us04-notificacoes.feature` — RN08: silêncio noturno e limite diário.
- `src/newsflow.js` — regras de negócio independentes dos testes.
- `features/support/world.js` — uma instância de domínio por cenário.
- `features/step_definitions/newsflow.steps.js` — preparação, ações e verificações reais.
- `relatorios/cucumber-report.html` — relatório gerado pelo Cucumber.

## Fora de escopo
- **RN01 — salvamento e versões:** exige outra fatia de trabalho sobre edição e restauração; priorizou-se a distribuição revisada.
- **RN05 — frequência semanal:** exige contagem e fila entre semanas; o limite diário de push não substitui essa regra.
- **RN06 — descadastro e duplo opt-in:** envolve consentimento, confirmação e expiração de links, um fluxo próprio.
- **RN07 — falhas e retentativas:** envolve classificação de falhas e intervalos; este recorte valida a seleção e entrega lógica.
- Persistência, autenticação, interface, provedor de e-mail/push e execução automática de campanhas em produção não integram o domínio didático.

## Qualidade dos cenários
Todos têm um único Quando, dados explícitos e estado independente.
Os Esquemas do Cenário expandem fronteiras sem duplicar narrativas; há no máximo cinco narrativas por história.
As verificações incluem estado, horário, contador, destinatários e ausência de efeitos em recusas, além das mensagens.
Os preparativos de aprovação e reagendamento usam operações do domínio, evitando fabricar estados inconsistentes.
Não há sleep, rede ou relógio real na suíte. A instalação inicial requer acesso ao registro npm.
O fuso de negócio é explícito; o resultado não depende do fuso do computador.
As decisões não especificadas no PDF estão identificadas em [histórias](docs/historias.md).

## Verificações adicionais
```sh
npm run test:parallel
npm run test:random
npx cucumber-js --tags @smoke
```
A execução paralela e em ordem aleatória verifica independência. Execute `npm test` por último para regenerar o relatório completo.

## Entrega e dupla
O enunciado pede um **repositório Git**, não somente um PDF ou ZIP.
Este pacote contém os arquivos para esse repositório e exclui `node_modules`.
Confira o nome do segundo integrante antes de entregar; não foi inventada uma participação.
Sugestão de divisão: um integrante revisa histórias, prioridades e escopo; o outro revisa domínio e casos de borda; ambos fazem revisão cruzada.
Essa divisão é proposta, não registro de colaboração realizada.

## Referências
- Enunciado fornecido: `exercicio-newsflow.pdf`, páginas 2–10.
- Documentação oficial: https://github.com/cucumber/cucumber-js
- Instalação: https://cucumber.io/docs/installation/javascript/

## Resultado da execução
Validado com Node.js v24.15.0 e Cucumber.js 12.2.0.

```text
> newsflow-bdd@1.0.0 test
> cucumber-js

.....................................................................................................................................................................................................

40 scenarios (40 passed)
197 steps (197 passed)
0m00.143s (executing steps: 0m00.055s)
```

Também passaram: dry-run (40 cenários e 197 passos reconhecidos; skipped é esperado nessa modalidade), execução paralela com 2 processos e ordem aleatória com semente 42.


## Restaurar o repositório Git incluído no ZIP
O arquivo `newsflow.bundle` preserva o commit da entrega. Em uma pasta vazia:
```sh
git clone newsflow.bundle newsflow-entrega
cd newsflow-entrega
npm ci
npm test
```
Para entregar por URL, crie um repositório vazio na sua conta e publique o conteúdo com `git remote add origin URL_DO_REPOSITORIO` e `git push -u origin main`. Nenhum repositório remoto foi criado automaticamente.
