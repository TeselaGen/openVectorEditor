var _ = require('lodash');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
var getReverseComplementSequenceString = require('./getReverseComplementSequenceString');
var getAminoAcidFromSequenceString = require('./getAminoAcidFromSequenceString');

module.exports = function findOrfsFromAminoAcids(aminoAcidRepresentationOfSequence, circular, mininmumOrfSize) {
  
  //tnr, we should do the parsing down of the orfs immediately after they're returned from this sequence
  // var orfs1Forward = eliminateCircularOrfsThatOverlapWithNonCircularOrfs(getOrfsFromAminoAcids(0, doubleForwardSequence, mininmumOrfSize, true), maxLength);
  var orfs1Forward = getOrfsFromAminoAcids(0, aminoAcidRepresentationOfSequence.forward[0], mininmumOrfSize, true, circular);
  var orfs2Forward = getOrfsFromAminoAcids(1, aminoAcidRepresentationOfSequence.forward[1], mininmumOrfSize, true, circular);
  var orfs3Forward = getOrfsFromAminoAcids(2, aminoAcidRepresentationOfSequence.forward[2], mininmumOrfSize, true, circular);

  var orfs1Reverse = getOrfsFromAminoAcids(0, aminoAcidRepresentationOfSequence.reverse[0], mininmumOrfSize, false, circular);
  var orfs2Reverse = getOrfsFromAminoAcids(1, aminoAcidRepresentationOfSequence.reverse[1], mininmumOrfSize, false, circular);
  var orfs3Reverse = getOrfsFromAminoAcids(2, aminoAcidRepresentationOfSequence.reverse[2], mininmumOrfSize, false, circular);

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
function getOrfsFromAminoAcids(frame, aminoAcidsObject, mininmumOrfSize, forward, circular) {
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
  if (typeof aminoAcidsObject !== 'object') {
    throw ('invalid aminoAcidsObject passed');
  }
  var maxLength = aminoAcidsObject.aminoAcidStringCorrespondingToEachBaseOfDNA / (circular ? 2 : 1);
  
  // if (!forward) {
  //   //we reverse the sequence
  //   sequence = getReverseComplementSequenceString(sequence);
  // }
  
  // if (circular) {
  //   //we'll pass in double the sequence and then trim excess orfs
  //   sequence += sequence;
  // } 
  var potentiallyDuplicatedOrfs = calculateOrfs(frame, aminoAcidsObject, mininmumOrfSize, forward);
  
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
  
  function calculateOrfs(frame, aminoAcidsObject, mininmumOrfSize, forward) {
    var allOrfs = [];
    // var sequenceLength = sequence.length;

    // // var index = frame;
    // var triplet;
    // var aaSymbol;
    // var aaString = '';
    // var startIndex = -1;
    // var endIndex = -1;
    // var startCodonIndices = [];
    // var stopCodonIndices = [];
    // var possibleStopCodon;
    // var possibleStartCodon;
    // // Loop through sequence and generate list of ORFs.
    // for (var index = frame; index < sequenceLength; index += 3) {
    //   triplet = sequence.slice(index, index + 3);
    //   if (triplet.length === 3) {
    //     aaSymbol = getAminoAcidFromSequenceString(triplet);
    //     aaString += aaSymbol.value;
    //     possibleStartCodon = isStartCodon(triplet);
    //     possibleStopCodon = isStopCodon(triplet);

    //     // If we've found a start codon, add its index to startCodonIndices.
    //     if (possibleStartCodon) {
    //       startCodonIndices.push(index);
    //     }
    //     if (possibleStopCodon) {
    //       stopCodonIndices.push(index);
    //     }
    //   }
    // }

    //loop through the start codons and see if any of them form orfs
    aminoAcidsObject.startCodonIndices.forEach(function(startCodonIndex) {
      aminoAcidsObject.stopCodonIndices.some(function(stopCodonIndex) {
        if (stopCodonIndex - startCodonIndex > 0) {
          var orf = {
            start: startCodonIndex,
            end: stopCodonIndex,
            forward: forward,
            frame: frame,
            startCodons: aminoAcidsObject.startCodonIndices,
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



/**
 * @private
 * Sorting function for sorting codons.
 * @param a
 * @param b
 * @return {Int} Sort order.
 */
// function codonsSort(a, b) {
//   if (a > b) {
//     return 1;
//   } else if (a < b) {
//     return -1;
//   } else {
//     return 0;
//   }
// }