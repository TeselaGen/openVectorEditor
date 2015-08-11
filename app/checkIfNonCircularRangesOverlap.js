module.exports = function checkIfNonCircularRangesOverlap(range, comparisonRange) {
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