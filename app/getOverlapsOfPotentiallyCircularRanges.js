var arePositiveIntegers = require('./arePositiveIntegers');
var splitRangeIntoTwoPartsIfItIsCircular = require('./splitRangeIntoTwoPartsIfItIsCircular');
//returns an array of the overlaps between two potentially circular ranges
module.exports = function getOverlapsOfPotentiallyCircularRanges(rangeA, rangeB, maxLength) {
  if (!arePositiveIntegers(rangeA.start, rangeA.end, rangeB.start, rangeB.end)) {
    // console.warn("unable to calculate ranges of  inputs");
    return [];
  }
  var normalizedRangeA = splitRangeIntoTwoPartsIfItIsCircular(rangeA, maxLength);
  var normalizedRangeB = splitRangeIntoTwoPartsIfItIsCircular(rangeB, maxLength);

  var overlaps = [];
  normalizedRangeA.forEach(function(nonCircularRangeA) {
    normalizedRangeB.forEach(function(nonCircularRangeB) {
      var overlap = getOverlapOfNonCircularRanges(nonCircularRangeA, nonCircularRangeB);
      if (overlap) {
        overlaps.push(overlap);
      }
    });
  });
  
  return overlaps;
};

function getOverlapOfNonCircularRanges(rangeA, rangeB) {
  if (!arePositiveIntegers(rangeA.start, rangeA.end, rangeB.start, rangeB.end)) {
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