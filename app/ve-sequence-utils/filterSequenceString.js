import ac from 've-api-check';
module.exports = function filterSequenceString(sequenceString) {
    ac.throw(ac.string,sequenceString);
    return sequenceString.replace(/[^atgcyrswkmbvdhn]/ig, '');
}
