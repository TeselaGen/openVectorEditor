// var arePositiveIntegers = require('validate.io-nonnegative-integer-array');
// var splitRangeIntoTwoPartsIfItIsCircular = require('./splitRangeIntoTwoPartsIfItIsCircular');
// //returns an array of the overlaps between two potentially circular ranges
// module.exports = function getOverlapsOfPotentiallyCircularRanges(rangeA, rangeB, maxLength) {
//   if (!arePositiveIntegers(rangeA.start, rangeA.end, rangeB.start, rangeB.end)) {
//     // console.warn("unable to calculate ranges of  inputs");
//     return [];
//   }
//   var normalizedRangeA = splitRangeIntoTwoPartsIfItIsCircular(rangeA, maxLength);
//   var normalizedRangeB = splitRangeIntoTwoPartsIfItIsCircular(rangeB, maxLength);

//   var overlaps = [];
//   normalizedRangeA.forEach(function(nonCircularRangeA) {
//     normalizedRangeB.forEach(function(nonCircularRangeB) {
//       var overlap = getOverlapOfNonCircularRanges(nonCircularRangeA, nonCircularRangeB);
//       if (overlap) {
//         overlaps.push(overlap);
//       }
//     });
//   });
  
//   return overlaps;
// };

// function getOverlapOfNonCircularRanges(rangeA, rangeB) {
//   if (!arePositiveIntegers(rangeA.start, rangeA.end, rangeB.start, rangeB.end)) {
//     // console.warn("unable to calculate ranges of  inputs");
//     return null;
//   }
//   if (rangeA.start < rangeB.start) {
//     if (rangeA.end < rangeB.start) {
//       //no overlap
//     } else {
//       if (rangeA.end < rangeB.end) {
//         return {
//           start: rangeB.start,
//           end: rangeA.end
//         };
//       } else {
//         return {
//           start: rangeB.start,
//           end: rangeB.end
//         };
//       }
//     }
//   } else {
//     if (rangeA.start > rangeB.end) {
//       //no overlap
//     } else {
//       if (rangeA.end < rangeB.end) {
//         return {
//           start: rangeA.start,
//           end: rangeA.end
//         };
//       } else {
//         return {
//           start: rangeA.start,
//           end: rangeB.end
//         };
//       }
//     }
//   }
// }

var getOverlapsOfPotentiallyCircularRanges = require('../app/getOverlapsOfPotentiallyCircularRanges.js');
// var collapseOverlapsGeneratedFromRangeComparisonIfPossible = require('../app/collapseOverlapsGeneratedFromRangeComparisonIfPossible.js');
var assert = require('assert');
describe('getOverlapsOfPotentiallyCircularRanges', function() {
	it('doesnt return an overlap for non overlapping ranges', function() {
		assert.deepEqual(getOverlapsOfPotentiallyCircularRanges({
			start: 0,
			end: 100
		}, {
			start: 105,
			end: 999
		}, 1000), []);
	});
	it('does return overlaps for overlapping ranges', function() {
		assert.deepEqual(getOverlapsOfPotentiallyCircularRanges({
			start: 0,
			end: 100
		}, {
			start: 90,
			end: 100
		}, 1000),[{
			start: 90,
			end: 100
		}]);

		assert.deepEqual(getOverlapsOfPotentiallyCircularRanges({
			start: 12,
			end: 9
		}, {
			start: 0,
			end: 24
		}, 25),[{
			start: 0,
			end: 9
		},{
			start: 12,
			end: 24
		}]);
		assert.deepEqual(getOverlapsOfPotentiallyCircularRanges({
			start: 900,
			end: 100
		}, {
			start: 90,
			end: 100
		}, 1000),[{
			start: 90,
			end: 100
		}]);
		assert.deepEqual(getOverlapsOfPotentiallyCircularRanges({
			start: 900,
			end: 100
		}, {
			start: 900,
			end: 100
		}, 1000),[{
			start: 0,
			end: 100
		},{
			start: 900,
			end: 999
		}]);
		assert.deepEqual(getOverlapsOfPotentiallyCircularRanges({
			start: 900,
			end: 100
		}, {
			start: 90,
			end: 910
		}, 1000),[{
			start: 90,
			end: 100
		},{
			start: 900,
			end: 910
		}]);
		assert.deepEqual(getOverlapsOfPotentiallyCircularRanges({
			start: 900,
			end: 100
		}, {
			start: 90,
			end: 10
		}, 1000),[{
			start: 0,
			end: 10
		},{
			start: 90,
			end: 100
		},{
			start: 900,
			end: 999
		}]);
	});
});