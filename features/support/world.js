const {setWorldConstructor}=require('@cucumber/cucumber')
const {NewsFlow}=require('../../src/newsflow')
class Mundo {
 constructor() {
  this.servico=new NewsFlow(); this.edicao=null; this.resultado=null
  this.segmentos=[{nome:'Premium',assinantes:['ana']}]
  this.assinante={recebidas:[]}
 }
 guardarEdicao() {this.antes=structuredClone(this.edicao)}
}
setWorldConstructor(Mundo)

