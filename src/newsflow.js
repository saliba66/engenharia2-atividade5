const MINUTO = 60000
const FUSO = 'America/Sao_Paulo'
function partes(t) {
 return Object.fromEntries(new Intl.DateTimeFormat('sv-SE', {
 timeZone:FUSO, year:'numeric', month:'2-digit', day:'2-digit',
 hour:'2-digit', minute:'2-digit', second:'2-digit', hourCycle:'h23'
 }).formatToParts(new Date(t)).map(p => [p.type,p.value]))
}
function oitoHoras(t, seguinte) {
 const p = partes(t)
 const alvo = Date.UTC(+p.year,+p.month-1,+p.day+(seguinte?1:0),8)
 let candidato=alvo
 for(let i=0;i<3;i++) {
  const q=partes(candidato)
  candidato += alvo-Date.UTC(+q.year,+q.month-1,+q.day,+q.hour,+q.minute,+q.second)
 }
 return candidato
}
class NewsFlow {
 constructor(agora=Date.parse('2026-11-03T10:00:00-03:00')) {
  this.agora=agora; this.entregas=[]; this.filaPush=[]
 }
 criarEdicao(titulo,autor) {
  return {titulo,autor,estado:'rascunho',comentario:null,horario:null,reagendamentos:0,destinatarios:[]}
 }
 aprovar(e,revisor) {
  if(revisor===e.autor) return 'O autor não pode aprovar a própria edição'
  if(e.estado!=='rascunho') return 'A edição não está em rascunho'
  e.estado='aprovada'; return 'Edição aprovada'
 }
 reprovar(e,comentario) {
  if(!comentario.trim()) return 'O comentário de reprovação é obrigatório'
  e.estado='rascunho'; e.comentario=comentario.trim(); return 'Edição devolvida ao rascunho'
 }
 validarSegmentos(segmentos) {
  if(segmentos.length===0) return 'Selecione ao menos um segmento'
  if(segmentos.length>5) return 'Selecione no máximo 5 segmentos'
  if(segmentos.some(s=>s.assinantes.length===0)) return 'Segmento sem assinantes'
  return null
 }
 destinatarios(segmentos) {return [...new Set(segmentos.flatMap(s=>s.assinantes))]}
 agendar(e,horario,segmentos) {
  if(e.estado!=='aprovada') return 'A edição precisa de aprovação'
  if(horario-this.agora<15*MINUTO) return 'O envio precisa de ao menos 15 minutos'
  const erro=this.validarSegmentos(segmentos); if(erro) return erro
  e.horario=horario; e.destinatarios=this.destinatarios(segmentos); e.estado='agendada'
  return 'Envio agendado'
 }
 reagendar(e,horario) {
  if(e.estado!=='agendada') return 'Não há agendamento ativo'
  if(e.reagendamentos>=2) return 'Limite de reagendamentos atingido'
  if(horario-this.agora<15*MINUTO) return 'O envio precisa de ao menos 15 minutos'
  e.horario=horario; e.reagendamentos++; return 'Envio reagendado'
 }
 cancelar(e) {
  if(e.estado!=='agendada') return 'Não há agendamento ativo'
  if(e.horario-this.agora<5*MINUTO) return 'O cancelamento exige ao menos 5 minutos'
  e.estado='aprovada'; e.horario=null; e.destinatarios=[]; return 'Envio cancelado'
 }
 enviar(e,segmentos) {
  if(e.estado!=='aprovada') return 'A edição precisa de aprovação'
  const erro=this.validarSegmentos(segmentos); if(erro) return erro
  for(const assinante of this.destinatarios(segmentos)) this.entregas.push({assinante,titulo:e.titulo})
  e.estado='enviada'; return 'Envio realizado'
 }
 dia(t) { const p=partes(t); return [p.year,p.month,p.day].join('-') }
 entregarPush(a,t) {
  if(a.recebidas.filter(x=>this.dia(x)===this.dia(t)).length>=3) return false
  a.recebidas.push(t); return true
 }
 gerarPush(a) {
  const hora=+partes(this.agora).hour
  if(hora>=22||hora<8) {
   this.filaPush.push({assinante:a,horario:oitoHoras(this.agora,hora>=22)})
   return 'Notificação adiada para as 8h'
  }
  return this.entregarPush(a,this.agora)?'Notificação entregue':'Limite diário de notificações atingido'
 }
 avancarAte(t) {
  if(t<this.agora) throw new Error('O relógio não pode retroceder')
  this.agora=t
  const prontas=this.filaPush.filter(n=>n.horario<=t).sort((a,b)=>a.horario-b.horario)
  this.filaPush=this.filaPush.filter(n=>n.horario>t)
  for(const n of prontas) this.entregarPush(n.assinante,n.horario)
 }
}
module.exports={NewsFlow,MINUTO,FUSO}

