var revComp = require('./getReverseComplementSequenceString');
var getAA = require('./getAminoAcidFromSequenceTriplet');
// var ac = require('ve-api-check'); 
// ac.throw([ac.string,ac.bool],arguments);
/**
 * @private
 * Gets aminoAcid data, including position in string and position in codon
 * from the sequenceString and the direction of the translation
 * @param  {String} sequenceString The dna sequenceString.
 * @param  {boolean} forward Should we find forward facing orfs or reverse facing orfs
 * @return [{
        aminoAcid: 
        positionInCodon: 
      }]
 */
module.exports = function getAminoAcidDataForEachBaseOfDna(sequenceString, forward) {
    // ac.throw([ac.string,ac.bool],arguments);
    var aminoAcidDataForEachBaseOfDNA = [];

    var revCompGapLength = 0;
    var aminoAcidIndex = 0;
    if (!forward) {
    //compute the start of the sequence, but only if translating in the reverse direction
        aminoAcidIndex = Math.floor((sequenceString.length - 1)/ 3);
    //because we're translating in the reverse direction, we need to
    //check to see if there are untranslated amino acids at the start of the sequenceString
        revCompGapLength = sequenceString.length % 3;
        if (revCompGapLength > 0) {
            for (var i = 0; i < revCompGapLength; i++) {
                aminoAcidDataForEachBaseOfDNA.push({
                    aminoAcid: getAA('xxx'), //fake xxx triplet returns the gap amino acid
                    positionInCodon: revCompGapLength - i - 1,
                    aminoAcidIndex: aminoAcidIndex,
                    fullCodon: false
                });
            }
            aminoAcidIndex--;
        }
    }

  //compute the bulk of the sequence
    for (var index = 2 + revCompGapLength; index < sequenceString.length; index += 3) {
        var triplet = sequenceString.slice(index - 2, index + 1);
        if (!forward) {
      //we reverse the triplet
            triplet = revComp(triplet);
        }
        var aminoAcid = getAA(triplet);
        aminoAcidDataForEachBaseOfDNA.push({
            aminoAcid: aminoAcid, //gap amino acid
            positionInCodon: forward ? 0 : 2,
            aminoAcidIndex: aminoAcidIndex,
            fullCodon: true
        });
        aminoAcidDataForEachBaseOfDNA.push({
            aminoAcid: aminoAcid, //gap amino acid
            positionInCodon: 1,
            aminoAcidIndex: aminoAcidIndex,
            fullCodon: true
        });
        aminoAcidDataForEachBaseOfDNA.push({
            aminoAcid: aminoAcid, //gap amino acid
            positionInCodon: forward ? 2 : 0,
            aminoAcidIndex: aminoAcidIndex,
            fullCodon: true
        });
        if (forward) {
            aminoAcidIndex++;
        } else {
            aminoAcidIndex--;
        }
    }

  //compute the end of the sequence
  //we'll never hit the following logic if translating in the reverse direction
    var lengthOfEndBpsNotCoveredByAminoAcids = sequenceString.length - aminoAcidDataForEachBaseOfDNA.length;
    for (var j = 0; j < lengthOfEndBpsNotCoveredByAminoAcids; j++) {
        aminoAcidDataForEachBaseOfDNA.push({
            aminoAcid: getAA('xxx'), //fake xxx triplet returns the gap amino acid
            positionInCodon: j,
            aminoAcidIndex: aminoAcidIndex,
            fullCodon: false
        });
    }

    if (sequenceString.length !== aminoAcidDataForEachBaseOfDNA.length) {
        throw new Error('something went wrong!');
    }
    return aminoAcidDataForEachBaseOfDNA;
};
