var ac = require('ve-api-check');
module.exports = function getDnaFromAminoAcids(aminoAcidString) {
    //tnrtodoL this needs to be completed
    ac.throw(ac.string, aminoAcidString);
    var dnaChars = ''
    for (var i = 0; i < sequence.sequence.length; i++) {
        var codon = proteinToSequenceMap[sequence.sequence[i]];
        if (codon) {
            dnaChars += codon;
        }
    };
    sequence.sequence = dnaChars;
}
