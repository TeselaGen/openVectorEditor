var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
var getReverseComplementSequenceString = require('./getReverseComplementSequenceString');
var getAminoAcidFromSequenceString = require('./getAminoAcidFromSequenceString');

module.exports = function getAminoAcidRepresentationOfSequence(sequence, circular) {
  //tnr: I think we should always calculate this assuming a circular sequence
  //there is no penalty for making this assumption whereas the other way around, we might limit ourselves
  circular = true; 
  var forwardSequence = sequence;

  //tnr, we should do the parsing down of the orfs immediately after they're returned from this sequence
  // var orfs1Forward = eliminateCircularOrfsThatOverlapWithNonCircularOrfs(getOrfsFromSequenceString(0, doubleForwardSequence, mininmumOrfSize, true), maxLength);
  var aminoAcidsForwardFrame0 = getAminoAcidsFromSequenceStringBasedOnFrameDirectionAndCircularity(0, sequence, true, circular);
  var aminoAcidsForwardFrame1 = getAminoAcidsFromSequenceStringBasedOnFrameDirectionAndCircularity(1, sequence, true, circular);
  var aminoAcidsForwardFrame2 = getAminoAcidsFromSequenceStringBasedOnFrameDirectionAndCircularity(2, sequence, true, circular);

  var aminoAcidsReverseFrame0 = getAminoAcidsFromSequenceStringBasedOnFrameDirectionAndCircularity(0, sequence, false, circular);
  var aminoAcidsReverseFrame1 = getAminoAcidsFromSequenceStringBasedOnFrameDirectionAndCircularity(1, sequence, false, circular);
  var aminoAcidsReverseFrame2 = getAminoAcidsFromSequenceStringBasedOnFrameDirectionAndCircularity(2, sequence, false, circular);

  var combinedForwardOrfs = orfs1Forward.concat(orfs2Forward, orfs3Forward);
  var combinedReverseOrfs = orfs1Reverse.concat(orfs2Reverse, orfs3Reverse);
  var allOrfs = combinedForwardOrfs.concat(combinedReverseOrfs);
  return {
    forward: [
      aminoAcidsForwardFrame0,
      aminoAcidsForwardFrame1,
      aminoAcidsForwardFrame2,
    ],
    reverse: [
      aminoAcidsReverseFrame0,
      aminoAcidsReverseFrame1,
      aminoAcidsReverseFrame2,
    ]
  };
};

/**
 * @private
 * Finds ORFs in a given DNA forward in a given frame.
 * @param  {Int} frame The frame to look in.
 * @param  {String}sequence The dna sequence.
 * @param  {Int} mininmumOrfSize The minimum length of ORF to return.
 * @param  {boolean} forward Should we find forward facing orfs or reverse facing orfs
 * @return {Teselagen.bio.orf.ORF[]} The list of ORFs found.
 */
function getAminoAcidsFromSequenceStringBasedOnFrameDirectionAndCircularity(frame, sequence, forward, circular) {
  var ObjectID = require("bson-objectid");
  if (typeof(forward) === "undefined") {
    throw ('no direction passed');
  }
  // if (typeof(circular) === "undefined") {
  //   throw ('no orf StrandType passed');
  // }
  if (!areNonNegativeIntegers([frame]) || frame > 2) {
    throw ('invalid frame passed');
  }
  if (typeof sequence !== 'string') {
    throw ('invalid sequence passed');
  }
  var maxLength = sequence.length;

  if (!forward) {
    //we reverse the sequence
    sequence = getReverseComplementSequenceString(sequence);
  }
  
  if (circular) {
    //we'll pass in double the sequence and then trim excess orfs
    sequence += sequence;
  }
  
  if (!forward) {
    //we'll reverse the orfs start and end before (potentially) trimming them 
  }
  var nonDuplicatedOrfs;
  if (circular) {
    // we'll trim the excess orfs
    nonDuplicatedOrfs = [];
    potentiallyDuplicatedOrfs.forEach(function(orf) {
      if (orf.start >= maxLength) {
        //eliminate this orf because there must already be a normal orf with the same start bp (just shifted by 1 sequence length)
      } else {
        if (orf.end >= maxLength) {
          orf.end -= maxLength;
        }
        nonDuplicatedOrfs.push(orf);
      }
    });
  } else {
    //non circular so
    nonDuplicatedOrfs = potentiallyDuplicatedOrfs;
  }
  return nonDuplicatedOrfs;

  function calculateOrfs(frame, sequence, mininmumOrfSize, forward) {
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
      if (triplet.length === 3) {
        aaSymbol = getAminoAcidFromSequenceString(triplet);
        aaString += aaSymbol.value;
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
    }

    //loop through the start codons and see if any of them form orfs
    startCodonIndices.forEach(function(startCodonIndex) {
      stopCodonIndices.some(function(stopCodonIndex) {
        if (stopCodonIndex - startCodonIndex > 0) {
          var orf = {
            start: startCodonIndex,
            end: stopCodonIndex,
            forward: forward,
            frame: frame,
            startCodons: startCodonIndices,
            id: ObjectID().str
          };
          allOrfs.push(orf);
          return true; //break the some loop
        }
      });
    });
    //after this we'll need to do a 'reduce' step to shave off the orfs that don't meet the minimum size requirements 
    //as well as the orfs with the same stop bp
    //tnrtodo: inspect this function and make sure it is reducing the orfs correctly!
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

}

function isStartCodon(codon) {
  return (codon === 'atg' || codon === 'aug' && codon.indexOf("-") === -1);
}
/**
 * {Calculates whether a three character string is a stop codon.
 * @param  {String} codon a three character string.
 * @return {Boolean} shows whether the nucleotides make up a stop codon
 */
function isStopCodon(codon) {
  return (codon == 'taa' || codon == 'tag' || codon == 'tga' || codon == 'uaa' || codon == 'uag' || codon == 'uga');
}

/**
 * @private
 * Takes three nucleotides and determines if they (and their ambiguous matches) form a stop codon.
 * @param  {Teselagen.bio.sequence.symbols.NucleotideSymbol/Teselagen.bio.sequence.symbols.GapSymbol} nucleotideOne
 * @param  {Teselagen.bio.sequence.symbols.NucleotideSymbol/Teselagen.bio.sequence.symbols.GapSymbol} nucleotideTwo
 * @param  {Teselagen.bio.sequence.symbols.NucleotideSymbol/Teselagen.bio.sequence.symbols.GapSymbol} nucleotideThree
 * @return {Boolean} True if the nucleotides given form a stop codon.
 */
function evaluatePossibleStop(nucleotideOne, nucleotideTwo, nucleotideThree) {
  var n1 = this.returnMatches(nucleotideOne);
  var n2 = this.returnMatches(nucleotideTwo);
  var n3 = this.returnMatches(nucleotideThree);

  for (var i1 = 0; i1 < n1.length; i1++) {
    for (var i2 = 0; i2 < n2.length; i2++) {
      for (var i3 = 0; i3 < n3.length; i3++) {
        if (Teselagen.TranslationUtils.isStopCodon(n1[i1], n2[i2], n3[i3])) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * @private
 * Helper function to return ambiguous matches of a nucleotide if they exist, and
 * otherwise return an array just containing the nucleotide.
 * @param {Teselagen.bio.sequence.symbols.NucleotideSymbol} nucleotide The nucleotide to get matches for.
 * @return {Teselagen.bio.sequence.symbols.NucleotideSymbol[]} The array containing matches.
 */
function returnMatches(nucleotide) {
  var nucleotideObject = Teselagen.DNAAlphabet[nucleotide];
  var ambiguousMatches;

  if (nucleotideObject && nucleotideObject.getAmbiguousMatches().length !== 0) {
    ambiguousMatches = nucleotideObject.getAmbiguousMatches();
  } else {
    ambiguousMatches = [nucleotide];
  }

  return ambiguousMatches;
}

/**
 * @private
 * Sorting function for sorting codons.
 * @param a
 * @param b
 * @return {Int} Sort order.
 */
function codonsSort(a, b) {
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  } else {
    return 0;
  }
}

function getAminoAcidsFromSequenceString(sequenceString, frame) {
  var aminoAcidStringCorrespondingToEachBaseOfDNA = '';
  for (var i = 0; i < frame; i++) {
    aminoAcidStringCorrespondingToEachBaseOfDNA+= '-';
  }
  var aminoAcidString = '';
  //tnr: eventually we're going to want to 
  for (var i = 3 + frame; i < sequenceString.length; i += 3) {
    var aminoAcid = getAminoAcidFromSequenceString(sequenceString.slice(i - 3, i + 1));
    aminoAcidString += aminoAcid;
    aminoAcidStringCorrespondingToEachBaseOfDNA += aminoAcid + aminoAcid + aminoAcid;
  }
  var lengthOfEndBpsNotCoveredByAminoAcids = sequenceString.length - aminoAcidStringCorrespondingToEachBaseOfDNA.length;
  for (var i = 0; i < lengthOfEndBpsNotCoveredByAminoAcids; i++) {
    aminoAcidStringCorrespondingToEachBaseOfDNA+= '-';
  }
  if (sequenceString.length !== aminoAcidStringCorrespondingToEachBaseOfDNA.length) {
    throw 'something went wrong!';
  }
  return {
    aminoAcidString: aminoAcidString,
    aminoAcidStringCorrespondingToEachBaseOfDNA: aminoAcidStringCorrespondingToEachBaseOfDNA
  };
}
