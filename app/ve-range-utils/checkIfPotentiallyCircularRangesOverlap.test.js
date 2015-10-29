// var tap = require('tap');
// tap.mochaGlobals();
var expect = require('chai').expect;
var checkIfPotentiallyCircularRangesOverlap = require('./checkIfPotentiallyCircularRangesOverlap.js');
// checkIfPotentiallyCircularRangesOverlap(frame, sequence, minimumOrfSize, forward, circular)
describe('checkIfPotentiallyCircularRangesOverlap', function() {
    it('returns true if ranges do overlap', function() {
        expect(checkIfPotentiallyCircularRangesOverlap({
            start: 5,
            end: 100
        }, {
            start: 50,
            end: 50
        })).to.equal(true);
        expect(checkIfPotentiallyCircularRangesOverlap({
            start: 5,
            end: 100
        }, {
            start: 50,
            end: 500
        })).to.equal(true);
        expect(checkIfPotentiallyCircularRangesOverlap({
            start: 5,
            end: 100
        }, {
            start: 0,
            end: 5
        })).to.equal(true);
        expect(checkIfPotentiallyCircularRangesOverlap({
            start: 50,
            end: 10
        }, {
            start: 0,
            end: 5
        })).to.equal(true);
        expect(checkIfPotentiallyCircularRangesOverlap({
            start: 50,
            end: 10
        }, {
            start: 20,
            end: 5
        })).to.equal(true);
        expect(checkIfPotentiallyCircularRangesOverlap({
            start: 50,
            end: 10
        }, {
            start: 20,
            end: 51
        })).to.equal(true);
    });
    it('returns false if ranges do not overlap', function() {
        expect(checkIfPotentiallyCircularRangesOverlap({
            start: 5,
            end: 100
        }, {
            start: 1,
            end: 4
        })).to.equal(false);
        expect(checkIfPotentiallyCircularRangesOverlap({
            start: 50,
            end: 10
        }, {
            start: 20,
            end: 49
        })).to.equal(false);
        expect(checkIfPotentiallyCircularRangesOverlap({
            start: 5,
            end: 100
        }, {
            start: 101,
            end: 101
        })).to.equal(false);
    });
});