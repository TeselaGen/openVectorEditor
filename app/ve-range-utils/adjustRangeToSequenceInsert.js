var ac = require('ve-api-check'); 
    // ac.throw([ac.posInt, ac.posInt, ac.bool], arguments);
// var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');

var splitRangeIntoTwoPartsIfItIsCircular = require('./splitRangeIntoTwoPartsIfItIsCircular');

module.exports = function adjustRangeToSequenceInsert(rangeToBeAdjusted, insertStart, insertLength) {
    ac.throw([ac.range, ac.posInt, ac.posInt], arguments);
    var newRange = {
        start: rangeToBeAdjusted.start,
        end: rangeToBeAdjusted.end
    };
    if (rangeToBeAdjusted.start > rangeToBeAdjusted.end) {
        //circular range
        if (rangeToBeAdjusted.end >= insertStart) {
            //adjust both start and end
            newRange.start += insertLength;
            newRange.end += insertLength;
        } else if (rangeToBeAdjusted.start >= insertStart) {
            //adjust just the start
            newRange.start += insertLength;
        }
    } else {
        if (rangeToBeAdjusted.start >= insertStart) {
            //adjust both start and end
            newRange.start += insertLength;
            newRange.end += insertLength;
        } else if (rangeToBeAdjusted.end >= insertStart) {
            //adjust just the end
            newRange.end += insertLength;
        }
    }
    return newRange;
    //we can make some awesome logical simplifications because we know that the two ranges do not overlap (since we've already trimmed the rangeToBeAdjusted)
};