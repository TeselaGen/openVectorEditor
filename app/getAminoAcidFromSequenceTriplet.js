var threeLetterSequenceStringToAminoAcidMap = require('./threeLetterSequenceStringToAminoAcidMap');
var proteinAlphabet = require('./proteinAlphabet');
//tnrtodo: expand the threeLetterSequenceStringToAminoAcidMap mappings to include RNA characters. 
//currently stop bps aren't all mapped!
module.exports = function getAminoAcidFromSequenceTriplet(sequenceString) {
  if (typeof sequenceString === 'string') {
    sequenceString = sequenceString.toLowerCase();
  } else {
    throw new Error('must pass a string to this function');
  }
  if (sequenceString.length !== 3) {
    throw new Error('must pass a string of length 3');
  }
  if (threeLetterSequenceStringToAminoAcidMap[sequenceString]) {
    return threeLetterSequenceStringToAminoAcidMap[sequenceString];
  } else {
    return (proteinAlphabet['-']); //return a gap/undefined character
  }
};