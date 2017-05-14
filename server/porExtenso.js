// Define as partes do valor por extenso
var extenso = [];

extenso[1] = 'um';
extenso[2] = 'dois';
extenso[3] = 'tres';
extenso[4] = 'quatro';
extenso[5] = 'cinco';
extenso[6] = 'seis';
extenso[7] = 'sete';
extenso[8] = 'oito';
extenso[9] = 'nove';
extenso[10] = 'dez';
extenso[11] = 'onze';
extenso[12] = 'doze';
extenso[13] = 'treze';
extenso[14] = 'quatorze';
extenso[15] = 'quinze';
extenso[16] = 'dezesseis';
extenso[17] = 'dezessete';
extenso[18] = 'dezoito';
extenso[19] = 'dezenove';
extenso[20] = 'vinte';
extenso[30] = 'trinta';
extenso[40] = 'quarenta';
extenso[50] = 'cinquenta';
extenso[60] = 'sessenta';
extenso[70] = 'setenta';
extenso[80] = 'oitenta';
extenso[90] = 'noventa';
extenso[100] = 'cem';
extenso[200] = 'duzentos';
extenso[300] = 'trezentos';
extenso[400] = 'quatrocentos';
extenso[500] = 'quinhentos';
extenso[600] = 'seiscentos';
extenso[700] = 'setecentos';
extenso[800] = 'oitocentos';
extenso[900] = 'novecentos';

var PorExtenso = {};
PorExtenso.resolve = function(cardinal){
  var mapped = extenso.map(function(value, key){
    return {
      number: key,
      cardinal: value
    }
  })
  .find(function(value){
    return value && value.cardinal === cardinal
  });
  return mapped ? mapped.number : null;
}

module.exports = PorExtenso;
