//var tap = require('tap');
//tap.mochaGlobals();
var adjustRangeToDeletionOfAnotherRange = require('./adjustRangeToDeletionOfAnotherRange.js');
// var collapseOverlapsGeneratedFromRangeComparisonIfPossible = require('./collapseOverlapsGeneratedFromRangeComparisonIfPossible.js');
var assert = require('assert');
describe('adjustRangeToDeletionOfAnotherRange', function() {
    it('deletes non circular range if fully overlapped', function() {
        assert.deepEqual(adjustRangeToDeletionOfAnotherRange({
            start: 10,
            end: 20
        }, {
            start: 10,
            end: 20
        }, 30), null);
    });
    it('deletes circular range if fully overlapped', function() {
        assert.deepEqual(adjustRangeToDeletionOfAnotherRange({
            start: 20,
            end: 10
        }, {
            start: 20,
            end: 10
        }, 30), null);
    });
    it('shifts start and end if deleting before non circular range', function() {
        assert.deepEqual(adjustRangeToDeletionOfAnotherRange({
            start: 10,
            end: 20
        }, {
            start: 5,
            end: 8
        }, 30), {
            start: 6,
            end: 16
        });
    });
    it('shifts start if deleting in middle of non circular range', function() {
        assert.deepEqual(adjustRangeToDeletionOfAnotherRange({
            start: 20,
            end: 10
        }, {
            start: 15,
            end: 20
        }, 30), {
            start: 15,
            end: 10
        });
        assert.deepEqual(adjustRangeToDeletionOfAnotherRange({
            start: 20,
            end: 10
        }, {
            start: 15,
            end: 15
        }, 30), {
            start: 19,
            end: 10
        });
    });
    it('shifts start and end if deleting before end of non circular range', function() {
        assert.deepEqual(adjustRangeToDeletionOfAnotherRange({
            start: 20,
            end: 10
        }, {
            start: 0,
            end: 0
        }, 30), {
            start: 19,
            end: 9
        });
        assert.deepEqual(adjustRangeToDeletionOfAnotherRange({
            start: 20,
            end: 10
        }, {
            start: 5,
            end: 15
        }, 30), {
            start: 9,
            end: 4
        });
    });
    it('shifts neither start nor end if deleting after start of non circular range', function() {
        assert.deepEqual(adjustRangeToDeletionOfAnotherRange({
            start: 20,
            end: 10
        }, {
            start: 25,
            end: 27
        }, 30), {
            start: 20,
            end: 10
        });
        assert.deepEqual(adjustRangeToDeletionOfAnotherRange({
            start: 20,
            end: 10
        }, {
            start: 20,
            end: 25
        }, 30), {
            start: 20,
            end: 10
        });
    });
});