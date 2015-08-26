var areRangesValid = require('./areRangesValid');
var splitRangeIntoTwoPartsIfItIsCircular = require('./splitRangeIntoTwoPartsIfItIsCircular');
var getOverlapOfNonCircularRanges = require('./getOverlapOfNonCircularRanges');
//returns an array of the overlaps between two potentially circular ranges
module.exports = function getOverlapsOfPotentiallyCircularRanges(rangeA, rangeB, maxRangeLength) {
  if (!areRangesValid([rangeA, rangeB], maxRangeLength)) {
    // console.warn("unable to calculate ranges of  inputs");
    throw new Error('invalid ranges passed in!');
    // return [];
  }
  var normalizedRangeA = splitRangeIntoTwoPartsIfItIsCircular(rangeA, maxRangeLength);
  var normalizedRangeB = splitRangeIntoTwoPartsIfItIsCircular(rangeB, maxRangeLength);

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


