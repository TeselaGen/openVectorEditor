var arePositiveIntegers = require('../arePositiveIntegers');
module.exports = function findOrfsFromSequence(sequence, isCircular) {
	getAminoAcidsFromSequenceString(sequence);
	getAminoAcidsFromSequenceString(sequence);
	getAminoAcidsFromSequenceString(sequence);


	function getAminoAcidsFromSequenceString (sequenceString) {
		var aminoAcidString = '';
		for (var i = 3; i < sequenceString.length; i+=3) {
			aminoAcidString+= getAminoAcidFromSequenceString(sequenceString[i-3,i]);
		};
		return aminoAcidString;
	}

	function getAminoAcidFromSequenceString (sequenceString) {
		if (sequenceString && sequenceString.length === 3 && threeLetterSequenceStringToAminoAcidMap[sequenceString]) {
			return threeLetterSequenceStringToAminoAcidMap[sequenceString].value;
		}
	}

};


var proteinAlphabet = { //tnrtodo: add stop codons and non-normal codons to these maps as well!!
	'A': {value: 'A', name:'Alanine', threeLettersName: 'Ala'}
	'R': {value: 'R', name:'Arginine', threeLettersName: 'Arg'}
	'N': {value: 'N', name:'Asparagine', threeLettersName: 'Asn'}
	'D': {value: 'D', name:'Aspartic acid', threeLettersName: 'Asp'}
	'C': {value: 'C', name:'Cysteine', threeLettersName: 'Cys'}
	'E': {value: 'E', name:'Glutamic acid', threeLettersName: 'Glu'}
	'Q': {value: 'Q', name:'Glutamine', threeLettersName: 'Gln'}
	'G': {value: 'G', name:'Glycine', threeLettersName: 'Gly'}
	'H': {value: 'H', name:'Histidine', threeLettersName: 'His'}
	'I': {value: 'I', name:'Isoleucine ', threeLettersName: 'Ile'}
	'L': {value: 'L', name:'Leucine', threeLettersName: 'Leu'}
	'K': {value: 'K', name:'Lysine', threeLettersName: 'Lys'}
	'M': {value: 'M', name:'Methionine', threeLettersName: 'Met'}
	'F': {value: 'F', name:'Phenylalanine', threeLettersName: 'Phe'}
	'P': {value: 'P', name:'Proline', threeLettersName: 'Pro'}
	'S': {value: 'S', name:'Serine', threeLettersName: 'Ser'}
	'T': {value: 'T', name:'Threonine', threeLettersName: 'Thr'}
	'W': {value: 'W', name:'Tryptophan', threeLettersName: 'Trp'}
	'Y': {value: 'Y', name:'Tyrosine', threeLettersName: 'Tyr'}
	'V': {value: 'V', name:'Valine ', threeLettersName: 'Val'}
}

var threeLetterSequenceStringToAminoAcidMap = {
	gct: proteinAlphabet.A
	gcc: proteinAlphabet.A
	gca: proteinAlphabet.A
	gcg: proteinAlphabet.A
	gcu: proteinAlphabet.A
	cgt: proteinAlphabet.R
	cgc: proteinAlphabet.R
	cga: proteinAlphabet.R
	cgg: proteinAlphabet.R
	aga: proteinAlphabet.R
	agg: proteinAlphabet.R
	cgu: proteinAlphabet.R
	aat: proteinAlphabet.N
	aac: proteinAlphabet.N
	aau: proteinAlphabet.N
	gat: proteinAlphabet.D
	gac: proteinAlphabet.D
	gau: proteinAlphabet.D
	tgt: proteinAlphabet.C
	tgc: proteinAlphabet.C
	ugu: proteinAlphabet.C
	ugc: proteinAlphabet.C
	gaa: proteinAlphabet.E
	gag: proteinAlphabet.E
	caa: proteinAlphabet.Q
	cag: proteinAlphabet.Q
	ggt: proteinAlphabet.G
	ggc: proteinAlphabet.G
	gga: proteinAlphabet.G
	ggg: proteinAlphabet.G
	ggu: proteinAlphabet.G
	cat: proteinAlphabet.H
	cac: proteinAlphabet.H
	cau: proteinAlphabet.H
	att: proteinAlphabet.I
	atc: proteinAlphabet.I
	ata: proteinAlphabet.I
	auu: proteinAlphabet.I
	auc: proteinAlphabet.I
	aua: proteinAlphabet.I
	ctt: proteinAlphabet.L
	ctc: proteinAlphabet.L
	cta: proteinAlphabet.L
	ctg: proteinAlphabet.L
	tta: proteinAlphabet.L
	ttg: proteinAlphabet.L
	cuu: proteinAlphabet.L
	cuc: proteinAlphabet.L
	cua: proteinAlphabet.L
	cug: proteinAlphabet.L
	uua: proteinAlphabet.L
	uug: proteinAlphabet.L
	aaa: proteinAlphabet.K
	aag: proteinAlphabet.K
	atg: proteinAlphabet.M
	aug: proteinAlphabet.M
	ttt: proteinAlphabet.F
	ttc: proteinAlphabet.F
	uuu: proteinAlphabet.F
	uuc: proteinAlphabet.F
	cct: proteinAlphabet.P
	ccc: proteinAlphabet.P
	cca: proteinAlphabet.P
	ccg: proteinAlphabet.P
	ccu: proteinAlphabet.P
	tct: proteinAlphabet.S
	tcc: proteinAlphabet.S
	tca: proteinAlphabet.S
	tcg: proteinAlphabet.S
	agt: proteinAlphabet.S
	agc: proteinAlphabet.S
	ucu: proteinAlphabet.S
	ucc: proteinAlphabet.S
	uca: proteinAlphabet.S
	ucg: proteinAlphabet.S
	agu: proteinAlphabet.S
	act: proteinAlphabet.T
	acc: proteinAlphabet.T
	aca: proteinAlphabet.T
	acg: proteinAlphabet.T
	acu: proteinAlphabet.T
	tgg: proteinAlphabet.W
	ugg: proteinAlphabet.W
	tat: proteinAlphabet.Y
	tac: proteinAlphabet.Y
	uau: proteinAlphabet.Y
	uac: proteinAlphabet.Y
	gtt: proteinAlphabet.V
	gtc: proteinAlphabet.V
	gta: proteinAlphabet.V
	gtg: proteinAlphabet.V
	guu: proteinAlphabet.V
	guc: proteinAlphabet.V
	gua: proteinAlphabet.V
	gug: proteinAlphabet.V
}
