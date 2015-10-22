//var tap = require('tap');
//tap.mochaGlobals();

var trimRangeByAnotherRange = require('./trimRangeByAnotherRange.js');
// var trimRangeByAnotherRange = require('./trimRangeByAnotherRange.js');
var assert = require('assert');
describe('trimRangeByAnotherRange', function() {
    it('trims non circular ranges that dont fully overlap', function() {
        assert.deepEqual(trimRangeByAnotherRange({
            start: 0,
            end: 2
        }, {
            start: 2,
            end: 2
        }, 10), {
            start: 0,
            end: 1
        });
    });
    it('it does not trim non circular ranges with overlap contained within it', function() {
        assert.deepEqual(trimRangeByAnotherRange({
            start: 0,
            end: 10
        }, {
            start: 2,
            end: 2
        }, 10), {
            start: 0,
            end: 10
        });
    });
    it('trims non circular ranges that fully overlap', function() {
        assert.deepEqual(trimRangeByAnotherRange({
            start: 0,
            end: 2
        }, {
            start: 0,
            end: 2
        }, 10), undefined);
        assert.deepEqual(trimRangeByAnotherRange({
            start: 3,
            end: 5
        }, {
            start: 3,
            end: 5
        }, 10), undefined);
        assert.deepEqual(trimRangeByAnotherRange({
            start: 3,
            end: 3
        }, {
            start: 3,
            end: 3
        }, 10), undefined);
        assert.deepEqual(trimRangeByAnotherRange({
            start: 0,
            end: 0
        }, {
            start: 0,
            end: 3
        }, 10), undefined);
    });
    it('does not trim non circular ranges that dont overlap', function() {
        assert.deepEqual(trimRangeByAnotherRange({
            start: 0,
            end: 2
        }, {
            start: 5,
            end: 6
        }, 10), {
            start: 0,
            end: 2
        });
        assert.deepEqual(trimRangeByAnotherRange({
            start: 3,
            end: 5
        }, {
            start: 0,
            end: 0
        }, 10), {
            start: 3,
            end: 5
        });
    });
    it('does trim circular ranges that overlap', function() {
        assert.deepEqual(trimRangeByAnotherRange({
            start: 3,
            end: 2
        }, {
            start: 5,
            end: 6
        }, 10), {
            start: 3,
            end: 2
        });
        assert.deepEqual(trimRangeByAnotherRange({
            start: 3,
            end: 2
        }, {
            start: 3,
            end: 6
        }, 10), {
            start: 7,
            end: 2
        });
        assert.deepEqual(trimRangeByAnotherRange({
            start: 3,
            end: 2
        }, {
            start: 1,
            end: 6
        }, 10), {
            start: 7,
            end: 0
        });
        assert.deepEqual(trimRangeByAnotherRange({
            start: 3,
            end: 2
        }, {
            start: 0,
            end: 6
        }, 10), {
            start: 7,
            end: 9
        });
        assert.deepEqual(trimRangeByAnotherRange({
            start: 3,
            end: 2
        }, {
            start: 2,
            end: 9
        }, 10), {
            start: 0,
            end: 1
        });
        assert.deepEqual(trimRangeByAnotherRange({
            start: 3,
            end: 2
        }, {
            start: 4,
            end: 2
        }, 10), {
            start: 3,
            end: 3
        });
        assert.deepEqual(trimRangeByAnotherRange({
            start: 1,
            end: 2
        }, {
            start: 4,
            end: 1
        }, 10), {
            start: 2,
            end: 2
        });
        assert.deepEqual(trimRangeByAnotherRange({
            start: 1,
            end: 5
        }, {
            start: 4,
            end: 1
        }, 10), {
            start: 2,
            end: 3
        });
        assert.deepEqual(trimRangeByAnotherRange({
            start: 3,
            end: 2
        }, {
            start: 3,
            end: 2
        }, 10), undefined);
    });
    
});