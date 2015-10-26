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
//var tap = require('tap');
//tap.mochaGlobals();
var splitRangeIntoTwoPartsIfItIsCircular = require('./splitRangeIntoTwoPartsIfItIsCircular.js');
var assert = require('assert');
describe('splitRangeIntoTwoPartsIfItIsCircular', function() {
    it('returns an array with one range in it if the array is non-circular', function() {
        assert.deepEqual(splitRangeIntoTwoPartsIfItIsCircular({start: 0, end: 100}, 1000), [{start: 0, end: 100, type: 'beginningAndEnd'}]);
        assert.deepEqual(splitRangeIntoTwoPartsIfItIsCircular({start: 10, end: 909}, 1000), [{start: 10, end: 909, type: 'beginningAndEnd'}]);
    });
    it('returns an array with two ranges in it if the array is circular', function() {
        assert.deepEqual(splitRangeIntoTwoPartsIfItIsCircular({start: 110, end: 100},1000), [{start: 0, end: 100, type: 'end'},{start: 110, end: 999, type: 'beginning'}]);
    });
});