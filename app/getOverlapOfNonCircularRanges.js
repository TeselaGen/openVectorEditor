var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
module.exports = function getOverlapOfNonCircularRanges(rangeA, rangeB) {
  if (!areNonNegativeIntegers([rangeA.start, rangeA.end, rangeB.start, rangeB.end])) {
    // console.warn("unable to calculate ranges of  inputs");
    return null;
  }
  if (rangeA.start < rangeB.start) {
    if (rangeA.end < rangeB.start) {
      //no overlap
    } else {
      if (rangeA.end < rangeB.end) {
        return {
          start: rangeB.start,
          end: rangeA.end
        };
      } else {
        return {
          start: rangeB.start,
          end: rangeB.end
        };
      }
    }
  } else {
    if (rangeA.start > rangeB.end) {
      //no overlap
    } else {
      if (rangeA.end < rangeB.end) {
        return {
          start: rangeA.start,
          end: rangeA.end
        };
      } else {
        return {
          start: rangeA.start,
          end: rangeB.end
        };
      }
    }
  }
}