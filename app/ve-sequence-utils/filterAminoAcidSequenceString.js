import ac from 've-api-check';
module.exports = function filterAminoAcidSequenceString(sequenceString) {
    ac.throw(ac.string, sequenceString);
    return sequenceString.replace(/[^galmfwkqespvicyhrnd]/ig, '');
}

