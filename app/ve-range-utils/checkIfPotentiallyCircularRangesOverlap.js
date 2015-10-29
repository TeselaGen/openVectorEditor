var ac = require('ve-api-check'); 
var checkIfNonCircularRangesOverlap = require('./checkIfNonCircularRangesOverlap');
var splitRangeIntoTwoPartsIfItIsCircular = require('./splitRangeIntoTwoPartsIfItIsCircular');
  // ac.throw([ac.posInt, ac.posInt, ac.bool], arguments);
module.exports = function checkIfPotentiallyCircularRangesOverlap(range, comparisonRange) {
    ac.throw([ac.range, ac.range], arguments);
    //split the potentially circular ranges and compare each part for overlap
    return splitRangeIntoTwoPartsIfItIsCircular(range, Infinity).some(function (splitRange) {
      return splitRangeIntoTwoPartsIfItIsCircular(comparisonRange, Infinity).some(function (splitComparisonRange) {
        return checkIfNonCircularRangesOverlap(splitRange, splitComparisonRange);
      })
    })
};

