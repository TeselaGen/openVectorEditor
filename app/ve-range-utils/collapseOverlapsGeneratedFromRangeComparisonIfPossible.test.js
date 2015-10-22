//var tap = require('tap');
//tap.mochaGlobals();
// module.exports = function collapseOverlapsGeneratedFromRangeComparisonIfPossible(overlaps, sequenceLength) {
//     //this function is a little confusing, but basically it takes an array of overlaps 
//     //generated from a range overlap calculation, and it sews them together if possible
//     if (overlaps.length === 1) {
//         return overlaps;
//     } else if (overlaps.length === 2) {
//         if (overlap[0].start === 0 && overlap[1].end + 1 === sequenceLength) {
//             return [{
//                 start: overlap[1].start,
//                 end: overlap[0].end
//             }];
//         } else if (overlap[1].start === 0 && overlap[0].end + 1 === sequenceLength) {
//             return [{
//                 start: overlap[0].start,
//                 end: overlap[1].end
//             }];
//         } else {
//             return overlaps;
//         }
//     } else if (overlaps.length === 3) {
//         var firstOverlap = overlaps[0];
//         var secondOverlap = overlaps[1];
//         var thirdOverlap = overlaps[2];
//         var collapsedOverlaps = collapseOverlapsGeneratedFromRangeComparisonIfPossible([firstOverlap, secondOverlap], sequenceLength);
//         if (collapsedOverlaps.length === 1) {
//             collapsedOverlaps.push(thirdOverlap);
//             return collapsedOverlaps;
//         } else {
//             collapsedOverlaps = collapseOverlapsGeneratedFromRangeComparisonIfPossible([firstOverlap, thirdOverlap], sequenceLength);
//             if (collapsedOverlaps.length === 1) {
//                 collapsedOverlaps.push(secondOverlap);
//                 return collapsedOverlaps;
//             } else {
//                 collapsedOverlaps = collapseOverlapsGeneratedFromRangeComparisonIfPossible([secondOverlap, thirdOverlap], sequenceLength);
//                 if (collapsedOverlaps.length === 1) {
//                     collapsedOverlaps.push(firstOverlap);
//                     return collapsedOverlaps;
//                 } else {
//                     return overlaps;
//                 }
//             }
//         }
//     }
// }

var getOverlapsOfPotentiallyCircularRanges = require('./getOverlapsOfPotentiallyCircularRanges.js');
var collapseOverlapsGeneratedFromRangeComparisonIfPossible = require('./collapseOverlapsGeneratedFromRangeComparisonIfPossible.js');
var assert = require('assert');
describe('collapseOverlapsGeneratedFromRangeComparisonIfPossible', function() {
    it('returns an empty array if passed an empty array of overlaps', function() {
        assert.deepEqual(collapseOverlapsGeneratedFromRangeComparisonIfPossible([], 1000), []);
        assert.deepEqual(collapseOverlapsGeneratedFromRangeComparisonIfPossible(getOverlapsOfPotentiallyCircularRanges({
            start: 900,
            end: 100
        }, {
            start: 900,
            end: 100
        }, 1000), 1000), [{
            start: 900,
            end: 100
        }]);
    });
    it('collapses a split circular range', function() {
        assert.deepEqual(collapseOverlapsGeneratedFromRangeComparisonIfPossible([{
            start: 0,
            end: 100
        }, {
            start: 105,
            end: 999
        }], 1000), [{
            start: 105,
            end: 100
        }]);
        assert.deepEqual(collapseOverlapsGeneratedFromRangeComparisonIfPossible(getOverlapsOfPotentiallyCircularRanges({
            start: 900,
            end: 100
        }, {
            start: 900,
            end: 100
        }, 1000), 1000), [{
            start: 900,
            end: 100
        }]);
    });
    it('doesnt collapses a split range that doesnt line up correctly', function() {
        assert.deepEqual(collapseOverlapsGeneratedFromRangeComparisonIfPossible([{
            start: 0,
            end: 100
        }, {
            start: 105,
            end: 998
        }], 1000),[{
            start: 0,
            end: 100
        }, {
            start: 105,
            end: 998
        }]);
    });
    it('collapses a split circular range with a third part', function() {
        assert.deepEqual(collapseOverlapsGeneratedFromRangeComparisonIfPossible([{
            start: 200,
            end: 300
        },{
            start: 0,
            end: 100
        }, {
            start: 500,
            end: 999
        }], 1000), [{
            start: 500,
            end: 100
        },{
            start: 200,
            end: 300
        }]);
    });

    it('collapses a split circular range with a third part in a different order', function() {
        assert.deepEqual(collapseOverlapsGeneratedFromRangeComparisonIfPossible([{
            start: 0,
            end: 100
        },{
            start: 200,
            end: 300
        }, {
            start: 500,
            end: 999
        }], 1000), [{
            start: 500,
            end: 100
        },{
            start: 200,
            end: 300
        }]);
    });
});