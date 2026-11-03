# language: pt
@US02 @RN03
Funcionalidade: Controlar o horário de um envio
  Como gestora, quero agendar, reagendar e cancelar o envio,
  para organizar a comunicação sem perder o prazo de alteração.

  Contexto:
    Dado que existe uma edição aprovada por outra revisora
    E o horário atual em São Paulo é "2026-11-03T10:00:00-03:00"

  @feliz @excecao @limite @smoke
  Esquema do Cenário: Antecedência mínima de 15 minutos
    Quando a gestora agenda o envio para daqui a <minutos> minutos
    Então o resultado é "<mensagem>"
    E o agendamento reflete a antecedência de <minutos> minutos

    Exemplos:
      | minutos | mensagem                              |
      | 60      | Envio agendado                        |
      | 16      | Envio agendado                        |
      | 15      | Envio agendado                        |
      | 14      | O envio precisa de ao menos 15 minutos |
      | 0       | O envio precisa de ao menos 15 minutos |
      | -1      | O envio precisa de ao menos 15 minutos |

  @alternativa @limite
  Esquema do Cenário: No máximo 2 reagendamentos
    Dado que a edição está agendada e já foi reagendada <vezes> vezes
    Quando a gestora reagenda o envio para daqui a 90 minutos
    Então o resultado é "<mensagem>"
    E o horário e o contador refletem <vezes> reagendamentos anteriores

    Exemplos:
      | vezes | mensagem                         |
      | 0     | Envio reagendado                  |
      | 1     | Envio reagendado                  |
      | 2     | Limite de reagendamentos atingido |

  @excecao
  Cenário: Reagendamento também exige 15 minutos
    Dado que a edição está agendada e já foi reagendada 0 vezes
    Quando a gestora reagenda o envio para daqui a 14 minutos
    Então o resultado é "O envio precisa de ao menos 15 minutos"
    E a edição permanece inalterada

  @alternativa @excecao @limite
  Esquema do Cenário: Cancelamento até 5 minutos antes
    Dado que faltam <minutos> minutos para o envio agendado
    Quando a gestora cancela o envio
    Então o resultado é "<mensagem>"
    E o cancelamento reflete a antecedência de <minutos> minutos

    Exemplos:
      | minutos | mensagem                               |
      | 6       | Envio cancelado                        |
      | 5       | Envio cancelado                        |
      | 4       | O cancelamento exige ao menos 5 minutos |

  @alternativa
  Cenário: Agendamento atravessa a meia-noite em São Paulo
    Dado o horário atual em São Paulo é "2026-11-03T23:50:00-03:00"
    Quando a gestora agenda o envio para daqui a 15 minutos
    Então o resultado é "Envio agendado"
    E o envio está marcado para "2026-11-04T00:05:00-03:00" no fuso "America/Sao_Paulo"

