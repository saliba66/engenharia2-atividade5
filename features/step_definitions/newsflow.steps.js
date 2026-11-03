const {Given,When,Then}=require('@cucumber/cucumber')
const assert=require('node:assert/strict')
const {MINUTO,FUSO}=require('../../src/newsflow')
Given('que existe a edição {string} de autoria de {string}',function(titulo,autor){
 this.edicao=this.servico.criarEdicao(titulo,autor)
})
Given('que existe uma edição aprovada por outra revisora',function(){
 this.edicao=this.servico.criarEdicao('Informativo #42','Ana')
 assert.equal(this.servico.aprovar(this.edicao,'Bia'),'Edição aprovada')
})
Given('o horário atual em São Paulo é {string}',function(horario){this.servico.agora=Date.parse(horario)})
Given('que a edição está agendada e já foi reagendada {int} vezes',function(n){
 assert.equal(this.servico.agendar(this.edicao,this.servico.agora+30*MINUTO,this.segmentos),'Envio agendado')
 for(let i=0;i<n;i++) assert.equal(this.servico.reagendar(this.edicao,this.servico.agora+(45+i)*MINUTO),'Envio reagendado')
})
Given('que faltam {int} minutos para o envio agendado',function(n){
 const inicio=this.servico.agora
 assert.equal(this.servico.agendar(this.edicao,inicio+30*MINUTO,this.segmentos),'Envio agendado')
 this.servico.avancarAte(inicio+(30-n)*MINUTO)
})
Given('que a gestora seleciona {int} segmentos com 1 assinante distinto em cada',function(n){
 this.segmentos=Array.from({length:n},(_,i)=>({nome:'Segmento '+i,assinantes:['assinante'+i]}))
})
Given('que os segmentos escolhidos são',function(tabela){
 this.segmentos=tabela.hashes().map(l=>({nome:l.segmento,assinantes:l.assinantes?l.assinantes.split(','):[]}))
})
Given('que a assinante recebe {int} notificações hoje',function(n){
 for(let i=0;i<n;i++) assert.equal(this.servico.gerarPush(this.assinante),'Notificação entregue')
})
Given('que a assinante recebe {int} notificações ontem',function(n){
 this.servico.agora=Date.parse('2026-11-02T10:00:00-03:00')
 for(let i=0;i<n;i++) assert.equal(this.servico.gerarPush(this.assinante),'Notificação entregue')
 this.servico.avancarAte(Date.parse('2026-11-03T10:00:00-03:00'))
})
Given('que {int} notificações são geradas às 22h do dia anterior',function(n){
 this.servico.agora=Date.parse('2026-11-02T22:00:00-03:00')
 for(let i=0;i<n;i++) assert.equal(this.servico.gerarPush(this.assinante),'Notificação adiada para as 8h')
})
When('a revisora {string} aprova a edição',function(nome){
 this.guardarEdicao(); this.resultado=this.servico.aprovar(this.edicao,nome)
})
When('a revisora reprova a edição com o comentário {string}',function(comentario){
 this.guardarEdicao(); this.resultado=this.servico.reprovar(this.edicao,comentario)
})
When('a gestora solicita {string} da edição',function(acao){
 this.guardarEdicao()
 assert.ok(['envio','agendamento'].includes(acao))
 this.resultado=acao==='envio'?this.servico.enviar(this.edicao,this.segmentos):
 this.servico.agendar(this.edicao,this.servico.agora+30*MINUTO,this.segmentos)
})
When('a gestora agenda o envio para daqui a {int} minutos',function(n){
 this.guardarEdicao(); this.resultado=this.servico.agendar(this.edicao,this.servico.agora+n*MINUTO,this.segmentos)
})
When('a gestora reagenda o envio para daqui a {int} minutos',function(n){
 this.guardarEdicao(); this.resultado=this.servico.reagendar(this.edicao,this.servico.agora+n*MINUTO)
})
When('a gestora cancela o envio',function(){
 this.guardarEdicao(); this.resultado=this.servico.cancelar(this.edicao)
})
When('uma notificação é gerada para a assinante',function(){this.resultado=this.servico.gerarPush(this.assinante)})
When('o horário chega a {string}',function(t){this.servico.avancarAte(Date.parse(t))})
Then('o resultado é {string}',function(m){assert.equal(this.resultado,m)})
Then('a edição fica {string}',function(e){assert.equal(this.edicao.estado,e)})
Then('a edição permanece inalterada',function(){assert.deepEqual(this.edicao,this.antes)})
Then('o comentário registrado é {string}',function(c){assert.equal(this.edicao.comentario,c)})
Then('nenhum e-mail é enviado',function(){assert.deepEqual(this.servico.entregas,[])})
Then('o agendamento reflete a antecedência de {int} minutos',function(n){
 if(n>=15) {
  assert.equal(this.edicao.estado,'agendada')
  assert.equal(this.edicao.horario,this.servico.agora+n*MINUTO)
  assert.deepEqual(this.edicao.destinatarios,['ana'])
 } else assert.deepEqual(this.edicao,this.antes)
})
Then('o horário e o contador refletem {int} reagendamentos anteriores',function(n){
 if(n<2){
  assert.equal(this.edicao.horario,this.servico.agora+90*MINUTO)
  assert.equal(this.edicao.reagendamentos,n+1)
  assert.equal(this.edicao.estado,'agendada')
  assert.deepEqual(this.edicao.destinatarios,this.antes.destinatarios)
 } else assert.deepEqual(this.edicao,this.antes)
})
Then('o cancelamento reflete a antecedência de {int} minutos',function(n){
 if(n>=5){
  assert.equal(this.edicao.estado,'aprovada'); assert.equal(this.edicao.horario,null)
  assert.deepEqual(this.edicao.destinatarios,[])
 } else assert.deepEqual(this.edicao,this.antes)
})
Then('o envio está marcado para {string} no fuso {string}',function(t,fuso){
 assert.equal(FUSO,fuso); assert.equal(this.edicao.horario,Date.parse(t))
 const formatador=new Intl.DateTimeFormat('pt-BR',{timeZone:fuso,hour:'2-digit',minute:'2-digit',hourCycle:'h23'})
 assert.equal(formatador.format(this.edicao.horario),'00:05')
})
Then('a seleção de {int} segmentos é respeitada',function(n){
 if(n<=5){
  assert.equal(this.edicao.estado,'agendada')
  assert.equal(this.edicao.horario,this.servico.agora+30*MINUTO)
  assert.deepEqual(this.edicao.destinatarios,Array.from({length:n},(_,i)=>'assinante'+i))
 } else assert.deepEqual(this.edicao,this.antes)
})
Then('os e-mails entregues são exatamente',function(tabela){
 const esperados=tabela.hashes().flatMap(l=>Array.from({length:+l.quantidade},()=>l.assinante)).sort()
 assert.deepEqual(this.servico.entregas.map(e=>e.assinante).sort(),esperados)
 assert.ok(this.servico.entregas.every(e=>e.titulo===this.edicao.titulo))
 assert.equal(this.edicao.estado,'enviada')
})
Then('a notificação tem entrega prevista para {string}',function(t){
 const esperado=Date.parse(t)
 if(esperado===this.servico.agora){
  assert.deepEqual(this.assinante.recebidas,[esperado]); assert.equal(this.servico.filaPush.length,0)
 } else {
  assert.deepEqual(this.assinante.recebidas,[]); assert.equal(this.servico.filaPush.length,1)
  assert.equal(this.servico.filaPush[0].horario,esperado)
  assert.equal(this.servico.filaPush[0].assinante,this.assinante)
 }
})
Then('a assinante totaliza {int} notificações hoje',function(n){
 const dia=this.servico.dia(this.servico.agora)
 assert.equal(this.assinante.recebidas.filter(t=>this.servico.dia(t)===dia).length,n)
 // Nenhuma entrega pode ocorrer durante o silêncio, nem antes do instante previsto.
 for(const t of this.assinante.recebidas){
  const hora=+new Intl.DateTimeFormat('en-GB',{timeZone:FUSO,hour:'2-digit',hourCycle:'h23'}).format(t)
  assert.ok(hora>=8&&hora<22); assert.ok(t<=this.servico.agora)
 }
})
Then('não há notificações adiadas',function(){assert.equal(this.servico.filaPush.length,0)})
Then('restam {int} notificações adiadas',function(n){assert.equal(this.servico.filaPush.length,n)})
Then('o histórico contém {int} notificações',function(n){assert.equal(this.assinante.recebidas.length,n)})

