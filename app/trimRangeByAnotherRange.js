var arePositiveIntegers = require('validate.io-nonnegative-integer-array');
var getOverlapsOfPotentiallyCircularRanges = require('./getOverlapsOfPotentiallyCircularRanges');
var splitRangeIntoTwoPartsIfItIsCircular = require('./splitRangeIntoTwoPartsIfItIsCircular');

//trims range, but does *not* adjust it
//returns a new range if there is one, or null, if it is trimmed completely
module.exports = function trimRangeByAnotherRange(rangeToBeTrimmed, anotherRange, sequenceLength) {
  if (!arePositiveIntegers([rangeToBeTrimmed.start, rangeToBeTrimmed.end])) {
    console.warn('invalid range input');
    return;
  }
  //get the overlaps of the ranges
  var overlaps = getOverlapsOfPotentiallyCircularRanges(rangeToBeTrimmed, anotherRange, sequenceLength);
  //split the range to be trimmed into pieces if necessary
  //and trim both pieces by the already calculated overlaps
  var splitRangesToBeTrimmed = splitRangeIntoTwoPartsIfItIsCircular(rangeToBeTrimmed, sequenceLength);
  splitRangesToBeTrimmed.forEach(function(nonCircularRangeToBeTrimmed, index) {
    overlaps.forEach(function(overlap) {
      nonCircularRangeToBeTrimmed = trimNonCicularRangeByAnotherNonCircularRange(nonCircularRangeToBeTrimmed, overlap);
    });
    if (!nonCircularRangeToBeTrimmed) {
      splitRangesToBeTrimmed.splice(index, 1);
    }
  });
  var outputTrimmedRange;
  if (splitRangesToBeTrimmed.length < 0) {
    //do nothing to the output trimmed range
  } else if (splitRangesToBeTrimmed.length === 1) {
    outputTrimmedRange = splitRangesToBeTrimmed[0];
  } else if (splitRangesToBeTrimmed.length === 2) {
    if (splitRangesToBeTrimmed[0].start < splitRangesToBeTrimmed[1].start) {
      outputTrimmedRange = {
        start: splitRangesToBeTrimmed[1].start,
        end: splitRangesToBeTrimmed[0].end,
      };
    } else {
      outputTrimmedRange = {
        start: splitRangesToBeTrimmed[0].start,
        end: splitRangesToBeTrimmed[1].end,
      };
    }
  }
  return outputTrimmedRange;
};

function trimNonCicularRangeByAnotherNonCircularRange(rangeToBeTrimmed, anotherRange) {
  var outputTrimmedRange;
  if (rangeToBeTrimmed.start < anotherRange.start) {
    outputTrimmedRange = {
      start: rangeToBeTrimmed.start
    };
    if (rangeToBeTrimmed.end < anotherRange.end) {
      outputTrimmedRange.end = rangeToBeTrimmed.end;
    } else {
      outputTrimmedRange.end = anotherRange.end;
    }
  } else {
    if (rangeToBeTrimmed.end <= anotherRange.end) {
      //fully deleting the range
    } else {
      outputTrimmedRange = {
        end: rangeToBeTrimmed.end
      };
      if (rangeToBeTrimmed.start > anotherRange.end) {
        outputTrimmedRange.start = rangeToBeTrimmed.start;
      } else {
        outputTrimmedRange.start = anotherRange.start;
      }
    }
  }
  return outputTrimmedRange;
}