var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
var getOverlapsOfPotentiallyCircularRanges = require('./getOverlapsOfPotentiallyCircularRanges');
var splitRangeIntoTwoPartsIfItIsCircular = require('./splitRangeIntoTwoPartsIfItIsCircular');
var trimNonCicularRangeByAnotherNonCircularRange = require('./trimNonCicularRangeByAnotherNonCircularRange');

/**
 * trims range, but does *not* adjust it
 * returns a new range if there is one, or null, if it is trimmed completely
 * @param  {object} subRange  {start:
 *                                  end:
 *                                  }
 * @param  {object} containerRange {start:
 *                                  end:
 *                                  }
 * @param  {int} sequenceLength 
 * @return {object} || null        {start:
 *                                  end:
 *                                  }
 */
module.exports = function trimRangeByAnotherRange(rangeToBeTrimmed, trimmingRange, sequenceLength) {
    if (!areNonNegativeIntegers([rangeToBeTrimmed.start, rangeToBeTrimmed.end])) {
        console.warn('invalid range input');
        return;
    }
  //get the overlaps of the ranges
    var overlaps = getOverlapsOfPotentiallyCircularRanges(rangeToBeTrimmed, trimmingRange, sequenceLength);
  //split the range to be trimmed into pieces if necessary
    if (!overlaps.length) {
        return {
            start: rangeToBeTrimmed.start,
            end: rangeToBeTrimmed.end
        };
    }
  //and trim both pieces by the already calculated overlaps
    var splitRangesToBeTrimmed = splitRangeIntoTwoPartsIfItIsCircular(rangeToBeTrimmed, sequenceLength);
    splitRangesToBeTrimmed.forEach(function(nonCircularRangeToBeTrimmed, index) {
        overlaps.forEach(function(overlap) {
            if (nonCircularRangeToBeTrimmed) {
                nonCircularRangeToBeTrimmed = trimNonCicularRangeByAnotherNonCircularRange(nonCircularRangeToBeTrimmed, overlap);
            }
        });
        splitRangesToBeTrimmed[index] = nonCircularRangeToBeTrimmed;
    });
  //filter out any of the split ranges that have been fully deleted!
    var outputSplitRanges = splitRangesToBeTrimmed.filter(function(trimmedRange) {
        if (trimmedRange) {
            return true;
        }
    });

    var outputTrimmedRange;
    if (outputSplitRanges.length < 0) {
    //do nothing to the output trimmed range
    } else if (outputSplitRanges.length === 1) {
        outputTrimmedRange = outputSplitRanges[0];
    } else if (outputSplitRanges.length === 2) {
        if (outputSplitRanges[0].start < outputSplitRanges[1].start) {
            outputTrimmedRange = {
                start: outputSplitRanges[1].start,
                end: outputSplitRanges[0].end,
            };
        } else {
            outputTrimmedRange = {
                start: outputSplitRanges[0].start,
                end: outputSplitRanges[1].end,
            };
        }
    }
    return outputTrimmedRange;
};

