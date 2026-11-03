# language: pt
@US01 @RN02
Funcionalidade: Aprovar uma edição com revisão independente
  Como revisora, quero avaliar a edição antes da distribuição,
  para impedir que conteúdo sem revisão chegue aos assinantes.

  Contexto:
    Dado que existe a edição "Informativo #42" de autoria de "Ana"

  @feliz @smoke
  Cenário: Aprovação por outra revisora
    Quando a revisora "Bia" aprova a edição
    Então o resultado é "Edição aprovada"
    E a edição fica "aprovada"

  @excecao
  Cenário: Autora tenta aprovar sua própria edição
    Quando a revisora "Ana" aprova a edição
    Então o resultado é "O autor não pode aprovar a própria edição"
    E a edição permanece inalterada

  @alternativa
  Cenário: Reprovação com justificativa
    Quando a revisora reprova a edição com o comentário "Corrigir a data da manutenção"
    Então o resultado é "Edição devolvida ao rascunho"
    E a edição fica "rascunho"
    E o comentário registrado é "Corrigir a data da manutenção"

  @excecao
  Cenário: Comentário obrigatório para reprovar
    Quando a revisora reprova a edição com o comentário ""
    Então o resultado é "O comentário de reprovação é obrigatório"
    E a edição permanece inalterada

  @excecao
  Esquema do Cenário: Distribuição bloqueada sem aprovação
    Quando a gestora solicita "<acao>" da edição
    Então o resultado é "A edição precisa de aprovação"
    E a edição permanece inalterada
    E nenhum e-mail é enviado

    Exemplos:
      | acao        |
      | envio       |
      | agendamento |

