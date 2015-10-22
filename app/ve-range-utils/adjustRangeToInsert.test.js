//var tap = require('tap');
//tap.mochaGlobals();

var adjustRangeToInsert = require('./adjustRangeToInsert.js');
// var collapseOverlapsGeneratedFromRangeComparisonIfPossible = require('./collapseOverlapsGeneratedFromRangeComparisonIfPossible.js');
var assert = require('assert');
describe('adjustRangeToInsert', function() {
    it('shifts start and end if inserting before non circular range', function() {
        assert.deepEqual(adjustRangeToInsert({
            start: 10,
            end: 20
        }, 4, 5), {
            start: 15,
            end: 25
        });
        assert.deepEqual(adjustRangeToInsert({
            start: 10,
            end: 20
        }, 10, 5), {
            start: 15,
            end: 25
        });
        assert.deepEqual(adjustRangeToInsert({
            start: 10,
            end: 20
        }, 0, 5), {
            start: 15,
            end: 25
        });
    });
    it('shifts end if inserting in middle of non circular range', function() {
        assert.deepEqual(adjustRangeToInsert({
            start: 10,
            end: 20
        }, 11, 5), {
            start: 10,
            end: 25
        });
        assert.deepEqual(adjustRangeToInsert({
            start: 10,
            end: 20
        }, 20, 5), {
            start: 10,
            end: 25
        });
    });
    it('shifts neither start nor end if inserting in after end of non circular range', function() {
        assert.deepEqual(adjustRangeToInsert({
            start: 10,
            end: 20
        }, 24, 5), {
            start: 10,
            end: 20
        });
        assert.deepEqual(adjustRangeToInsert({
            start: 10,
            end: 20
        }, 21, 5), {
            start: 10,
            end: 20
        });
    });
    it('shifts neither start nor end if inserting in after start of circular range', function() {
        assert.deepEqual(adjustRangeToInsert({
            start: 20,
            end: 10
        }, 24, 5), {
            start: 20,
            end: 10
        });
        assert.deepEqual(adjustRangeToInsert({
            start: 20,
            end: 10
        }, 21, 5), {
            start: 20,
            end: 10
        });
    });
    it('shifts both start and end if inserting in before end of circular range', function() {
        assert.deepEqual(adjustRangeToInsert({
            start: 20,
            end: 10
        }, 5, 5), {
            start: 25,
            end: 15
        });
        assert.deepEqual(adjustRangeToInsert({
            start: 20,
            end: 10
        }, 10, 5), {
            start: 25,
            end: 15
        });
    });
    it('shifts just start if inserting in after end but before start of circular range', function() {
        assert.deepEqual(adjustRangeToInsert({
            start: 20,
            end: 10
        }, 11, 5), {
            start: 25,
            end: 10
        });
        assert.deepEqual(adjustRangeToInsert({
            start: 20,
            end: 10
        }, 20, 5), {
            start: 25,
            end: 10
        });
    });
});