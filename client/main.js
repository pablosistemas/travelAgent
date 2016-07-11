/**
 * <p>
 * Finalidade da Classe: Modelo de dados para integração com o otimizador.
 * item de processo em autorização de fornecimento.
 * </p>
 *
 * <p>
 * Copyright: Copyright (c) Synergia - DCC - UFMG
 * </p>
 *
 * @author izabella.avelar
 * @author Última modificação realizada por : izabella.avelar $.
 * @version :: 05/07/16#$.
 *
 */

import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import './main.html';

let numLinhasTabela     = new ReactiveVar(1);
let isSubmitted         = new ReactiveVar(false);
let partidaMaisTarde    = new ReactiveVar(1);
let T                   = new ReactiveVar(1);
const NUM_MAX_CIDADES   = 7;
let idLinhaAtual        = 0;

/* intersecoes: maximo intervalo de permanencia possivel por cidade */
let intersecoes     = [];

// possiveis dias de chegada em qualquer cidade
let diasChegada     = [];

// lista de maximas permanencias
let maxPermanencias = [];

// lista de minimas permanencias
let minPermanencias = [];

/******* DEFINES **********/
const DIA_CHEGADA_VIAVEL = 1;

let IDCidadesDestinos = [];

let intervalos = {};

let dMax = 1;

// vetor de dias, cada dia será um array associativo  de cidades
let celulas = [];
arvore      = [];

function removeClassDestino(ID) {
  if($("#" + ID).hasClass("celulaDestino")){
    $("#" + ID).removeClass("celulaDestino");
  }
}
function removeClassAtiva(ID){
  if($("#" + ID).hasClass("celulaAtiva")){
    $("#" + ID).removeClass("celulaAtiva");
  }
}
function removeClassPermanenciaOpcional(ID){
  if($("#" + ID).hasClass("celulaPermanenciaOpcional")){
    $("#" + ID).removeClass("celulaPermanenciaOpcional");
  }
}
function removeClassPermanencia(ID){
  if($("#" + ID).hasClass("celulaPermanencia")){
    $("#" + ID).removeClass("celulaPermanencia");
  }
}

function subIntervalosPossiveis() {

  let infAnt;
  let supAnt;

  let int = 1;
  //for (let i = 0, i = IDCidadesDestinos.length; i++) {
  for (let i in IDCidadesDestinos) {
    intervalos[i][0] = [$("#partidaMaisCedo").val(), parseInt($("#partidaMaisTarde").val()) + 1];
    let auxMin = [];
    let auxMax = [];
    for (let elem = 0; elem < parseInt(numLinhasTabela.get()); elem++) {
      if (IDCidadesDestinos[elem] == i) {
        continue;
      }
      auxMin.add(minPermanencias[elem]);
      auxMax.add(maxPermanencias[elem]);

    }
    for (let intCity = 1; intCity < numLinhasTabela.get(); intCity++) {
      infAnt = intervalos[i][int][0];
      supAnt = intervalos[i][int][1];
      intervalos[i][intCity] = [parseInt(infAnt) + parseInt(minPermanencias.min()) + 1, parseInt(supAnt) + parseInt(minPermanencias.max()) + 2];
      int++;
      minPermanencias.remove(minPermanencias.min());
      maxPermanencias.remove(maxPermanencias.max());
    }

    //infAnt = intervalos[i][int-1][0];
    //supAnt = intervalos[i][int-1][1];
  }
}

/*
 *  Valida os nomes das cidades retirando os espaços entre eles.
 *
 */

function validaNomeCidade(cidade) {

  let arrayOfStrings = cidade.split(/\s+/);
  let newName = "";
  arrayOfStrings.forEach(function (elem) {
    newName=newName+elem;
  });
  return newName;
}

/*
 *  Função chamada no Template cidades.events
 *  Valida se as partidas não são vazias e se a partida mais cedo não é maior que a partida mais tarde
 *  Depois chama a função validaMinimos()
 */
function validaPartidas() {

  let partidaMaisCedo = document.getElementById("partidaMaisCedo").value;
  let partidaMaisTarde = document.getElementById("partidaMaisTarde").value;

  if(partidaMaisCedo === "" || partidaMaisCedo === null || partidaMaisTarde === "" || partidaMaisTarde === null){
    alert('Preencha os campos de partida!');
    isSubmitted.set(false);
  }
  if(partidaMaisCedo > partidaMaisTarde){
    alert('Partida mais cedo não pode ser menor que Partida mais tarde!');
    isSubmitted.set(false);
  }
  validaMinimos();

}

/*
 *  Valida se a chegadamaiscedo e minPermanencia são maiores que chegadaMaisTarde e maxPermanencia respectivamente.
 *  Depois chama a função validaPermanencias()
 */
function validaMinimos() {

  let chegadaMaisCedo;
  let chegadaMaisTarde;
  let minPermanencia;
  let maxPermanencia;

  for (let i = 1; i <= parseInt(numLinhasTabela.get()); i++) {
    minPermanencia      = $("#minPermanenciacidade" + i).val();
    maxPermanencia      = $("#maxPermanenciacidade" + i).val();
    chegadaMaisCedo     = $("#diaMaisCedoChegadacidade" + i).val();
    chegadaMaisTarde    = $("#diaMaisTardeChegadacidade" + i).val();

    if (minPermanencia > maxPermanencia){
      alert('Permanencia mínima não pode ser maior que a permanencia máxima!');
      isSubmitted.set(false);
      //break;
    }
    if(chegadaMaisCedo > chegadaMaisTarde){
      alert('Chegada mais cedo não pode ser maior que a chegada mais tarde!');
      isSubmitted.set(false);
      //break;
    }
    break;

  }
  validaPermanencias();
}

/*
 *  Valida se os campos de permanencia estão vazios ou nulos.
 *  Depois chama a função maxpermMenorTrinta(somaMaxPermanencia)
 */
function validaPermanencias() {
  let minPermanencia;
  let maxPermanencia;
  let somaMaxPermanencia = 0;

  for (let i = 1; i <= parseInt(numLinhasTabela.get()); i++) {

    minPermanencia = $("#minPermanenciacidade" + i).val();
    maxPermanencia = $("#maxPermanenciacidade" + i).val();

    if (minPermanencia === "" || minPermanencia === null || maxPermanencia === "" || maxPermanencia === null) {
      alert('Preencha os campos de permanencia');
      isSubmitted.set(false);
      minPermanencias = [];
      maxPermanencias = [];
      //return false;
      break;
    }
    minPermanencias.push(minPermanencia);
    maxPermanencias.push(maxPermanencia);
    somaMaxPermanencia += parseInt(maxPermanencia);
  }

  //let retCode = true;
  if (somaMaxPermanencia != "" || somaMaxPermanencia != null) {
    //retCode = maxpermMenorTrinta(somaMaxPermanencia);
    maxpermMenorTrinta(somaMaxPermanencia);
  }

  //return retCode;
}

/*
 *  Valida se as permancencias somadas são maiores que 30.
 *  Depois chama a função lechegadas()
 */
function maxpermMenorTrinta(somaMaxPermanencia) {

  for (let i = 1; i <= parseInt(numLinhasTabela.get()); i++) {

    if (somaMaxPermanencia > 30) {
      alert('Tempo máximo de viagem possível são 30 dias, diminua sua permanencia nas cidades');

      isSubmitted.set(false);
      break;
      //return false;

    } else {
      lechegadas();
    }

  }
  //return true;
}

/*
 *  Valida se a chegadaMaisCedo e a chegadaMaisTarde estão vazias ou nulas, se sim preeche os mesmos com 1 e T respectivamente.
 */
function lechegadas() {

  let chegadaMaisCedo;
  let chegadaMaisTarde;

  for (let i = 1; i <= parseInt(numLinhasTabela.get()); i++) {
    chegadaMaisCedo     = $("#diaMaisCedoChegadacidade" + i).val();
    chegadaMaisTarde    = $("#diaMaisTardeChegadacidade" + i).val();

    if (chegadaMaisCedo === "" || chegadaMaisCedo === null || chegadaMaisTarde === "" || chegadaMaisTarde === null) {
      $("#diaMaisCedoChegadacidade" + i).val("1");
      $("#diaMaisTardeChegadacidade" + i).val(T.get());
    }
  }
}

function constroiIDCidadesDestinos() {
  var $elemTabela;

// constroi lista de IDs das cidades de destino

  for (var cidade = 1; cidade <= numLinhasTabela.get(); cidade++) {
    $elemTabela = document.getElementById("cidade" + cidade);
    IDCidadesDestinos.push(($elemTabela.value));
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
  //console.log("geraIntersecoes");
  let id;     // ID da cidade
  let fj, fi; // dia minimo de chegada
  let lj, li; //dia maximo de chegada
  let lambdaj;  // minimo permanencia
  let kij, kii; // maximo permanencia
  let menorPermanenciaPossivel; // menor dia possivel de permanencia
  for (let i = 1; i <= parseInt(numLinhasTabela.get()); i++) {
    //console.log(i);
    id  = IDCidadesDestinos[i - 1];
    fi  = parseInt(document.getElementById("diaMaisCedoChegadacidade" + i).value);
    li  = parseInt(document.getElementById("diaMaisTardeChegadacidade" + i).value);
    kii = parseInt(document.getElementById("maxPermanenciacidade" + i).value);
    //console.log(id + " " + fi + " " + li + " " + kii);
    let diasDisponiveis = [];

    for (let j = 1; j <= parseInt(numLinhasTabela.get()), j != i; j++) {
      //console.log(j);
      id      = IDCidadesDestinos[j - 1];
      fj      = parseInt(document.getElementById("diaMaisCedoChegadacidade" + i).value);
      lj      = parseInt(document.getElementById("diaMaisTardeChegadacidade" + i).value);
      lambdaj = parseInt(document.getElementById("minPermanenciacidade" + i).value);
      kij     = parseInt(document.getElementById("maxPermanenciacidade" + i).value);
      // se fi for alcancavel por pelo menos uma cidade ja basta
      //console.log(id + " " + fj + " " + lj + " " + lambdaj + " " + kij);
      for (let k = fi; k <= li; k++) {
        if (k >= (fj + lambdaj + 1) && k <= (lj + kij + 1)) {
          diasDisponiveis.push(k);
        } else if (k === 1) {
          break; // se fi nao eh alcancavel, nenhum acima o eh
        }
      }
    }

    // seleciona o subintervalo de chegada maximo
    // //console.log((typeof intersecoes[i] === 'undefined'));
    if (typeof intersecoes[i] !== "undefined" && typeof diasDisponiveis !== "undefined") {
      if (diasDisponiveis[0] <= parseInt(intersecoes[i][0])) {
        intersecoes[i][0] = getMinOfArray(diasDisponiveis);
      }
      if (diasDisponiveis[1] >= parseInt(intersecoes[i][1])) {
        intersecoes[i][1] = getMaxOfArray(diasDisponiveis);
      }
    }
    else if (intersecoes[i].length <= 0) {
      if (diasDisponiveis[0] <= parseInt(intersecoes[i][0])) {
        intersecoes[i][0] = getMinOfArray(diasDisponiveis);
      }
      if (diasDisponiveis[1] >= parseInt(intersecoes[i][1])) {
        intersecoes[i][1] = getMaxOfArray(diasDisponiveis);
      }
    } else {
      // se definido
      if (diasDisponiveis.length > 0) {
        intersecoes.push([getMinOfArray(diasDisponiveis), getMaxOfArray(diasDisponiveis)]);
      } else {
        intersecoes.push([]);
      }
    }

    //console.log(diasDisponiveis);
    //console.log(getMinOfArray(diasDisponiveis));
    //console.log(getMaxOfArray(diasDisponiveis));

  }
  //console.log(intersecoes);
}

function unique(x) {
  return x.filter(function (elem, index) {
    return x.indexOf(elem) === index;
  });
}

function union(x, y) {
  return unique(x.concat(y));
}

function range(x, y) {
  let list = [];
  for (let i = x; i <= y; i++) {
    list.push(i);
  }
  return list;
}

// deve ser chamado dentro do evento submit, antes da mudanca dos IDs das celulas
// corresponder aos nomes das cidades
function criaDiasPossiveisChegada() {
  let maisCedo;
  let maisTarde;
  let minPerm;
  let maxPerm;
  for (let i = 1; i <= parseInt(numLinhasTabela.get()); i++) {
    maisCedo    = $("#diaMaisCedoChegadacidade" + i).val();
    maisTarde   = $("#diaMaisTardeChegadacidade" + i).val();
    minPerm     = $("#minPermanenciacidade" + i).val();
    maxPerm     = $("#maxPermanenciacidade" + i).val();
    let incomingDaysFromI = range(parseInt(maisCedo) + parseInt(minPerm) + 1, parseInt(maisTarde) + parseInt(maxPerm) + 2);
    //console.log("incomingDays");
    //console.log(incomingDaysFromI);
    diasChegada = union(diasChegada, incomingDaysFromI);
  }

  // add dias de chegada a partir da origem
  diasChegada = union(diasChegada, range(parseInt($("#partidaMaisCedo").val()) + 1, parseInt($("#partidaMaisTarde").val()) + 1));
}

function isDiaPossivelChegada(dia) {
  return diasChegada.filter(function (element) {
    return element === dia
  });
}

function isCelulaAlcancavel(IDCidade, diaAtual) {

  // se cidade origem, verifica intervalo partidaMaisCedo e partidaMaisTarde
  if (IDCidade === document.getElementById("cidade0").value) {
    var diaMaisCedo     = document.getElementById("partidaMaisCedo").value;
    var diaMaisTarde    = document.getElementById("partidaMaisTarde").value;
    if (parseInt(diaAtual) >= parseInt(diaMaisCedo) && parseInt(diaAtual) <= parseInt(diaMaisTarde)) {
      return true;
    }
    return false;
  } // intervalo maximo: [fi, li+ki_i]
  else {
    var maxPerm         = document.getElementById("maxPermanencia" + IDCidade).value;
    var diaMaisCedo     = document.getElementById("diaMaisCedoChegada" + IDCidade).value;
    var diaMaisTarde    = document.getElementById("diaMaisTardeChegada" + IDCidade).value;

    if (parseInt(diaAtual) >= parseInt(diaMaisCedo) && parseInt(diaAtual) <= (parseInt(diaMaisTarde) + parseInt(maxPerm))) {
      return true;
    }
  }
  return false;
}

// 1, Paris
//function isDiaChegadaInFiLi(diaChegada, destino){
function isDiaChegadaInFiLi(diaChegada, destino) {
  var maisCedo    = document.getElementById("diaMaisCedoChegada" + destino).value;
  var maisTarde   = document.getElementById("diaMaisTardeChegada" + destino).value;
  ////console.log(maisCedo);
  ////console.log(maisTarde);
  if (parseInt(diaChegada) >= parseInt(maisCedo) &&
      parseInt(diaChegada) <= parseInt(maisTarde)) {
    return true;
  }
  //console.log("retorna falso");
  return false;
}

function isDiaPermanenciaInOrigem(IDOrigem, diaPartida, diaChegada) {
  if (diaChegada >= document.getElementById("minPermanencia" + IDOrigem).value &&
      diaChegada <= document.getElementById("maxPermanencia" + IDOrigem).value) {
    return true;
  }
  return false;
}

// BH, 1, Paris, {1,2}
function isTransicaoValida(IDOrigem, diaPartida, destino, diaChegada) {

  //if (isDiaChegadaInFiLi(diaChegada, destino) && isDiaPossivelChegada(diaPartida)) {
  if (isDiaChegadaInFiLi(diaChegada, destino) && isDiaPossivelChegada(diaPartida) && isCidadeAlcancavelEmDia(diaChegada, destino)) {
    return DIA_CHEGADA_VIAVEL;
  }
  // nao eh transicao viavel
  return -1;
}
// BH, 1, {Paris, Berlim, Roma}
function coloreDestinos(IDOrigem, diaAtual, IDDestinos) {
  // se nao eh cidade de origem e eh dia de permanencia obrigatorio, faz nada!
  if (IDOrigem !== document.getElementById("cidade0").value) {
    var chegadaMaisCedo = document.getElementById("diaMaisCedoChegada" + IDOrigem).value;
    var minPerm = document.getElementById("minPermanencia" + IDOrigem).value;
    if (parseInt(diaAtual) >= parseInt(chegadaMaisCedo) && parseInt(diaAtual) <= parseInt(chegadaMaisCedo) + parseInt(minPerm)) {
      return;
    }
  }


  IDDestinos.forEach(function (destino) {
    // dia chegada for no mesmo dia da partida ou no dia seguinte, d E {0,1}
    for (var diaChegada = diaAtual; diaChegada <= parseInt(diaAtual) + 1 && diaChegada <= parseInt(T.get()); diaChegada++) {
      ////console.log("destino : "+destino+"dia chegada: "+ diaChegada);
      if (isTransicaoValida(IDOrigem, diaAtual, destino, diaChegada) > 0) {
        $("#" + destino + "_" + diaChegada).addClass("celulaDestino");
      }
    }
  })
}

function removeColorePermanencia(IDOrigem, diaAtual) {

  // se nao eh dia de partida, nao colore as permanencias
  if ($("#" + IDOrigem + "_" + diaAtual).hasClass("celulaDestino") === false) {
    //console.log("saindo" + $("#" + IDOrigem + "_" + diaAtual).hasClass("celulaDestino"));
    return;
  }

  //console.log("Colore permanencia " + IDOrigem + " " + diaAtual);
  let maxPerm         = document.getElementById("maxPermanencia" + IDOrigem).value;
  let minPerm         = document.getElementById("minPermanencia" + IDOrigem).value;
  let diaMaisCedo     = document.getElementById("diaMaisCedoChegada" + IDOrigem).value;
  let diaMaisTarde    = document.getElementById("diaMaisTardeChegada" + IDOrigem).value;

  for (let permanencia = parseInt(diaAtual) + 1; permanencia <= (parseInt(diaAtual) + parseInt(maxPerm)); permanencia++) {
    if (parseInt(permanencia) > parseInt(diaAtual) + parseInt(minPerm)) {
      $("#" + IDOrigem + "_" + permanencia).removeClass("celulaPermanenciaOpcional");
    } else {
      $("#" + IDOrigem + "_" + permanencia).removeClass("celulaPermanencia");
    }
    //$("#" + IDOrigem + "_" + diaAtual).removeClass("celulaAtiva");
  }
}

function colorePermanencia(IDOrigem, diaAtual) {

  // se nao eh dia de partida, nao colore as permanencias
  if ($("#" + IDOrigem + "_" + diaAtual).hasClass("celulaDestino") === false) {
    //console.log("saindo" + $("#" + IDOrigem + "_" + diaAtual).hasClass("celulaDestino"));
    return;
  }

  //console.log("Colore permanencia " + IDOrigem + " " + diaAtual);
  let maxPerm         = document.getElementById("maxPermanencia" + IDOrigem).value;
  let minPerm         = document.getElementById("minPermanencia" + IDOrigem).value;
  let diaMaisCedo     = document.getElementById("diaMaisCedoChegada" + IDOrigem).value;
  let diaMaisTarde    = document.getElementById("diaMaisTardeChegada" + IDOrigem).value;

  for (let permanencia = parseInt(diaAtual) + 1; permanencia <= (parseInt(diaAtual) + parseInt(maxPerm)); permanencia++) {
    if (parseInt(permanencia) > parseInt(diaAtual) + parseInt(minPerm)) {
      $("#" + IDOrigem + "_" + permanencia).addClass("celulaPermanenciaOpcional");
    } else {
      $("#" + IDOrigem + "_" + permanencia).addClass("celulaPermanencia");
    }

  }
  /*if((parseInt(diaAtual)+1) >= parseInt(diaMaisCedo) && (parseInt(diaAtual)+1) <= (parseInt(diaMaisTarde)+parseInt(maxPerm))){
   $("#" + IDOrigem + "_" + (parseInt(diaAtual)+1)).addClass("celulaPermanencia");
   }*/
}

/*********** TABELA *************/
Template.tabelaDinamica.onCreated(function helloOnCreated() {
});


Template.tabelaDinamica.helpers({

  colunasVaziasEach () {
    var out = [];
    for (var i = 1; i <= T.get(); i++) {
      //out.push(cidade+"col"+i);
      out.push(i);
    }
    return out;
  },
  colunasDatasEach () {
    var out = [];
    //for(var i = parseInt(inicial); i <= parseInt(ndatas) + parseInt(inicial); i++) {
    for (var i = 1; i <= T.get(); i++) {
      out.push(i);
    }
    return out;
  },
  cidadeOrigem () {
    return document.getElementById("cidade0").value;
  },
  cidadesDestino () {
    var cidades = [];
    for (var i = 1; i <= numLinhasTabela.get(); i++) {
      cidades.push(document.getElementById("cidade" + i).value);
    }
    return cidades;
  },
  todasCidades (){
    var cidades = [];
    var consulta;
    for (var i = 0; i <= numLinhasTabela.get(); i++) {
      //cidades.push(document.getElementById("cidade"+i).value);
      //cidades.push("linhaCidade"+i);
      consulta = document.getElementById("cidade" + i).value;
      cidades.push(consulta);
      if (i >= 1) {
        $("#diaMaisCedoChegadacidade" + i).attr("id", "diaMaisCedoChegada" + consulta);
        $("#diaMaisTardeChegadacidade" + i).attr("id", "diaMaisTardeChegada" + consulta);
        $("#minPermanenciacidade" + i).attr("id", "minPermanencia" + consulta);
        $("#maxPermanenciacidade" + i).attr("id", "maxPermanencia" + consulta);
      }
    }

    // cria arvore de alcancabilidade
    //for (var i = parseInt($("#partidaMaisCedo").val()); i <= parseInt($("#partidaMaisTarde").val()); i++){
    //IDCidadesDestinos.forEach(function(destino) {
    //for (let j = i; j <= i + parseInt(dMax); j++) {
    //criaArvore([], parseInt($("#partidaMaisCedo").val()), parseInt($("#partidaMaisCedo").val()), " ",cidades[0], cidades.slice(1, cidades.length));
    //}
    //});

    //caminho,diaPartida,diaChegada,cidadeAnterior,cidadeAtual,destinosPossiveis
    //}

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

Template.tabelaDinamica.events({});

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

  'click #limpar' (event, instance){
    let ID;
    // remove classes das celulas da origem
    for (let i = 1; i <= parseInt(T.get()); i++) {
      ID = $("#cidade0").val()+"_"+i;
      removeClassAtiva(ID);
    }
    // remove classes das demais
    IDCidadesDestinos.forEach(function (id) {
      for (let i = 1; i <= parseInt(T.get()); i++){
        ID=id+"_"+i;
        removeClassDestino(ID);
        removeClassAtiva(ID);
        removeClassPermanenciaOpcional(ID);
        removeClassPermanencia(ID);
      }
    })
  },

  'click #addCidade'(event, instance) {
    // increment the counter when button is clicked
    if (numLinhasTabela.get() < NUM_MAX_CIDADES) {
      numLinhasTabela.set(numLinhasTabela.get() + 1);
    }
  },
  'click #delCidade'(event, instance) {
    // increment the counter when button is clicked
    if (numLinhasTabela.get() > 1) {
      numLinhasTabela.set(numLinhasTabela.get() - 1);
    }
  },
  'click #submit'(event, instance) {
    if (isSubmitted.get() == false) {

      //verifica se tem alguma permanencia vazia
      /*if(!validaPermanencias()){
       return;
       }*/

      // increment the counter when button is clicked
      isSubmitted.set(true);

      // increment the counter when button is clicked
      partidaMaisTarde.set(document.getElementById("partidaMaisTarde").value);
      //console.log("Partida: " + partidaMaisTarde.get());

      T.set(partidaMaisTarde.get());

      ////console.log("Linhas tabelas: "+numLinhasTabela.get());

      var dmax = 1; // dias de viagem: 0 ou 1 na Europa
      for (var i = 1; i <= numLinhasTabela.get(); i++) {
        var soma = parseInt(T.get()) + parseInt(document.getElementById("maxPermanenciacidade" + i).value) + 1 + dmax;
        ////console.log("Soma :" + soma);
        T.set(soma); //maxPermanencia{{this}}
      }

      //verifica se tem alguma permanencia vazia
      validaPartidas();

      //validaChegadas();

      //função de intervalos teste
      //subIntervalosPossiveis();
      //console.log("intervalos possíveis: " + intervalos);

      // Captura os IDs de destino (valor do campo)
      constroiIDCidadesDestinos();

      // preenche intersecoes de permanencia possiveis
      // geraIntersecoesPermanencia();
      criaDiasPossiveisChegada();


      diasChegada = diasChegada.sort();

      ////console.log("DiasChegada:");
      ////console.log(diasChegada);
    }
    ////console.log("T: " + T.get());
  },
});

/************* LINHACIDADE **************/
Template.linhaCidade.onCreated(function (idLinha) {
  this.ID = idLinha;
  //document.getElementsById("nomeCidade")
});

/************* CIDADE **************/
Template.celula.onCreated(function () {

});

Template.celula.events({
  'click .celula': function (event) {

    if(arvore.length == 0) {
      criaArvore([], parseInt($("#partidaMaisCedo").val()), parseInt($("#partidaMaisCedo").val()), " ",$("#cidade0").val(), IDCidadesDestinos.slice()); //cidades.slice(1, cidades.length));
      //console.log("CELULAS:");
      //console.log(arvore);
    }

    var $elem = $(event.target);
    ////console.log("id do caller: " + elem);
    var regexElem = /(\w+\s*\w*)_(\d+)/g.exec($elem.attr('id'));
    // //console.log(regexElem);

    // muda a cor da célula para celulaAtiva
    if (isCelulaAlcancavel(regexElem[1], regexElem[2])) { // LEFT click =1

      // adiciona celula partida
      if (regexElem[1] === document.getElementById("cidade0").value) {
        $elem.addClass("celulaAtiva");
      }

      var IDDestinos = [];
      var $elemTabela;
      ////console.log(numLinhasTabela.get());

      // constroi lista de IDs das cidades de destino
      for (var cidade = 1; cidade <= numLinhasTabela.get() + 1; cidade++) {
        $elemTabela = $(".table :nth-child(2) :nth-child(" + cidade + ") :nth-child(1)");
        // regexElem[1,2] = {cidade, coluna}
        ////console.log($elemTabela);
        // add destinos diferentes da cidade atual e da origem
        if ($elemTabela.attr("id") != regexElem[1] && $elemTabela.attr("id") != $("#cidade0").val()) {
          IDDestinos.push($elemTabela.attr("id"));
        }
      }

      // coloreDestinos(cidadeAtual, diaAtual/ ids dos destinos)
      coloreDestinos(regexElem[1], regexElem[2], IDDestinos);
      // nao colore permanencia para cidade de origem
      if (regexElem[1] !== document.getElementById("cidade0").value) {
        colorePermanencia(regexElem[1], regexElem[2]);
      }
    }

    ////console.log("Intersecoes: ");
    //console.log(intersecoes);

  },

  'dblclick .celula': function (event) {

    ////console.log("evento 2");
    var $elem = $(event.target);
    ////console.log("id do caller: " + elem);
    var regexElem = /(\w+\s*\w*)_(\d+)/g.exec($elem.attr('id'));
    let IDOrigem = regexElem[1];
    let diaAtual = regexElem[2];

    // remove se celula for ativa
    if ($("#" + IDOrigem + "_" + diaAtual).hasClass("celulaAtiva")) {
      $("#" + IDOrigem + "_" + diaAtual).removeClass("celulaAtiva");
    }
    // remove destino e suas permanencias
    if ($("#" + IDOrigem + "_" + diaAtual).hasClass("celulaDestino")) {
      removeColorePermanencia(regexElem[1], regexElem[2]);
      $("#" + IDOrigem + "_" + diaAtual).removeClass("celulaDestino");
    }

    // remove permanencias se celula for apenas de permanencia
    /*if($("#" + IDOrigem + "_" + diaAtual).hasClass("celulaPermanencia")){
     $("#" + IDOrigem + "_" + diaAtual).removeClass("celulaPermanencia");
     }

     if ($("#" + IDOrigem + "_" + diaAtual).hasClass("celulaPermanenciaOpcional")) {
     $("#" + IDOrigem + "_" + diaAtual).removeClass("celulaPermanenciaOpcional");
     }*/
  }


});

/*
 *
 *   INICIO FUNCOES DE ARVORE
 *
 */


function criaObjCidadePartida(cidade, partida) {
  return {'cidade': cidade, 'partida': partida};
}

function listaOpcoes(diaAtual, IDOrigem, IDDestinos) {
  let opcoes = [];
  if (IDOrigem !== $("#cidade0").val()) {
    var chegadaMaisCedo = $("#diaMaisCedoChegada" + IDOrigem).val();
    var minPerm         = $("#minPermanencia" + IDOrigem).val();
    if (parseInt(diaAtual) >= parseInt(chegadaMaisCedo) && parseInt(diaAtual) <= parseInt(chegadaMaisCedo) + parseInt(minPerm)) {
      return;
    }
  }

  IDDestinos.forEach(function (destino) {
    // dia chegada for no mesmo dia da partida ou no dia seguinte, d E {0,1}
    for (var diaChegada = diaAtual; diaChegada <= parseInt(diaAtual) + dMax && diaChegada <= parseInt(T.get()); diaChegada++) {
      ////console.log("destino : "+destino+"dia chegada: "+ diaChegada);
      if (isTransicaoValida(IDOrigem, diaAtual, destino, diaChegada) > 0) {
        opcoes.push(criaObjCidadePartida(IDOrigem, diaAtual));
        //$("#" + destino + "_" + diaChegada).addClass("celulaDestino");
      }
    }
  });
  return opcoes;
}

// nao add caminhamentos repetidos
function addCidade(cidade, diaChegada, caminho) {
  if(arvore[diaChegada] === undefined){
    arvore[diaChegada] = [];
  }
  if(arvore[diaChegada][cidade] === undefined){
    arvore[diaChegada][cidade] = [];
  }
  var isEqual = false;
  arvore[diaChegada][cidade].forEach(function(elemento){
    if(JSON.stringify(elemento) == JSON.stringify(caminho)){
      isEqual = true;
    }
  });
  if(!isEqual){
    arvore[diaChegada][cidade].push(caminho.slice());
  }
}

function criaArvore(caminho,diaPartida,diaChegada,cidadeAnterior,
                    cidadeAtual,destinosPossiveis) {

  //console.log("cria arvore");
  //console.log(destinosPossiveis);
  var pMaisCedo;
  var pMaisTarde;

  // JQUERY AQUI
  // se nao for origem, add no caminho e consulta intervalos partidas
  if($("#cidade0").val() != cidadeAtual) {
    // add no comeco do caminho
    addCidade(cidadeAtual,diaChegada,caminho.slice());
    caminho.unshift({'cidade':cidadeAtual,'partida':parseInt(diaPartida),
      'chegada': parseInt(diaChegada), 'anterior':cidadeAnterior});
    // JQUERY AQUI
    pMaisCedo   = parseInt(diaChegada) + parseInt($("#minPermanencia"+cidadeAtual).val()) + parseInt(1);
    pMaisTarde  = parseInt(diaChegada) + parseInt($("#maxPermanencia"+cidadeAtual).val()) + parseInt(1);
  } else {
    pMaisCedo   = parseInt($("#partidaMaisCedo").val());
    pMaisTarde  = parseInt($("#partidaMaisTarde").val());
  }

  var destPossiveis   = destinosPossiveis.slice();
  destPossiveis       = destPossiveis.filter(function(item){
    if(item != cidadeAtual){
      //console.log("Remocao: "+item+" "+cidadeAtual);
      return true;
    }
  });

  for(var i = pMaisCedo; i <= pMaisTarde; i++){
    var opcoes  = listaPossibilidades(cidadeAtual,
        destPossiveis,i);
    //destinosPossiveis,i);
    //console.log("opcoes");
    //console.log(opcoes);
    if (opcoes.length > 0) {
      opcoes.forEach(function (elemento){

        criaArvore (caminho.slice(), elemento['partida'],
            elemento['chegada'], elemento['anterior'],
            elemento['cidade'], destPossiveis.slice());

      });
    } else {
      //console.log("caminho ate aqui: ");
      //console.log(caminho);
      //console.log("");
      //caminho.shift();
      if($("#cidade0").val() != cidadeAtual){
        addCidade (cidadeAtual, diaChegada, caminho.slice());
      }
      return;
    }
  }
}

function listaPossibilidades (anterior, destinosPossiveis,
                              diaPartida) {
  var opcoes = [];
  destinosPossiveis.forEach(function (destino) {
    var diasChegada = cidadeAlcancavel(diaPartida,destino);
    diasChegada.forEach(function (dia) {
      opcoes.push({'cidade': destino,'partida': diaPartida,
        'chegada': dia, 'anterior': anterior});
    });
  });

  return opcoes;
}

// retorna lista de dias alcancaveis
function cidadeAlcancavel (partida, destino) {
  var dias = [];
  for(var j = partida; j <= parseInt(partida)+parseInt(dMax); j++){
    if(isDiaChegadaInFiLi(j, destino)){
      dias.push(j);
    }
  }

  return dias;
}

function adicionaCelula(diaAtual, cidadeAtual, caminho) {
  //console.log("adiciona celula");
  //console.log(diaAtual + " " + cidadeAtual + " " + caminho);
  if (celulas[diaAtual] == undefined) {
    celulas[diaAtual] = [];
  }
  if (celulas[diaAtual][cidadeAtual] == undefined) {
    celulas[diaAtual][cidadeAtual] = [];
  }
  celulas[diaAtual][cidadeAtual].push(caminho);

}

function isCidadeAlcancavelEmDia(dia, cidade){
  /*arvore.forEach(function(no){
   var chaves = keys(no);
   chaves.forEach(function (key){
   no[key].forEach(function (arr){
   if(arr.length > 0){
   if(key == cidade)
   }
   })
   })
   });*/
  //return (arvore[dia][cidade].length > 0);
  if(arvore[dia] === undefined){
    return false;
  } else if(arvore[dia].length > 0){
    return false;
  } else if(arvore[dia][cidade] === undefined) {
    return false;
  } else {
    return (arvore[dia][cidade].length > 0);
  }
}