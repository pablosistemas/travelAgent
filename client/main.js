import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';

import './main.html';

let numLinhasTabela = new ReactiveVar(1);
let isSubmitted = new ReactiveVar(false);
let partidaMaisTarde = new ReactiveVar(1);
let T = new ReactiveVar(1);
const NUM_MAX_CIDADES = 7;
let idLinhaAtual = 0;

/* intersecoes: maximo intervalo de permanencia possivel por cidade */
let intersecoes = [];

// possiveis dias de chegada em qualquer cidade
let diasChegada = [];

// lista de maximas permanencias
let maxPermanencias = [];

// lista de minimas permanencias
let minPermanencias = [];

/******* DEFINES **********/
const DIA_CHEGADA_VIAVEL = 1;
const DIA_PERMANENCIA_VIAVEL = 2;

let IDCidadesDestinos = [];

let intervalos = {};

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
        for(let intCity=1; intCity < numLinhasTabela.get(); intCity++){
            infAnt = intervalos[i][int][0];
            supAnt = intervalos[i][int][1];
            intervalos[i][intCity]=[parseInt(infAnt)+parseInt(minPermanencias.min())+1,parseInt(supAnt)+parseInt(minPermanencias.max())+2];
            int++;
            minPermanencias.remove(minPermanencias.min());
            maxPermanencias.remove(maxPermanencias.max());
        }

        //infAnt = intervalos[i][int-1][0];
        //supAnt = intervalos[i][int-1][1];
    }
}

function leperm() {
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
            break;
        }
        minPermanencias.push(minPermanencia);
        maxPermanencias.push(maxPermanencia);
        somaMaxPermanencia += parseInt(maxPermanencia);
    }

    if (somaMaxPermanencia != "" || somaMaxPermanencia != null) {
        maxpermMenorTrinta(somaMaxPermanencia);
    }

}

function maxpermMenorTrinta(somaMaxPermanencia) {


    for (let i = 1; i <= parseInt(numLinhasTabela.get()); i++) {

        if (somaMaxPermanencia > 30) {
            alert('Tempo máximo de viagem possível são 30 dias, diminua sua permanencia nas cidades');

            isSubmitted.set(false);

            break;
        } else {
            lechegadas();
        }

    }

}

function lechegadas() {

    let chegadamaiscedo;
    let chegadamaisTarde;

    for (let i = 1; i <= parseInt(numLinhasTabela.get()); i++) {
        chegadamaiscedo = $("#diaMaisCedoChegadacidade" + i).val();
        chegadamaisTarde = $("#diaMaisTardeChegadacidade" + i).val();

        if (chegadamaiscedo === "" || chegadamaiscedo === null || chegadamaisTarde === "" || chegadamaisTarde === null) {
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
    for (let i = 1; i <= parseInt(numLinhasTabela.get()); i++) {
        console.log(i);
        id = IDCidadesDestinos[i - 1];
        fi = parseInt(document.getElementById("diaMaisCedoChegadacidade" + i).value);
        li = parseInt(document.getElementById("diaMaisTardeChegadacidade" + i).value);
        kii = parseInt(document.getElementById("maxPermanenciacidade" + i).value);
        console.log(id + " " + fi + " " + li + " " + kii);
        let diasDisponiveis = [];

        for (let j = 1; j <= parseInt(numLinhasTabela.get()), j != i; j++) {
            console.log(j);
            id = IDCidadesDestinos[j - 1];
            fj = parseInt(document.getElementById("diaMaisCedoChegadacidade" + i).value);
            lj = parseInt(document.getElementById("diaMaisTardeChegadacidade" + i).value);
            lambdaj = parseInt(document.getElementById("minPermanenciacidade" + i).value);
            kij = parseInt(document.getElementById("maxPermanenciacidade" + i).value);
            // se fi for alcancavel por pelo menos uma cidade ja basta
            console.log(id + " " + fj + " " + lj + " " + lambdaj + " " + kij);
            for (let k = fi; k <= li; k++) {
                if (k >= (fj + lambdaj + 1) && k <= (lj + kij + 1)) {
                    diasDisponiveis.push(k);
                } else if (k === 1) {
                    break; // se fi nao eh alcancavel, nenhum acima o eh
                }
            }
        }

        // seleciona o subintervalo de chegada maximo
        // console.log((typeof intersecoes[i] === 'undefined'));
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

        console.log(diasDisponiveis);
        console.log(getMinOfArray(diasDisponiveis));
        console.log(getMaxOfArray(diasDisponiveis));

    }
    console.log(intersecoes);
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
        maisCedo = $("#diaMaisCedoChegadacidade" + i).val();
        maisTarde = $("#diaMaisTardeChegadacidade" + i).val();
        minPerm = $("#minPermanenciacidade" + i).val();
        maxPerm = $("#maxPermanenciacidade" + i).val();
        let incomingDaysFromI = range(parseInt(maisCedo) + parseInt(minPerm) + 1, parseInt(maisTarde) + parseInt(maxPerm) + 2);
        console.log("incomingDays");
        console.log(incomingDaysFromI);
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
        var diaMaisCedo = document.getElementById("partidaMaisCedo").value;
        var diaMaisTarde = document.getElementById("partidaMaisTarde").value;
        if (parseInt(diaAtual) >= parseInt(diaMaisCedo) && parseInt(diaAtual) <= parseInt(diaMaisTarde)) {
            return true;
        }
        return false;
    } // intervalo maximo: [fi, li+ki_i]
    else {
        var maxPerm = document.getElementById("maxPermanencia" + IDCidade).value;
        var diaMaisCedo = document.getElementById("diaMaisCedoChegada" + IDCidade).value;
        var diaMaisTarde = document.getElementById("diaMaisTardeChegada" + IDCidade).value;

        if (parseInt(diaAtual) >= parseInt(diaMaisCedo) && parseInt(diaAtual) <= (parseInt(diaMaisTarde) + parseInt(maxPerm))) {
            return true;
        }
    }
    return false;
}

// 1, Paris
//function isDiaChegadaInFiLi(diaChegada, destino){
function isDiaChegadaInFiLi(diaChegada, destino) {
    var maisCedo = document.getElementById("diaMaisCedoChegada" + destino).value;
    var maisTarde = document.getElementById("diaMaisTardeChegada" + destino).value;
    //console.log(maisCedo);
    //console.log(maisTarde);
    if (parseInt(diaChegada) >= parseInt(maisCedo) &&
        parseInt(diaChegada) <= parseInt(maisTarde)) {
        return true;
    }
    console.log("retorna falso");
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

    //if(isDiaChegadaInFiLi(diaChegada, destino) === true){
    //if(isDiaChegadaInFiLi(diaPartida, diaChegada, destino) === true){
    if (isDiaChegadaInFiLi(diaChegada, destino) && isDiaPossivelChegada(diaPartida)) {
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
            //console.log("destino : "+destino+"dia chegada: "+ diaChegada);
            if (isTransicaoValida(IDOrigem, diaAtual, destino, diaChegada) > 0) {
                $("#" + destino + "_" + diaChegada).addClass("celulaDestino");
            }
        }
    })
}

function removeColorePermanencia(IDOrigem, diaAtual) {

    // se nao eh dia de partida, nao colore as permanencias
    if ($("#" + IDOrigem + "_" + diaAtual).hasClass("celulaDestino") === false) {
        console.log("saindo" + $("#" + IDOrigem + "_" + diaAtual).hasClass("celulaDestino"));
        return;
    }

    console.log("Colore permanencia " + IDOrigem + " " + diaAtual);
    let maxPerm = document.getElementById("maxPermanencia" + IDOrigem).value;
    let minPerm = document.getElementById("minPermanencia" + IDOrigem).value;
    let diaMaisCedo = document.getElementById("diaMaisCedoChegada" + IDOrigem).value;
    let diaMaisTarde = document.getElementById("diaMaisTardeChegada" + IDOrigem).value;

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
        console.log("saindo" + $("#" + IDOrigem + "_" + diaAtual).hasClass("celulaDestino"));
        return;
    }

    console.log("Colore permanencia " + IDOrigem + " " + diaAtual);
    let maxPerm = document.getElementById("maxPermanencia" + IDOrigem).value;
    let minPerm = document.getElementById("minPermanencia" + IDOrigem).value;
    let diaMaisCedo = document.getElementById("diaMaisCedoChegada" + IDOrigem).value;
    let diaMaisTarde = document.getElementById("diaMaisTardeChegada" + IDOrigem).value;

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
            // increment the counter when button is clicked
            isSubmitted.set(true);

            // increment the counter when button is clicked
            partidaMaisTarde.set(document.getElementById("partidaMaisTarde").value);
            console.log("Partida: " + partidaMaisTarde.get());

            T.set(partidaMaisTarde.get());

            //console.log("Linhas tabelas: "+numLinhasTabela.get());

            var dmax = 1; // dias de viagem: 0 ou 1 na Europa
            for (var i = 1; i <= numLinhasTabela.get(); i++) {
                var soma = parseInt(T.get()) + parseInt(document.getElementById("maxPermanenciacidade" + i).value) + 1 + dmax;
                console.log("Soma :" + soma);
                T.set(soma); //maxPermanencia{{this}}
            }

            //função de intervalos teste
            subIntervalosPossiveis();
            console.log("intervalos possíveis: " + intervalos);

            //verifica se tem alguma permanencia vazia
            leperm();

            // Captura os IDs de destino (valor do campo)
            constroiIDCidadesDestinos();

            // preenche intersecoes de permanencia possiveis
            // geraIntersecoesPermanencia();
            criaDiasPossiveisChegada();


            diasChegada = diasChegada.sort();

            console.log("DiasChegada:");
            console.log(diasChegada);
        }
        console.log("T: " + T.get());
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

        var $elem = $(event.target);
        //console.log("id do caller: " + elem);
        var regexElem = /(\w+\s*\w*)_(\d+)/g.exec($elem.attr('id'));
        // console.log(regexElem);

        // muda a cor da célula para celulaAtiva
        if (isCelulaAlcancavel(regexElem[1], regexElem[2])) { // LEFT click =1

            // adiciona celula partida
            if (regexElem[1] === document.getElementById("cidade0").value) {
                $elem.addClass("celulaAtiva");
            }

            var IDDestinos = [];
            var $elemTabela;
            //console.log(numLinhasTabela.get());

            // constroi lista de IDs das cidades de destino
            for (var cidade = 1; cidade <= numLinhasTabela.get() + 1; cidade++) {
                $elemTabela = $(".table :nth-child(2) :nth-child(" + cidade + ") :nth-child(1)");
                // regexElem[1,2] = {cidade, coluna}
                //console.log($elemTabela);
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

        console.log("Intersecoes: ");
        console.log(intersecoes);

    },

    'dblclick .celula': function (event) {

        console.log("evento 2");
        var $elem = $(event.target);
        //console.log("id do caller: " + elem);
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