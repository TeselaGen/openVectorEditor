var DNAComplementMap = require('./DNAComplementMap');
// var ac = require('ve-api-check'); 
// ac.throw([ac.string,ac.bool],arguments);
module.exports = function getComplementSequenceString (sequence) {
    // ac.throw([ac.string],arguments);
    var complementSeqString = "";
    for (var i = 0; i < sequence.length; i++) {
        var complementChar = DNAComplementMap[sequence[i]];
        if (!complementChar) {
            complementChar = sequence[i];
            // throw new Error('trying to get the reverse compelement of an invalid base');
        }
        complementSeqString+= complementChar;
    }
    return complementSeqString;
};