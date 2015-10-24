var ac = require('ve-api-check'); 
  // ac.throw([ac.posInt, ac.posInt, ac.bool], arguments);
module.exports = function checkIfNonCircularRangesOverlap(range, comparisonRange) {
    ac.throw([ac.range, ac.range], arguments);
    if (range.start < comparisonRange.start) {
        if (range.end < comparisonRange.start) {
      //----llll
      //--------cccc
      //no overlap
            return false;
        } else {
      //----llll
      //-------cccc
      //overlap
            return true;
        }
    } else {
        if (range.start > comparisonRange.end) {
      //------llll
      // -cccc
      //no overlap
            return false;
        } else {
      //-----llll
      // -cccc
      //overlap
            return true;
        }
    }
};