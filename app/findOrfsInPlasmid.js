var getOrfsFromSequence = require('./getOrfsFromSequence.js');
module.exports = function findOrfsInPlasmid(sequence, circular, minimumOrfSize) {
  
  //tnr, we should do the parsing down of the orfs immediately after they're returned from this sequence
  // var orfs1Forward = eliminateCircularOrfsThatOverlapWithNonCircularOrfs(getOrfsFromSequence(0, doubleForwardSequence, minimumOrfSize, true), maxLength);
  var forwardOrfs = getOrfsFromSequence(sequence.forward[0], minimumOrfSize, true, circular);
  var reverseOrfs = getOrfsFromSequence(sequence.reverse[2], minimumOrfSize, false, circular);

  // var combinedForwardOrfs = orfs1Forward.concat(orfs2Forward, orfs3Forward);
  // var combinedReverseOrfs = orfs1Reverse.concat(orfs2Reverse, orfs3Reverse);
  // var allOrfs = combinedForwardOrfs.concat(combinedReverseOrfs);
  return forwardOrfs.concat(reverseOrfs);
};