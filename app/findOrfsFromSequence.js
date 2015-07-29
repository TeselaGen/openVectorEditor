var _ = require('lodash');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
var getReverseComplementSequenceString = require('./getReverseComplementSequenceString');
var getAminoAcidFromSequenceString = require('./getAminoAcidFromSequenceString');

module.exports = function findOrfsFromSequence(sequence, circular, mininmumOrfSize) {
  // if (circular) {
  var forwardSequence = sequence;
  
  //tnr, we should do the parsing down of the orfs immediately after they're returned from this sequence
  // var orfs1Forward = eliminateCircularOrfsThatOverlapWithNonCircularOrfs(getOrfsFromSequenceString(0, doubleForwardSequence, mininmumOrfSize, true), maxLength);
  var orfs1Forward = getOrfsFromSequenceString(0, sequence, mininmumOrfSize, true, circular);
  var orfs2Forward = getOrfsFromSequenceString(1, sequence, mininmumOrfSize, true, circular);
  var orfs3Forward = getOrfsFromSequenceString(2, sequence, mininmumOrfSize, true, circular);

  var orfs1Reverse = getOrfsFromSequenceString(0, sequence, mininmumOrfSize, false, circular);
  var orfs2Reverse = getOrfsFromSequenceString(1, sequence, mininmumOrfSize, false, circular);
  var orfs3Reverse = getOrfsFromSequenceString(2, sequence, mininmumOrfSize, false, circular);

  var combinedForwardOrfs = orfs1Forward.concat(orfs2Forward, orfs3Forward);
  var combinedReverseOrfs = orfs1Reverse.concat(orfs2Reverse, orfs3Reverse);
  var allOrfs = combinedForwardOrfs.concat(combinedReverseOrfs);
  return allOrfs;
};

  // function eliminateCircularOrfsThatOverlapWithNonCircularOrfs(potentiallyDuplicatedOrfs, maxLength) {
  //   var circularOrfs = [];
  //   var normalOrfs = [];
  //   var nonDuplicatedOrfs = [];
  //   potentiallyDuplicatedOrfs.forEach(function(orf) {
  //     if (orf.start >= maxLength) {
  //       //eliminate this orf because there must already be a normal orf with the same start bp (just shifted by 1 sequence length)
  //     } else {
  //       nonDuplicatedOrfs.push(orf);
  //     }
  //     
  //     // else if (orf.end <= maxLength) {
  //     //   normalOrfs.push(orf);
  //     // } else if (orf.end > maxLength && orf.start < maxLength) {
  //     //   var startCodons = orf.startCodons;
  //     // 
  //     //   orf.end(orf.end - maxLength);
  //     // 
  //     //   orf.startCodons = (orf.startCodons.map(function(startCodon) {
  //     //     if (startCodon >= maxLength) {
  //     //       startCodon -= maxLength;
  //     //     }
  //     //     return startCodon;
  //     //   }));
  //     // 
  //     //   circularOrfs.push(orf);
  //     // }
  //   });
  // 
  //   // Eliminate the orfs that overlaps with circular orfs.
  //   // normalOrfs.forEach(function(normalOrf) {
  //   //   var skip = false;
  //   //   circularOrfs.forEach(function(circularOrf) {
  //   //     if (circularOrf.end === normalOrf.end) {
  //   //       skip = true;
  //   //       return false;
  //   //     }
  //   //   });
  //   // 
  //   //   if (!skip) {
  //   //     nonDuplicatedOrfs.push(normalOrf);
  //   //   }
  //   // });
  //   
  //   
  //   // orfsWithNoDuplicates.forEach(function(orf) {
  //   //   //the end bps of orfs on the reverse forward were off by 1, so this code fixes that
  //   //   if (orf.forward === -1) {
  //   //     orf.end++;
  //   //   }
  //   // });
  //   return nonDuplicatedOrfs;
  // }
  // //recalculate the start and end indices for the combinedReverseOrfs 
  // //(because they were generated using the reverse complement sequence and thus have their indices flipped)
  // for (var i = 0; i < combinedReverseOrfs.length; i++) {
  //   var orf = combinedReverseOrfs[i];
  // 
  //   var start = doubleBackwardSequence.length - orf.start - 1;
  //   var end = doubleBackwardSequence.length - orf.end;
  // 
  //   orf.start(end);
  //   orf.end(start);
  // 
  //   for (var j = 0; j < orf.startCodons.length; j++) {
  //     orf.startCodons[j] = doubleBackwardSequence.length - orf.startCodons[j] - 1;
  //   }
  // 
  //   var startCodons = orf.startCodons;
  //   startCodons.sort(this.codonsSort);
  //   orf.startCodons = startCodons;
  // }


  
  //        var orf = null;

  
  // } else {
  //     //get the aa's for the 3 frames
  //     getAminoAcidsFromSequenceString(sequence);
  //     getAminoAcidsFromSequenceString(sequence);
  //     getAminoAcidsFromSequenceString(sequence);
  // }
// };

/**
 * @private
 * Finds ORFs in a given DNA forward in a given frame.
 * @param  {Int} frame The frame to look in.
 * @param  {String}sequence The dna sequence.
 * @param  {Int} mininmumOrfSize The minimum length of ORF to return.
 * @param  {boolean} forward Should we find forward facing orfs or reverse facing orfs
 * @return {Teselagen.bio.orf.ORF[]} The list of ORFs found.
 */
function getOrfsFromSequenceString(frame, sequence, mininmumOrfSize, forward, circular) {
  var ObjectID = require("bson-objectid");
  if (typeof(mininmumOrfSize) === "undefined") {
    throw ('no min orf size given');
  }
  if (typeof(forward) === "undefined") {
    throw ('no orf StrandType passed');
  }
  if (typeof(circular) === "undefined") {
    throw ('no orf StrandType passed');
  }
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
  var potentiallyDuplicatedOrfs = calculateOrfs(frame, sequence, mininmumOrfSize, forward);
  
  if (!forward) {
    //we'll reverse the orfs start and end before (potentially) trimming them 
    potentiallyDuplicatedOrfs.forEach(function(orf) {
      var endHolder = orf.end;
      orf.end = orf.start;
      orf.start = orf.end;
    });
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