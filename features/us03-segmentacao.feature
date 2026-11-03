# language: pt
@US03 @RN04
Funcionalidade: Selecionar o público sem duplicar e-mails
  Como gestora, quero escolher segmentos com assinantes,
  para alcançar o público desejado sem mensagens repetidas.

  Contexto:
    Dado que existe uma edição aprovada por outra revisora

  @feliz @excecao @limite
  Esquema do Cenário: Seleção de no máximo 5 segmentos
    Dado que a gestora seleciona <quantidade> segmentos com 1 assinante distinto em cada
    Quando a gestora agenda o envio para daqui a 30 minutos
    Então o resultado é "<mensagem>"
    E a seleção de <quantidade> segmentos é respeitada

    Exemplos:
      | quantidade | mensagem                        |
      | 1          | Envio agendado                  |
      | 4          | Envio agendado                  |
      | 5          | Envio agendado                  |
      | 6          | Selecione no máximo 5 segmentos |

  @excecao
  Cenário: Segmento vazio bloqueia mesmo junto de um válido
    Dado que os segmentos escolhidos são
      | segmento | assinantes |
      | Premium  | ana        |
      | Inativos |            |
    Quando a gestora agenda o envio para daqui a 30 minutos
    Então o resultado é "Segmento sem assinantes"
    E a edição permanece inalterada

  @feliz @smoke
  Cenário: Assinante de dois segmentos recebe um único e-mail
    Dado que os segmentos escolhidos são
      | segmento  | assinantes |
      | Premium   | ana,bia    |
      | São Paulo | ana,caio   |
    Quando a gestora solicita "envio" da edição
    Então o resultado é "Envio realizado"
    E os e-mails entregues são exatamente
      | assinante | quantidade |
      | ana       | 1          |
      | bia       | 1          |
      | caio      | 1          |

  @excecao
  Cenário: Envio imediato também respeita o máximo de segmentos
    Dado que a gestora seleciona 6 segmentos com 1 assinante distinto em cada
    Quando a gestora solicita "envio" da edição
    Então o resultado é "Selecione no máximo 5 segmentos"
    E nenhum e-mail é enviado
    E a edição permanece inalterada

