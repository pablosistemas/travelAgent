/**
 * Created by izabella.avelar on 01/07/16.
 */

let dMax = 1;

// vetor de dias, cada dia será um array associativo  de cidades
let objCelula = [];

function criaObjCidadePartida(cidade, partida) {
    return {'cidade': cidade, 'partida': partida};
}

function addElementObjCelula() {


}

function listaOpcoes(diaAtual, IDOrigem, IDDestinos) {
    let opcoes = [];
    if (IDOrigem !== $("#cidade0").val()) {
        var chegadaMaisCedo = $("#diaMaisCedoChegada" + IDOrigem).val();
        var minPerm = $("#minPermanencia" + IDOrigem).val();
        if (parseInt(diaAtual) >= parseInt(chegadaMaisCedo) && parseInt(diaAtual) <= parseInt(chegadaMaisCedo) + parseInt(minPerm)) {
            return;
        }
    }

    IDDestinos.forEach(function (destino) {
        // dia chegada for no mesmo dia da partida ou no dia seguinte, d E {0,1}
        for (var diaChegada = diaAtual; diaChegada <= parseInt(diaAtual) + dMax && diaChegada <= parseInt(T.get()); diaChegada++) {
            //console.log("destino : "+destino+"dia chegada: "+ diaChegada);
            if (isTransicaoValida(IDOrigem, diaAtual, destino, diaChegada) > 0) {
                opcoes.push(criaObjCidadePartida(IDOrigem, diaAtual));
                //$("#" + destino + "_" + diaChegada).addClass("celulaDestino");
            }
        }
    })
    return opcoes;
}


function navegaArvore(caminho, origem, destino) {


}

function criaArvore(caminho, diaAtual, cidadeAtual, destinosPossiveis) {

    adicionaCelula(diaAtual, cidadeAtual, caminho);

    let opcoes = listaPossibilidades(cidadeAtual, diaAtual, destinosPossiveis);

    opcoes.forEach(function (transicao, diaPartida) {
        let destinos = caminhos;
        destinos.push({'cidade': cidadeAtual, 'partida': diaPartida});

        let destPossiveis = destinosPossiveis;
        destPossiveis.splice(destPossiveis(cidadeAtual), 1);
        criaArvore(destinos, transicao['chegada'], transicao['cidade'], destPossiveis);
    })
}


// retorna array contendo dias possiveis de saida. Cada dia tem relacionado um vetor de objetos das cidades alcancavewis e suas chegadas
/*function listaPossibilidades(origem,data,destinos,destinosPossiveis){
 let partidas=[];
 for(let i=parseInt(data)+parseInt($("#minPermanenciacidade"+origem).val()); i <= parseInt(data)+parseInt($("#maxPermanenciacidade"+origem).val())+1; i++){
 partidas[i]=[];
 destinosPossiveis.forEach(function(cidade){
 let dias=cidadeAlcancavel(cidade,i);
 dias.forEach(function(oDia){
 partidas[i].push({'cidade':cidade,'chegada':oDia});
 })
 })
 }
 return partidas;
 }*/

function listaPossibilidades(origem, data, destinosPossiveis) {
    let partidas = [];
    let maisCedo;
    let maisTarde;
    if (origem == $("#cidade0").val()) {
        maisCedo    = parseInt($("#partidaMaisCedo").val());
        maisTarde   = parseInt($("#partidaMaisTarde").val());
    } else {
        maisCedo    = parseInt(data) + parseInt($('#minPermanenciacidade' + origem)) + 1;
        maisTarde   = parseInt(data) + parseInt($('#maxPermanenciacidade' + origem)) + 1;
    }

    for (let diaPartida = maisCedo; diaPartida <= maisTarde; diaPartida++) {
        partidas[diaPartida] = [];
        destinosPossiveis.forEach(function (cidade) {
            let dias = cidadeAlcancavel(diaPartida, cidade);
            dias.forEach(function (date) {
                partidas[diaPartida].push({'cidade': cidade, 'chegada': date});
            })

        })
    }
    return partidas;
}

function cidadeAlcancavel(diaPartida, cidadeDestino) {
    let dias = [];
    for (let i = diaPartida; i <= parseInte(diaPartida) + parseInt(dMax); i++) {
        if (isDiaChegadaInFiLi(i, cidadeDestino)) {
            dias.push(i);
        }
    }
    return dias;
}

function adicionaCelula(diaAtual, cidadeAtual, caminho) {
    if (celulas[diaAtual] == undefined) {
        celulas[diaAtual] = [];
    }
    if (celulas[diaAtual][cidadeAtual] == undefined) {
        celulas[diaAtual][cidadeAtual] = [];
    }
    celulas[diaAtual][cidadeAtual].push(caminho);

}