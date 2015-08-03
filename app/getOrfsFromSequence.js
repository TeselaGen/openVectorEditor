// var findIndex = require('lodash/array/findIndex');
// var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
var ObjectId = require("bson-objectid");
var getReverseComplementSequenceString = require('./getReverseComplementSequenceString');

/**
 * @private
 * Finds ORFs in a given DNA forward in a given frame.
 * @param  {Int} frame The frame to look in.
 * @param  {String}sequence The dna sequence.
 * @param  {Int} minimumOrfSize The minimum length of ORF to return.
 * @param  {boolean} forward Should we find forward facing orfs or reverse facing orfs
 * @return {Teselagen.bio.orf.ORF[]} The list of ORFs found.
 */
module.exports = function getOrfsFromSequence(options) {
  // var frame = options.frame;
  var sequence = options.sequence;
  var minimumOrfSize = options.minimumOrfSize;
  var forward = options.forward;
  var circular = options.circular;

  var ObjectID = require("bson-objectid");
  if (typeof(minimumOrfSize) === "undefined") {
    throw ('no min orf size given');
  }
  if (typeof(forward) === "undefined") {
    throw ('no orf StrandType passed');
  }
  if (typeof(circular) === "undefined") {
    throw ('no orf StrandType passed');
  }
  if (typeof sequence !== 'string') {
    throw ('invalid sequence passed');
  }
  var originalSequenceLength = sequence.length;
  
  if (!forward) {
    //we reverse the sequence
    sequence = getReverseComplementSequenceString(sequence);
  }
  
  if (circular) {
    //we'll pass in double the sequence and then trim excess orfs
    sequence += sequence;
  }
  var re = /(?=((?:A[TU]G)(?:.{3})*?(?:[TU]AG|[TU]AA|[TU]GA)))/ig;
  // var str = 'tatgaatgaatgffffffatgfftaaftaafatgfatgfffffsdfatgffatgfffstaafftaafffffffffffffffatgtaaataa\n\natgffftaaf\n\natgffatgftaafftaa\n\natgatgftaafftaa\n\natgatgtaataa\n\ntttttttttttttaatgatgfffffffffftaa';
  var m;
  var orfRanges = [];
  //loop through orf hits!
  while ((m = re.exec(sequence)) !== null) {
    //stuff to get the regex to work
    if (m.index === re.lastIndex) {
      re.lastIndex++;
    }
    //orf logic: 
    var orfLength = m[1].length;
    if (orfLength >= minimumOrfSize) {
      //only keep orfs >= to the minimum size
      var start = m.index;
      var end = orfLength + start - 1;
      if (start < originalSequenceLength) {
        //only keep the orfs that begin before the original sequence length (only the case when dealing with circular orfs)
        var previousOrf = orfRanges[orfRanges.length-1];
        if (previousOrf && end === previousOrf.end) {
          //tnrtodo: check to see if this actually excludes the orfs in the way I thought it would
          //it doesn't...
          previousOrf.startCodonIndices.push(start);
        } else {
          orfRanges.push({
            start: start,
            end: end,
            length: m[1].length,
            startCodonIndices: [start],
            frame: start % 3,
            forward: forward,
            id: ObjectId().str
          });
        }
      }
    }
  }
  return orfRanges;
  console.log('orfRanges: ' + JSON.stringify(orfRanges,null,4));
};


//   var potentiallyDuplicatedOrfs = calculateOrfs(frame, sequence, minimumOrfSize, forward);
  
//   if (!forward) {
//     //we'll reverse the orfs start and end before (potentially) trimming them 
//     potentiallyDuplicatedOrfs.forEach(function(orf) {
//       var endHolder = orf.end;
//       orf.end = orf.start;
//       orf.start = endHolder;
//     });
//   } 
//   var nonDuplicatedOrfs;
//   if (circular) {
//     // we'll trim the excess orfs
//     nonDuplicatedOrfs = [];
//     potentiallyDuplicatedOrfs.forEach(function(orf) {
//       if (orf.start >= originalSequenceLength) {
//         //eliminate this orf because there must already be a normal orf with the same start bp (just shifted by 1 sequence length)
//       } else {
//         if (orf.end >= originalSequenceLength) {
//           orf.end -= originalSequenceLength;
//         }
//         nonDuplicatedOrfs.push(orf);
//       }
//     });
//   } else { 
//     //non circular so
//     nonDuplicatedOrfs = potentiallyDuplicatedOrfs;
//   }
//   return nonDuplicatedOrfs;
  
//   function calculateOrfs(frame, sequence, minimumOrfSize, forward) {
//     var allOrfs = [];
//     var sequenceLength = sequence.length;

//     // var index = frame;
//     var triplet;
//     // var aaSymbol;
//     // var aaString = '';
//     // var startIndex = -1;
//     // var endIndex = -1;
//     var startCodonIndices = [];
//     var stopCodonIndices = [];
//     var possibleStopCodon;
//     var possibleStartCodon;
//     // Loop through sequence and generate list of ORFs.
//     for (var index = frame; index < sequenceLength; index += 3) {
//       triplet = sequence.slice(index, index + 3);
//       if (triplet.length === 3) {
//         // aaSymbol = getAminoAcidFromSequenceTriplet(triplet);
//         // aaString += aaSymbol.value;
//         possibleStartCodon = isStartCodon(triplet);
//         possibleStopCodon = isStopCodon(triplet);

//         // If we've found a start codon, add its index to startCodonIndices.
//         if (possibleStartCodon) {
//           startCodonIndices.push(index);
//         }
//         if (possibleStopCodon) {
//           stopCodonIndices.push(index);
//         }
//       }
//     }

//     //loop through the start codons and see if any of them form orfs
//     startCodonIndices.forEach(function(startCodonIndex) {
//       stopCodonIndices.some(function(stopCodonIndex) {
//         if (stopCodonIndex - startCodonIndex > 0) {
//           var orf = {
//             start: startCodonIndex,
//             end: stopCodonIndex,
//             forward: forward,
//             frame: frame,
//             startCodonIndices: startCodonIndices,
//             id: ObjectID().str
//           };
//           allOrfs.push(orf);
//           return true; //break the some loop
//         }
//       });
//     });
//     //after this we'll need to do a 'reduce' step to shave off the orfs that don't meet the minimum size requirements 
//     //as well as the orfs with the same stop bp
//     //tnrtodo: inspect this function and make sure it is reducing the orfs correctly!
//     var trimmedOrfs = [];
//     allOrfs.forEach(function(orf) {
//       if (orf.end - orf.start + 1 >= minimumOrfSize) { //make sure the orf size is >= to the minimum size
//         var indexOfOrfWithSameStopBp = findIndex(trimmedOrfs, function(trimmedOrf) { //find any orfs with the same stop bp in the trimmed orf array
//           return trimmedOrf.end === orf.end;
//         });
//         if (indexOfOrfWithSameStopBp === -1) {
//           trimmedOrfs.push(orf);
//         } else {
//           if (trimmedOrfs[indexOfOrfWithSameStopBp].start > orf.start) {
//             trimmedOrfs[indexOfOrfWithSameStopBp] = orf; //replace the old orf at that position with this new orf because it is longer
//           }
//         }
//       }
//     });
//     return trimmedOrfs;
//   }
// };

// function isStartCodon(codon) {
//   return (codon == 'atg' || codon == 'aug' && codon.indexOf("-") === -1);
// }
// /**
//  * {Calculates whether a three character string is a stop codon.
//  * @param  {String} codon a three character string.
//  * @return {Boolean} shows whether the nucleotides make up a stop codon
//  */
// function isStopCodon(codon) {
//   return (codon == 'taa' || codon == 'tag' || codon == 'tga' || codon == 'uaa' || codon == 'uag' || codon == 'uga');
// }


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