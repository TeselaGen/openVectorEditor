var nn_s = {
  'AA': '240',
  'AC': '173',
  'AG': '208',
  'AT': '239',
  'AN': '215',
  'CA': '129',
  'CC': '266',
  'CG': '278',
  'CT': '208',
  'CN': '220',
  'GA': '135',
  'GC': '267',
  'GG': '266',
  'GT': '173',
  'GN': '210',
  'TA': '169',
  'TC': '135',
  'TG': '129',
  'TT': '240',
  'TN': '168',
  'NA': '168',
  'NC': '210',
  'NG': '220',
  'NT': '215',
  'NN': '203',
  'aa': '240',
  'ac': '173',
  'ag': '208',
  'at': '239',
  'an': '215',
  'ca': '129',
  'cc': '266',
  'cg': '278',
  'ct': '208',
  'cn': '220',
  'ga': '135',
  'gc': '267',
  'gg': '266',
  'gt': '173',
  'gn': '210',
  'ta': '169',
  'tc': '135',
  'tg': '129',
  'tt': '240',
  'tn': '168',
  'na': '168',
  'nc': '210',
  'ng': '220',
  'nt': '215',
  'nn': '203'
}
var nn_h = {
  'AA': '91',
  'AC': '65',
  'AG': '78',
  'AT': '86',
  'AN': '80',
  'CA': '58',
  'CC': '110',
  'CG': '119',
  'CT': '78',
  'CN': '91',
  'GA': '56',
  'GC': '111',
  'GG': '110',
  'GT': '65',
  'GN': '85',
  'TA': '60',
  'TC': '56',
  'TG': '58',
  'TT': '91',
  'TN': '66',
  'NA': '66',
  'NC': '85',
  'NG': '91',
  'NT': '80',
  'NN': '80',
  'aa': '91',
  'ac': '65',
  'ag': '78',
  'at': '86',
  'an': '80',
  'ca': '58',
  'cc': '110',
  'cg': '119',
  'ct': '78',
  'cn': '91',
  'ga': '56',
  'gc': '111',
  'gg': '110',
  'gt': '65',
  'gn': '85',
  'ta': '60',
  'tc': '56',
  'tg': '58',
  'tt': '91',
  'tn': '66',
  'na': '66',
  'nc': '85',
  'ng': '91',
  'nt': '80',
  'nn': '80'
}



//Calculate Tm of Primer if >36bps
function calcTmLong(dna) {
  var numberTmLong = 81.5 + (16.6 * (Math.log(50 / 1000.0) / Math.log(10))) +
      (41.0 * (gcPercent(dna) / 100)) - (600.0 / dna.length);
  return numberTmLong.toFixed(2);
}

//Calculate Tm of Primer if <=36bps
function calcTmShort(oligo) {
  var dH = 0;
  var dS = 108;
  var i;
  // Compute dH and dS
  for (i = 0; i < (oligo.length - 1); i++) {
      var pair = oligo.substr(i, 2);
      dH += parseInt(nn_h[pair], 10);
      dS += parseInt(nn_s[pair], 10);
  }
  dH *= -100.0;
  dS *= -0.1;
  var numberTm = dH / (dS + 1.987 * Math.log(100 / 4000000000.0)) - 273.15 +
      16.6 * (Math.log(50 / 1000.0) / Math.log(10));
  return numberTm.toFixed(2);
}


//Calculate GC Percentage of Primer
function gcPercent(oligo) {
  var Arr_Primer = oligo.split("");
  var gCount = 0;
  var tCount = 0;
  var cCount = 0;
  var aCount = 0;
  for (var i = 0; i < Arr_Primer.length; i++) {
      if (Arr_Primer[i] === 'A') {
          aCount++;
      } else if (Arr_Primer[i] === 'C') {
          cCount++;
      } else if (Arr_Primer[i] === 'T') {
          tCount++;
      } else if (Arr_Primer[i] === 'G') {
          gCount++;
      }
  }
  var number = ((gCount + cCount) / Arr_Primer.length) * 100;
  return number.toFixed(2);
}



function calcTm(primer) {
  if (primer.length > 36) {
      return calcTmLong(primer)
  } else if (primer.length <= 36 && primer.length >=10) {
      return calcTmShort(primer)
  } else {
      return null
  }
}


// var primer = "GCGGATCGCGCGATCGAGCAGCGCT";

var primer = process.argv[2];
if (primer) {
  var returnTm = calcTm(primer)
  if (returnTm) {
      console.log(returnTm+"degC");
  } else {
      console.log("primer must be at least 10bps");
  }
}

calcTm.calcTmShort = calcTmShort
calcTm.calcTmLong = calcTmLong
module.exports = calcTm;