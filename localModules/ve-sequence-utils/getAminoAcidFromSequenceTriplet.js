var threeLetterSequenceStringToAminoAcidMap = require('./threeLetterSequenceStringToAminoAcidMap');
var proteinAlphabet = require('./proteinAlphabet');
// var ac = require('ve-api-check'); 
// ac.throw([ac.string,ac.bool],arguments);
//tnrtodo: expand the threeLetterSequenceStringToAminoAcidMap mappings to include RNA characters. 
//currently stop bps aren't all mapped!
module.exports = function getAminoAcidFromSequenceTriplet(sequenceString) {
    // ac.throw([ac.string],arguments);
    sequenceString = sequenceString.toLowerCase();
    if (sequenceString.length !== 3) {
        throw new Error('must pass a string of length 3');
    }
    if (threeLetterSequenceStringToAminoAcidMap[sequenceString]) {
        return threeLetterSequenceStringToAminoAcidMap[sequenceString];
    } else {
        return (proteinAlphabet['-']); //return a gap/undefined character
    }
};