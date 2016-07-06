const fs    = require ('fs');
const http  = require ('http');

const hostname = '127.0.0.1'; 
const port = 3000; 
const server = http.createServer (function (req, res) { 
   res.statusCode = 200; 
   res.setHeader ('Content-Type', 'text/plain'); 
   res.end('HelloWorld2\n'); 
}); 

const assert = require('assert');

// global
var params      = [];
var dadosOrigem = [];
const dMax      = 1;
var arvore      = [];

server.listen (port, hostname, function() { 
   console.log('Server running at http://${hostname}:${port}/'); 
});

function addCelula (destinoFinal, caminho){
   if (celulas[destinoFinal['chegada']] == undefined){
      celulas[destinoFinal['chegada']] = [];
   }

   celulas[destinoFinal['chegada']].push(caminho);
}


fs.readFile('./input', 'utf8', function (errRF, data){
   var linhas = data.split(/\r\n|\r|\n/);
   //console.log(linhas);
   //console.log(data);      

   var numLinhas     = linhas.length;
   var regex         = /(\w+)\s+(\d+)\s+(\d+)\s*/;
   dadosOrigem       = regex.exec(linhas[0]); 
   console.log(dadosOrigem);      

   //params            = [];
   regex             = /(\w+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*/;

   // linha nula no fim do arquivo???
   for (var i=1; i < linhas.length-1; i++){
      var dadosDestinos = regex.exec(linhas[i]);
      //console.log(dadosDestinos);
      params[dadosDestinos[1]] = {
         'cidade' : dadosDestinos[1], 
         'chegadaMaisCedo' : dadosDestinos[2],
         'chegadaMaisTarde': dadosDestinos[3], 
         'minPermanencia'  : dadosDestinos[4],      
         'maxPermanencia'  : dadosDestinos[5]
      };      
   }
   console.log(params);

   testaCidadeAlcancavel();
   testaListaPossibilidades();   

   testaCriaArvore();
});


// DEBUG
function testaCidadeAlcancavel(){
   // sanidade
   assert.deepEqual([1,2], [1,2]);
   console.log(cidadeAlcancavel(1,'Paris'));
   assert.deepEqual([2], cidadeAlcancavel(1,'Paris'));
   assert.deepEqual([2,3], cidadeAlcancavel(2,'Paris'));
   assert.deepEqual([3,4], cidadeAlcancavel(3,'Paris'));
   assert.deepEqual([5], cidadeAlcancavel(4,'Berlim'));
   assert.deepEqual([5,6], cidadeAlcancavel(5,'Berlim'));
}

function testaListaPossibilidades(){
   console.log('testalistapossibilidades');
   // os parametros de entrada podem nao estar de acordo com o arquivo
   console.log(listaPossibilidades('BH',['Paris','Berlim','Roma'],4));
   console.log(listaPossibilidades('BH',['Paris','Berlim','Roma'],5));
}

function testaCriaArvore(){
   for(var i=dadosOrigem[2]; i <= dadosOrigem[3]; i++){
      var arr = [];
      criaArvore(arr,i,i,"","BH",['Paris','Roma','Berlim']);
   }
   console.log("cria arvore");
   //console.log(arvore);
   imprimeArvore();
}

function isChegadaInFiLi(dia, destino){
   // JQUERY AQUI
   var cMaisCedo  = parseInt(params[destino]['chegadaMaisCedo']);
   var cMaisTarde = parseInt(params[destino]['chegadaMaisTarde']);
   if (dia >= cMaisCedo && dia <= cMaisTarde) {
      return true;     
   } 
   return false;
}

function cidadeAlcancavel (partida, destino) {
   var dias = [];
   for(var j = partida; j <= parseInt(partida)+parseInt(dMax); j++){
      if(isChegadaInFiLi(j, destino)){
         dias.push(j);
      }
   }

   return dias;
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

function criaArvore(caminho,diaPartida,diaChegada,cidadeAnterior,
      cidadeAtual,destinosPossiveis) {
   //console.log("Recebeu caminho:" );
   //console.log(caminho);
   //console.log("");
   var pMaisCedo;
   var pMaisTarde;

   // JQUERY AQUI
   // se nao for origem, add no caminho e consulta intervalos partidas
   if(dadosOrigem[1] != cidadeAtual) {
      // add no comeco do caminho
      //console.log(typeof(caminho));
      //var novoCaminho = caminho.slice();
      addCidade(cidadeAtual,diaChegada,caminho);
      caminho.unshift({'cidade':cidadeAtual,'partida':diaPartida,
      'chegada': diaChegada, 'anterior':cidadeAnterior});
      // JQUERY AQUI
      pMaisCedo   = parseInt(diaChegada) + parseInt(params[cidadeAtual]['minPermanencia']) + parseInt(1);
      pMaisTarde  = parseInt(diaChegada) + parseInt(params[cidadeAtual]['maxPermanencia']) + parseInt(1);
   } else {
      pMaisCedo   = dadosOrigem[2];
      pMaisTarde  = dadosOrigem[3];
   }

   //console.log("pMaisCedo: "+pMaisCedo);
   //console.log("pMaisTarde: "+pMaisTarde);

   var destPossiveis = destinosPossiveis;   
   destPossiveis = destPossiveis.filter(function(item){
      if(item != cidadeAtual){
         console.log("Remocao: "+item+" "+cidadeAtual);
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
         //console.log("misterio");
         //console.log(opcoes);
         opcoes.forEach(function (elemento){
           
            criaArvore (caminho.slice(), elemento['partida'],
               elemento['chegada'], elemento['anterior'],
               elemento['cidade'], destPossiveis);

         });
      } else {
         console.log("caminho ate aqui: ");
         console.log(caminho);
         console.log("");
         //caminho.shift();
         addCidade (cidadeAtual, diaChegada, caminho);
         return;
      }
   }
}

function addCidade(cidade, diaChegada, caminho) {
   if(arvore[diaChegada] === undefined){
      arvore[diaChegada] = [];
   }
   if(arvore[diaChegada][cidade] === undefined){
      arvore[diaChegada][cidade] = [];
   }
   arvore[diaChegada][cidade].push(caminho.slice());
}

function imprimeArvore(){
   arvore.forEach(function(no, diaChegada){
      console.log(diaChegada);
      //console.log(no);
      var keys = Object.keys(no);
      console.log(keys);
      keys.forEach(function(cidade){
         console.log("No dia: "+diaChegada+", "+cidade+" e acessivel");   
      })
   })
}

function isCityReachableInDay(dia, cidade){
   if(arvore[dia]['cidade'] !== undefined){
      return true;
   }
   return false;
}
