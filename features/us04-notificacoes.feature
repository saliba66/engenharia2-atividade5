# language: pt
@US04 @RN08
Funcionalidade: Receber notificações sem interrupções excessivas
  Como assinante, quero silêncio noturno e limite diário de notificações,
  para receber avisos sem comprometer meu descanso.

  @feliz @excecao @limite @smoke
  Esquema do Cenário: Silêncio das 22h inclusive às 8h exclusive
    Dado o horário atual em São Paulo é "<agora>"
    Quando uma notificação é gerada para a assinante
    Então o resultado é "<mensagem>"
    E a notificação tem entrega prevista para "<entrega>"

    Exemplos:
      | agora                    | mensagem                     | entrega                   |
      | 2026-11-03T07:59:00-03:00 | Notificação adiada para as 8h | 2026-11-03T08:00:00-03:00 |
      | 2026-11-03T08:00:00-03:00 | Notificação entregue         | 2026-11-03T08:00:00-03:00 |
      | 2026-11-03T21:59:00-03:00 | Notificação entregue         | 2026-11-03T21:59:00-03:00 |
      | 2026-11-03T22:00:00-03:00 | Notificação adiada para as 8h | 2026-11-04T08:00:00-03:00 |
      | 2026-11-03T23:59:00-03:00 | Notificação adiada para as 8h | 2026-11-04T08:00:00-03:00 |

  @feliz @excecao @limite
  Esquema do Cenário: No máximo 3 notificações por dia
    Dado que a assinante recebe <anteriores> notificações hoje
    Quando uma notificação é gerada para a assinante
    Então o resultado é "<mensagem>"
    E a assinante totaliza <total> notificações hoje
    E não há notificações adiadas

    Exemplos:
      | anteriores | total | mensagem                              |
      | 0          | 1     | Notificação entregue                  |
      | 2          | 3     | Notificação entregue                  |
      | 3          | 3     | Limite diário de notificações atingido |

  @alternativa
  Cenário: O limite recomeça no dia seguinte
    Dado que a assinante recebe 3 notificações ontem
    Quando uma notificação é gerada para a assinante
    Então o resultado é "Notificação entregue"
    E a assinante totaliza 1 notificações hoje
    E o histórico contém 4 notificações

  @alternativa @limite
  Esquema do Cenário: Entrega da fila somente às 8h
    Dado que 1 notificações são geradas às 22h do dia anterior
    Quando o horário chega a "<horario>"
    Então a assinante totaliza <entregues> notificações hoje
    E restam <pendentes> notificações adiadas

    Exemplos:
      | horario                   | entregues | pendentes |
      | 2026-11-03T07:59:00-03:00  | 0         | 1         |
      | 2026-11-03T08:00:00-03:00  | 1         | 0         |
      | 2026-11-03T08:01:00-03:00  | 1         | 0         |

  @excecao @limite
  Cenário: Fila noturna também respeita o limite diário
    Dado que 4 notificações são geradas às 22h do dia anterior
    Quando o horário chega a "2026-11-03T08:00:00-03:00"
    Então a assinante totaliza 3 notificações hoje
    E restam 0 notificações adiadas

