var getOrfsFromSequence = require('./getOrfsFromSequence.js');
module.exports = function findOrfsInPlasmid(sequence, circular, minimumOrfSize) {
    //tnr, we should do the parsing down of the orfs immediately after they're returned from this sequence
    // var orfs1Forward = eliminateCircularOrfsThatOverlapWithNonCircularOrfs(getOrfsFromSequence(0, doubleForwardSequence, minimumOrfSize, true), maxLength);
    var forwardOrfs = getOrfsFromSequence({
        sequence: sequence,
        minimumOrfSize: minimumOrfSize,
        forward: true,
        circular: circular,
    });
    var reverseOrfs = getOrfsFromSequence({
        sequence: sequence,
        minimumOrfSize: minimumOrfSize,
        forward: false,
        circular: circular,
    });
    return forwardOrfs.concat(reverseOrfs);
};