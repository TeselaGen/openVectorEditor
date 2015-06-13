// //takes a potentially circular range and returns an array containing the range split on the origin
// module.exports = function splitRangeIntoTwoPartsIfItIsCircular(range, maxLength) {
//   if (range.start <= range.end) {
//     //the range isn't circular, so we just return the range
//     return [{
//       start: range.start,
//       end: range.end
//     }];
//   } else {
//     //the range is cicular, so we return an array of two ranges
//     return [{
//       start: 0,
//       end: range.end
//     }, {
//       start: range.start,
//       end: maxLength - 1
//     }];
//   }
// };

var splitRangeIntoTwoPartsIfItIsCircular = require('../app/splitRangeIntoTwoPartsIfItIsCircular.js');
var assert = require('assert');

assert.equal(splitRangeIntoTwoPartsIfItIsCircular(0), true);
assert.equal(splitRangeIntoTwoPartsIfItIsCircular(-0), true);
assert.equal(splitRangeIntoTwoPartsIfItIsCircular(1), true);
assert.equal(splitRangeIntoTwoPartsIfItIsCircular(5704), true);
assert.equal(splitRangeIntoTwoPartsIfItIsCircular(100000), true);

assert.equal(splitRangeIntoTwoPartsIfItIsCircular(-1), false);
assert.equal(splitRangeIntoTwoPartsIfItIsCircular(-5704), false);
assert.equal(splitRangeIntoTwoPartsIfItIsCircular(-100000), false);
assert.equal(splitRangeIntoTwoPartsIfItIsCircular(1.5), false);
assert.equal(splitRangeIntoTwoPartsIfItIsCircular(400.554), false);
assert.equal(splitRangeIntoTwoPartsIfItIsCircular(null), false);
assert.equal(splitRangeIntoTwoPartsIfItIsCircular({}), false);
assert.equal(splitRangeIntoTwoPartsIfItIsCircular([]), false);
assert.equal(splitRangeIntoTwoPartsIfItIsCircular(undefined), false);
