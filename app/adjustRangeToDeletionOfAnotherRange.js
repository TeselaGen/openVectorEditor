// var arePositiveIntegers = require('validate.io-nonnegative-integer-array');
var splitRangeIntoTwoPartsIfItIsCircular = require('./splitRangeIntoTwoPartsIfItIsCircular');
var trimRangeByAnotherRange = require('./trimRangeByAnotherRange');
var areRangesValid = require('./areRangesValid');

//takes in two potentially circular ranges and returns the first one trimmed by the second one
//returns null if no range is left after the trimming
module.exports = function adjustRangeToDeletionOfAnotherRange(rangeToBeAdjusted, anotherRange, maxLength) {
  if (!areRangesValid([rangeToBeAdjusted, anotherRange], maxLength)) {
    throw 'invalid ranges passed';
  }
  var trimmedRange = trimRangeByAnotherRange(rangeToBeAdjusted, anotherRange, maxLength);
  if (trimmedRange) { //if there is a range left after being trimmed, adjust it by the deleted anotherRange
    //we can make some awesome logical simplifications because we know that the two ranges do not overlap (since we've already trimmed the rangeToBeAdjusted)
    var nonCircularDeletionRanges = splitRangeIntoTwoPartsIfItIsCircular(anotherRange, maxLength);
    nonCircularDeletionRanges.forEach(function(nonCircularDeletionRange){
      var deletionLength = nonCircularDeletionRange.end - nonCircularDeletionRange.start + 1;
      if (trimmedRange.start > trimmedRange.end) { //the trimmed range is circular
        if (nonCircularDeletionRange.start < trimmedRange.end) {
          trimmedRange.start-=deletionLength;
          trimmedRange.end-=deletionLength;
        } else if (nonCircularDeletionRange.start < trimmedRange.start) {
          trimmedRange.end-=deletionLength;
        } else {
          //do nothing
        }
      } else {
        if (nonCircularDeletionRange.start < trimmedRange.start) {
          trimmedRange.start-=deletionLength;
          trimmedRange.end-=deletionLength;
        } else if (nonCircularDeletionRange.start < trimmedRange.end) {
          trimmedRange.end-=deletionLength;
        } else {
          //do nothing
        }
      }
    });
  }
  return trimmedRange;
};