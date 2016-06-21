import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

let numLinhasTabela = new ReactiveVar(1);
let isSubmitted = new ReactiveVar(false);
let partidaMaisTarde = new ReactiveVar(1);
let T = new ReactiveVar(1);
const NUM_MAX_CIDADES=7;
let idLinhaAtual = 0;

/*let preencheCid = function preencheCidades(bool) {

    $(".table :nth-child(2) :nth-child(1)").attr("id","cidade 0");
    $("#cidade0").attr("id","cidade origem");
    return cidades;
}*/

/*********** TABELA *************/
Template.tabelaDinamica.onCreated(function helloOnCreated() {
});



Template.tabelaDinamica.helpers({

  colunasVaziasEach () {
    var out = [];
    for(var i = 1; i <= T.get(); i++) {
      //out.push(cidade+"col"+i);
      out.push(i);
    }
    return out;
  },
  colunasDatasEach () {
    var out = [];
    //for(var i = parseInt(inicial); i <= parseInt(ndatas) + parseInt(inicial); i++) {
    for(var i = 1; i <= T.get(); i++) {
      out.push(i);
    }
    return out;
  },
  cidadeOrigem () {
    return document.getElementById("cidade0").value;
  },
  cidadesDestino () {
    var cidades=[];
    for(var i=1; i <= numLinhasTabela.get(); i++){
        cidades.push(document.getElementById("cidade"+i).value);
    }
    return cidades;
  },
  todasCidades (){
    var cidades=[];
    for(var i=0; i <= numLinhasTabela.get(); i++){
      //cidades.push(document.getElementById("cidade"+i).value);
      //cidades.push("linhaCidade"+i);
      cidades.push(document.getElementById("cidade"+i).value);
    }
    return cidades;
  },

  setaIdLinhaAtual (linhaAtual) {
    idLinhaAtual = document.getElementById(linhaAtual).value;
  },
  setaIdLinhasColunas () {
    /*for (var i = 0; i <= NUM_MAX_CIDADES; i++) {
      for (var j = 1; j <= T.get(); j++) {
      }
    }*/
    /*$(".table :nth-child(2) :nth-child(1)").attr("id","cidade 0");
    $("#cidade0").attr("id","cidade origem");*/
  },
  setaCidadesTabela () {
    for (var i = 0; i <= numLinhasTabela.get(); i++) {
      //$("#linhaCidade"+i+" :nth-child(1)").attr("value",document.getElementById("cidade"+i).value);
      //$("#linhaCidade"+i+" :nth-child(1)").attr("value","ttt");
      $("#"+document.getElementById("cidade"+i).value +" :nth-child(1)").attr("value","ttt");
    }
  },

});


/*********** TRAVELAGENT **************/

Template.travelAgent.helpers({
  isSubmit () {
    return isSubmitted.get();
  },
});

Template.tabelaDinamica.events({

});

/*********** CIDADES ***************/

Template.cidades.onCreated(function helloOnCreated() {
  
});


Template.cidades.helpers({
  criaFormsCidades () {
    var out = [];
    for (var i = 1; i <= numLinhasTabela.get(); i++) {
      out.push("cidade" + i);
    }
    return out;
  },
});

Template.cidades.events({
  'click #addCidade'(event, instance) {
    // increment the counter when button is clicked
    if(numLinhasTabela.get() < NUM_MAX_CIDADES) {
      numLinhasTabela.set(numLinhasTabela.get() + 1);
    }
  },
  'click #delCidade'(event, instance) {
    // increment the counter when button is clicked
    if(numLinhasTabela.get() > 1) {
      numLinhasTabela.set(numLinhasTabela.get() - 1);
    }
  },
  'click #submit'(event, instance) {
    // increment the counter when button is clicked
    isSubmitted.set(true);

      // increment the counter when button is clicked
    partidaMaisTarde.set(document.getElementById("partidaMaisTarde").value);
    console.log("Partida: "+partidaMaisTarde.get());

    T.set(partidaMaisTarde.get());

    //console.log("Linhas tabelas: "+numLinhasTabela.get());

    var dmax=1; // dias de viagem: 0 ou 1 na Europa
    for(var i=1; i <= numLinhasTabela.get(); i++){
      var soma=parseInt(T.get())+parseInt(document.getElementById("maxPermanenciacidade"+i).value)+1+dmax;
      console.log("Soma :"+soma);
      T.set(soma); //maxPermanencia{{this}}
    }

    console.log("T: "+T.get());
  },
});

/************* LINHACIDADE **************/
Template.linhaCidade.onCreated(function(idLinha){
  this.ID = idLinha;
  document.getElementsById("nomeCidade")
});
