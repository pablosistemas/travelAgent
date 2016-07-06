import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

let numLinhasTabela = new ReactiveVar(1);
let isSubmitted = new ReactiveVar(false);
let partidaMaisTarde = new ReactiveVar(1);
let T = new ReactiveVar(1);
const NUM_MAX_CIDADES=7;
let idLinhaAtual = 0;

/******* DEFINES **********/
const DIA_CHEGADA_VIAVEL = 1;
const DIA_PERMANENCIA_VIAVEL = 2;

/*let preencheCid = function preencheCidades(bool) {

    $(".table :nth-child(2) :nth-child(1)").attr("id","cidade 0");
    $("#cidade0").attr("id","cidade origem");
    return cidades;
}*/
// 1, Paris
function isDiaChegadaInFiLi(diaChegada, destino){
  var maisCedo = document.getElementById("diaMaisCedoChegada"+destino).value;
  var maisTarde = document.getElementById("diaMaisTardeChegada"+destino).value;
  //console.log(maisCedo);
  //console.log(maisTarde);
  if(diaChegada >= maisCedo  &&
          diaChegada <= maisTarde){
      return true;
  }
  console.log("retorna falso");
  return false;
}

function isDiaPermanenciaInOrigem(IDOrigem, diaPartida, diaChegada) {
  if(diaChegada >= document.getElementById("minPermanencia"+IDOrigem).value &&
      diaChegada <= document.getElementById("maxPermanencia"+IDOrigem).value) {
    return true;
  }
  return false;
}

// BH, 1, Paris, {1,2}
function isTransicaoValida(IDOrigem, diaPartida, destino, diaChegada) {

  if(isDiaChegadaInFiLi(diaChegada, destino) === true){
    return DIA_CHEGADA_VIAVEL;
  }
  //console.log("retorna -1");
  // nao eh transicao viavel
  return -1;
}
// BH, 1, {Paris, Berlim, Roma}
function coloreDestinos(IDOrigem,diaAtual,IDDestinos){
  IDDestinos.forEach(function(destino){
    // dia chegada for no mesmo dia da partida ou no dia seguinte, d E {0,1}
    for (var diaChegada=diaAtual; diaChegada <= parseInt(diaAtual)+1 && diaChegada <= T.get(); diaChegada++) {
      //console.log("destino : "+destino+"dia chegada: "+ diaChegada);
      if (isTransicaoValida(IDOrigem, diaAtual, destino, diaChegada) > 0) {
        $("#" + destino + "_" + diaChegada).addClass("celulaDestino");
      }
    }

  })
  /************** LIXO *****************/
  /*for(var idx=0; idx < IDDestinos.length; idx++){
    console.log("dia atual: "+diaAtual);
    var destino = IDDestinos[idx];
    for (var diaChegada=diaAtual; diaChegada <= parseInt(diaAtual)+1 && diaChegada <= T.get(); diaChegada++) {
      console.log("destino : "+destino+" dia chegada: "+ diaChegada);
      if (parseInt(isTransicaoValida(IDOrigem, diaAtual, destino, diaChegada)) > 0) {
        $("#" + destino + "_" + diaChegada).addClass("celulaDestino");
      }
    }
  }*/
   /*else if(isDiaPermanenciaInOrigem(IDOrigem, diaPartida, diaChegada)){
   return DIA_PERMANENCIA_VIAVEL;
   }*/
}

function colorePermanencia(IDOrigem,diaAtual){
}

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
    var consulta;
    for(var i=0; i <= numLinhasTabela.get(); i++){
      //cidades.push(document.getElementById("cidade"+i).value);
      //cidades.push("linhaCidade"+i);
      consulta = document.getElementById("cidade"+i).value;
      cidades.push(consulta);
      if(i >= 1) {
        $("#diaMaisCedoChegadacidade"+i).attr("id","diaMaisCedoChegada"+consulta);
        $("#diaMaisTardeChegadacidade"+i).attr("id","diaMaisTardeChegada"+consulta);
        $("#minPermanenciacidade"+i).attr("id","minPermanencia"+consulta);
        $("#maxPermanenciacidade"+i).attr("id","maxPermanencia"+consulta);
      }
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
  //document.getElementsById("nomeCidade")
});

/************* CIDADE **************/
Template.celula.onCreated(function(){

});

Template.celula.events({
  'click .celula': function (event) {

    var $elem=$(event.target);
    //console.log("id do caller: " + elem);
    var regexElem = /(\w+)_(\d+)/g.exec($elem.attr('id'));
    // console.log(regexElem);
    //console.log("cidade: "+regexElem[1]+" ColunaAtual: "+regexElem[2]);

    // muda a cor da célula para celulaAtiva
    $elem.addClass("celulaAtiva");

    var IDDestinos = [];
    var $elemTabela;
    //console.log(numLinhasTabela.get());
    
    // constroi lista de IDs das cidades de destino
    for(var cidade=1; cidade <= numLinhasTabela.get()+1; cidade++){
      $elemTabela = $(".table :nth-child(2) :nth-child(" + cidade + ") :nth-child(1)");
      // regexElem[1,2] = {cidade, coluna}
      //console.log($elemTabela);
      // add destinos diferentes da cidade atual e da origem
      if ($elemTabela.attr("id") != regexElem[1] && $elemTabela.attr("id") != $("#cidade0").val()){
        IDDestinos.push($elemTabela.attr("id"));
      }
    }
    
    //console.log(IDDestinos);
    // coloreDestinos(cidadeAtual, ddiaAtual/ ids dos destinos)
    coloreDestinos(regexElem[1],regexElem[2],IDDestinos);
    //colorePermanencia(regexElem[1],regexElem[2]);
  },
});