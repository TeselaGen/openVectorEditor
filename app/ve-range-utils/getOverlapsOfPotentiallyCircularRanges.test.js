//var tap = require('tap');
//tap.mochaGlobals();

var getOverlapsOfPotentiallyCircularRanges = require('./getOverlapsOfPotentiallyCircularRanges.js');
// var collapseOverlapsGeneratedFromRangeComparisonIfPossible = require('./collapseOverlapsGeneratedFromRangeComparisonIfPossible.js');
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