import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

let numLinhasTabela   = new ReactiveVar(1);
let isSubmitted       = new ReactiveVar(false);
let partidaMaisTarde  = new ReactiveVar(1);
let T = new ReactiveVar(1);
const NUM_MAX_CIDADES =7;
let idLinhaAtual      = 0;

/* intersecoes: maximo intervalo de permanencia possivel por cidade */
let intersecoes = [];

/******* DEFINES **********/
const DIA_CHEGADA_VIAVEL = 1;
const DIA_PERMANENCIA_VIAVEL = 2;

let IDCidadesDestinos = [];

function constroiIDCidadesDestinos () {
  var $elemTabela;

// constroi lista de IDs das cidades de destino
  for(var cidade=1; cidade <= numLinhasTabela.get(); cidade++){
    $elemTabela = document.getElementById("cidade"+cidade);
    IDCidadesDestinos.push($elemTabela.value);
  }
}

/****** MIN e MAX de um array *******/

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

function getMinOfArray(numArray) {
  return Math.min.apply(null, numArray);
}

/********Intersecoes de permanencia*******/
function geraIntersecoesPermanencia() {
  console.log("geraIntersecoes");
  let id;     // ID da cidade
  let fj, fi; // dia minimo de chegada
  let lj, li; //dia maximo de chegada
  let lambdaj;  // minimo permanencia
  let kij, kii; // maximo permanencia
  let menorPermanenciaPossivel; // menor dia possivel de permanencia
  for(let i=1; i <= parseInt(numLinhasTabela.get()); i++) {
    console.log(i);
    id    = IDCidadesDestinos[i-1];
    fi    = parseInt(document.getElementById("diaMaisCedoChegadacidade"+i).value);
    li    = parseInt(document.getElementById("diaMaisTardeChegadacidade"+i).value);
    kii   = parseInt(document.getElementById("maxPermanenciacidade"+i).value);
    console.log(id+" "+fi+" "+li+" "+kii);
    let diasDisponiveis = [];

    for(let j=1; j <= parseInt(numLinhasTabela.get()), j != i; j++) {
      console.log(j);
      id      = IDCidadesDestinos[j-1];
      fj      = parseInt(document.getElementById("diaMaisCedoChegadacidade"+i).value);
      lj      = parseInt(document.getElementById("diaMaisTardeChegadacidade"+i).value);
      lambdaj = parseInt(document.getElementById("minPermanenciacidade"+i).value);
      kij     = parseInt(document.getElementById("maxPermanenciacidade"+i).value);
      // se fi for alcancavel por pelo menos uma cidade ja basta
      console.log(id+" "+fj+" "+lj+" "+lambdaj+" "+kij);
      for(let k = fi; k <= li; k++) {
        if(k >= (fj+lambdaj+1) && k <= (lj+kij+1)) {
          diasDisponiveis.push(k);
        } else if (k === 1) {
          break; // se fi nao eh alcancavel, nenhum acima o eh
        }
      }
    }

    // seleciona o subintervalo de chegada maximo
    // console.log((typeof intersecoes[i] === 'undefined'));
    if(typeof intersecoes[i] !== "undefined" && typeof diasDisponiveis !== "undefined") {
      if (diasDisponiveis[0] <= parseInt(intersecoes[i][0])) {
        intersecoes[i][0] = getMinOfArray(diasDisponiveis);
      }
      if (diasDisponiveis[1] >= parseInt(intersecoes[i][1])) {
        intersecoes[i][1] = getMaxOfArray(diasDisponiveis);
      }
    }
    else if (intersecoes[i].length <= 0){
      if (diasDisponiveis[0] <= parseInt(intersecoes[i][0])) {
        intersecoes[i][0] = getMinOfArray(diasDisponiveis);
      }
      if (diasDisponiveis[1] >= parseInt(intersecoes[i][1])) {
        intersecoes[i][1] = getMaxOfArray(diasDisponiveis);
      }
    } else {
      // se definido
      if(diasDisponiveis.length > 0) {
        intersecoes.push([getMinOfArray(diasDisponiveis),getMaxOfArray(diasDisponiveis)]);
      } else {
        intersecoes.push([]);
      }
    }

    console.log(diasDisponiveis)  ;
    console.log(getMinOfArray(diasDisponiveis));
    console.log(getMaxOfArray(diasDisponiveis));

  }
  console.log(intersecoes);
}


function isCelulaAlcancavel(IDCidade, diaAtual) {

  // se cidade origem, verifica intervalo partidaMaisCedo e partidaMaisTarde
  if(IDCidade === document.getElementById("cidade0").value){
    var diaMaisCedo   = document.getElementById("partidaMaisCedo").value;
    var diaMaisTarde  = document.getElementById("partidaMaisTarde").value;
    if(parseInt(diaAtual) >= parseInt(diaMaisCedo) && parseInt(diaAtual) <= parseInt(diaMaisTarde)){
      return true;
    }
    return false;
  } // intervalo maximo: [fi, li+ki_i]
  else {
    var maxPerm       = document.getElementById("maxPermanencia"+IDCidade).value;
    var diaMaisCedo   = document.getElementById("diaMaisCedoChegada"+IDCidade).value;
    var diaMaisTarde  = document.getElementById("diaMaisTardeChegada"+IDCidade).value;

    if(parseInt(diaAtual) >= parseInt(diaMaisCedo) && parseInt(diaAtual) <= (parseInt(diaMaisTarde)+parseInt(maxPerm))) {
      return true;
    }
  }
  return false;
}

// 1, Paris
function isDiaChegadaInFiLi(diaChegada, destino){
  var maisCedo  = document.getElementById("diaMaisCedoChegada"+destino).value;
  var maisTarde = document.getElementById("diaMaisTardeChegada"+destino).value;
  //console.log(maisCedo);
  //console.log(maisTarde);
  if(parseInt(diaChegada) >= parseInt(maisCedo)  &&
          parseInt(diaChegada) <= parseInt(maisTarde)){
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
  // se nao eh cidade de origem e eh dia de permanencia obrigatorio, faz nada!
  if(IDOrigem !== document.getElementById("cidade0").value){
    var chegadaMaisCedo = document.getElementById("diaMaisCedoChegada"+IDOrigem).value;
    var minPerm         = document.getElementById("minPermanencia"+IDOrigem).value;
    if(parseInt(diaAtual) >= parseInt(chegadaMaisCedo) && parseInt(diaAtual) <= parseInt(chegadaMaisCedo)+parseInt(minPerm)){
      return;
    }
  }


  IDDestinos.forEach(function(destino){
    // dia chegada for no mesmo dia da partida ou no dia seguinte, d E {0,1}
    for (var diaChegada=diaAtual; diaChegada <= parseInt(diaAtual)+1 && diaChegada <= parseInt(T.get()); diaChegada++) {
      //console.log("destino : "+destino+"dia chegada: "+ diaChegada);
      if (isTransicaoValida(IDOrigem, diaAtual, destino, diaChegada) > 0) {
        $("#" + destino + "_" + diaChegada).addClass("celulaDestino");
      }
    }
  })
}

function colorePermanencia(IDOrigem,diaAtual){

  console.log("Colore permanencia "+IDOrigem+" "+diaAtual);
  var maxPerm       = document.getElementById("maxPermanencia"+IDOrigem).value;
  var diaMaisCedo   = document.getElementById("diaMaisCedoChegada"+IDOrigem).value;
  var diaMaisTarde  = document.getElementById("diaMaisTardeChegada"+IDOrigem).value;

  if((parseInt(diaAtual)+1) >= parseInt(diaMaisCedo) && (parseInt(diaAtual)+1) <= (parseInt(diaMaisTarde)+parseInt(maxPerm))){
    $("#" + IDOrigem + "_" + (parseInt(diaAtual)+1)).addClass("celulaPermanencia");
  }
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
    if( isSubmitted.get() == false) {
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

      // Captura os IDs de destino (valor do campo)
      constroiIDCidadesDestinos();

      // preenche intersecoes de permanencia possiveis
      // geraIntersecoesPermanencia();
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
    var regexElem = /(\w+\s*\w*)_(\d+)/g.exec($elem.attr('id'));
    // console.log(regexElem);

    // muda a cor da célula para celulaAtiva
    if(isCelulaAlcancavel(regexElem[1],regexElem[2])){

      console.log("cidade: "+regexElem[1]+" ColunaAtual: "+regexElem[2]);
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

      // coloreDestinos(cidadeAtual, ddiaAtual/ ids dos destinos)
      coloreDestinos(regexElem[1],regexElem[2],IDDestinos);
      // nao colore permanencia para cidade de origem
      if(regexElem[1] !== document.getElementById("cidade0").value){
        colorePermanencia(regexElem[1],regexElem[2]);
      }
    }

    console.log("Intersecoes: ");
    console.log(intersecoes);

  },
});


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