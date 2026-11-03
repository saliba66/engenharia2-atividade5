# Histórias de usuário — NewsFlow
Autores: Gabriel Fonseca Saliba e João Vitor Martins e Lara.

## US01 — Aprovar edição com revisão independente
**Como** revisora, **quero** avaliar a edição antes da distribuição, **para** impedir a circulação de conteúdo sem revisão.
**Critérios de aceitação**
- CA01: uma revisora diferente da autora consegue aprovar a edição em rascunho.
- CA02: a autora não aprova a própria edição; uma tentativa recusada preserva seu estado.
- CA03: uma reprovação com comentário devolve a edição ao rascunho e registra a justificativa.
- CA04: sem comentário, a reprovação é recusada e não altera a edição.
- CA05: enviar ou agendar sem aprovação é bloqueado, sem entrega ou alteração da edição.
**Regras cobertas:** RN02.
**Prioridade:** Alta — impede a distribuição de conteúdo sem revisão independente.
**Cenários:** [us01-aprovacao.feature](../features/us01-aprovacao.feature).
**Rastreabilidade:** CA01 → Aprovação por outra revisora; CA02 → Autora tenta aprovar; CA03 → Reprovação com justificativa; CA04 → Comentário obrigatório; CA05 → Distribuição bloqueada.

## US02 — Controlar agendamento de envio
**Como** gestora, **quero** agendar e ajustar o horário de envio, **para** organizar a comunicação e corrigir o planejamento dentro dos prazos.
**Critérios de aceitação**
- CA01: uma edição aprovada pode ser agendada com pelo menos 15 minutos de antecedência, inclusive exatamente 15; abaixo disso, nada é alterado.
- CA02: os horários são interpretados em America/Sao_Paulo, inclusive na mudança de dia.
- CA03: são permitidos até 2 reagendamentos; a terceira tentativa preserva o horário e o contador.
- CA04: reagendar também exige antecedência mínima de 15 minutos e uma recusa não consome uma alteração.
- CA05: o cancelamento é permitido até exatamente 5 minutos antes; remove o agendamento, mantém a aprovação e, abaixo do limite, preserva os dados.
**Regras cobertas:** RN03; RN02 como pré-condição.
**Prioridade:** Alta — erros nas fronteiras de horário afetam diretamente a operação.
**Cenários:** [us02-agendamento.feature](../features/us02-agendamento.feature).
**Rastreabilidade:** CA01 → Antecedência mínima; CA02 → Meia-noite em São Paulo; CA03 → No máximo 2 reagendamentos; CA04 → Reagendamento também exige 15 minutos; CA05 → Cancelamento até 5 minutos.

## US03 — Selecionar público sem duplicar e-mails
**Como** gestora, **quero** selecionar segmentos com assinantes, **para** alcançar o público desejado sem mensagens repetidas.
**Critérios de aceitação**
- CA01: o agendamento aceita de 1 a 5 segmentos com assinantes; a seleção de 6 é recusada sem alteração.
- CA02: qualquer segmento vazio bloqueia o agendamento, mesmo acompanhado por um segmento válido.
- CA03: um assinante presente em dois segmentos recebe exatamente um e-mail, e todos os destinatários distintos recebem a edição.
- CA04: o envio imediato também é bloqueado quando há mais de 5 segmentos, sem gerar entregas.
**Regras cobertas:** RN04; RN02 como pré-condição.
**Prioridade:** Alta — previne disparos inválidos e duplicação de mensagens.
**Cenários:** [us03-segmentacao.feature](../features/us03-segmentacao.feature).
**Rastreabilidade:** CA01 → Seleção de no máximo 5; CA02 → Segmento vazio; CA03 → Assinante de dois segmentos; CA04 → Envio imediato.

## US04 — Respeitar silêncio e limite de notificações
**Como** assinante, **quero** que os avisos respeitem meu descanso e um limite diário, **para** acompanhar novidades sem interrupções excessivas.
**Critérios de aceitação**
- CA01: notificações geradas entre 22h inclusive e 8h exclusive ficam para as próximas 8h; fora da janela, são entregues imediatamente, se houver cota.
- CA02: no máximo 3 notificações são entregues por assinante e por dia; a quarta é bloqueada.
- CA03: entregas do dia anterior não consomem a cota do dia atual.
- CA04: a fila noturna não entrega às 7h59 e entrega às 8h, uma única vez.
- CA05: a liberação da fila também respeita o limite de 3 entregas, sem manter excedentes para outro dia.
**Regras cobertas:** RN08.
**Prioridade:** Média — protege o descanso e evita excesso de avisos após o fluxo editorial básico.
**Cenários:** [us04-notificacoes.feature](../features/us04-notificacoes.feature).
**Rastreabilidade:** CA01 → Silêncio; CA02 → No máximo 3; CA03 → Dia seguinte; CA04 → Entrega da fila; CA05 → Fila noturna também respeita o limite.

## Decisões de interpretação
São decisões explícitas desta solução, e não regras adicionais atribuídas ao enunciado:
- RN08 não define o fuso: adota-se America/Sao_Paulo, como na RN03.
- O limite diário usa a data local da entrega, não uma janela móvel de 24 horas.
- RN08 não determina o destino do excedente: ele é descartado, sem migração para outro dia. A escolha distingue notificações da fila semanal explicitamente exigida em RN05.
- Cancelamento preserva a aprovação da edição, pois cancela o disparo, não a revisão.
- Reagendamento precisa obedecer à antecedência mínima do agendamento.
- São necessários ao menos um segmento e uma edição aprovada para um disparo; o mínimo de um segmento explicita uma pré-condição operacional.
- Identificadores de assinantes são únicos. A deduplicação usa esse identificador, não o nome de um segmento.
- Não há projeto-base anexado ao enunciado. Implementa-se domínio próprio em memória, expressamente permitido na página 9.


