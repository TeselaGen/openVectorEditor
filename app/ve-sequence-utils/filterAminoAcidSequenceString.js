var ac = require('ve-api-check');
module.exports = function filterAminoAcidSequenceString(sequenceString) {
    ac.warn(ac.string, sequenceString);
    return sequenceString.replace(/[^galmfwkqespvicyhrnd]/ig, '');
}

