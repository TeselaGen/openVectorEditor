// var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
// var getReverseComplementSequenceString = require('./getReverseComplementSequenceString');
// var getAminoAcidFromSequenceTriplet = require('./getAminoAcidFromSequenceTriplet');
// var reverseText = require('reverse-text');
 
// //amino acid representations of the sequence only make sense when defined by a start bp
// //
// //strategy: calculate the amino acid representation for 2x the sequence, 
// //thus when getting the amino acids for orfs/translations which cross the origin, we can just linearize them 
// //past the end of the sequence and grab their corresponding AA's.
// //Thus, there's no need to worry about the start bps of the translation when out of frame.
// //if a translation crosses the origin, we'll have linearized it.
// //

// /**
//  * @param  {string} sequence sequence string
//  * @param  {boolean} circular 
//  * @return {forward: [{
//  *           aminoAcidString: string,
//  *           aminoAcidStringCorrespondingToEachBaseOfDNA: string,
//  *           startCodonIndices: [],
//  *           stopCodonIndices: []},{ditto above..},{}],
//  *          reverse: [],}          [description]
//  */
// module.exports = function getAminoAcidsFromPlasmid(sequence, circular) {
//   //tnr: I think we should always calculate this assuming a circular sequence
//   //there is no penalty for making this assumption whereas the other way around, we might limit ourselves
//   circular = true;
//   var forwardSequence = sequence;

//   var aminoAcidsForwardFrame0 = getAminoAcidsForEntirePlasmid(0, sequence, true, circular);
//   var aminoAcidsForwardFrame1 = getAminoAcidsForEntirePlasmid(1, sequence, true, circular);
//   var aminoAcidsForwardFrame2 = getAminoAcidsForEntirePlasmid(2, sequence, true, circular);

//   var aminoAcidsReverseFrame0 = getAminoAcidsForEntirePlasmid(0, sequence, false, circular);
//   var aminoAcidsReverseFrame1 = getAminoAcidsForEntirePlasmid(1, sequence, false, circular);
//   var aminoAcidsReverseFrame2 = getAminoAcidsForEntirePlasmid(2, sequence, false, circular);

//   return {
//     forward: [
//       aminoAcidsForwardFrame0,
//       aminoAcidsForwardFrame1,
//       aminoAcidsForwardFrame2,
//     ],
//     reverse: [
//       aminoAcidsReverseFrame0,
//       aminoAcidsReverseFrame1,
//       aminoAcidsReverseFrame2,
//     ]
//   };
// };

// /**
//  * @private
//  * Gets aminoAcids from sequence string based on frame, direction and circularity
//  * @param  {Int} frame The frame to look in.
//  * @param  {String} sequence The dna sequence.
//  * @param  {boolean} forward Should we find forward facing orfs or reverse facing orfs
//  * @param  {boolean} circular Whether or not the sequence is circular or linear
//  * @return {aminoAcidString: string,
//             aminoAcidStringCorrespondingToEachBaseOfDNA: string,
//             startCodonIndices: [],
//             stopCodonIndices: []}
//  */
// function getAminoAcidsForEntirePlasmid(frame, sequence, forward, circular) {
//   var ObjectID = require("bson-objectid");
//   if (typeof(forward) === "undefined") {
//     throw ('no direction passed');
//   }
//   // if (typeof(circular) === "undefined") {
//   //   throw ('no orf StrandType passed');
//   // }
//   if (!areNonNegativeIntegers([frame]) || frame > 2) {
//     throw ('invalid frame passed');
//   }
//   if (typeof sequence !== 'string') {
//     throw ('invalid sequence passed');
//   }
//   var maxLength = sequence.length;

//   if (!forward) {
//     //we reverse the sequence
//     sequence = getReverseComplementSequenceString(sequence);
//   }
//   if (circular) {
//     //we double the sequence, 
//     sequence += sequence;
//   }
//   //tnrtodo: we need to get starting amino acids, maybe a 1 to 1 mapping of aa's to sequence letters would be better..
//   return getAminoAcidDataForEachBaseOfDna(sequence, frame, forward);
// }

// function getAminoAcidDataForEachBaseOfDna(sequenceString, frame, forward) {
//   var res = {
//     aminoAcidString: '',
//     aminoAcidStringCorrespondingToEachBaseOfDNA: '',
//     aminoAcidDataForEachBaseOfDNA: [],
//     startCodonIndices: [],
//     stopCodonIndices: []
//   };
//   for (var i = 0; i < frame; i++) {
//     res.aminoAcidStringCorrespondingToEachBaseOfDNA += '-';
//     res.aminoAcidDataForEachBaseOfDNA.push({
//       aminoAcid: getAminoAcidFromSequenceTriplet('xxx'), //fake xxx triplet returns the gap amino acid
//       positionInCodon: i,
//       sequencePosition: sequenceString[i]
//     });
//   }
//   //tnr: eventually we're going to want to 
//   for (var index = 3 + frame; index < sequenceString.length; index += 3) {
//     var triplet = sequenceString.slice(index - 3, index);
//     var aminoAcid = getAminoAcidFromSequenceTriplet(triplet);
//     res.aminoAcidDataForEachBaseOfDNA.push({
//       aminoAcid: aminoAcid, //gap amino acid
//       positionInCodon: 0,
//       sequencePosition: sequenceString[i + 0]
//     });
//     res.aminoAcidDataForEachBaseOfDNA.push({
//       aminoAcid: aminoAcid, //gap amino acid
//       positionInCodon: 1,
//       sequencePosition: sequenceString[i + 1]
//     });
//     res.aminoAcidDataForEachBaseOfDNA.push({
//       aminoAcid: aminoAcid, //gap amino acid
//       positionInCodon: 2,
//       sequencePosition: sequenceString[i + 2]
//     });
//     res.aminoAcidStringCorrespondingToEachBaseOfDNA += aminoAcid.value + aminoAcid.value + aminoAcid.value;
//     // If we've found a start or stop codon, add its index to startCodonIndices.
//     if (isStartCodon(triplet)) {
//       res.startCodonIndices.push(index);
//     }
//     if (isStopCodon(triplet)) {
//       res.stopCodonIndices.push(index);
//     }
//   }
//   var lengthOfEndBpsNotCoveredByAminoAcids = sequenceString.length - res.aminoAcidStringCorrespondingToEachBaseOfDNA.length;
//   for (var i = 0; i < lengthOfEndBpsNotCoveredByAminoAcids; i++) {
//     res.aminoAcidStringCorrespondingToEachBaseOfDNA += '-';
//     res.aminoAcidDataForEachBaseOfDNA.push({
//       aminoAcid: getAminoAcidFromSequenceTriplet('xxx'), //fake xxx triplet returns the gap amino acid
//       positionInCodon: i,
//       sequencePosition: sequenceString[i]
//     });
//   }

//   if (sequenceString.length !== res.aminoAcidStringCorrespondingToEachBaseOfDNA.length) {
//     throw 'something went wrong!';
//   }
//   return res;
// }

// function isStartCodon(codon) {
//   return (codon === 'atg' || codon === 'aug' && codon.indexOf("-") === -1);
// }
// /**
//  * {Calculates whether a three character string is a stop codon.
//  * @param  {String} codon a three character string.
//  * @return {Boolean} shows whether the nucleotides make up a stop codon
//  */
// function isStopCodon(codon) {
//   return (codon == 'taa' || codon == 'tag' || codon == 'tga' || codon == 'uaa' || codon == 'uag' || codon == 'uga');
// }

// /**
//  * @private
//  * Takes three nucleotides and determines if they (and their ambiguous matches) form a stop codon.
//  * @param  {Teselagen.bio.sequence.symbols.NucleotideSymbol/Teselagen.bio.sequence.symbols.GapSymbol} nucleotideOne
//  * @param  {Teselagen.bio.sequence.symbols.NucleotideSymbol/Teselagen.bio.sequence.symbols.GapSymbol} nucleotideTwo
//  * @param  {Teselagen.bio.sequence.symbols.NucleotideSymbol/Teselagen.bio.sequence.symbols.GapSymbol} nucleotideThree
//  * @return {Boolean} True if the nucleotides given form a stop codon.
//  */
// function evaluatePossibleStop(nucleotideOne, nucleotideTwo, nucleotideThree) {
//   var n1 = this.returnMatches(nucleotideOne);
//   var n2 = this.returnMatches(nucleotideTwo);
//   var n3 = this.returnMatches(nucleotideThree);

//   for (var i1 = 0; i1 < n1.length; i1++) {
//     for (var i2 = 0; i2 < n2.length; i2++) {
//       for (var i3 = 0; i3 < n3.length; i3++) {
//         if (Teselagen.TranslationUtils.isStopCodon(n1[i1], n2[i2], n3[i3])) {
//           return true;
//         }
//       }
//     }
//   }

//   return false;
// }

// /**
//  * @private
//  * Helper function to return ambiguous matches of a nucleotide if they exist, and
//  * otherwise return an array just containing the nucleotide.
//  * @param {Teselagen.bio.sequence.symbols.NucleotideSymbol} nucleotide The nucleotide to get matches for.
//  * @return {Teselagen.bio.sequence.symbols.NucleotideSymbol[]} The array containing matches.
//  */
// function returnMatches(nucleotide) {
//   var nucleotideObject = Teselagen.DNAAlphabet[nucleotide];
//   var ambiguousMatches;

//   if (nucleotideObject && nucleotideObject.getAmbiguousMatches().length !== 0) {
//     ambiguousMatches = nucleotideObject.getAmbiguousMatches();
//   } else {
//     ambiguousMatches = [nucleotide];
//   }

//   return ambiguousMatches;
// }