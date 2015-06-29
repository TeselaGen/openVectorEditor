var arePositiveIntegers = require('../arePositiveIntegers');
var getReverseComplementSequenceString = require('getReverseComplementSequenceString');

module.exports = function findOrfsFromSequence(sequence, isCircular, mininmumOrfSize) {
	if (isCircular) {
		var forwardSequence = sequence;
        var backwardSequence = getReverseComplementSequenceString(sequence);

        var doubleForwardSequence = forwardSequence + forwardSequence;
        var doubleBackwardSequence = backwardSequence + backwardSequence;

        var orfs1Forward = this.getAminoAcidsAndOrfsFromSequenceString(0, doubleForwardSequence, mininmumOrfSize);
        var orfs2Forward = this.getAminoAcidsAndOrfsFromSequenceString(1, doubleForwardSequence, mininmumOrfSize);
        var orfs3Forward = this.getAminoAcidsAndOrfsFromSequenceString(2, doubleForwardSequence, mininmumOrfSize);

        var orfs1Reverse = this.getAminoAcidsAndOrfsFromSequenceString(0, doubleBackwardSequence, mininmumOrfSize);
        var orfs2Reverse = this.getAminoAcidsAndOrfsFromSequenceString(1, doubleBackwardSequence, mininmumOrfSize);
        var orfs3Reverse = this.getAminoAcidsAndOrfsFromSequenceString(2, doubleBackwardSequence, mininmumOrfSize);

        var combinedForwardOrfs = orfs1Forward.concat(orfs2Forward, orfs3Forward);
        var combinedReverseOrfs = orfs1Reverse.concat(orfs2Reverse, orfs3Reverse);
        
        //recalculate the start and end indices for the combinedReverseOrfs 
        //(because they were generated using the reverse complement sequence and thus have their indices flipped)
        for(var i = 0; i < combinedReverseOrfs.length; i++) {
            var orf = combinedReverseOrfs[i];

            var start = doubleBackwardSequence.length - orf.start - 1;
            var end = doubleBackwardSequence.length - orf.end;

            orf.start(end);
            orf.end(start);

            for(var j = 0; j < orf.startCodons.length; j++) {
                orf.startCodons[j] = doubleBackwardSequence.length - orf.startCodons[j] - 1;
            }

            var startCodons = orf.startCodons;
            startCodons.sort(this.codonsSort);
            orf.startCodons = startCodons;
        }

        var allOrfs = combinedForwardOrfs.concat(combinedReverseOrfs);

        var maxLength = forwardSequence.length;

        orfsWithNoDuplicates = [];
        var normalOrfs = [];
//        var orf = null;

        allOrfs.forEach(function(orf) {
            if(orf.start >= maxLength) {
            	//do nothing
            } else if(orf.end <= maxLength) {
                normalOrfs.push(orf);
            } else if(orf.end > maxLength && orf.start < maxLength) {
                var startCodons = orf.startCodons;

                orf.end(orf.end - maxLength);

                orf.startCodons = (orf.startCodons.map(function(startCodon) {
                    if(startCodon >= maxLength) {
                        startCodon -= maxLength;
                    }
                    return startCodon;
                }));

                orfsWithNoDuplicates.push(orf);
            }
        });

        // Eliminate the orfs that overlaps with circular orfs.
        normalOrfs.forEach(function(normalOrf) {
            var skip = false;

            orfsWithNoDuplicates.forEach(function(circularOrf) {
                if(circularOrf.end === normalOrf.end &&
                   circularOrf.forward === normalOrf.forward) {
                    skip = true;
                    return false;
                }
            });

            if(!skip) {
                orfsWithNoDuplicates.push(normalOrf);
            }
        });
        orfsWithNoDuplicates.forEach(function(orf) {
            //the end bps of orfs on the reverse forward were off by 1, so this code fixes that
            if (orf.forward === -1) {
                orf.end++;
            }
        });
        return orfsWithNoDuplicates;
	} else {
		//get the aa's for the 3 frames
		getAminoAcidsFromSequenceString(sequence);
		getAminoAcidsFromSequenceString(sequence);
		getAminoAcidsFromSequenceString(sequence);
	}
};

    /**
     * @private
     * Finds ORFs in a given DNA forward in a given frame.
     * @param  {Int} frame The frame to look in.
     * @param  {String}sequence The dna sequence.
     * @param  {Int} mininmumOrfSize The minimum length of ORF to return.
     * @param  {Teselagen.bio.sequence.common.StrandType} forward The forward we are looking at.
     * @return {Teselagen.bio.orf.ORF[]} The list of ORFs found.
     */
    function getAminoAcidsAndOrfsFromSequenceString(frame, sequence, mininmumOrfSize, forward) {

        if (typeof(mininmumOrfSize) === "undefined") {
            console.warn('no min orf size given');
            return;
        }

        if (typeof(forward) === "undefined") {
            console.warn('no orf StrandType passed');
            return;
        }
        if (!arePositiveIntegers(frame) || frame > 2) {
            console.warn('invalid frame passed');
            return;
        }

        var allOrfs = [];
        var sequenceLength = sequence.length;

        // var index = frame;
        var triplet;
        var aaSymbol;
        var aaString = '';
        var startIndex = -1;
        var endIndex = -1;
        var startCodonIndices = [];
        var stopCodonIndices = [];
        var possibleStopCodon;
        var possibleStartCodon;

        // Loop through sequence and generate list of ORFs.
        for (var index = frame; index < sequenceLength; index += 3) {
            triplet = sequence.slice(index, index + 3);
            aaSymbol = threeLetterSequenceStringToAminoAcidMap[triplet];
            aaString.push(aaSymbol);

            possibleStartCodon = isStartCodon(triplet);
            possibleStopCodon = isStopCodon(triplet);

            // If we've found a start codon, add its index to startCodonIndices.
            if (possibleStartCodon) {
                startCodonIndices.push(index);
            }
            if (possibleStopCodon) {
                stopCodonIndices.push(index);
            }
        }

        //loop through the start codons and see if any of them form orfs
        startCodonIndices.forEach(function(startCodonIndex){
            stopCodonIndices.some(function(stopCodonIndex){
                if (stopCodonIndex - startCodonIndex > 0) {
                    var orf = {
                            start: startIndex,
                            end: endIndex,
                            forward: forward,
                            frame: frame,
                            startCodons: startCodonIndices
                        };
                    allOrfs.push(orf);
                    return true; //break the some loop
                } 
            });
        });
        //after this we'll need to do a 'reduce' step to shave off the orfs that don't meet the minimum size requirements 
        //as well as the orfs with the same stop bp
        var trimmedOrfs = [];
        allOrfs.forEach(function(orf) {
            if (orf.end - orf.start + 1 >= mininmumOrfSize) { //make sure the orf size is >= to the minimum size
                var indexOfOrfWithSameStopBp = _.findIndex(trimmedOrfs, function(trimmedOrf) { //find any orfs with the same stop bp in the trimmed orf array
                    return trimmedOrf.end === orf.end;
                });
                if (indexOfOrfWithSameStopBp === -1) {
                    trimmedOrfs.push(orf);
                } else {
                    if (trimmedOrfs[indexOfOrfWithSameStopBp].start > orf.start) {
                        trimmedOrfs[indexOfOrfWithSameStopBp] = orf; //replace the old orf at that position with this new orf because it is longer
                    }
                }
            }
        });
        return trimmedOrfs;
    }

    function isStartCodon (codon) {
        return (codon === 'atg' || codon === 'aug' && codon.indexOf("-") === -1);
    }

    /**
     * @private
     * Takes three nucleotides and determines if they (and their ambiguous matches) form a stop codon.
     * @param  {Teselagen.bio.sequence.symbols.NucleotideSymbol/Teselagen.bio.sequence.symbols.GapSymbol} nucleotideOne
     * @param  {Teselagen.bio.sequence.symbols.NucleotideSymbol/Teselagen.bio.sequence.symbols.GapSymbol} nucleotideTwo
     * @param  {Teselagen.bio.sequence.symbols.NucleotideSymbol/Teselagen.bio.sequence.symbols.GapSymbol} nucleotideThree
     * @return {Boolean} True if the nucleotides given form a stop codon.
     */
    function evaluatePossibleStop (nucleotideOne, nucleotideTwo, nucleotideThree) {
        var n1 = this.returnMatches(nucleotideOne);
        var n2 = this.returnMatches(nucleotideTwo);
        var n3 = this.returnMatches(nucleotideThree);

        for(var i1 = 0; i1 < n1.length; i1++) {
            for(var i2 = 0; i2 < n2.length; i2++) {
                for(var i3 = 0; i3 <n3.length; i3++) {
                    if(Teselagen.TranslationUtils.isStopCodon(n1[i1], n2[i2], n3[i3])) {
                        return true;
                    }
                }
            }
        }

        return false;
    },

    /**
     * @private
     * Helper function to return ambiguous matches of a nucleotide if they exist, and
     * otherwise return an array just containing the nucleotide.
     * @param {Teselagen.bio.sequence.symbols.NucleotideSymbol} nucleotide The nucleotide to get matches for.
     * @return {Teselagen.bio.sequence.symbols.NucleotideSymbol[]} The array containing matches.
     */
    returnMatches: function(nucleotide) {
        var nucleotideObject = Teselagen.DNAAlphabet[nucleotide];
        var ambiguousMatches;

        if(nucleotideObject && nucleotideObject.getAmbiguousMatches().length !== 0) {
            ambiguousMatches = nucleotideObject.getAmbiguousMatches();
        } else {
            ambiguousMatches = [nucleotide];
        }

        return ambiguousMatches;
    },

    /**
     * @private
     * Sorting function for sorting codons.
     * @param a
     * @param b
     * @return {Int} Sort order.
     */
    codonsSort: function(a, b) {
        if(a > b) {
            return 1;
        } else if(a < b) {
            return -1;
        } else {
            return 0;
        }
    }

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
	'V': {value: 'V', name:'Valine', threeLettersName: 'Val'}
	'V': {value: 'V', name:'Valine', threeLettersName: 'Val'}
	'*': {value: '*', name:'Stop', threeLettersName: 'Stop'}
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
	taa: proteinAlphabet.*
	tag: proteinAlphabet.*
	tga: proteinAlphabet.*
}
