var threeLetterSequenceStringToAminoAcidMap = require('./threeLetterSequenceStringToAminoAcidMap');
module.exports = function getAminoAcidFromSequenceString(sequenceString) {
  if (typeof sequenceString === 'string') {
    sequenceString = sequenceString.toLowerCase();
  } else {
    throw ('must pass a string to this function');
  }
  if (sequenceString.length !== 3) {
    throw 'must pass a string of length 3';
  }
  if (threeLetterSequenceStringToAminoAcidMap[sequenceString]) {
    return threeLetterSequenceStringToAminoAcidMap[sequenceString];
  } else {
    return ({
      value: '-',
      name: 'Gap',
      threeLettersName: 'Gap'
    });
  }
};